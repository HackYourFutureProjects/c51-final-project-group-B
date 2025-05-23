import express from "express";

import { getPublicProfile } from "../controllers/profile.js";

const profileRouter = express.Router();

// ------------- public profile -----------------

profileRouter.get("/:id", getPublicProfile);

export default profileRouter;
