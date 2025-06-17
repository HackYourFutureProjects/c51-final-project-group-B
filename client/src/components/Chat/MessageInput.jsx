import { useRef, useState } from "react";
import { useChat } from "../../hooks/useChat";
import styles from "./chat-sections.module.css";
import PropTypes from "prop-types";
import { uploadFileToCloudinary } from "../../util/cloudinaryUpload";
import { MdAttachFile } from "react-icons/md";

const MessageInput = ({ conversationId, disabled }) => {
  const { sendMessage, loading } = useChat();
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const handleFileButtonClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };
  const handleSend = async (e) => {
    e.preventDefault();
    if ((!text.trim() && !file) || !conversationId) return;

    let attachment = "";
    if (file) {
      setUploading(true);
      try {
        attachment = await uploadFileToCloudinary(file);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (err) {
        alert("File upload failed: " + err.message);
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    //  send if text or attachment is present (after upload)
    if (text.trim() || attachment) {
      sendMessage(conversationId, { text, attachment });
      setText("");
    }
  };

  return (
    <form className={styles.messageInputForm} onSubmit={handleSend}>
      <input
        className={styles.messageInput}
        type="text"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading || disabled || uploading || !conversationId}
        autoComplete="off"
      />
      <button
        type="button"
        className={styles.uploadBtn}
        onClick={handleFileButtonClick}
        disabled={loading || disabled || uploading}
        title="Attach file"
      >
        <MdAttachFile size={22} />
      </button>
      <input
        type="file"
        accept="image/*,application/pdf"
        ref={fileInputRef}
        onChange={(e) => setFile(e.target.files[0])}
        style={{ display: "none" }}
        disabled={loading || disabled || uploading}
      />
      <button
        className={styles.messageSendBtn}
        type="submit"
        disabled={
          loading ||
          disabled ||
          uploading ||
          (!text.trim() && !file) ||
          !conversationId
        }
      >
        {uploading ? "Uploading..." : "Send"}
      </button>
    </form>
  );
};

MessageInput.propTypes = {
  conversationId: PropTypes.string,
  disabled: PropTypes.bool,
};
export default MessageInput;
