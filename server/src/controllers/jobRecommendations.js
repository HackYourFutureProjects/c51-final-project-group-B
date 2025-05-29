import {
  populateJobsWithCompany,
  recommendByCriteria,
} from "../helpers/jobPostHelper.js";
import JobPost from "../models/JobPost.js";

import { profileBasedMatchingCriterion } from "../util/jobMatching/profileBased.js";
import { recentViewMatchingCriterion } from "../util/jobMatching/recentViewed.js";

/**
 * Job recommendations based on recently clicked and view job post by a user
 */
export const recommendationsByRecentView = async (req, res) => {
  const response = await recommendByCriteria(
    recentViewMatchingCriterion,
    req.jobPost,
    "recent-view-based",
    () => JobPost.find().sort({ createdAt: -1 }).limit(5),
  );

  if (response.success) {
    response.data = await populateJobsWithCompany(response.data);
  }

  return res.status(200).json(response);
};

/**
 * Job recommendations based on logged in user's profile
 * example: preference, skills, position and location
 */
export const recommendationsByProfile = async (req, res) => {
  const response = await recommendByCriteria(
    profileBasedMatchingCriterion,
    req.fullUser,
    "profile-based",
    () => JobPost.find().sort({ createdAt: -1 }).limit(10),
  );

  if (response.success) {
    response.data = await populateJobsWithCompany(response.data);
  }

  return res.status(200).json(response);
};
