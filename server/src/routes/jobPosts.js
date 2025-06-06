import express from "express";

import {
  createJob,
  getJob,
  deleteJob,
  updateJob,
  jobs,
  getCompanyJobLists,
} from "../controllers/jobPost.js";

import {
  recommendationsByRecentView,
  recommendationsByProfile,
} from "../controllers/jobRecommendations.js";

import { validateUserType } from "../middlewares/validateUserType.js";

import {
  validateJobPost,
  validateJobPostExists,
} from "../middlewares/validateJobPost.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import asyncHandler from "../util/asyncHandler.js";

const jobRouter = express.Router();

// GET /api/jobs/company/job-lists -> gets all jobs posted  by logged in company
jobRouter.get(
  "/company/job-lists",
  authMiddleware,
  asyncHandler(validateUserType("company")),
  asyncHandler(getCompanyJobLists),
);

// GET /api/jobs/recommendations -> gets job recommendations based user profile
jobRouter.get(
  "/recommendations",
  authMiddleware,
  asyncHandler(validateUserType("seeker")),
  asyncHandler(recommendationsByProfile),
);

// GET /api/jobs/:id/similar-jobs-> gets similar jobs based on clicked/recent viewed
jobRouter.get(
  "/:id/similar-jobs",
  //asyncHandler(validateUserType("seeker")),
  asyncHandler(validateJobPostExists),
  asyncHandler(recommendationsByRecentView),
);

// POST /api/jobs -> create a new job post
jobRouter.post(
  "/",
  authMiddleware,
  asyncHandler(validateUserType("company")),
  validateJobPost,
  asyncHandler(createJob),
);

// GET /api/jobs/id -> finds a specific job post
jobRouter.get("/:id", validateJobPostExists, asyncHandler(getJob));

// DELETE /api/jobs/:id -> delete existing job post
jobRouter.delete(
  "/:id",
  authMiddleware,
  asyncHandler(validateUserType("company")),
  asyncHandler(validateJobPostExists),
  asyncHandler(deleteJob),
);

// PATCH /api/jobs/:id -> delete existing job post
jobRouter.patch(
  "/:id",
  authMiddleware,
  asyncHandler(validateUserType("company")),
  asyncHandler(validateJobPostExists),
  validateJobPost,
  asyncHandler(updateJob),
);

// GET /api/jobs/ -> gets all job posts plus filter them by given criteria
jobRouter.get("/", asyncHandler(jobs));

export default jobRouter;
