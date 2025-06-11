/**
 * SocketManager is responsible for managing the lifecycle
 * of a Socket.IO connection based on the user's authentication status.
 *
 * When the user is login it establishes a new socket connection
 * using createSocketConnection (is in socket.js)and stores it in state.
 *
 * If the user is not authenticated or logs out, it will
 * disconnected and cleaned up the existing socket.
 *
 * The active socket and user(this is coming from UserContext) are
 * then passed to the NotificationProvider.
 *
 */

// All in all this is a simple component that creates
// socket connection if a user is authenticated and
//  pass this socket & user to the NotificationProvider
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { createSocketConnection } from "../../socket.js";
import { NotificationProvider } from "../../contexts/NotificationContext";
import { useUser } from "../../contexts/UserContext";

const SocketManager = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user, isAuthenticated } = useUser();

  useEffect(() => {
    let currentSocketInstance = null;

    if (isAuthenticated) {
      currentSocketInstance = createSocketConnection();
      setSocket(currentSocketInstance);
    } else {
      if (socket) {
        socket.disconnect();
      }
      setSocket(null);
    }

    return () => {
      if (currentSocketInstance) {
        currentSocketInstance.disconnect();
      } else if (socket) {
        socket.disconnect();
      }
      setSocket(null);
    };
  }, [isAuthenticated]);

  return (
    <NotificationProvider socket={socket} user={user}>
      {children}
    </NotificationProvider>
  );
};

SocketManager.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SocketManager;
