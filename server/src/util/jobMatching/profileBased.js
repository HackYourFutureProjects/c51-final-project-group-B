/**
 * Constructs an array of job matching criteria with strict, moderate, and loose levels
 * based on the user's profile.
 *
 */

export const profileBasedMatchingCriterion = (user) => {
  const {
    location,
    seekerProfile: { preferences, skills, position },
  } = user;

  const strict = {
    $and: [
      { location: location },
      { tags: { $in: skills } },
      { type: { $in: preferences } },
      // { title: new RegExp(position, "i") },
    ],
  };

  const moderate = {
    $or: [
      {
        $and: [{ location: location }, { tags: { $in: skills } }],
      },
      {
        $and: [{ type: { $in: preferences } }, { tags: { $in: skills } }],
      },
      {
        $and: [{ location: location }, { title: new RegExp(position, "i") }],
      },
    ],
  };

  const loose = {
    $or: [
      { location: location },
      { tags: { $in: skills } },
      { type: { $in: preferences } },
      { title: new RegExp(position, "i") },
    ],
  };

  return [
    { type: "strict", value: strict },
    { type: "moderate", value: moderate },
    { type: "loose", value: loose },
  ];
};
