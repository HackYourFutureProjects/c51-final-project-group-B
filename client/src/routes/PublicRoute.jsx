import { useUser } from "../contexts/UserContext";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

export function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useUser();
  if (loading) return null; //  spinner later
  return isAuthenticated ? <Navigate to="/profile" /> : children;
}

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
