import express from "express";

import {
  createJob,
  getJob,
  deleteJob,
  updateJob,
  jobs,
} from "../controllers/jobPost.js";

import {
  recommendationsByRecentView,
  recommendationsByProfile,
} from "../controllers/jobRecommendations.js";

import {
  validateJobPost,
  validateUserType,
  validateJobPostExists,
} from "../middlewares/validateJobPost.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import asyncHandler from "../util/asyncHandler.js";

const jobRouter = express.Router();

// GET /api/jobs/recommendations -> gets recommendations based user profile
jobRouter.get(
  "/recommendations",
  authMiddleware,
  asyncHandler(validateUserType("seeker")),
  asyncHandler(recommendationsByProfile),
);

// GET /api/jobs/:id/similar-jobs-> gets recommendations based on recent viewed
jobRouter.get(
  "/:id/similar-jobs",

  asyncHandler(validateUserType("seeker")),
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

jobRouter.patch(
  "/:id",
  authMiddleware,
  asyncHandler(validateUserType("company")),
  asyncHandler(validateJobPostExists),
  validateJobPost,
  asyncHandler(updateJob),
);

// GET /api/jobs/ -> gets all job posts
jobRouter.get("/", asyncHandler(jobs));

export default jobRouter;
