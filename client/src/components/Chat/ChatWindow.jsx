import { useEffect, useRef } from "react";
import { useChat } from "../../hooks/useChat";
import PropTypes from "prop-types";
import styles from "./chat-sections.module.css";
import { MdPerson } from "react-icons/md";
import Loading from "../templates/Loader";

const ChatWindow = ({ conversationId }) => {
  const { messages, messagesLoading, conversations, user } = useChat();
  const messageList = messages[conversationId] || [];
  const convo = conversations.find((c) => c._id === conversationId);
  const bottomRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageList]);

  if (!conversationId) {
    return (
      <section className={styles.chatWindowEmpty}>
        <span>Select a conversation to start chatting.</span>
      </section>
    );
  }

  if (messagesLoading && !messageList.length) {
    return <Loading />;
  }

  return (
    <section className={styles.chatWindow}>
      <header className={styles.chatWindowHeader}>
        {convo?.user?.profilePhoto ? (
          <img
            src={convo.user.profilePhoto}
            alt={convo.user.name}
            className={`Avatar ${styles.chatWindowAvatar}`}
          />
        ) : (
          <MdPerson className={`Avatar ${styles.chatWindowAvatar}`} />
        )}
        <span className={styles.chatWindowName}>
          {convo?.user?.name || "Unknown"}
        </span>
      </header>
      <div className={styles.chatWindowMessages}>
        {messageList.length === 0 ? (
          <div className={styles.chatWindowEmptyMsg}>No messages yet.</div>
        ) : (
          messageList.map((msg) => (
            <div
              key={msg._id}
              className={
                msg.sender?._id === convo?.user?._id
                  ? styles.chatWindowMsgOther
                  : styles.chatWindowMsgSelf
              }
            >
              <div className={styles.chatWindowMsgText}>{msg.text}</div>
              <div className={styles.chatWindowMsgMeta}>
                <span>
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {/* Read receipt  */}
                {msg.sender?._id === user._id && msg.read && (
                  <span className={styles.readReceipt}>✔✔</span>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </section>
  );
};
ChatWindow.propTypes = {
  conversationId: PropTypes.string,
};
export default ChatWindow;
