import { useUser } from "../contexts/UserContext";
import ErrorArea from "../pages/Error/ErrorArea";
import PropTypes from "prop-types";

const JobSeekerRoute = ({ children }) => {
  const { user } = useUser();

  if (!user || user.userType !== "seeker") {
    return <ErrorArea />;
  }
  return children;
};

export default JobSeekerRoute;
JobSeekerRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
