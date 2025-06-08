import express from "express";
import {
  createSavedJob,
  deleteSavedJob,
  savedJobs,
} from "../controllers/savedJobs.js";

import { validateUserType } from "../middlewares/validateUserType.js";
import { validateJobPostExists } from "../middlewares/validateJobPost.js";
import asyncHandler from "../util/asyncHandler.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const savedJobsRoute = express.Router();

// GET /api/saved-jobs/ -> Retrieves saved jobs for the logged in seeker
savedJobsRoute.get(
  "/",
  authMiddleware,
  validateUserType("seeker"),
  asyncHandler(savedJobs),
);

// POST /api/saved-jobs/:id -> Creates a saved job for the logged in seeker
savedJobsRoute.post(
  "/:id",
  authMiddleware,
  validateUserType("seeker"),
  validateJobPostExists,
  asyncHandler(createSavedJob),
);

// DELETE /api/saved-jobs/:id -> Deletes a saved job for the logged in seeker
savedJobsRoute.delete(
  "/:id",
  authMiddleware,
  validateUserType("seeker"),
  validateJobPostExists,
  asyncHandler(deleteSavedJob),
);

export default savedJobsRoute;
