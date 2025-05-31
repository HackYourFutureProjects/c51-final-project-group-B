import { findJobs, recommendByCriteria } from "../helpers/jobPostHelper.js";
import { profileBasedMatchingCriterion } from "../util/jobMatching/profileBased.js";
import { recentViewMatchingCriterion } from "../util/jobMatching/recentViewed.js";

/**
 * Job recommendations based on recently clicked and view job post by a user
 */
export const recommendationsByRecentView = async (req, res) => {
  const fallbackQuery = () =>
    findJobs(
      { _id: { $ne: req.jobPost._id } },
      "title tags location description",
      "postedBy",
      { createdAt: -1 },
      0,
      10,
    );

  const response = await recommendByCriteria(
    recentViewMatchingCriterion,
    req.jobPost,
    "recent-view-based",
    fallbackQuery,
  );

  if (!response.success) {
    return {
      success: false,
      status: 500,
      msg: "Failed to get recommendations.",
    };
  }

  return res.status(200).json(response);
};

/**
 * Job recommendations based on logged in user's profile
 * example: preference, skills, position and location
 */
export const recommendationsByProfile = async (req, res) => {
  const user = req.fullUser;

  const criteria = profileBasedMatchingCriterion(user);

  const fallbackQuery = () =>
    findJobs(
      {},
      "title tags location description",
      "postedBy",
      { createdAt: -1 },
      0,
      10,
    );

  // If user profile is incomplete, fallback but still remind them to complete their profile.
  if (!criteria.length) {
    const fallback = await fallbackQuery();

    return res.status(200).json({
      success: true,
      message:
        "Showing recent jobs. Complete your profile to get better recommendations.",
      data: fallback,
      personalized: false,
    });
  }

  const response = await recommendByCriteria(
    () => criteria,
    user,
    "profile-based",
    fallbackQuery,
  );

  if (!response.success) {
    return res.status(500).json({
      success: false,
      message: "Failed to get recommendations.",
    });
  }

  return res.status(200).json({
    ...response,
  });
};
