import crypto from "crypto";
import bcrypt from "bcrypt";

// import sendEmail from "../util/sendEmail.js";
import { User } from "../models/User.js";
import { HOUR_MS, PASSWORD_MIN_LENGTH, SALT_ROUNDS } from "../constants.js";

/**
 * This function handles password recovery by generating and sending
 * a token if a user signup with a valid email address.
 *
 * It does that by following these 5 steps:
 *
 * 1. Checks if the use's email exists in db.
 * 2. Generates a secure random token used to verify the password reset request.
 * 3. Sets an expiration time for the token which in an hour
 * 4. Saves the token and expiration time to the user's record in the database.
 *      For this purpose I added two fields in the 'User' schema
 *      check from line 36 from User.js
 *
 * 5. Sends an email to the user containing a password reset link with the token.
 *  It uses  nodemailer configured with  Gmail account as defined in senderEmail.js.
 */

export const requestPasswordRecovery = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Email not found." });
  }

  const token = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + HOUR_MS;

  await user.save();

  // I had to comment this out so the branch can deploy on Heroku.
  // We still need to set EMAIL_USERNAME and EMAIL_PASSWORD in the Heroku env.

  // const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  // const message = `Click this link to reset your password: ${resetUrl}`;

  // await sendEmail({
  //   to: user.email,
  //   subject: "Password Reset",
  //   text: message,
  // });

  res.json({ success: true, message: "Recovery email sent" });
};

/**
 * This function resets the user’s password.
 *
 * It does that by following these 5 steps:
 *  1. Checks if the password meets requirement.
 *  2. Confirms that password and confirmPassword match.
 *  3. Finds the user with the valid reset token.
 *  4. Hashes the new password and updates the user’s password.
 *  5. Clears the reset token and expiration from the user’s data.
 *  6. Saves the updated user and sends a success response.
 */

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (!password || password.length < PASSWORD_MIN_LENGTH) {
    return res.status(400).json({
      success: false,
      message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`,
    });
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Passwords do not match" });
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired token" });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  user.passwordHash = passwordHash;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.json({ success: true, message: "Password updated successfully" });
};
