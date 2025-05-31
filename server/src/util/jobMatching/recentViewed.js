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
  const { tags = [], location = "", type = "", title = "", _id } = clickedJob;
  if (!_id) return [];

  // To prevent unintended matches when the input contains special regex characters.
  // for example C++, + is a regex quantifier so must me escaped
  const regex = (val) => new RegExp(escapeRegex(val), "i");

  const selfMatch = { _id: { $ne: _id } }; // do NOT include the clicked job

  const strict = {
    $and: [
      selfMatch,
      { tags: { $in: tags } },
      { location: regex(location) },
      { type },
      { title: regex(title) },
    ],
  };

  const moderate = {
    $and: [
      selfMatch,
      {
        $or: [
          { $and: [{ tags: { $in: tags } }, { location: regex(location) }] },
          { $and: [{ tags: { $in: tags } }, { type }] },
          { $and: [{ location: regex(location) }, { type }] },
          { $and: [{ title: regex(title) }, { tags: { $in: tags } }] },
          { $and: [{ title: regex(title) }, { location: regex(location) }] },
          { $and: [{ title: regex(title) }, { type }] },
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
          { location: regex(location) },
          { type },
          { title: regex(title) },
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
