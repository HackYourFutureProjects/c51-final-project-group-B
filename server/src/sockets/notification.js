import Notification from "../models/Notification.js";
import { logError } from "../util/logging.js";
import { parseCookies, verifyToken } from "../util/utils.js";

/**
 * This function creates a namespace called notifications to avoid event collisions
 * with the default root namespace like the one used in the chat app
 *
 * It listens for a connection event, and runs a callback function
 * when a client connects.
 *
 * Inside this callback:
 * - We authenticate the connected client.
 * - If authentication is successful, we can use emit or on to send and receive events
 *   between the server and that client.
 * - Finally, listens for disconnect event.
 */

export const notificationSocketSpace = (io) => {
  const notificationNamespace = io.of("/notifications");

  notificationNamespace.on("connection", async (socket) => {
    try {
      const userId = verifyClient(socket);

      socket.join(userId);

      await sendUnreadNotifications(socket, userId);
      handleNotificationRead(socket, userId);

      socket.on("disconnect", () => {
        socket.leave(userId);
      });
    } catch (error) {
      logError("Setting up notification namespace failed.");
      socket.emit("unauthorized", "Authentication Failed.");
      socket.disconnect(true);
    }
  });
};

/**
 * This function gets notifications that are unread for a logged in user,
 * and emit each notification under event name notification.
 *
 * It differs from sendNotification in a way that this sends notifications
 * when a user that was offline comes online.
 */

export const sendUnreadNotifications = async (socket, userId) => {
  try {
    const unreadNotifications = await Notification.find({
      recipient: userId,
      isRead: false,
    });

    unreadNotifications.forEach((notification) => {
      socket.emit("notification", notification);
    });
  } catch (err) {
    logError("Error fetching unread notifications.", err.message);
  }
};

/**
 * This function handles marking specific notification as read. It listens to the
 * on notification:read event and emit notification:read:conform
 */
export const handleNotificationRead = (socket, userId) => {
  socket.on("notification:read", async ({ notificationId }) => {
    try {
      await Notification.findOneAndUpdate(
        { _id: notificationId, recipient: userId },
        { isRead: true, readAt: new Date() },
        { new: true },
      );
    } catch (err) {
      logError("Error marking notification read:", err.message);
    }
  });
};

/**
 * Sends a real time notification to a specific user if he/she
 * has an active socket connection.
 */
export const sendNotification = (io, userId, notification) => {
  io.of("/notifications").to(userId).emit("notification", notification);
};

/**
 * Verify the client socket that tries to connect is auth.
 */
const verifyClient = (socket) => {
  const cookies = parseCookies(socket.handshake.headers.cookie);
  const token = cookies.token;
  if (!token) throw new Error("No token provided.");

  const userId = verifyToken(token);
  if (!userId) throw new Error("Invalid token.");
  return userId;
};
