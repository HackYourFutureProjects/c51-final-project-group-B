/**
 * NotificationProvider sets up a React context for managing
 * real time notifications via Socket.IO.
 *
 * It listens for incoming notification events from the server,
 *  stores them in local state,
 * and prevents duplicate notifications based on their unique ID.
 *
 * When the user or socket changes, it resets or reinitializes the
 * state and subscriptions accordingly.
 *
 * It also emits a request to fetch unread notifications when the socket connects.
 *
 * The provider provides:
 * 1: notifications >- an array of notification fetched from the db
 * 2: markAsRead -> a function to mark a specific notification
 * 3: unreadCount -> the number of unread notifications
 *
 */

import { createContext, useContext, useEffect, useState } from "react";

const NotificationContext = createContext();
import PropTypes from "prop-types";

export const NotificationProvider = ({ children, socket, user }) => {
  const [notifications, setNotification] = useState([]);

  // when user changes clear the notification array
  useEffect(() => {
    setNotification([]);
  }, [user]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const onNotification = (notification) => {
      setNotification((prev) => {
        if (prev.some((n) => n._id === notification._id)) return prev;
        return [notification, ...prev];
      });
    };

    // Since this provider accept the socket from SocketManager
    // it can listen to new events or send events <=> bidirectional communication
    socket.on("notification", onNotification); // Listens for new notifications sent from the server and runs onNotification when one arrives.
    socket.emit("requestUnreadNotifications"); // Asks the server to send all unread notifications for the current user.

    return () => {
      socket.off("notification", onNotification);
    };
  }, [socket, user]);

  const markAsRead = (notificationId) => {
    if (!socket) return;
    socket.emit("notification:read", { notificationId });

    setNotification((prev) => {
      return prev.map((notification) =>
        notification._id === notificationId
          ? { ...notification, isRead: true, readAt: new Date() }
          : notification,
      );
    });
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, markAsRead, unreadCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
  socket: PropTypes.shape({
    on: PropTypes.func.isRequired,
    emit: PropTypes.func.isRequired,
    off: PropTypes.func.isRequired,
  }).isRequired,
  user: PropTypes.object.isRequired,
};
export const useNotifications = () => useContext(NotificationContext);
