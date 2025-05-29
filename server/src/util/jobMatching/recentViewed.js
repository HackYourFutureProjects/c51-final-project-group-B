/**
 * Constructs an array of job matching criteria with strict, moderate, and loose levels
 * based on the recent clicked job post.
 * Ensures the clicked job itself is excluded from results.
 */
export const recentViewMatchingCriterion = (clickedJob) => {
  const { tags = [], location = "", type, title = "", _id } = clickedJob;

  const strict = {
    $and: [
      { tags: { $in: tags } },
      { location: new RegExp(location, "i") },
      { type: type },
      { title: new RegExp(title, "i") },
      { _id: { $ne: _id } },
    ],
  };

  const moderate = {
    $or: [
      {
        $and: [
          { tags: { $in: tags } },
          { location: new RegExp(location, "i") },
          { _id: { $ne: _id } },
        ],
      },
      {
        $and: [{ tags: { $in: tags } }, { type: type }, { _id: { $ne: _id } }],
      },
      {
        $and: [
          { location: new RegExp(location, "i") },
          { type: type },
          { _id: { $ne: _id } },
        ],
      },
      {
        $and: [
          { title: new RegExp(title, "i") },
          { tags: { $in: tags } },
          { _id: { $ne: _id } },
        ],
      },
      {
        $and: [
          { title: new RegExp(title, "i") },
          { location: new RegExp(location, "i") },
          { _id: { $ne: _id } },
        ],
      },
      {
        $and: [
          { title: new RegExp(title, "i") },
          { type: type },
          { _id: { $ne: _id } },
        ],
      },
    ],
  };

  const loose = {
    $or: [
      { tags: { $in: tags }, _id: { $ne: _id } },
      { location: new RegExp(location, "i"), _id: { $ne: _id } },
      { type: type, _id: { $ne: _id } },
      { title: new RegExp(title, "i"), _id: { $ne: _id } },
    ],
  };

  return [
    { type: "strict", value: strict },
    { type: "moderate", value: moderate },
    { type: "loose", value: loose },
  ];
};
