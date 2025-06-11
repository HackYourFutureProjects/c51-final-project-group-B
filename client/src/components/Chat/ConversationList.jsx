import { useChat } from "../../hooks/useChat";
import PropTypes from "prop-types";
import ConversationPreview from "./ConversationPreview";
import styles from "./chat-sections.module.css";
import Loading from "../templates/Loader";

const ConversationList = ({ onSelect, selectedId }) => {
  const { conversations, unread, conversationsLoading } = useChat();
  console.log("Rendering ConversationList", unread);

  return (
    <aside className={styles.convList}>
      {conversationsLoading && <Loading />}
      {!conversationsLoading && conversations.length === 0 && (
        <div className={styles.convListEmpty}>No conversations.</div>
      )}
      {conversations.map((conv) => (
        <ConversationPreview
          key={conv._id}
          conversation={conv}
          selected={selectedId === conv._id}
          onSelect={() => onSelect(conv._id)}
          unreadCount={unread[conv._id] || 0}
        />
      ))}
    </aside>
  );
};

ConversationList.propTypes = {
  onSelect: PropTypes.func.isRequired,
  selectedId: PropTypes.string,
};
export default ConversationList;
