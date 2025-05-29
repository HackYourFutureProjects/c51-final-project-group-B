import mongoose from "mongoose";

import { body, validationResult } from "express-validator";
import { User } from "../models/User.js";
import JobPost from "../models/JobPost.js";
import {
  JOB_TYPES,
  MIN_NR_REQUIREMENTS,
  MAX_NR_REQUIREMENTS,
  MAX_NR_TAGS,
} from "../constants.js";

/* The function 'validate; shows detailed error upon validation 
/* Below is for example the output  when required field 'title' is empty: 
    {
      "success": false,
      "message": "Validation failed",
      "errors": [
          {
              "field": "title",
              "message": "Title is required",
              "value": ""
          },
          {
              "field": "title",
              "message": "Title must be between 8 and 200 characters",
              "value": ""
          }
      ]
    }
*/

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    });
  }
  next();
};

export const validateJobPost = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string")
    .isLength({ min: 8, max: 200 })
    .withMessage("Title must be between 8 and 200 characters"),

  body("description")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string")
    .isLength({ min: 20, max: 1000 })
    .withMessage("Description must be between 20 and 1000 characters"),

  body("requirements")
    .optional()
    .isArray()
    .withMessage("Requirements must be an array.")
    .bail()
    .custom(
      (arr) =>
        arr.length >= MIN_NR_REQUIREMENTS && arr.length <= MAX_NR_REQUIREMENTS,
    )
    .withMessage(
      `Min ${MIN_NR_REQUIREMENTS} and Max ${MAX_NR_REQUIREMENTS} requirements allowed.`,
    )
    .bail()
    .custom((arr) =>
      arr.every((tag) => typeof tag === "string" && tag.trim().length <= 200),
    )
    .withMessage("Each requirement must be a string with max 200 characters."),
  body("numberOfOpenings")
    .exists()
    .withMessage("Number of openings is required")
    .isInt({ min: 1 })
    .withMessage("Number of openings must be an integer greater than 0"),

  body("location")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Location is required")
    .isString()
    .withMessage("Location must be a string")
    .isLength({ min: 3, max: 100 })
    .withMessage("Location must be between 3 and 100 characters"),

  body("type").isIn(JOB_TYPES).withMessage("Invalid job type."),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array.")
    .bail()
    .custom((arr) => arr.length <= MAX_NR_TAGS)
    .withMessage(`Maximum ${MAX_NR_TAGS} tags allowed.`)
    .bail()
    .custom((arr) =>
      arr.every((tag) => typeof tag === "string" && tag.trim().length <= 40),
    )
    .withMessage("Each tag must be a string with max 40 characters."),

  body("expireOn").optional().isISO8601().withMessage("Invalid date format"),

  body("salaryMax")
    .optional()
    .custom((salaryMax, { req }) => {
      const salaryMin = req.body.salaryMin;

      if (
        typeof salaryMin === "number" &&
        typeof salaryMax === "number" &&
        salaryMin > salaryMax
      ) {
        throw new Error("Minimum salary cannot be greater than maximum salary");
      }

      return true;
    }),

  body("postedBy")
    .not()
    .exists()
    .withMessage("postedBy cannot be set manually"),

  validate,
];

/** Validates if user's userType is 'company' or 'seeker' */
export const validateUserType = (userType) => async (req, res, next) => {
  const id = req.user?.id;

  const user = await User.findById(id);
  if (!user) {
    return res
      .status(404)
      .json({ success: false, msg: `No user with ${id} is found.` });
  }

  if (user && user.userType !== userType) {
    return res.status(403).json({
      success: false,
      msg: `Access denied. Only ${userType}s can access this resource.`,
    });
  }

  console.log("User: ", userType);
  req.fullUser = user;

  next();
};

/** Validates if a job exists */
export const validateJobPostExists = async (req, res, next) => {
  const jobId = req.params.id;
  console.log(jobId);

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res
      .status(400)
      .json({ success: false, msg: "Invalid job post ID." });
  }

  /** Mongoose doc states:
   * Enabling the lean option tells Mongoose to skip instantiating
   * a full Mongoose document and just give you the POJO which
   * make query fast and less memory intensive.
   *
   * Check this link: https://mongoosejs.com/docs/tutorials/lean.html
   * */

  const jobPost = await JobPost.findById(jobId).lean();
  if (!jobPost) {
    return res
      .status(404)
      .json({ success: false, msg: `No job post with ${jobId} found.` });
  }

  req.jobPost = jobPost;

  next();
};
