import styles from "./notification-bell.module.css";
import PropTypes from "prop-types";
import { useNotifications } from "../../contexts/NotificationContext";

const NotificationFilter = ({ showUnreadOnly, setShowUnreadOnly }) => {
  const { notifications, unreadCount } = useNotifications();
  return (
    <div className={styles.filterToggle}>
      <button
        className={`${styles.filterBtn} ${!showUnreadOnly ? styles.active : ""}`}
        onClick={() => setShowUnreadOnly(false)}
      >
        All ({notifications.length})
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
