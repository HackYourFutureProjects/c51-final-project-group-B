/**
 * Constructs an array of job matching criteria with strict, moderate, and loose levels
 * based on the recent clicked job post.
 *
 * Ensures the clicked job itself is excluded from results.
 *
 * Note: This is basic implementation we can always improve(make it smart)by adding weight to the fields
 *  like preference 3, skills 2... and calculate the score
 */

import { escapeRegex } from "../utils.js";
export const recentViewMatchingCriterion = (clickedJob = {}) => {
  const {
    tags = [],
    location = "",
    type = "",
    title = "",
    languages = [],
    _id,
  } = clickedJob;

  if (!_id) return [];

  const regex = (val) => new RegExp(escapeRegex(val), "i");

  const selfMatch = { _id: { $ne: _id } };
  const titleCondition = { title: regex(title) };
  const locationCondition = { location: regex(location) };
  const languageCondition = { languages: { $in: languages } };

  const strict = {
    $and: [
      selfMatch,
      { tags: { $in: tags } },
      locationCondition,
      { type },
      titleCondition,
      languageCondition,
    ],
  };

  const moderate = {
    $and: [
      selfMatch,
      {
        $or: [
          {
            $and: [
              { tags: { $in: tags } },
              locationCondition,
              languageCondition,
            ],
          },
          {
            $and: [{ tags: { $in: tags } }, { type }, languageCondition],
          },
          {
            $and: [locationCondition, { type }, languageCondition],
          },
          {
            $and: [titleCondition, { tags: { $in: tags } }, languageCondition],
          },
          {
            $and: [titleCondition, locationCondition, languageCondition],
          },
          {
            $and: [titleCondition, { type }, languageCondition],
          },
        ],
      },
    ],
  };

  const loose = {
    $and: [
      selfMatch,
      {
        $or: [
          { tags: { $in: tags } },
          locationCondition,
          { type },
          titleCondition,
          languageCondition,
        ],
      },
    ],
  };

  return [
    { type: "strict", value: strict },
    { type: "moderate", value: moderate },
    { type: "loose", value: loose },
  ];
};
