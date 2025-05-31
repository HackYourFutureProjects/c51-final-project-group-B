import JobPost from "../models/JobPost.js";
import { MIN_JOBS } from "../constants.js";

/**
 * A generic function that we can use to search job posts based on a given criteria
 *  It takes 6 parameters:
 *
 *  1: criteria: is a MongoDB object that we construct depending on what
 *     filters or search terms we want.
 *     e.g. const criteria = {
 *               location: "Amsterdam",
 *               tags: { $in: ["Full-time", "Remote"] },
 *               title: /developer/i,
 *            };
 *
 *  2: selectedFields: fields that we want to include in response.
 *  3: populatedFields: fields that we want to include in from the referenced object, if any
 *  sort, skip and limit are obvious ^_^
 *  Note: we can even make this more generic by passing Model type and rename it 'findAnything'
 */
export const findJobs = async (
  criteria = {},
  selectedFields = " ",
  path = null,
  sort = { createdAt: -1 },
  skip = 0,
  limit = 10,
) => {
  let query = JobPost.find(criteria)
    .select(selectedFields)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  if (path) {
    query = query.populate({
      path: "postedBy",
      select: "companyProfile.companyName profilePhoto",
    });
  }

  return await query.lean();
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
  if (!input) {
    return {
      success: false,
      status: 400,
      msg: "Invalid input for job recommendations.",
    };
  }

  const criteriaList = criteriaFn(input);
  let recommendedJobs = [];
  let matchLevelsUsed = [];

  if (!criteriaList.length) {
    matchLevelsUsed.push("recent");
    recommendedJobs = await fallbackQuery();
  } else {
    for (const criteria of criteriaList) {
      const jobs = await findJobs(
        criteria.value,
        "title tags location description createdAt",
        "postedBy",
        { createdAt: -1 },
        0,
        10,
      );
      if (jobs.length) {
        recommendedJobs.push(...jobs);
        matchLevelsUsed.push(criteria.type);
        if (recommendedJobs.length >= MIN_JOBS) break;
      }
    }

    if (!recommendedJobs.length) {
      matchLevelsUsed.push("recent");
      recommendedJobs = await fallbackQuery();
    }
  }

  if (!recommendedJobs.length) {
    return { success: false, status: 404, msg: "No recommendations found." };
  }

  return {
    success: true,
    data: recommendedJobs.slice(0, MIN_JOBS),
    type: typeLabel,
    matchLevel: matchLevelsUsed.join(", "),
  };
};
