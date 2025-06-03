import {
  profileBasedMatchingCriterion,
  getProfileBasedRecommendations,
} from "../util/jobMatching/profileBased.js";
import { MIN_JOBS } from "../constants.js";
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
 * Fetches recommended jobs using a tiered matching strategy.
 *
 * It always starts by looking for jobs that strictly match all the criteria.
 * If no results are found, it gradually relaxes the filters; first trying moderate,
 * then loose criteria.
 *
 * If even the loose criteria don’t return any jobs, it falls back to a default query,
 * like fetching the most recent job posts.
 *
 * This approach follows a progression from:
 * Strict -> Moderate -> Loose -> Fallback
 *
 * Further we can add match level to the response.
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

  const { jobs, matchLevels } =
    await getProfileBasedRecommendations(criteriaList);

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
    data: jobs.slice(0, MIN_JOBS),
    type: "profile-based",
    matchLevel: matchLevels.join(", "),
  });
};
