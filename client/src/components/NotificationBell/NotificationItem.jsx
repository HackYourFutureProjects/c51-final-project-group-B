import { Link } from "react-router-dom";
import styles from "./notification-bell.module.css";
import PropTypes from "prop-types";
import { formatDistanceToNow } from "date-fns";

const NotificationItem = ({ notification, markAsRead }) => {
  const { type, title, message, data, isRead } = notification;
  const { metadata = {} } = data || {};
  const timeAgo = notification.createdAt
    ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })
    : null;

  const renderDetails = () => {
    switch (type) {
      case "application_submitted":
        return metadata.profileUrl ? (
          <Link className={styles.linkItem} to={`/${metadata.profileUrl}`}>
            View Profile
          </Link>
        ) : null;

      case "application_status_change":
        return (
          <>
            <Link className={styles.linkItem} to={`/${metadata.jobUrl}`}>
              {metadata.jobTitle && <p>{metadata.jobTitle}</p>}
            </Link>
            {metadata.companyName && <p>By: {metadata.companyName}</p>}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`${styles.notificationItem} ${
        isRead ? styles.readNotification : styles.unreadNotification
      }`}
      onClick={() => markAsRead(notification._id)}
    >
      <strong>{title}</strong>
      <p>{message}</p>
      {renderDetails()}
      {timeAgo && <small className={styles.timestamp}>{timeAgo}</small>}
      {!isRead && <div className={styles.unreadIndicator}></div>}
    </div>
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    isRead: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    createdAt: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]).isRequired,
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
