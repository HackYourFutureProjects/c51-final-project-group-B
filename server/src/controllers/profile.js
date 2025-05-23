import bcrypt from "bcrypt";
import { User, Seeker, Company } from "../models/User.js";
import { logError } from "../util/logging.js";
import validationErrorMessage from "../util/validationErrorMessage.js";

// -------------- public profile  ------------------

// fetches the public profile of a user by ID
export async function getPublicProfile(req, res) {
  try {
    const { id } = req.params;
    // exculding the passwordHash, we can add more fields to exclude if needed
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
