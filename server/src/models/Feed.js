import mongoose from "mongoose";
const { Schema } = mongoose;

const feedSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      minlength: [3, "Title must be at least 3 characters."],
      maxlength: [200, "Title cannot exceed 200 characters."],
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: [50, "Tag cannot exceed 50 characters."],
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author (user) is required."],
    },
    content: {
      type: String,
      required: [true, "Content is required."],
      minlength: [20, "Content must be at least 20 characters."],
      maxlength: [5000, "Content cannot exceed 5,000 characters."],
      trim: true,
    },
    sources: [
      {
        type: String,
        trim: true,
      },
    ],
    media: [
      {
        type: String,
        trim: true,
      },
    ],
    audience: {
      type: String,
      enum: ["all", "company", "seeker"],
      default: "all",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Feed", feedSchema);
