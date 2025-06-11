import { logInfo } from "../util/logging.js";

const userSockets = new Map();

/**
 * Finds the user linked to the disconnected socketId.
 * Removes that user from the userSockets map, cleaning up
 * the tracking.
 */
export const removeUserSocket = (socketId) => {
  for (const [userId, sId] of userSockets.entries()) {
    if (sId === socketId) {
      logInfo(
        `Removing user ${userId} with socket ${socketId} from userSockets map`,
      );
      userSockets.delete(userId);
      break;
    }
  }
  logInfo(
    "Current userSockets map after removal:",
    Object.fromEntries(userSockets),
  );
};

export const addUserSocket = (userId, socketId) => {
  userSockets.set(userId, socketId);
  console.log("Current userSockets map:", Object.fromEntries(userSockets));
};

export const getUserSocket = (userId) => {
  return userSockets.get(userId);
};
