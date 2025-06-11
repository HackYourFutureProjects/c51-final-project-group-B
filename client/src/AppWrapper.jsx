import PropTypes from "prop-types";
import { BrowserRouter as Router } from "react-router-dom";

/**
 * This component wraps our App with the providers we do not want to have in our tests
 */

/**
 * NOTE: I removed UserProvider from this component because it caused conflicts.
 * I already included it at the root level in main.jsx.
 *
 */
const AppWrapper = ({ children }) => {
  return <Router>{children}</Router>;
};

AppWrapper.propTypes = {
  children: PropTypes.element.isRequired,
};

export default AppWrapper;
