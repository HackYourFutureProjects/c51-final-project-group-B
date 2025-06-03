import JobPost from "../models/JobPost.js";
import { logError, logInfo } from "../util/logging.js";

export const updateIsActiveStatus = async () => {
  try {
    logInfo("Running updateIsActiveStatus");

    const now = new Date();
    const result = await JobPost.updateMany(
      { expireOn: { $lte: now }, isActive: true },
      { isActive: false },
    );

    logInfo(
      `${result.modifiedCount} expired job posts deactivated at ${now.toISOString()}`,
    );
  } catch (err) {
    logError("Error updating job posts");
  }
};
