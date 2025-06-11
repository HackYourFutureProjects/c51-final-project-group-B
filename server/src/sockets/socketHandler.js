import Notification from "../models/Notification.js";
import { logError, logInfo } from "../util/logging.js";
import { parseCookies, verifyToken } from "../util/utils.js";

import {
  addUserSocket,
  removeUserSocket,
  getUserSocket,
} from "./socketUserTracker.js";

/**
 * The setupSocket function listens for new real time
 * connections to the server using Socket.IO.
 *
 * When a client tries to connect, it verifies their
 * authentication token from the cookies sent by the client.
 *   This part: socket.handshake.headers.cookie where it gets the cookie from.
 *
 * If verification fails, the client is disconnected.
 *
 * If verification is a success the connection from the client is accepted.
 *
 * After that the server knows who really connected by using userId
 * and assign each connected client a unique socket ID to identify them.
 *
 * After that the server starts listening for events from that client.
 *   For example check the events emitted by the client in the
 *   context/NotificationContext around line 45 and 54
 *
 * A Map is used to associate the authenticated userId with the socketId,
 * allowing targeted communication with specific users check the file
 * socketUserTracker.js.
 */

export const setupSocket = (io) => {
  io.on("connection", async (socket) => {
    try {
      const cookies = parseCookies(socket.handshake.headers.cookie);

      const token = cookies.token;

      if (!token) return socket.disconnect(true);

      const userId = verifyToken(token);

      if (!userId) return socket.disconnect(true);

      addUserSocket(userId, socket.id);

      await sendUnreadNotifications(socket, userId);
      handleNotificationRead(socket, userId);

      socket.on("disconnect", () => {
        removeUserSocket(socket.id);
      });
    } catch (error) {
      logInfo("Socket setup error:", error.message);
      socket.disconnect(true);
    }
  });
};

/**
 * Fetches all unread and undelivered notifications for a specific user
 * and emits each notification to the client via the socket connection.
 */
export const sendUnreadNotifications = async (socket, userId) => {
  try {
    const unreadUndelivered = await Notification.find({
      recipient: userId,
    });

    unreadUndelivered.forEach((notification) => {
      socket.emit("notification", notification);
    });

    logInfo(`Sent ${unreadUndelivered.length} notifications to user ${userId}`);
  } catch (err) {
    logInfo("Error fetching notifications:", err.message);
  }
};

/**
 * Sets up a socket listener to handle marking a notification
 * as read for a specific user.
 *
 * When a "notification:read" event is received,
 * it updates the notification in the database
 * and emits the updated notification back to the client.
 */
export const handleNotificationRead = (socket, userId) => {
  socket.on("notification:read", async ({ notificationId }) => {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, recipient: userId },
        { isRead: true, readAt: new Date() },
        { new: true },
      );

      if (notification) {
        socket.emit("notification:read", notification);
        logInfo(
          `Notification ${notificationId} marked as read for user ${userId}`,
        );
      }
    } catch (err) {
      logError("Error marking notification as read:", err.message);
    }
  });
};

/**
 * Sends a real time notification to a specific user if they
 * have an active socket connection.
 *
 * If no active socket is found, logs that the notification was not sent.
 */
export const sendNotification = (io, userId, notification) => {
  const socketId = getUserSocket(userId);

  if (socketId) {
    io.to(socketId).emit("notification", notification);
  } else {
    logInfo(`No active socket for user ${userId}. Notification not sent.`);
  }
};
