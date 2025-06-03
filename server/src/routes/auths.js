import express from "express";
import {
  requestPasswordRecovery,
  resetPassword,
} from "../controllers/recoverPassword.js";

import asyncHandler from "../util/asyncHandler.js";

const authRouter = express.Router();

authRouter.post("/forgot-password", asyncHandler(requestPasswordRecovery));
authRouter.post("/reset-password/:token", asyncHandler(resetPassword));

export default authRouter;
