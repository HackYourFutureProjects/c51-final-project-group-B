import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import PropTypes from "prop-types";

import { useUser } from "../../contexts/UserContext";
import { SocketProvider } from "../../contexts/SocketContext.jsx";

const SERVER_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

/**
 * SocketManager is a React component that manages socket connection
 * to the notifications namespace on the server.
 *
 * -establishes a socket connection when the user is authenticated.
 * -disconnects the socket when the user logs out.
 * -provides the socket to child components.
 */
const SocketManager = ({ children }) => {
  const { isAuthenticated } = useUser();
  const [notificationSocket, setNotificationSocket] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      if (notificationSocket) {
        notificationSocket.disconnect();
        setNotificationSocket(null);
      }
      return;
    }

    const nsSocket = io(`${SERVER_URL}/notifications`, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    nsSocket.on("connect", () => {
      console.log("Notification socket connected:", nsSocket.id);
    });

    setNotificationSocket(nsSocket);

    return () => {
      nsSocket.disconnect();
    };
  }, [isAuthenticated]);

  return (
    <SocketProvider notificationSocket={notificationSocket}>
      {children}
    </SocketProvider>
  );
};

SocketManager.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SocketManager;
