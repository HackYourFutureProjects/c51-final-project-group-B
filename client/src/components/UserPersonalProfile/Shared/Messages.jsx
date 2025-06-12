import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useChat } from "../../../hooks/useChat";
import ConversationList from "../../Chat/ConversationList";
import ChatWindow from "../../Chat/ChatWindow";
import MessageInput from "../../Chat/MessageInput";
import styles from "./messages.module.css";

const Messages = () => {
  const { conversationId: routeConversationId } = useParams();
  const { openConversation, fetchConversations, setActiveConversationId } =
    useChat();
  const [selectedId, setSelectedId] = useState("");

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Open conversation when selectedId changes
  useEffect(() => {
    if (selectedId) openConversation(selectedId);
  }, [selectedId, openConversation]);

  // Sync with route param
  useEffect(() => {
    if (routeConversationId && routeConversationId !== selectedId) {
      setSelectedId(routeConversationId);
    }
  }, [routeConversationId, selectedId]);

  // Cleanup: reset active conversation on unmount
  useEffect(() => {
    return () => {
      setActiveConversationId(null);
    };
  }, [setActiveConversationId]);

  return (
    <div className={styles.chatLayout}>
      <ConversationList onSelect={setSelectedId} selectedId={selectedId} />
      <div className={styles.chatMain}>
        <ChatWindow conversationId={selectedId} />
        <MessageInput conversationId={selectedId} />
      </div>
    </div>
  );
};

export default Messages;
