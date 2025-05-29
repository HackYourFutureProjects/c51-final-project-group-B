import { User } from "../models/User.js";
import JobPost from "../models/JobPost.js";

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
 * Strict → Moderate → Loose → Fallback
 *
 * Further we can add match level to the response.
 */

export const recommendByCriteria = async (
  criteriaFn,
  input,
  typeLabel,
  fallbackQuery,
) => {
  const criteriaList = criteriaFn(input);
  let recommendedJobs = [];

  let matchLevel = "";
  for (const criteria of criteriaList) {
    matchLevel = criteria.type;
    recommendedJobs = await JobPost.find(criteria.value).limit(10);
    if (recommendedJobs.length) break;
  }

  if (!recommendedJobs.length) {
    matchLevel = "recent";
    recommendedJobs = await fallbackQuery();
  }

  if (!recommendedJobs.length) {
    return { success: false, status: 404, msg: "No recommendations found." };
  }

  return {
    success: true,
    data: recommendedJobs,
    type: typeLabel,
    matchLevel: matchLevel,
  };
};

/** Populates job post with company info */
export const populateJobsWithCompany = async (jobPosts) => {
  return Promise.all(
    jobPosts.map(async (jobPost) => {
      const company = await User.findById(jobPost.postedBy)
        .select("companyProfile.companyName profilePhoto")
        .lean();

      return {
        ...jobPost.toObject(),
        companyName: company?.companyProfile?.companyName || null,
        profilePhoto: company?.profilePhoto,
      };
    }),
  );
};
