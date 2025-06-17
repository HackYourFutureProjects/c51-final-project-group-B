import PropTypes from "prop-types";
import styles from "./notification-bell.module.css";

const EmptyState = ({ showUnreadOnly }) => {
  return (
    <div className={styles.emptyState}>
      {showUnreadOnly ? "No unread notifications" : "No notifications"}
    </div>
  );
};

EmptyState.propTypes = {
  showUnreadOnly: PropTypes.bool.isRequired,
};
export default EmptyState;
