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

jobRouter.get(
  "/recommendations",
  authMiddleware,
  validateUserType("seeker"),
  asyncHandler(recommendationsByProfile),
);

jobRouter.get(
  "/:id/similar-jobs",
  authMiddleware,
  validateUserType("seeker"),
  validateJobPostExists,
  recommendationsByRecentView,
);

// POST /api/jobs -> create a new job post
jobRouter.post(
  "/",
  authMiddleware,
  validateUserType("company"),
  validateJobPost,
  asyncHandler(createJob),
);

// GET /api/jobs/id -> finds a specific job post
jobRouter.get("/:id", validateJobPostExists, asyncHandler(getJob));

// DELETE /api/jobs/:id -> delete existing job post
jobRouter.delete(
  "/:id",
  authMiddleware,
  validateUserType("company"),
  validateJobPostExists,
  asyncHandler(deleteJob),
);

jobRouter.patch(
  "/:id",
  authMiddleware,
  validateUserType("company"),
  validateJobPostExists,
  validateJobPost,
  asyncHandler(updateJob),
);

// GET /api/jobs/ -> gets all job posts
jobRouter.get("/", asyncHandler(jobs));

export default jobRouter;
