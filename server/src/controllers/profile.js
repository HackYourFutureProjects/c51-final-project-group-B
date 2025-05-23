import bcrypt from "bcrypt";
import { User, Seeker, Company } from "../models/User.js";
import { logError } from "../util/logging.js";
import validationErrorMessage from "../util/validationErrorMessage.js";

// -------------- public profile  ------------------

// Fetches the public profile of a user by ID
export async function getPublicProfile(req, res) {
  try {
    const { id } = req.params;
    // Find the user and exculding the passwordHash, we can add more fields to exclude if needed
    const user = await User.findById(id).select("-passwordHash");

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found." });
    }

    return res.status(200).json({ success: true, user });
  } catch (err) {
    logError(err);
    return res
      .status(500)
      .json({ success: false, msg: "Server error while fetching profile." });
  }
}

// ---------------- private profile  ------------------

// Fetches the authenticated user's profile. then returns a structured response with success/error .

export async function getProfile(req, res) {
  try {
    // Find the user exculding the passwordHash, we can add more fields to exclude if needed
    const user = await User.findById(req.user.id).select("-passwordHash");

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found." });
    }

    return res.status(200).json({ success: true, user });
  } catch (err) {
    logError(err);
    return res
      .status(500)
      .json({ success: false, msg: "Server error while fetching profile." });
  }
}

// Updates the authenticated user's profile. doing validation checks before applying updates.

export async function updateProfile(req, res) {
  try {
    const { id, userType } = req.user;
    const updates = {};
    let errors = [];

    // base user updates
    if (req.body.email !== undefined) updates.email = req.body.email;
    if (req.body.location !== undefined) updates.location = req.body.location;
    if (req.body.profilePhoto !== undefined)
      updates.profilePhoto = req.body.profilePhoto;

    if (req.body.password !== undefined) {
      updates.passwordHash = await bcrypt.hash(req.body.password.trim(), 10);
    }

    // for seeker profile
    if (userType === "seeker" && req.body.seekerProfile) {
      const seekerErrors = Seeker.validateSeekerProfile(req.body.seekerProfile);
      if (seekerErrors.length > 0) errors = errors.concat(seekerErrors);

      Object.entries(req.body.seekerProfile).forEach(([key, val]) => {
        if (val !== undefined) updates[`seekerProfile.${key}`] = val;
      });
    }

    // for company profile
    if (userType === "company" && req.body.companyProfile) {
      const companyErrors = Company.validateCompanyProfile(
        req.body.companyProfile,
      );
      if (companyErrors.length > 0) errors = errors.concat(companyErrors);

      Object.entries(req.body.companyProfile).forEach(([key, val]) => {
        if (val !== undefined) updates[`companyProfile.${key}`] = val;
      });
    }

    // Return validation errors if any
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ success: false, msg: validationErrorMessage(errors) });
    }

    // Check if there are updates to apply
    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ success: false, msg: "No valid fields to update." });
    }

    // Select the correct model based on userType
    const UserModel = userType === "seeker" ? Seeker : Company;

    // Perform the update with validation and return the updated user
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true, context: "query" },
    ).select("-passwordHash");

    if (!updatedUser) {
      return res.status(404).json({ success: false, msg: "User not found." });
    }

    return res.status(200).json({
      success: true,
      msg: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (err) {
    // for a duplicate key error(email already used)
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        msg: "Email already in use. Please use a different email.",
      });
    }
    logError(err);
    return res
      .status(500)
      .json({ success: false, msg: "Server error while updating profile." });
  }
}

// delete the user entirly
export async function deleteProfile(req, res) {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user.id);

    if (!deletedUser) {
      return res.status(404).json({ success: false, msg: "User not found." });
    }

    return res
      .status(200)
      .json({ success: true, msg: "Account deleted successfully." });
  } catch (err) {
    logError(err);
    return res
      .status(500)
      .json({ success: false, msg: "Server error while deleting profile." });
  }
}
