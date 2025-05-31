import { escapeRegex } from "../utils.js";

/**
 * Constructs an array of job matching criteria with strict,
 * moderate, and loose levels based on the user's(seeker) profile.
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

  const titleCondition = { title: new RegExp(escapeRegex(position), "i") };
  //const languageCondition = { languages: { $in: languages } };

  const strict = {
    $and: [
      { location: location },
      { tags: { $in: skills } },
      { type: { $in: preferences } },
      titleCondition,
      //languageCondition,
    ],
  };

  const moderate = {
    $or: [
      {
        $and: [
          { location: location },
          { tags: { $in: skills } },
          //languageCondition,
        ],
      },
      {
        $and: [
          { type: { $in: preferences } },
          { tags: { $in: skills } },
          //languageCondition,
        ],
      },
      {
        // $and: [{ location: location }, titleCondition, languageCondition],
        $and: [{ location: location }, titleCondition],
      },
    ],
  };

  const loose = {
    $or: [
      { location: location },
      { tags: { $in: skills } },
      { type: { $in: preferences } },
      titleCondition,
      //languageCondition,
    ],
  };

  return [
    { type: "strict", value: strict },
    { type: "moderate", value: moderate },
    { type: "loose", value: loose },
  ];
};
