import { User } from "../models/User.js";

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
  req.fullUser = user;

  next();
};
