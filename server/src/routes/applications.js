import express from "express";
import {
  createApplication,
  applications,
  getJobApplicants,
  updateApplicationStatus,
} from "../controllers/applications.js";
import authMiddleware from "../middlewares/authMiddleware.js";

import asyncHandler from "../util/asyncHandler.js";
import { validateUserType } from "../middlewares/validateUserType.js";

const applicationsRouter = express.Router();

applicationsRouter.post("/", authMiddleware, createApplication);

// GET /api/applications/ -> Gets all applications submitted by the logged in / seeker
applicationsRouter.get(
  "/",
  authMiddleware,
  validateUserType("seeker"),
  asyncHandler(applications),
);

// GET /api/applications/:id ->  Gets all applicants for a specific job post
applicationsRouter.get(
  "/:id",
  authMiddleware,
  asyncHandler(validateUserType("company")),
  asyncHandler(getJobApplicants),
);

// PATXH /api/applications/:id/status ->  Updates the status of an application
applicationsRouter.patch(
  "/:id/status",
  authMiddleware,
  asyncHandler(validateUserType("company")),
  asyncHandler(updateApplicationStatus),
);
export default applicationsRouter;
