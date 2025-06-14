import express from "express";
import {
  startConversation,
  getUserConversations,
  deleteConversation,
  getConversationMessages,
  sendMessage,
} from "../controllers/messages.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import asyncHandler from "../util/asyncHandler.js";

const messagesRouter = express.Router();

// Start or get a conversation (init contact )
messagesRouter.post("/start", authMiddleware, asyncHandler(startConversation));

// List all conversations for the logged-in user
messagesRouter.get(
  "/conversations",
  authMiddleware,
  asyncHandler(getUserConversations),
);

// Delete a conversation (and its messages)
messagesRouter.delete(
  "/conversations/:id",
  authMiddleware,
  asyncHandler(deleteConversation),
);

// Get all messages in a conversation
messagesRouter.get(
  "/conversations/:id",
  authMiddleware,
  asyncHandler(getConversationMessages),
);

// Send a message in a conversation
messagesRouter.post(
  "/conversations/:id",
  authMiddleware,
  asyncHandler(sendMessage),
);

export default messagesRouter;
