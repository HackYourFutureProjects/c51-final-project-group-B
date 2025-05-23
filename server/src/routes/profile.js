import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { validateUpdateProfile } from "../middlewares/validateInput.js";
import {
  getProfile,
  updateProfile,
  deleteProfile,
  getPublicProfile,
} from "../controllers/profile.js";

const profileRouter = express.Router();

// ------------- public profile -----------------

profileRouter.get("/:id", getPublicProfile);

// -------------- private profile  ------------------

profileRouter.get("/", authMiddleware, getProfile);
profileRouter.patch("/", authMiddleware, validateUpdateProfile, updateProfile);
profileRouter.delete("/", authMiddleware, deleteProfile);

export default profileRouter;
