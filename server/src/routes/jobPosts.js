import express from "express";

import {
  createJob,
  getJob,
  deleteJob,
  updateJob,
  jobs,
} from "../controllers/jobPost.js";

import {
  validateJobPost,
  validateIsCompany,
  validateJobPostExists,
} from "../middlewares/validateJobPost.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import asyncHandler from "../util/asyncHandler.js";

const jobRouter = express.Router();

// POST /api/jobs -> create a new job post
jobRouter.post(
  "/",
  authMiddleware,
  validateIsCompany,
  validateJobPost,
  asyncHandler(createJob),
);

// GET /api/jobs/id -> finds a specific job post
jobRouter.get("/:id", validateJobPostExists, asyncHandler(getJob));

// DELETE /api/jobs/:id -> delete existing job post
jobRouter.delete(
  "/:id",
  authMiddleware,
  validateIsCompany,
  validateJobPostExists,
  asyncHandler(deleteJob),
);

jobRouter.patch(
  "/:id",
  authMiddleware,
  validateIsCompany,
  validateJobPostExists,
  asyncHandler(updateJob),
);

// GET /api/jobs/ -> gets all job posts
jobRouter.get("/", asyncHandler(jobs));

export default jobRouter;
