import mongoose from "mongoose";
import validateAllowedFields from "../util/validateAllowedFields.js";

const { Schema, model } = mongoose;

const BaseOptions = {
  discriminatorKey: "userType",
  collection: "users",
  timestamps: true,
  minimize: false,
};

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      // validate the email format
      match: [/.+@.+\..+/, "Please provide a valid email address"],
      maxlength: [200, "Email must be less than 200 characters"],
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    location: {
      type: String,
      default: "",
      maxlength: [300, "Location must be less than 300 characters"],
    },
    profilePhoto: {
      type: String,
      default: "",
    },
  },
  BaseOptions,
);

// validate allowed fields for the base user.
UserSchema.statics.validateUser = function (userObj) {
  const errorList = [];
  const allowedKeys = ["email", "passwordHash", "location", "profilePhoto"];
  const validatedMsg = validateAllowedFields(userObj, allowedKeys);
  if (validatedMsg) errorList.push(validatedMsg);
  if (!userObj.email) errorList.push("Email is required.");
  if (!userObj.passwordHash) errorList.push("Password is required.");
  return errorList;
};

const User = model("User", UserSchema);

// I added this to avoid the error in the test router
export const validateUser = User.validateUser;

// --------Seeker Discriminator --------------------

const SeekerProfileSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name must be less than 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name must be less than 50 characters"],
    },
    resumeUrl: { type: String, default: "" },
    bio: {
      type: String,
      default: "",
      maxlength: [500, "Bio must be less than 500 characters"],
    },
    skills: { type: [String], default: [] },
    languages: { type: [String], default: [] },
    preferences: { type: [String], default: [] },
    experiences: {
      type: [
        {
          company: {
            type: String,
            maxlength: [
              100,
              "Company name in experience must be less than 100 characters",
            ],
          },
          title: {
            type: String,
            maxlength: [100, "Title must be less than 100 characters"],
          },
          workLocation: {
            type: String,
            maxlength: [150, "Work location must be less than 150 characters"],
            default: "",
          },
          startDate: Date,
          endDate: Date,
          description: {
            type: String,
            maxlength: [1000, "Description must be less than 1000 characters"],
          },
        },
      ],
      default: [],
    },
    education: {
      type: [
        {
          school: {
            type: String,
            maxlength: [150, "School name must be less than 150 characters"],
          },
          degree: {
            type: String,
            maxlength: [200, "Degree must be less than 200 characters"],
          },
          fieldOfStudy: {
            type: String,
            maxlength: [100, "Field of study must be less than 100 characters"],
            default: "",
          },
          educationLocation: {
            type: String,
            maxlength: [
              150,
              "Education location must be less than 150 characters",
            ],
            default: "",
          },
          startDate: Date,
          endDate: Date,
        },
      ],
      default: [],
    },
  },
  { _id: false },
);

// Seeker profile validation.
SeekerProfileSchema.statics.validateSeekerProfile = function (profileObj) {
  const errorList = [];
  const allowedKeys = [
    "firstName",
    "lastName",
    "resumeUrl",
    "bio",
    "skills",
    "languages",
    "preferences",
    "experiences",
    "education",
  ];
  const validatedMsg = validateAllowedFields(profileObj, allowedKeys);
  if (validatedMsg) errorList.push(validatedMsg);
  if (!profileObj.firstName) errorList.push("First name is required.");
  if (!profileObj.lastName) errorList.push("Last name is required.");
  return errorList;
};

const Seeker = User.discriminator(
  "seeker",
  new Schema(
    {
      seekerProfile: { type: SeekerProfileSchema, required: true },
    },
    { _id: false },
  ),
);

Seeker.validateSeekerProfile =
  SeekerProfileSchema.statics.validateSeekerProfile;

// -------------------- Company Discriminator --------------------

const CompanyProfileSchema = new Schema(
  {
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name must be less than 100 characters"],
    },
    website: { type: String, default: "" },
    industry: {
      type: String,
      default: "",
      maxlength: [100, "Industry must be less than 100 characters"],
    },
    about: {
      type: String,
      default: "",
      maxlength: [1000, "About must be less than 1000 characters"],
    },
    companySize: { type: String, default: "" },
    tagline: {
      type: String,
      default: "",
      maxlength: [150, "Tagline must be less than 150 characters"],
    },
    headquarters: { type: String, default: "" },
    branches: { type: [String], default: [] },
    values: { type: [String], default: [] },
  },
  { _id: false },
);

// company profile validation.
CompanyProfileSchema.statics.validateCompanyProfile = function (profileObj) {
  const errorList = [];
  const allowedKeys = [
    "companyName",
    "website",
    "industry",
    "about",
    "companySize",
    "tagline",
    "headquarters",
    "branches",
    "values",
  ];
  const validatedMsg = validateAllowedFields(profileObj, allowedKeys);
  if (validatedMsg) errorList.push(validatedMsg);
  if (!profileObj.companyName) errorList.push("Company name is required.");
  return errorList;
};

const Company = User.discriminator(
  "company",
  new Schema(
    {
      companyProfile: { type: CompanyProfileSchema, required: true },
    },
    { _id: false },
  ),
);
Company.validateCompanyProfile =
  CompanyProfileSchema.statics.validateCompanyProfile;

export { User, Seeker, Company };
