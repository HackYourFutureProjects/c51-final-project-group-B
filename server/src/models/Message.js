import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const MessageSchema = new Schema(
  {
    conversationId: {
      type: Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    sender: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    // for attachments in the future
    attachment: {
      type: String,
      default: "",
    },
    //  read status
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Message = model("Message", MessageSchema);

export default Message;
