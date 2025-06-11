import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import cookie from "cookie";

//  track userId - socketId
export const onlineUsers = new Map();
export let ioInstance = null;

// Init Socket.io chat events.

export default function initChatSocket(io) {
  ioInstance = io;
  io.on("connection", async (socket) => {
    // we can send the token in the handshake auth or in cookies(we use cookies here)
    let token = socket.handshake.auth?.token;

    if (!token && socket.request.headers.cookie) {
      const cookies = cookie.parse(socket.request.headers.cookie);
      token = cookies.token;
    }
    let userId = null;

    try {
      if (!token) throw new Error("No token provided");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
      //  verifying that user exists
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");
      onlineUsers.set(userId, socket.id);
    } catch (err) {
      socket.emit("unauthorized", "Invalid or missing token");
      socket.disconnect();
      return;
    }

    // sending a message
    socket.on("send_message", async (data) => {
      try {
        const { conversationId, text, attachment = "" } = data;
        // Find conversation and recipient
        const conversation = await Conversation.findById(conversationId);
        if (
          !conversation ||
          !conversation.participants.some((p) => p.toString() === userId)
        ) {
          return socket.emit("error", "Conversation not found or unauthorized");
        }
        const recipientId = conversation.participants.find(
          (p) => p.toString() !== userId,
        );

        // Saving message to DB
        const message = await Message.create({
          conversationId,
          sender: userId,
          recipient: recipientId,
          text,
          attachment,
        });

        // Update conversations lastMessage and updatedAt
        conversation.lastMessage = message._id;
        conversation.updatedAt = new Date();
        await conversation.save();

        // emit message to recipient if online
        const recipientSocketId = onlineUsers.get(recipientId.toString());
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("new_message", {
            ...message.toObject(),
            sender: { _id: userId },
            recipient: { _id: recipientId },
          });
        }
        // emit to sender for confirmation
        socket.emit("new_message", {
          ...message.toObject(),
          sender: { _id: userId },
          recipient: { _id: recipientId },
        });
      } catch (err) {
        socket.emit("error", "Failed to send message");
      }
    });
    // read status
    socket.on("conversation_read", async ({ conversationId, userId }) => {
      try {
        // Mark all messages as read for this user in this conversation
        await Message.updateMany(
          { conversationId, recipient: userId, read: false },
          { $set: { read: true } },
        );

        // Find the other participant  and notify them
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;
        const otherUserId = conversation.participants.find(
          (id) => id.toString() !== userId,
        );
        const recipientSocketId = onlineUsers.get(otherUserId.toString());
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("messages_read", {
            conversationId,
            readerId: userId,
          });
        }
      } catch (err) {
        console.error("Error handling conversation_read:", err);
      }
    });

    // disconnect
    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
    });
  });
}
