import mongoose from "mongoose";

import Application from "../models/Applications.js";
import JobPost from "../models/JobPost.js";
import { logError } from "../util/logging.js";

// Create a new application [only job seekers can apply for jobs]
export const createApplication = async (req, res) => {
  try {
    if (req.user.userType !== "seeker") {
      return res
        .status(403)
        .json({ success: false, msg: "Only seekers can apply for jobs." });
    }

    const { jobId, resumeUrl } = req.body;
    const userId = req.user.id;
    // checking for resumeUrl
    if (!resumeUrl) {
      return res.status(400).json({
        success: false,
        msg: "Resume URL is required.",
      });
    }
    // checking for jobId
    const job = await JobPost.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, msg: "Job not found." });
    }
    // we will add a isActive too . but this works the same way based on  the limit and expire date, the isActive can be added too and  can be used if a job is temporarily paused or not accepting applications for any reason.

    const canApply = !job.limit || job.applicationCount < job.limit;
    const isNotExpired = !job.expireOn || job.expireOn > new Date();
    if (!canApply || !isNotExpired) {
      return res.status(400).json({
        success: false,
        msg: "This job is not accepting applications anymore.",
      });
    }
    // Check if the user has already applied for this job
    const alreadyApplied = await Application.findOne({ userId, jobId });
    if (alreadyApplied) {
      return res.status(409).json({
        success: false,
        msg: "You have already applied for this job.",
      });
    }

    // create application and update job in sequence
    const application = new Application({
      userId,
      jobId,
      resumeUrl,
      status: "pending",
    });
    await application.save();

    try {
      job.applicationCount += 1;
      await job.save();
    } catch (jobSaveErr) {
      // rollback application if job update fails
      await Application.deleteOne({ _id: application._id });
      return res.status(500).json({
        success: false,
        msg: "Failed to add this application to the job. Please try again.",
      });
    }

    return res.status(201).json({ success: true, data: application });
  } catch (err) {
    logError(err);

    // handle validation errors
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, msg: err.message });
    }
    return res.status(500).json({ success: false, msg: "Server error." });
  }
};

/**
 * Gets all applications submitted by the logged in user/job seeker
 * including the associated job details and the company info who posted
 * each job.
 */
export const applications = async (req, res) => {
  const applicant = req.fullUser;

  const applications = await Application.aggregate([
    { $match: { userId: applicant._id } },
    {
      $lookup: {
        from: "jobposts",
        localField: "jobId",
        foreignField: "_id",
        as: "appliedJobs",
      },
    },
    { $unwind: "$appliedJobs" },

    {
      $lookup: {
        from: "users",
        localField: "appliedJobs.postedBy",
        foreignField: "_id",
        as: "company",
      },
    },
    { $unwind: "$company" },
    {
      $project: {
        jobTitle: "$appliedJobs.title",
        jobLocation: "$appliedJobs.location",
        jobIsActive: "$appliedJobs.isActive",
        jobExpireOn: "$appliedJobs.expireOn",
        companyEmail: "$company.email",
        companyName: "$company.companyProfile.companyName",
        status: "$status",
        appliedAt: "$createdAt",
      },
    },
  ]);

  return res.status(200).json({ success: true, data: applications });
};

/**
 * Gest all applicants for a specific job with their basic profile
 * and application time.
 */
export const getJobApplicants = async (req, res) => {
  const jobId = new mongoose.Types.ObjectId(req.params.id);

  const applicants = await Application.aggregate([
    { $match: { jobId: jobId } },

    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "applicant",
      },
    },
    { $unwind: "$applicant" },
    {
      $project: {
        applicantId: "$userId",
        applicationStatus: "$status",
        firstName: "$applicant.seekerProfile.firstName",
        lastName: "$applicant.seekerProfile.lastName",
        resumeUrl: "$applicant.seekerProfile.resumeUrl",
        email: 1,
        appliedAt: "$createdAt",
      },
    },
  ]);

  if (!applicants.length) {
    return res
      .status(404)
      .json({ success: false, message: "No applicants for this job found." });
  }

  return res.status(200).json({ success: true, data: applicants });
};

/** Updates the status of an application */
export const updateApplicationStatus = async (req, res) => {
  const { _id: applicantId } = req.params;
  const { status } = req.body;

  const validStatuses = [
    "pending",
    "reviewed",
    "accepted",
    "rejected",
    "shortlisted",
    "withdrawn",
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Status must be one of ${validStatuses.join(", ")}`,
    });
  }

  const application = await Application.findOne({ applicantId });
  if (!application) {
    return res
      .status(404)
      .json({ success: false, message: "No application found." });
  }

  application.status = status;
  await application.save;

  return res
    .status(200)
    .json({ success: true, updatedApplication: application });
};
