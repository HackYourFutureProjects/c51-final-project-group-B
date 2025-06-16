import { useState } from "react";
import PropTypes from "prop-types";
import NotificationFilter from "./NotificationFilter";
import NotificationList from "./NotificationList";
import EmptyState from "./EmptyState";
import styles from "./notification-bell.module.css";

const NotificationDropDown = ({ notifications, markAsRead, unreadCount }) => {
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const filteredNotifications = showUnreadOnly
    ? notifications.filter((notification) => !notification.isRead)
    : notifications;

  return (
    <div className={styles.dropDown}>
      <NotificationFilter
        showUnreadOnly={showUnreadOnly}
        setShowUnreadOnly={setShowUnreadOnly}
        totalCount={notifications.length}
        unreadCount={unreadCount}
      />

      {!filteredNotifications.length ? (
        <EmptyState showUnreadOnly={showUnreadOnly} />
      ) : (
        <NotificationList
          notifications={filteredNotifications}
          markAsRead={markAsRead}
        />
      )}
    </div>
  );
};

NotificationDropDown.propTypes = {
  notifications: PropTypes.array.isRequired,
  markAsRead: PropTypes.func.isRequired,
  unreadCount: PropTypes.number.isRequired,
};

export default NotificationDropDown;
