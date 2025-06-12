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

const Conversation = model("Conversation", ConversationSchema);

export default Conversation;
