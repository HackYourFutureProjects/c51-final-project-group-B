import styles from "./notification-bell.module.css";
import PropTypes from "prop-types";

const NotificationFilter = ({
  showUnreadOnly,
  setShowUnreadOnly,
  totalCount,
  unreadCount,
}) => {
  return (
    <div className={styles.filterToggle}>
      <button
        className={`${styles.filterBtn} ${!showUnreadOnly ? styles.active : ""}`}
        onClick={() => setShowUnreadOnly(false)}
      >
        All ({totalCount})
      </button>
      <button
        className={`${styles.filterBtn} ${showUnreadOnly ? styles.active : ""}`}
        onClick={() => setShowUnreadOnly(true)}
      >
        Unread ({unreadCount})
      </button>
    </div>
  );
};

NotificationFilter.propTypes = {
  showUnreadOnly: PropTypes.bool.isRequired,
  setShowUnreadOnly: PropTypes.func.isRequired,
  totalCount: PropTypes.number.isRequired,
  unreadCount: PropTypes.number.isRequired,
};
export default NotificationFilter;
