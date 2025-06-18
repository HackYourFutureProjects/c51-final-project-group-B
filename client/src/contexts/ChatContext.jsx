import { useRef, createContext, useEffect, useState, useCallback } from "react";
import * as chatService from "../api/chatService";
import { useUser } from "./UserContext";
import PropTypes from "prop-types";

export const ChatContext = createContext();

export function ChatProvider({ children }) {
  const { user, isAuthenticated } = useUser();

  // state
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({}); // { [conversationId]: [messages] }
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [unread, setUnread] = useState({}); // { [conversationId]: count }
  const [loading, setLoading] = useState(false);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const activeConversationIdRef = useRef(activeConversationId);
  const pendingReadConversations = useRef(new Set());

  useEffect(() => {
    activeConversationIdRef.current = activeConversationId;
  }, [activeConversationId]);

  // Socket connection
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    chatService.connectSocket();

    // Listen for new messages
    chatService.onNewMessage(handleIncomingMessage);

    // Clean on logout/unmount
    return () => {
      chatService.offNewMessage(handleIncomingMessage);
      chatService.disconnectSocket();
    };
  }, [isAuthenticated, user?._id]);

  useEffect(() => {
    if (!window.socket || !user || !user._id) return;
    const handleMessagesRead = ({ conversationId }) => {
      setMessages((prev) => {
        const msgs = prev[conversationId] || [];
        return {
          ...prev,
          [conversationId]: msgs.map((msg) =>
            String(msg.sender?._id) === String(user._id)
              ? { ...msg, read: true }
              : msg,
          ),
        };
      });
      pendingReadConversations.current.add(conversationId);
      setTimeout(() => {
        pendingReadConversations.current.delete(conversationId);
      }, 3000);
    };
    window.socket.on("messages_read", handleMessagesRead);
    return () => {
      window.socket.off("messages_read", handleMessagesRead);
    };
  }, [user?._id]);

  //  Fetchall conversations
  const fetchConversations = useCallback(async () => {
    setConversationsLoading(true);
    try {
      const data = await chatService.getConversations();
      setConversations(data.data || data);
      // Set unread counts from backend
      const unreadObj = {};
      (data.data || data).forEach((conv) => {
        unreadObj[conv._id] = conv.unreadCount || 0;
      });
      setUnread(unreadObj);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setConversationsLoading(false);
    }
  }, []);

  // Fetch conversations on mount or when user changes this we used in messages page, but here to get badge for the unread count on first mount.
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchConversations();
    }
  }, [isAuthenticated, user, fetchConversations]);

  //  Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId) => {
    setMessagesLoading(true);
    try {
      const data = await chatService.getMessages(conversationId);
      setMessages((prev) => ({
        ...prev,
        [conversationId]: data.data || data,
      }));
    } catch (error) {
      console.error(
        `Error fetching messages for conversation ${conversationId}:`,
        error,
      );
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  // Start(if not exist) or get a conversation
  const startConversation = async (recipientId) => {
    setLoading(true);
    try {
      const data = await chatService.startConversation(recipientId);
      // Add to conversations if not present
      setConversations((prev) => {
        const exists = prev.find((c) => c._id === data.data._id);
        return exists ? prev : [data.data, ...prev];
      });
      return data.data;
    } catch (error) {
      console.error("Error starting conversation:", error);
    } finally {
      setLoading(false);
    }
  };

  //  Send a message (with socket preferred) ---
  const sendMessage = async (conversationId, message) => {
    try {
      if (window.socket && window.socket.connected) {
        chatService.sendSocketMessage({ conversationId, ...message });
      } else {
        // using fallback to REST API if socket is not connected it works only for send
        await chatService.sendMessage(conversationId, message);
        fetchMessages(conversationId);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  //  Handle incoming message (real-time)
  function handleIncomingMessage(msg) {
    const convId = msg.conversationId;
    const isRecipient = msg.sender?._id !== user?._id;
    const isActive = activeConversationIdRef.current === convId;

    // if the conversation is not in state(new), fetch conversations
    setConversations((prev) => {
      const exists = prev.some((c) => c._id === convId);
      if (!exists) {
        //  Fetch  conversations
        fetchConversations();
      }
      return prev;
    });

    // If this is a message sent, and the conversation is pending read, mark as read
    if (
      msg.sender?._id === user?._id &&
      pendingReadConversations.current.has(convId)
    ) {
      msg = { ...msg, read: true };
    }

    setMessages((prev) => {
      const prevMsgs = prev[convId] || [];
      if (prevMsgs.some((m) => m._id === msg._id)) return prev;
      const newMsg = isActive && isRecipient ? { ...msg, read: true } : msg;
      return {
        ...prev,
        [convId]: [...prevMsgs, newMsg],
      };
    });

    // After updating state, emit conversation_read
    if (
      activeConversationIdRef.current === msg.conversationId &&
      window.socket &&
      user?._id &&
      msg.sender?._id !== user?._id // only if recipient
    ) {
      setTimeout(() => {
        window.socket.emit("conversation_read", {
          conversationId: msg.conversationId,
          userId: user._id,
        });
      }, 500);
    }
    // Only increment unread if:
    // The message is NOT from the current user
    // The conversation is NOT currently active
    setUnread((prev) => {
      // user._id is the current user's id
      if (
        activeConversationIdRef.current === msg.conversationId ||
        msg.sender?._id === user?._id
      ) {
        return prev;
      }

      return {
        ...prev,
        [msg.conversationId]: (prev[msg.conversationId] || 0) + 1,
      };
    });

    // Update lastMessage in conversations
    setConversations((prev) => {
      // Update the lastMessage for the relevant conversation
      const updated = prev.map((conv) =>
        conv._id === msg.conversationId ? { ...conv, lastMessage: msg } : conv,
      );
      // Sort by lastMessage.createdAt (or updatedAt as fallback)- to show most recent first
      return updated.sort((a, b) => {
        const aTime = a.lastMessage?.createdAt || a.updatedAt || 0;
        const bTime = b.lastMessage?.createdAt || b.updatedAt || 0;
        return new Date(bTime) - new Date(aTime);
      });
    });
  }

  //  Delete a conversation
  const deleteConversation = async (conversationId) => {
    setLoading(true);
    try {
      await chatService.deleteConversation(conversationId);
      setConversations((prev) => prev.filter((c) => c._id !== conversationId));
      setMessages((prev) => {
        const copy = { ...prev };
        delete copy[conversationId];
        return copy;
      });
      setUnread((prev) => {
        const copy = { ...prev };
        delete copy[conversationId];
        return copy;
      });
      if (activeConversationId === conversationId)
        setActiveConversationId(null);
    } catch (error) {
      console.error("Error deleting conversation:", error);
    } finally {
      setLoading(false);
    }
  };

  //  Set active conversation and mark as read
  const openConversation = useCallback(
    (conversationId) => {
      setActiveConversationId(conversationId);
      setUnread((prev) => {
        return { ...prev, [conversationId]: 0 };
      });
      fetchMessages(conversationId);
      // Emit read event via socket
      if (window.socket && user?._id) {
        window.socket.emit("conversation_read", {
          conversationId,
          userId: user._id,
        });
      }
    },
    [fetchMessages, user?._id],
  );

  //  Context values
  const value = {
    conversations,
    messages,
    unread,
    loading,
    conversationsLoading,
    messagesLoading,
    activeConversationId,
    fetchConversations,
    fetchMessages,
    startConversation,
    sendMessage,
    deleteConversation,
    openConversation,
    setActiveConversationId,
    user,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

ChatProvider.propTypes = {
  children: PropTypes.node,
};
