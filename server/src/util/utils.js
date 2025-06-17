import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { logInfo } from "./logging.js";

export const removeDuplicates = (doc, fields) => {
  fields.forEach((field) => {
    if (Array.isArray(doc[field])) {
      doc[field] = [...new Set(doc[field])];
    }
  });
};

export const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const startOfToday = () => new Date(new Date().setHours(0, 0, 0, 0));
export const endOfToday = () => new Date(new Date().setHours(23, 59, 59, 999));

/**
 *
 * This is used to  escape special characters in user input
 * before using it in a regular expression.
 * This prevents regex injection and ensures that the input is treated
 * as plain text, not as a regex pattern.
 */
export const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

/** We need this function because the token string returned from
 * socket.handshake.headers.cookie in the setupSocket has a format
 * token=the-token-string and we only need the-token-string
 */
export const parseCookies = (cookieString = "") => {
  const cookies = {};
  cookieString.split(";").forEach((cookie) => {
    const [name, ...rest] = cookie.trim().split("=");
    if (name && rest.length) {
      cookies[name] = rest.join("=");
    }
  });
  return cookies;
};

/**
 * Takes a JWT token string. Verifies it using your secret.
 * Resolves with the userId if valid, or null if invalid
 * or missing.
 */

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (err) {
    logInfo("JWT verification failed:", err.message);
    return null;
  }
};
