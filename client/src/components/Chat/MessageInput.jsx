import { useState } from "react";
import { useChat } from "../../hooks/useChat";
import styles from "./chat-sections.module.css";
import PropTypes from "prop-types";
const MessageInput = ({ conversationId, disabled }) => {
  const { sendMessage, loading } = useChat();
  const [text, setText] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !conversationId) return;
    sendMessage(conversationId, { text });
    setText("");
  };

  return (
    <form className={styles.messageInputForm} onSubmit={handleSend}>
      <input
        className={styles.messageInput}
        type="text"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading || disabled || !conversationId}
        autoComplete="off"
      />
      <button
        className={styles.messageSendBtn}
        type="submit"
        disabled={loading || disabled || !text.trim() || !conversationId}
      >
        Send
      </button>
    </form>
  );
};

MessageInput.propTypes = {
  conversationId: PropTypes.string,
  disabled: PropTypes.bool,
};
export default MessageInput;
