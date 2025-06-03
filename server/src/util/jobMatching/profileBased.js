import { escapeRegex } from "../utils.js";
import { findJobs } from "../../helpers/jobPostHelper.js";
import { MIN_JOBS } from "../../constants.js";

/**
 * Constructs an array of job matching criteria with strict and
 * moderate levels based on the user's(seeker) profile.
 *
 * The loose is removed because it's adding noise to the results.
 */
export const profileBasedMatchingCriterion = (user) => {
  const {
    location,
    seekerProfile: {
      preferences = [],
      skills = [],
      position = "",
      languages = [],
    } = {},
  } = user;

  const isProfileIncomplete =
    !location ||
    !position ||
    !skills.length ||
    !preferences.length ||
    !languages.length;

  if (isProfileIncomplete) {
    return [];
  }

  // Partial match is supported so title and position should not exactly same
  const titleCondition = { title: new RegExp(escapeRegex(position), "i") };
  const languageCondition = { languages: { $in: languages } };
  // Jobs with only isActive = true are included
  const baseConditions = [{ isActive: true }, languageCondition];

  const strict = {
    $and: [
      ...baseConditions,
      { location },
      { tags: { $in: skills } },
      { type: { $in: preferences } },
      titleCondition,
    ],
  };

  const moderate = {
    $or: [
      {
        $and: [...baseConditions, { location }, { tags: { $in: skills } }],
      },
      {
        $and: [
          ...baseConditions,
          { type: { $in: preferences } },
          { tags: { $in: skills } },
        ],
      },
      {
        $and: [...baseConditions, { location }, titleCondition],
      },
    ],
  };

  return [
    { type: "strict", value: strict },
    { type: "moderate", value: moderate },
  ];
};

export const getUniqueJobs = (jobs) => {
  const map = new Map();
  for (const job of jobs) {
    map.set(job._id.toString(), job);
  }
  return Array.from(map.values());
};

export const getProfileBasedRecommendations = async (criteriaList) => {
  let recommendedJobs = [];
  let matchLevelsUsed = new Set();

  for (const criteria of criteriaList) {
    const jobs = await findJobs(
      criteria.value,
      "title tags location description isActive createdAt",
      "postedBy",
      false,
      { createdAt: -1 },
      0,
      10,
    );

    if (jobs.length) {
      recommendedJobs.push(...jobs);
      matchLevelsUsed.add(criteria.type);
      if (recommendedJobs.length >= MIN_JOBS) break;
    }
  }

  return {
    jobs: getUniqueJobs(recommendedJobs),
    matchLevels: Array.from(matchLevelsUsed),
  };
};
