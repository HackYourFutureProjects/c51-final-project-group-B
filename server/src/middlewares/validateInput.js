import { body, validationResult } from "express-validator";

// Error checker
export function checkValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  next();
}

// Registration validators
export const validateRegistration = [
  body("email").isEmail().withMessage("Valid email required."),

  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),

  body("userType")
    .isIn(["seeker", "company"])
    .withMessage("userType must be 'seeker' or 'company'."),

  // For seeker
  body("firstName")
    .if(body("userType").equals("seeker"))
    .notEmpty()
    .withMessage("First name required."),

  body("lastName")
    .if(body("userType").equals("seeker"))
    .notEmpty()
    .withMessage("Last name required."),

  // For company
  body("companyName")
    .if(body("userType").equals("company"))
    .notEmpty()
    .withMessage("Company name required."),

  checkValidation,
];

// Login validators
export const validateLogin = [
  body("email").isEmail().withMessage("Valid email required."),

  body("password").notEmpty().withMessage("Password required."),

  checkValidation,
];

// Profile‑update validators (adding validation for the base user fields)
export const validateUpdateProfile = [
  body("email").optional().isEmail().withMessage("Must be a valid email."),

  body("password")
    .optional()
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),

  body("seekerProfile.firstName")
    .optional()
    .trim()
    .escape()
    .notEmpty()
    .withMessage("First name cannot be empty."),

  body("seekerProfile.lastName")
    .optional()
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Last name cannot be empty."),

  body("companyProfile.companyName")
    .optional()
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Company name cannot be empty."),

  checkValidation,
];
