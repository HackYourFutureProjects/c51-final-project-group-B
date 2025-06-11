import Notification from "../models/Notification.js";
import { sendNotification } from "../sockets/socketHandler.js";

/**
 * createNotification: creates and saves a new notification for a user.
 */
export const createNotification = async (recipientId, data) => {
  const notification = new Notification({
    recipient: recipientId,
    ...data,
  });

  await notification.save();

  return notification;
};

/**
 * notifyUser: creates a notification and sends it to the user via socket.
 *  This function is used in applications.js in controller line 208
 */
export const notifyUser = async (io, recipientId, data) => {
  const notification = await createNotification(recipientId, data);
  sendNotification(io, recipientId, notification);
  return notification;
};
