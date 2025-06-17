import { createContext, useContext } from "react";
import PropTypes from "prop-types";

const SocketContext = createContext(null);
/**
 * Creates a context to share socket connections across the app.
 * Provides access to the notification socket using a custom hook.
 */

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children, notificationSocket }) => {
  return (
    <SocketContext.Provider value={{ notificationSocket, chatSocket: null }}>
      {children}
    </SocketContext.Provider>
  );
};

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
  notificationSocket: PropTypes.object,
};
