import { io } from "socket.io-client";

let socket = null;

/**
 * Again here a singleton design pattern is used to create
 * Socket.IO client.
 *  WHY?
 *    It ensures only one client connection exists throughout the app.
 */

const SERVER_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const createSocketConnection = () => {
  if (!socket) {
    socket = io(SERVER_URL, {
      withCredentials: true,
      transports: ["websocket"],
      extraHeaders: {
        Cookie: document.cookie,
      },
    });
  }

  return socket;
};

/**
 * Get the current active socket instance.
 * Returns null if the socket has not been created.
 */
export const getSocket = () => socket;

/**
 * Disconnect the current socket connection and reset
 * the singleton.
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
