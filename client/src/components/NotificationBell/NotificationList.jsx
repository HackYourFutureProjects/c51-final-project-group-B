import { useNotifications } from "../../contexts/NotificationContext";
import NotificationItem from "./NotificationItem";
import PropTypes from "prop-types";

const NotificationList = () => {
  const { notifications } = useNotifications();
  return (
    <>
      {notifications.map((notification) => (
        <NotificationItem key={notification._id} notification={notification} />
      ))}
    </>
  );
};

NotificationList.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.object).isRequired,
  markAsRead: PropTypes.func.isRequired,
};
export default NotificationList;
