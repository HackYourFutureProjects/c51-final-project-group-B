import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import asyncHandler from "../util/asyncHandler.js";
import {
  createFeed,
  getAuthFeeds,
  getPublicFeeds,
} from "../controllers/feed.js";

const feedRouter = express.Router();

// POST /api/feed ---> create a new feed article (only allowed system users)
feedRouter.post("/", authMiddleware, asyncHandler(createFeed));
// GET /api/feed ---> get authenticated user's feeds based on audience type
feedRouter.get("/", authMiddleware, asyncHandler(getAuthFeeds));

// GET /api/feed/public ---> get public feeds (no auth required)
feedRouter.get("/public", asyncHandler(getPublicFeeds));

export default feedRouter;
