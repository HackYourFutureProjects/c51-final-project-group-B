import { useState, useRef } from "react";
import { MdNotifications } from "react-icons/md";
import useClickOutside from "../../hooks/useClickOutside";
import NotificationDropDown from "./NotificationDropDown";
import styles from "./notification-bell.module.css";
import PropTypes from "prop-types";
import { useNotifications } from "../../contexts/NotificationContext";

const NotificationBell = () => {
  const [showDropDown, setDropDownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { unreadCount } = useNotifications();
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

      {showDropDown && <NotificationDropDown />}
    </div>
  );
};

NotificationBell.propTypes = {
  notifications: PropTypes.array.isRequired,
  markAsRead: PropTypes.func.isRequired,
  unreadCount: PropTypes.number.isRequired,
};

export default NotificationBell;
