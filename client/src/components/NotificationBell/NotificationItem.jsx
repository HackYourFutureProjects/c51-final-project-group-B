import styles from "./notification-bell.module.css";
import PropTypes from "prop-types";

const NotificationItem = ({ notification, markAsRead }) => {
  return (
    <div
      className={`${styles.notificationItem} ${
        notification.isRead
          ? styles.readNotification
          : styles.unreadNotification
      }`}
      onClick={() => markAsRead(notification._id)}
    >
      <strong>{notification.title}</strong>
      <p>{notification.message}</p>
      <p>{notification.data.metadata.jobTitle}</p>
      <p>By: {notification.data.metadata.companyName}</p>
      {!notification.isRead && <div className={styles.unreadIndicator}></div>}
    </div>
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    isRead: PropTypes.bool.isRequired,
    data: PropTypes.shape({
      metadata: PropTypes.shape({
        jobTitle: PropTypes.string,
        companyName: PropTypes.string,
      }),
    }),
  }).isRequired,
  markAsRead: PropTypes.func.isRequired,
};

export default NotificationItem;
