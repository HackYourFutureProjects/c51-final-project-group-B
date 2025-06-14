import PropTypes from "prop-types";
import styles from "./chat-sections.module.css";
import { MdPerson } from "react-icons/md";

const ConversationPreview = ({
  conversation,
  selected,
  onSelect,
  unreadCount,
}) => {
  const user = conversation.user || {};

  return (
    <div
      className={
        selected
          ? `${styles.convListItem} ${styles.convListItemActive}`
          : styles.convListItem
      }
      onClick={onSelect}
    >
      {user.profilePhoto ? (
        <img
          src={user.profilePhoto}
          alt={user.name}
          className={`Avatar ${styles.convListAvatar}`}
        />
      ) : (
        <MdPerson className={`Avatar ${styles.convListAvatar}`} />
      )}
      <div className={styles.convListInfo}>
        <div className={styles.convListName}>{user.name || "Unknown"}</div>
        <div className={styles.convListLast}>
          {conversation.lastMessage?.text || "No messages yet"}
        </div>
      </div>
      {unreadCount > 0 && (
        <span className={styles.convListUnread}>{unreadCount}</span>
      )}
    </div>
  );
};

ConversationPreview.propTypes = {
  conversation: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  unreadCount: PropTypes.number,
};

export default ConversationPreview;
