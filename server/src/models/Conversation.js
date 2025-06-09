import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const ConversationSchema = new Schema(
  {
    participants: [
      {
        type: Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    lastMessage: {
      type: Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// only 2 participants
ConversationSchema.pre("validate", function (next) {
  if (this.participants.length !== 2) {
    return next(new Error("A conversation must have exactly 2 participants."));
  }
  next();
});

// Prevent duplicate conversations between the same two users
ConversationSchema.index({ participants: 1 }, { unique: true });

const Conversation = model("Conversation", ConversationSchema);

export default Conversation;
