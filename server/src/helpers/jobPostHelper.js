import { MAX_RECOMMENDATION_JOBS } from "../constants.js";
import JobPost from "../models/JobPost.js";
import { escapeRegex } from "../util/utils.js";

/**
 * A generic function that we can use to search job posts based on a given criteria
 *  It takes 7 parameters:
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
 *  4: singleDoc false by default determine to use 'find' or 'findOne'
 *  sort, skip and limit are obvious ^_^
 *  Note: we can even make this more generic by passing Model type and rename it 'findAnything'
 */
export const findJobs = async (
  criteria = {},
  selectedFields = "",
  path = null,
  singleDoc = false,
  sort = { createdAt: -1 },
  skip = 0,
  limit = 50,
) => {
  let query = singleDoc
    ? JobPost.findOne(criteria)
    : JobPost.find(criteria).skip(skip).limit(limit).sort(sort);

  query = query.select(selectedFields).lean();

  if (path) {
    query = query.populate({
      path: "postedBy",
      select: "companyProfile.companyName companyProfile.industry profilePhoto",
    });
  }

  const result = await query.exec();
  if (singleDoc) return result;

  return result || [];
};

/**
 * Retrieves a random set of job posts, excluding a specific job by ID.
 *
 * Steps:
 * 1: Excludes the job with the given ID from the results.
 * 2: Randomly samples a specified number of jobs.
 * 3: Joins with the "users" collection to get details about who posted each job.
 * 4: Unwinds the joined user data to simplify the structure.
 */

import mongoose from "mongoose";

export const getRandomJobs = async (
  excludeId,
  limit = MAX_RECOMMENDATION_JOBS,
) => {
  return JobPost.aggregate([
    {
      $match: {
        $nor: [
          { _id: new mongoose.Types.ObjectId(excludeId) },
          { isActive: false },
        ],
      },
    },
    { $sample: { size: limit } },
    {
      $lookup: {
        from: "users",
        localField: "postedBy",
        foreignField: "_id",
        as: "postedBy",
      },
    },
    { $unwind: "$postedBy" },
    {
      $project: {
        title: 1,
        tags: 1,
        type: 1,
        location: 1,
        description: 1,
        isActive: 1,
        createdAt: 1,
        postedBy: {
          _id: 1,
          companyProfile: {
            companyName: "$postedBy.companyProfile.companyName",
            industry: "$postedBy.companyProfile.industry",
          },
        },
      },
    },
    { $sort: { createdAt: -1 } },
    { $limit: limit },
  ]);
};

export const getJobSearchCriterion = (query, user) => {
  const { location, title, type, tags } = query;
  const criteria = {};

  if (location) {
    const safeLocation = escapeRegex(location);
    criteria.location = { $regex: safeLocation, $options: "i" };
  }

  if (title) {
    const safeTitle = escapeRegex(title);
    criteria.title = { $regex: safeTitle, $options: "i" };
  }

  if (type) {
    const safeType = escapeRegex(type);
    criteria.type = { $regex: safeType, $options: "i" };
  }

  if (tags) {
    const tagList = tags.split(",").map((tag) => tag.trim());
    criteria.tags = {
      $elemMatch: {
        $in: tagList.map((tag) => new RegExp(`^${escapeRegex(tag)}$`, "i")),
      },
    };
  }

  if (user?.userType === "company") {
    criteria.postedBy = user.id || user._id;
  }

  return criteria;
};
