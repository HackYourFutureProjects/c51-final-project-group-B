import express from "express";
import {
  requestPasswordRecovery,
  resetPassword,
  verifyEmail,
} from "../controllers/authController.js";

import asyncHandler from "../util/asyncHandler.js";

const authRouter = express.Router();

authRouter.post("/forgot-password", asyncHandler(requestPasswordRecovery));
authRouter.post("/reset-password/:token", asyncHandler(resetPassword));
authRouter.get("/verify-email/:token", asyncHandler(verifyEmail));

export default authRouter;
