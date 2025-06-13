import JobPost from "../models/JobPost.js";
import { logError, logInfo } from "../util/logging.js";
import cron from "node-cron";

/**
 * Deactivates job posts by setting `isActive` to false
 * if their `expireOn` timestamp is in the past or now.
 */
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

/**
 * Schedule a task i.e., updateIsActiveStatus
 * and run it every hour at min 0
 * */
cron.schedule("0 * * * *", async () => {
  try {
    logInfo(
      `[corn] Running updateIsActiveStatus at ${new Date().toISOString()} `,
    );

    await updateIsActiveStatus();
  } catch (error) {
    logError("[corn] Error in updateIsActiveStatus");
  }
});
