import { useState, useRef } from "react";
import { MdNotifications } from "react-icons/md";
import useClickOutside from "../../hooks/useClickOutside";
import NotificationDropDown from "./NotificationDropDown";
import styles from "./notification-bell.module.css";
import PropTypes from "prop-types";

const NotificationBell = ({ notifications, markAsRead, unreadCount }) => {
  const [showDropDown, setDropDownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setDropDownOpen(false));

  return (
    <div className={styles.notificationContainer} ref={dropdownRef}>
      <div
        className={styles.notificationWrapper}
        onClick={() => setDropDownOpen((prev) => !prev)}
      >
        <MdNotifications
          size={26}
          className={styles.icon}
          color="var(--primary-color)"
        />
        {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
      </div>

      {showDropDown && (
        <NotificationDropDown
          notifications={notifications}
          markAsRead={markAsRead}
          unreadCount={unreadCount}
        />
      )}
    </div>
  );
};

NotificationBell.propTypes = {
  notifications: PropTypes.array.isRequired,
  markAsRead: PropTypes.func.isRequired,
  unreadCount: PropTypes.number.isRequired,
};

export default NotificationBell;
