import { Schema, model } from "mongoose";
import { PERIOD } from "../constants.js";

/**
 * JobPost schema as defined in the ERD with added fields
 * namely: requirements and isActive
 * */

const jobPostSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Job title is required."],
      minlength: [8, "Title must be at least 8 characters"],
      maxlength: [200, "Title must be less than 200 characters"],
    },

    description: {
      type: String,
      trim: true,
      required: [true, "Job description is required."],
      minlength: [20, "Job description must be at least 20 characters"],
      maxlength: [1000, "Job description must be less than 1000 characters"],
    },

    requirements: {
      type: [String],
      maxlength: 200,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
      required: [true, "Job location is required."],
      minlength: [3, "Location must be at least 3 characters"],
      maxlength: [100, "Location must be less than 100 characters"],
    },

    type: {
      type: String,
      required: [true, "Job type is required."],
      enum: [
        "Full-time",
        "Part-time",
        "Internship",
        "Traineeship",
        "Remote",
        "Freelance",
        "Volunteer",
      ],
    },

    tags: [
      {
        type: String,
        maxlength: 20,
        trim: true,
      },
    ],

    salaryMin: {
      type: Number,
      min: [0, "Salary cannot be negative"],
      validate: {
        validator: function (value) {
          return value <= this.salaryMax;
        },
        message: "Min Salary should be less or equal to max salary.",
      },
    },

    salaryMax: {
      type: Number,
      min: [0, "Salary cannot be negative"],
      validate: {
        validator: function (value) {
          return value >= this.salaryMin;
        },
        message: "Max Salary should be greater or equal to min salary.",
      },
    },

    limit: {
      type: Number,
      min: 1,
    },

    applicationCount: {
      type: Number,
      default: 0,
    },

    expireOn: {
      type: Date,
      default: () => new Date(Date.now() + PERIOD),
      validate: {
        validator: function (value) {
          return !this.isNew || value >= new Date();
        },
        message: "Expiration date should be in the future.",
      },
    },

    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  {
    timestamps: true,
  },
);

/**
 *  This creates a virtual field which value
 *  changes depending on the expireOn and applicationCount of jobPostSchema
 */

jobPostSchema.virtual("isActive").get(function () {
  return this.expireOn > new Date() && this.applicationCount < this.limit;
});

/**
 *  The 'isActive' is virtual field and by default mongoose won't
 *  include virtual fields in API response.
 *
 *  These two lines tells the mongoose to include 'isActive' when
 *  converting documents to JSON or plain objects.
 */

jobPostSchema.set("toJSON", { virtuals: true });
jobPostSchema.set("toObject", { virtuals: true });

const JobPost = model("JobPost", jobPostSchema);

export default JobPost;
