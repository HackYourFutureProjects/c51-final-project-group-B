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

  // preview text for the last message in the conversation
  function getPreviewText(lastMessage) {
    if (!lastMessage) return "No messages yet";
    if (lastMessage.text && lastMessage.text.trim()) return lastMessage.text;
    if (lastMessage.attachment) {
      if (lastMessage.attachment.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return "Image attachment";
      }
      if (lastMessage.attachment.match(/\.pdf$/i)) {
        return "PDF attachment";
      }
      return "Attachment";
    }
    return "";
  }

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
          {getPreviewText(conversation.lastMessage)}
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
