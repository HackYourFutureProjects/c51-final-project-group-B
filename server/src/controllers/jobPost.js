import { User } from "../models/User.js";
import JobPost from "../models/JobPost.js";

import { endOfToday, startOfToday } from "../util/utils.js";
import { findJobs } from "../helpers/jobPostHelper.js";
import { escapeRegex } from "../util/utils.js";

import { MAX_POSTS_PER_DAY } from "../constants.js";

/**
 * Create a new job post.
 * */
export const createJob = async (req, res) => {
  const { title, type, location } = req.body;

  const doesJobPostExist = await JobPost.findOne({
    title: new RegExp(`^${title.trim()}$`, "i"),
    type: new RegExp(`^${type.trim()}$`, "i"),
    location: new RegExp(`^${location.trim()}$`, "i"),
    postedBy: req.user.id,
  }).lean();

  if (doesJobPostExist) {
    return res.status(400).json({
      success: false,
      msg: "Duplicates job post found.",
    });
  }

  const postsToday = await JobPost.countDocuments({
    postedBy: req.user.id,
    createdAt: { $gte: startOfToday(), $lte: endOfToday() },
  });

  if (postsToday > MAX_POSTS_PER_DAY) {
    return res
      .status(429)
      .json({ success: false, message: "Daily post limit reached." });
  }

  const newJobPost = new JobPost({
    ...req.body,
    postedBy: req.user.id,
  });

  await newJobPost.save();

  return res.status(201).json({ success: true, data: newJobPost });
};

/**
 * Get a job post by id.
 * */
export const getJob = async (req, res) => {
  const jobPost = req.jobPost;

  const companyProfile = await User.findById(jobPost.postedBy)
    .select("companyProfile.companyName profilePhoto")
    .lean();

  const jobInfo = { ...jobPost, ...companyProfile };
  return res.status(200).json({ success: true, data: jobInfo });
};

/**
 * Delete a job by id but first checks if no one has applied before.
 */
export const deleteJob = async (req, res) => {
  const jobPost = req.jobPost;

  if (jobPost.applicationCount > 0) {
    return res.status(400).json({
      success: false,
      msg: "Cannot delete a job post with existing applications",
    });
  }

  const deletedJobPost = await JobPost.findByIdAndDelete(jobPost._id);
  if (!deletedJobPost) {
    return res
      .status(404)
      .json({ success: false, msg: `No job post with ${jobPost._id} found.` });
  }

  return res.status(200).json({ success: true, data: deletedJobPost });
};

/**
 * Update a job by id but first checks if no one has applied before.
 */
export const updateJob = async (req, res) => {
  const jobPost = req.jobPost;

  if (jobPost.applicationCount > 0) {
    return res.status(400).json({
      success: false,
      msg: "Cannot update a job post with existing applications.",
    });
  }

  const updatedJobPost = await JobPost.findByIdAndUpdate(
    jobPost._id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedJobPost) {
    return res
      .status(404)
      .json({ success: false, msg: "Job post no longer exists." });
  }

  return res.status(200).json({ success: true, data: updatedJobPost });
};

/**
 *  Get all job posts based on a given criteria or key which is {} by default.
 *
 *  If we provide page number and limit it will find all jobs by skipping (page-1)*limit.
 */

export const jobs = async (req, res) => {
  const { location, title, tags, page = 1, limit = 10 } = req.query;

  const criteria = {};

  if (location) {
    const safeLocation = escapeRegex(location);
    criteria.location = { $regex: safeLocation, $options: "i" };
  }

  if (title) {
    const safeTitle = escapeRegex(title);
    criteria.title = { $regex: safeTitle, $options: "i" };
  }

  if (tags) {
    const tagList = tags.split(",").map((tag) => tag.trim());
    criteria.tags = {
      $elemMatch: {
        $in: tagList.map((tag) => new RegExp(`^${escapeRegex(tag)}$`, "i")),
      },
    };
  }

  const pageNumber = Math.max(1, parseInt(page));
  const limitNumber = Math.max(1, parseInt(limit));

  const skip = (pageNumber - 1) * limitNumber;

  const jobs = await findJobs(
    criteria,
    "title tags location description createdAt",
    true,
    { createdAt: -1 },
    skip,
    limitNumber,
  );

  res.status(200).json({ success: true, data: jobs });
};
