import mongoose from "mongoose";
const { Schema } = mongoose;
const applicationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required."],
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "JobPost",
      required: [true, "Job ID is required."],
    },
    // adding extra status fields maybe we need them in the future
    status: {
      type: String,
      enum: [
        "pending",
        "reviewed",
        "accepted",
        "rejected",
        "shortlisted",
        "withdrawn",
      ],
      default: "pending",
      required: true,
    },
    resumeUrl: {
      type: String,
      required: [true, "Resume URL is required."],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Application", applicationSchema);
