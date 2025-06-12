import {
  profileBasedMatchingCriterion,
  getProfileBasedRecommendations,
} from "../util/jobMatching/profileBased.js";
import { MAX_RECOMMENDATION_JOBS } from "../constants.js";
import { getIndustryMatchedJobs } from "../util/jobMatching/recentViewed.js";

import { getRandomJobs } from "../helpers/jobPostHelper.js";

/**
 * Finds similar jobs based on the industry of a job recently clicked or viewed by the user.
 *
 * It looks at the industry of the clicked job’s company and then fetches other jobs
 * posted by companies in the same industry.
 *
 * If no jobs match the industry, it will return a random selection of jobs instead.
 */

export const recommendationsByRecentView = async (req, res) => {
  const clickedJob = req.jobPost;

  if (!clickedJob?.postedBy?.companyProfile?.industry) {
    const randomJobs = await getRandomJobs(clickedJob._id);
    return res
      .status(200)
      .json({ success: true, data: randomJobs, source: "random" });
  }

  let jobs = await getIndustryMatchedJobs(clickedJob);
  let source = "matched";

  if (!jobs.length) {
    jobs = await getRandomJobs(clickedJob._id);
    source = "random";
  }

  if (!jobs.length) {
    return res.status(404).json({
      success: false,
      msg: "No job recommendations available at the moment.",
    });
  }

  return res.status(200).json({ success: true, data: jobs, source });
};

/**
 * This function recommends jobs to the user (job seeker) based on:
 * - Their position
 * - Or both position and location
 *
 * Each job in the result includes a `matchedBy` field indicating the match type:
 * - "by-position"
 * - or "by-position-and-location"
 *
 * If the user has not completed their profile, fallback jobs are shown,
 * along with the message:
 * "Complete your profile to get better recommendations."
 *
 * If the profile is complete but no matching jobs are found,
 * random jobs are returned with the message:
 * "No matches found. Showing random jobs instead."
 */

export const recommendationsByProfile = async (req, res) => {
  const user = req.fullUser;
  const criteriaList = profileBasedMatchingCriterion(user);

  if (!criteriaList.length) {
    const fallback = await getRandomJobs();
    return res.status(200).json({
      success: true,
      message:
        "Showing random recent jobs. Complete your profile to get better recommendations.",
      data: fallback,
      personalized: false,
    });
  }

  const { jobs } = await getProfileBasedRecommendations(
    criteriaList,
    MAX_RECOMMENDATION_JOBS,
  );

  if (!jobs.length) {
    const fallback = await getRandomJobs();
    return res.status(200).json({
      success: true,
      message: "No matches found. Showing random jobs instead.",
      data: fallback,
      personalized: false,
    });
  }

  return res.status(200).json({
    success: true,
    data: jobs.slice(0, MAX_RECOMMENDATION_JOBS),
    type: "profile-based",
  });
};
