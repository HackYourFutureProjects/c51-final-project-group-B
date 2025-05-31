import { Schema, model } from "mongoose";
import { PERIOD } from "../constants.js";
import { JOB_TYPES } from "../constants.js";
import { removeDuplicates } from "../util/utils.js";
import {
  MIN_NR_REQUIREMENTS,
  MAX_NR_REQUIREMENTS,
  MAX_NR_TAGS,
} from "../constants.js";

/**
 * JobPost schema as defined in the ERD with additional fields
 * namely: requirements, isActive, applicationCount,
 * numberOfOpenings
 * */

const jobPostSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Job title is required."],
      minlength: [3, "Title must be at least 8 characters"],
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
      type: [
        {
          type: String,
          maxlength: 200,
          trim: true,
        },
      ],
      required: [true, "Requirements are required."],
      validate: [
        {
          validator: (arr) =>
            arr.length >= MIN_NR_REQUIREMENTS &&
            arr.length <= MAX_NR_REQUIREMENTS,
          message: "Provide 2 to 10 requirements.",
        },
      ],
    },

    numberOfOpenings: {
      type: Number,
      required: [true, "Number of openings is required."],
      min: [1, "Number of openings must be at least 1."],
    },

    location: {
      type: String,
      trim: true,
      required: [true, "Job location is required."],
      minlength: [3, "Location must be at least 3 characters."],
      maxlength: [100, "Location must be less than 100 characters."],
    },

    type: {
      type: String,
      required: [true, "Job type is required."],
      enum: JOB_TYPES,
    },

    tags: {
      type: [
        {
          type: String,
          maxlength: 40,
          trim: true,
        },
      ],
      default: [],
      validate: {
        validator: (arr) => arr.length <= MAX_NR_TAGS,
        message: "Max 10 tags allowed.",
      },
    },

    salaryMin: {
      type: Number,
      min: 0,
    },

    salaryMax: {
      type: Number,
      min: 0,
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
        validator: (value) => value.getTime() > Date.now(),
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

/** Remove duplicates from tags, requirements  and other array fields */
jobPostSchema.pre("save", function (next) {
  removeDuplicates(this, ["requirements", "tags"]);
  next();
});

/** This  validates that min salary is less or equal max salary  */
jobPostSchema.pre("validate", function (next) {
  if (
    this.salaryMin != null &&
    this.salaryMax != null &&
    this.salaryMin > this.salaryMax
  ) {
    this.invalidate(
      "salaryMin",
      "Min salary must be less or equal to max salary.",
    );
  }
  next();
});

/**
 * For now 'isActive' is set on save for testing purposes.
 * Once the Application schema exists, we will update it there instead.
 */
jobPostSchema.pre("save", function (next) {
  const canApply = !this.limit || this.applicationCount < this.limit;
  const isNotExpired = !this.expireOn || this.expireOn > new Date();
  this.isActive = canApply && isNotExpired;
  next();
});

const JobPost = model("JobPost", jobPostSchema);

export default JobPost;
