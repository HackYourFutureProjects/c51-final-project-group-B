import PropTypes from "prop-types";
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { SavedJobsProvider } from "./contexts/SavedJobsContext";
import { ChatProvider } from "./contexts/ChatContext";

/**
 * This component wraps our App with the providers we do not want to have in our tests
 */
const AppWrapper = ({ children }) => {
  return (
    <Router>
      <UserProvider>

        <SavedJobsProvider>{children}</SavedJobsProvider>

        <ChatProvider>{children}</ChatProvider>

      </UserProvider>
    </Router>
  );
};

AppWrapper.propTypes = {
  children: PropTypes.element.isRequired,
};

export default AppWrapper;
