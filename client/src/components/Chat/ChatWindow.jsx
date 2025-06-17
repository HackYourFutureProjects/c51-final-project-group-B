import { useEffect, useRef } from "react";
import { useChat } from "../../hooks/useChat";
import PropTypes from "prop-types";
import styles from "./chat-sections.module.css";
import { MdPerson, MdPictureAsPdf, MdDelete } from "react-icons/md";
import Loading from "../templates/Loader";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ChatWindow = ({ conversationId }) => {
  const { messages, messagesLoading, conversations, user, deleteConversation } =
    useChat();
  const messageList = messages[conversationId] || [];
  const convo = conversations.find((c) => c._id === conversationId);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  // Handle conversation deletion
  const handleDeleteConversation = async (e) => {
    e.stopPropagation();
    if (window.confirm("Delete this conversation? This cannot be undone.")) {
      try {
        await deleteConversation(conversationId);
        navigate("/profile/messages"); // Navigate to messages page
      } catch (err) {
        toast.error("Error deleting conversation: " + err.message);
      }
    }
  };
  useEffect(() => {
    // Scroll to bottom when messages change
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageList]);
  // Ensure conversationId and convo are valid when convo deleted it will show empty state
  if (!conversationId || !convo) {
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
        <Link
          to={
            convo?.user?.userType === "company"
              ? `/users/company-profile/${convo.user._id}`
              : `/users/candidate-profile/${convo.user._id}`
          }
          style={{ textDecoration: "none" }}
        >
          {convo?.user?.profilePhoto ? (
            <img
              src={convo.user.profilePhoto}
              alt={convo.user.name}
              className={`Avatar ${styles.chatWindowAvatar}`}
            />
          ) : (
            <MdPerson className={`Avatar ${styles.chatWindowAvatar}`} />
          )}
        </Link>
        <span className={styles.chatWindowName}>
          {convo?.user?.name || "Unknown"}
        </span>
        <button
          onClick={handleDeleteConversation}
          className={styles.deleteConvoBtn}
          title="Delete conversation"
        >
          <MdDelete size={20} />
        </button>
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
              {/* attachemnts and the text  */}
              <div className={styles.chatWindowMsgText}>
                {msg.text}
                {msg.attachment && (
                  <div className={styles.attachmentContainer}>
                    {msg.attachment.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <a
                        href={msg.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={msg.attachment}
                          alt="attachment"
                          className={styles.attachmentImage}
                          style={{ cursor: "pointer" }}
                        />
                      </a>
                    ) : msg.attachment.match(/\.pdf$/i) ? (
                      <a
                        href={msg.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.pdfAttachment}
                      >
                        <MdPictureAsPdf
                          size={24}
                          color="#d32f2f"
                          style={{ marginRight: 8 }}
                        />
                        View PDF
                      </a>
                    ) : (
                      <a
                        href={msg.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Attachment
                      </a>
                    )}
                  </div>
                )}
              </div>
              <div className={styles.chatWindowMsgMeta}>
                <span className={styles.chatWindowMsgTime}>
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
