import { escapeRegex } from "../utils.js";
import { findJobs } from "../../helpers/jobPostHelper.js";

/**
 * Constructs an array of job matching criteria with strict and
 * moderate levels based on the user's(seeker) profile.
 *
 *
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

  const words = position.split(" ").map(escapeRegex);
  const titleCondition = { title: new RegExp(words.join("|"), "i") };

  const byPositionAndLocation = {
    $and: [{ isActive: true }, titleCondition, { location: location }],
  };

  const byPosition = {
    $and: [{ isActive: true }, titleCondition],
  };

  return [
    {
      type: "by-position-and-location",
      value: byPositionAndLocation,
    },
    { type: "by-position", value: byPosition },
  ];
};

export const getProfileBasedRecommendations = async (criteria, maxNumber) => {
  const [byPositionAndLocation, byPosition] = criteria;

  const jobsByPosition = await findJobs(
    byPosition.value,
    "title tags type location description isActive createdAt",
    "postedBy",
    false,
    { createdAt: -1 },
    0,
    maxNumber,
  );

  const locationValue = byPositionAndLocation.value.$and.find(
    (c) => c.location,
  )?.location;

  const jobs = jobsByPosition.map((job) => {
    const matchedBy =
      job.location === locationValue
        ? "by-position-and-location"
        : "by-position";
    return { ...job, matchedBy };
  });

  return { jobs };
};
