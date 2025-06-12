import { httpClient } from "./client";
import { io } from "socket.io-client";

// Start or get a conversation with another user.
export function startConversation(recipientId) {
  return httpClient("/messages/start", {
    method: "POST",
    body: { recipientId },
  });
}

// Get all conversations for the current user.
export function getConversations() {
  return httpClient("/messages/conversations");
}

// Delete a conversation by its ID.
export function deleteConversation(conversationId) {
  return httpClient(`/messages/conversations/${conversationId}`, {
    method: "DELETE",
  });
}

// Get all messages in a conversation.
export function getMessages(conversationId) {
  return httpClient(`/messages/conversations/${conversationId}`);
}

/*
 * Send a message in a conversation (REST fallback).
 *  messageData - { text, attachment }
 */
export function sendMessage(conversationId, messageData) {
  return httpClient(`/messages/conversations/${conversationId}`, {
    method: "POST",
    body: messageData,
  });
}

// --------- Socket.io  setup for real-time messaging ----------

let socket = null;

//Connect to the Socket.io
export function connectSocket() {
  socket = io("/", {
    transports: ["websocket"],
  });
  socket.on("connect", () => {
    console.log("Socket connected!", socket.id);
  });
  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err);
  });
  window.socket = socket; // for debugging
  return socket;
}

// Disconnect the socket connection.

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/*  Send a message in real-time via socket.
 *  messageData - { conversationId, text, attachment }
 */
export function sendSocketMessage(messageData) {
  if (socket) {
    socket.emit("send_message", messageData);
  }
}

//Listen for new incoming messages.
export function onNewMessage(callback) {
  if (socket) {
    socket.on("new_message", callback);
  }
}

// Remove the new message listener (cleanup).

export function offNewMessage(callback) {
  if (socket) {
    socket.off("new_message", callback);
  }
}
