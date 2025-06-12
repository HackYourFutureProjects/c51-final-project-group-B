import mongoose from "mongoose";
import SavedJob from "../models/SavedJob.js";

/** Saves a job post as fav associated with the logged in user */
export const createSavedJob = async (req, res) => {
  const { _id: userId } = req.fullUser;
  const { _id: jobId } = req.jobPost;

  const isAlreadySaved = await SavedJob.findOne({ userId, jobId });
  if (isAlreadySaved) {
    return res
      .status(404)
      .json({ success: false, message: "This job is saved already." });
  }

  const savedJob = await SavedJob.create({ userId, jobId });

  return res.status(201).json({
    success: true,
    data: savedJob,
  });
};

/** Get  all saved job post associated with the logged in user */
export const savedJobs = async (req, res) => {
  const { _id: userId } = req.fullUser;

  const savedJobs = await SavedJob.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },

    {
      $lookup: {
        from: "jobposts",
        localField: "jobId",
        foreignField: "_id",
        as: "savedJob",
      },
    },
    { $unwind: "$savedJob" },
    {
      $lookup: {
        from: "users",
        localField: "savedJob.postedBy",
        foreignField: "_id",
        as: "company",
      },
    },
    // I found out some companies who post jobposts
    // do not exists in the users collection
    {
      $unwind: {
        path: "$company",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 0,
        createdAt: 1,
        jobId: "$savedJob._id",
        jobTitle: "$savedJob.title",
        jobDescription: "$savedJob.description",
        jobType: "$savedJob.type",
        jobLocation: "$savedJob.location",
        jobExpireOn: "$savedJob.expireOn",
        jobIsActive: "$savedJob.isActive",
        companyName: {
          $ifNull: [
            "$company.companyProfile.companyName",
            "Company Doesn't exit,",
          ],
        },
        postedByEmail: "$company.email",
      },
    },
  ]);

  if (!savedJobs.length) {
    return res
      .status(404)
      .json({ success: false, message: "No saved jobs available." });
  }

  return res.status(200).json({
    success: true,
    data: savedJobs,
  });
};

/** Deletes saved job associated with the logged in user */
export const deleteSavedJob = async (req, res) => {
  const { _id: userId } = req.fullUser;
  const { _id: jobId } = req.jobPost;

  const delSavedJob = await SavedJob.findOneAndDelete({ userId, jobId });
  if (!delSavedJob) {
    return res
      .status(404)
      .json({ success: false, message: "Job post not found." });
  }

  return res.status(200).json({
    success: true,
    data: delSavedJob,
  });
};
