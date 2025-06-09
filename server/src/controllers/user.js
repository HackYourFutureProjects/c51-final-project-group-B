import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { User, Seeker, Company } from "../models/User.js";
import { logError } from "../util/logging.js";
import validationErrorMessage from "../util/validationErrorMessage.js";

import sendEmail from "../util/sendEmail.js";
import { A_DAY_MS } from "../constants.js";

/**
  Registering a new user (seeker or company) using discriminators.
  this will use the validation methods for allowed fields before creating the document we can use these validator in user and profile controllers.

  Note: this validator style was used already in the base project and I continued with it, later for the other schemas we can maybe use (strict: "throw") to ignore unwanted fields,as this one gives better feedback I used it for the users.
 */

export async function register(req, res) {
  try {
    //  Destructure fields from the request body.
    const { email, password, userType, firstName, lastName, companyName } =
      req.body;

    //  Check that the userType is either "seeker" or "company".
    if (!["seeker", "company"].includes(userType)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid user type.",
      });
    }

    //  Check if the provided email is already in use.
    if (await User.findOne({ email })) {
      return res.status(400).json({
        success: false,
        msg: "Registration failed. Please check your inputs and try again.",
      });
    }

    //  Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    //  payload common to all users.
    let payload = { email, passwordHash };

    //  collecting validation error messages.
    let errors = [];

    // base User validation .
    const baseErrors = User.validateUser(payload);
    if (baseErrors.length > 0) {
      errors = errors.concat(baseErrors);
    }

    // check the userType then  add type-specific profile data
    if (userType === "seeker") {
      const seekerProfile = { firstName, lastName };
      // Validator for seeker profiles.
      const seekerErrors = Seeker.validateSeekerProfile(seekerProfile);
      if (seekerErrors.length > 0) {
        errors = errors.concat(seekerErrors);
      }
      // Add to the payload  the seeker profile.
      payload = { ...payload, seekerProfile };
    } else if (userType === "company") {
      const companyProfile = { companyName };

      // validator for company profiles.
      const companyErrors = Company.validateCompanyProfile(companyProfile);
      if (companyErrors.length > 0) {
        errors = errors.concat(companyErrors);
      }
      // Add to the payload  the company profile.
      payload = { ...payload, companyProfile };
    }

    // If there are any validation errors return an error response
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        msg: validationErrorMessage(errors),
      });
    }

    // Select the correct model based on the userType.
    const UserModel = userType === "seeker" ? Seeker : Company;

    // Create a new document with the constructed payload.
    const newUser = new UserModel(payload);

    const token = crypto.randomBytes(20).toString("hex");
    newUser.emailVerificationToken = token;
    newUser.emailVerificationExpires = Date.now() + A_DAY_MS;

    // Save the new user document to the database.
    await newUser.save();

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    const message = `Welcome to TalentNest! Please verify your email by clicking this link: ${verifyUrl}`;

    await sendEmail({
      to: newUser.email,
      subject: "Verify Your Email",
      text: message,
    });

    // Send a response with a success indicator.
    return res.status(201).json({
      success: true,
      msg: "User registered successfully. A verification email has been sent.",
    });
  } catch (err) {
    logError(err);
    return res.status(500).json({
      success: false,
      msg: "Unable to register user, please try again later.",
    });
  }
}

// Logs an existing user in.

export async function login(req, res) {
  try {
    //  Get email and password
    const { email, password } = req.body;

    // Get the user by email.
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "Invalid credentials.",
      });
    }

    // Compare the provided password with the stored hash.
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({
        success: false,
        msg: "Invalid credentials.",
      });
    }

    if (!user.emailVerified) {
      return res.status(401).json({
        success: false,
        msg: "Please verify your email address before signin.",
      });
    }

    // Create a JWT token that has the user's ID and type.
    const token = jwt.sign(
      { id: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    // Set the token as a cookie.
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, //  we can change this later for https.
      sameSite: "Strict",
      maxAge: 1 * 24 * 60 * 60 * 1000, // the cookie valid for one day ( we can extend it later).
    });

    // Successful login response  with the token.
    return res.json({
      success: true,
      msg: "Login successful!",
      token,
    });
  } catch (err) {
    logError(err);
    return res.status(500).json({
      success: false,
      msg: "Unable to login, please try again later.",
    });
  }
}

// Logs out a user by clearing the auth cookie.

export async function logout(req, res) {
  try {
    // Clear the cookie named 'token' for logout.
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
    });
    return res.json({
      success: true,
      msg: "Logged out successfully.",
    });
  } catch (err) {
    logError(err);
    return res.status(500).json({
      success: false,
      msg: "Unable to log out, please try again later.",
    });
  }
}

// Deletes a user account by ID.
export async function deleteAccount(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found." });
    }
    await user.deleteOne();
    res.clearCookie("token");
    return res.json({ success: true, msg: "Account deleted successfully." });
  } catch (err) {
    logError(err);
    return res.status(500).json({
      success: false,
      msg: "Unable to delete account, please try again later.",
    });
  }
}
