import jwt from "jsonwebtoken";

// we will use this to check the token (dont forget to add JWT_SECRET to the .env file)
export default function authMiddleware(req, res, next) {
  const token = req.cookies.token; // Get token from cookie

  if (!token) {
    return res
      .status(401)
      .json({ success: false, msg: "Unauthorized: No token provided." });
  }
  try {
    const { id, userType } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id, userType };
    next();
  } catch {
    return res.status(401).json({ success: false, msg: "Invalid token." });
  }
}
