import NotificationItem from "./NotificationItem";
import PropTypes from "prop-types";

const NotificationList = ({ notifications, markAsRead }) => {
  return (
    <>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification._id}
          notification={notification}
          markAsRead={markAsRead}
        />
      ))}
    </>
  );
};

NotificationList.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.object).isRequired,
  markAsRead: PropTypes.func.isRequired,
};
export default NotificationList;
