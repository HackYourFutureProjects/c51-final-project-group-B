/**
 * This component wraps our App with the providers we do not want to have in our tests
 */

/**
 * NOTE: I removed UserProvider from this component because it caused conflicts.
 * I already included it at the root level in main.jsx.
 *
 */

import { BrowserRouter as Router } from "react-router-dom";
import { ChatProvider } from "./contexts/ChatContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { SavedJobsProvider } from "./contexts/SavedJobsContext";
import { useSocket } from "./contexts/SocketContext";
import { useUser } from "./contexts/UserContext";
import { SavedJobsProvider } from "./contexts/SavedJobsContext";
import PropTypes from "prop-types";

const AppWrapper = ({ children }) => {
  const { notificationSocket } = useSocket();
  const { user } = useUser();

  return (
    <Router>
      <ChatProvider>
        <NotificationProvider socket={notificationSocket} user={user}>
          <SavedJobsProvider>{children}</SavedJobsProvider>
        </NotificationProvider>
      </ChatProvider>
    </Router>
  );
};
AppWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
export default AppWrapper;
