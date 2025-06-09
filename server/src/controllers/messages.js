import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { User } from "../models/User.js";
import { logError } from "../util/logging.js";
import { ioInstance, onlineUsers } from "../sockets/chat.js";

//  Starts a new 1-to-1 conversation or returns the existing one.
//   POST /api/messages/start
//   Body: { recipientId }
//   Auth: Required (req.user) (auth middleware  )

export const startConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { recipientId } = req.body;

    // no conversation with self
    if (userId === recipientId) {
      return res.status(400).json({
        success: false,
        msg: "Cannot start a conversation with yourself.",
      });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId).select(
      "_id name profilePhoto",
    );
    if (!recipient) {
      return res
        .status(404)
        .json({ success: false, msg: "Recipient user not found." });
    }

    // Find existing conversation between the two users
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, recipientId] },
      $expr: { $eq: [{ $size: "$participants" }, 2] },
    }).populate({
      path: "lastMessage",
      select: "text sender createdAt",
    });

    // If  convo not found, create a new one
    if (!conversation) {
      conversation = new Conversation({
        participants: [userId, recipientId],
        lastMessage: null,
      });
      await conversation.save();
    }

    // Find the other participant's info
    const otherUserId = conversation.participants.find(
      (id) => id.toString() !== userId,
    );

    const otherUser = await User.findById(otherUserId).select(
      "_id userType seekerProfile.firstName seekerProfile.lastName companyProfile.companyName profilePhoto",
    );

    let displayName = "";
    if (otherUser.userType === "seeker") {
      displayName = `${otherUser.seekerProfile.firstName} ${otherUser.seekerProfile.lastName}`;
    } else if (otherUser.userType === "company") {
      displayName = otherUser.companyProfile.companyName;
    }

    // response data
    const convoData = {
      _id: conversation._id,
      participants: conversation.participants,
      lastMessage: conversation.lastMessage,
      updatedAt: conversation.updatedAt,
      user: {
        _id: otherUser._id,
        name: displayName,
        profilePhoto: otherUser.profilePhoto,
      },
    };

    return res.status(200).json({ success: true, data: convoData });
  } catch (err) {
    logError(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, msg: err.message });
    }
    return res.status(500).json({ success: false, msg: "Server error." });
  }
};

//  GET /api/messages/conversations
//   List all conversations for the authenticated user(newest first).
//   Each conversation includes the other user's basix info and the last message.

export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all conversations where the user is a participant
    const conversations = await Conversation.find({
      participants: userId,
    })
      .sort({ updatedAt: -1 })
      .populate({
        path: "lastMessage",
        select: "text sender createdAt",
      })
      .lean();

    // Finding the other participant's info for each convo
    const result = await Promise.all(
      conversations.map(async (convo) => {
        const otherUserId = convo.participants.find(
          (id) => id.toString() !== userId,
        );
        const otherUser = await User.findById(otherUserId).select(
          "_id userType seekerProfile.firstName seekerProfile.lastName companyProfile.companyName profilePhoto",
        );

        let displayName = "";
        if (otherUser.userType === "seeker") {
          displayName = `${otherUser.seekerProfile.firstName} ${otherUser.seekerProfile.lastName}`;
        } else if (otherUser.userType === "company") {
          displayName = otherUser.companyProfile.companyName;
        }
        return {
          _id: convo._id,
          participants: convo.participants,
          lastMessage: convo.lastMessage,
          updatedAt: convo.updatedAt,
          user: otherUser
            ? {
                _id: otherUser._id,
                name: displayName,
                profilePhoto: otherUser.profilePhoto,
              }
            : null,
        };
      }),
    );

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    logError(err);
    return res.status(500).json({ success: false, msg: "Server error." });
  }
};

//  DELETE /api/messages/conversations/:id
//   Delete a conversation (and all its messages) if the user is a participant.

export const deleteConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Find the convo
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res
        .status(404)
        .json({ success: false, msg: "Conversation not found." });
    }

    // Only allow deletion if the user is a participant
    if (!conversation.participants.some((p) => p.toString() === userId)) {
      return res.status(403).json({
        success: false,
        msg: "Not authorized to delete this conversation.",
      });
    }

    // Delete all messages in this conversation
    await Message.deleteMany({ conversationId: conversation._id });

    // Delete the conversation itself
    await conversation.deleteOne();

    return res
      .status(200)
      .json({ success: true, msg: "Conversation deleted." });
  } catch (err) {
    logError(err);
    return res.status(500).json({ success: false, msg: "Server error." });
  }
};

// GET /api/messages/conversations/:id
// Get all messages in a conversation, newest last.
// Only if the user is a participant.

export const getConversationMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Find the conversation and check participation
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res
        .status(404)
        .json({ success: false, msg: "Conversation not found." });
    }
    if (!conversation.participants.some((p) => p.toString() === userId)) {
      return res.status(403).json({
        success: false,
        msg: "Not authorized to view this conversation.",
      });
    }

    // Get all messages in this conversation, sorted by createdAt (oldest first)
    const messages = await Message.find({ conversationId: id })
      .sort({ createdAt: 1 })
      .populate("sender", "_id name profilePhoto")
      .populate("recipient", "_id name profilePhoto");

    return res.status(200).json({ success: true, data: messages });
  } catch (err) {
    logError(err);
    return res.status(500).json({ success: false, msg: "Server error." });
  }
};

//  POST /api/messages/conversations/:id
//   Send a message in a conversation.
//   Body: { text, attachment }
//   Only if the user is a participant.
//   Updates lastMessage and updatedAt in the conversation.

export const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { text, attachment } = req.body;

    // Validate message text
    if (!text || typeof text !== "string" || !text.trim()) {
      return res
        .status(400)
        .json({ success: false, msg: "Message text is required." });
    }

    // Find the conversation and check participation
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res
        .status(404)
        .json({ success: false, msg: "Conversation not found." });
    }
    if (!conversation.participants.some((p) => p.toString() === userId)) {
      return res.status(403).json({
        success: false,
        msg: "Not authorized to send messages in this conversation.",
      });
    }

    // Identify recipient
    const recipientId = conversation.participants.find(
      (p) => p.toString() !== userId,
    );

    // Create and save the message
    const message = await Message.create({
      conversationId: conversation._id,
      sender: userId,
      recipient: recipientId,
      text: text.trim(),
      attachment: attachment || "",
    });

    // Update conversation's lastMessage and updatedAt
    conversation.lastMessage = message._id;
    conversation.updatedAt = new Date();
    await conversation.save();

    // Populate sender and recipient for response
    await message.populate("sender", "_id name profilePhoto");
    await message.populate("recipient", "_id name profilePhoto");

    // Emit to recipient if online (real-time update for the REST API fallback on recipient's side)
    if (ioInstance && onlineUsers) {
      const recipientSocketId = onlineUsers.get(recipientId.toString());
      if (recipientSocketId) {
        ioInstance.to(recipientSocketId).emit("new_message", message);
      }
    }

    return res.status(201).json({ success: true, data: message });
  } catch (err) {
    logError(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, msg: err.message });
    }
    return res.status(500).json({ success: false, msg: "Server error." });
  }
};
