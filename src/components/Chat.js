import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { chatAPI } from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import { useSocket } from '../context/SocketContext';
import './Chat.css';

const Chat = () => {
  const { conversationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useWishlist();
  const { socket, isConnected } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState('');

  const currentUserId = (user?._id || user?.id || '').toString();
  const preloadedConversation = location.state?.conversation;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoadingConversations(true);
        const result = await chatAPI.getConversations();
        if (result.success && Array.isArray(result.conversations)) {
          setConversations(result.conversations);
        } else {
          setError(result.error || 'Unable to load conversations.');
        }
      } catch (err) {
        console.error('Conversations error:', err);
        setError('Unable to load conversations right now.');
      } finally {
        setLoadingConversations(false);
      }
    };

    if (isLoggedIn) {
      fetchConversations();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (preloadedConversation) {
      setConversations((prev) => {
        const exists = prev.some((conv) => conv._id === preloadedConversation._id);
        if (exists) {
          return prev;
        }
        return [preloadedConversation, ...prev];
      });
      setActiveConversationId(preloadedConversation._id);
    }
  }, [preloadedConversation]);

  useEffect(() => {
    if (conversationId) {
      setActiveConversationId(conversationId);
    } else if (!conversationId && conversations.length > 0 && !activeConversationId) {
      setActiveConversationId(conversations[0]._id);
    }
  }, [conversationId, conversations, activeConversationId]);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation._id === activeConversationId) || null,
    [conversations, activeConversationId]
  );

  useEffect(() => {
    const loadMessages = async () => {
      if (!activeConversationId) {
        setMessages([]);
        return;
      }
      try {
        setLoadingMessages(true);
        const result = await chatAPI.getMessages(activeConversationId);
        if (result.success) {
          setMessages(result.messages || []);
        }
      } catch (err) {
        console.error('Messages error:', err);
        setError('Unable to load messages right now.');
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [activeConversationId]);

  useEffect(() => {
    if (!socket || !activeConversationId) {
      return;
    }

    socket.emit('conversation:join', activeConversationId);

    return () => {
      socket.emit('conversation:leave', activeConversationId);
    };
  }, [socket, activeConversationId]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleNewMessage = ({ conversationId: incomingId, message }) => {
      setConversations((prev) => {
        const updated = prev.map((conversation) =>
          conversation._id === incomingId
            ? {
                ...conversation,
                lastMessage: {
                  content: message.content,
                  sender: message.sender?._id || message.sender,
                  createdAt: message.createdAt
                },
                updatedAt: message.createdAt
              }
            : conversation
        );
        return updated.sort(
          (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
        );
      });

      if (incomingId === activeConversationId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    const handleConversationUpdate = ({ conversationId: incomingId, lastMessage, updatedAt }) => {
      setConversations((prev) => {
        const updated = prev.map((conversation) =>
          conversation._id === incomingId
            ? {
                ...conversation,
                lastMessage,
                updatedAt: updatedAt || conversation.updatedAt
              }
            : conversation
        );
        return updated.sort(
          (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
        );
      });
    };

    socket.on('message:new', handleNewMessage);
    socket.on('conversation:update', handleConversationUpdate);

    return () => {
      socket.off('message:new', handleNewMessage);
      socket.off('conversation:update', handleConversationUpdate);
    };
  }, [socket, activeConversationId]);

  const getConversationPartner = (conversation) => {
    if (!conversation) return null;
    return (
      conversation.participants.find((participant) => {
        const participantId = (
          participant._id ||
          participant.id ||
          participant
        )?.toString();
        return participantId !== currentUserId;
      }) || conversation.participants[0]
    );
  };

  const handleSelectConversation = (conversation) => {
    setActiveConversationId(conversation._id);
    navigate(`/chat/${conversation._id}`, { replace: false });
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeConversationId) {
      return;
    }

    setSendingMessage(true);
    const payload = { conversationId: activeConversationId, content: messageInput.trim() };

    const resetInput = () => {
      setMessageInput('');
      setSendingMessage(false);
    };

    if (socket && isConnected) {
      socket.emit('message:send', payload);
      resetInput();
      return;
    }

    try {
      const result = await chatAPI.sendMessage(activeConversationId, messageInput.trim());
      if (result.success && result.message) {
        setMessages((prev) => [...prev, result.message]);
      }
    } catch (err) {
      console.error('Send message error:', err);
      setError('Unable to send message right now.');
    } finally {
      resetInput();
    }
  };

  const renderMessages = () => {
    if (loadingMessages) {
      return <div className="chat-placeholder">Loading messages...</div>;
    }

    if (messages.length === 0) {
      return <div className="chat-placeholder">Start the conversation by saying hello 👋</div>;
    }

    return messages.map((message) => {
      const senderId = (
        message.sender?._id ||
        message.sender?.id ||
        message.sender ||
        ''
      ).toString();
      const isMine = senderId === currentUserId;
      return (
        <div
          key={message._id}
          className={`chat-message ${isMine ? 'chat-message-own' : 'chat-message-other'}`}
        >
          <div className="chat-message-meta">
            {!isMine && <span className="chat-message-name">{message.sender?.name || 'Artist'}</span>}
            <span className="chat-message-time">
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <div className="chat-message-content">{message.content}</div>
        </div>
      );
    });
  };

  if (!isLoggedIn) {
    return null;
  }

  const partner = getConversationPartner(activeConversation);

  return (
    <div className="chat-page">
      <div className="chat-layout">
        <aside className="chat-sidebar">
          <div className="chat-sidebar-header">
            <h2>Chats</h2>
            <div className={`chat-status ${isConnected ? 'online' : 'offline'}`}>
              <span className="chat-status-dot" />
              {isConnected ? 'Online' : 'Offline'}
            </div>
          </div>
          {loadingConversations ? (
            <div className="chat-placeholder">Loading conversations...</div>
          ) : conversations.length === 0 ? (
            <div className="chat-placeholder">
              No chats yet. Start a conversation from a craft you love!
            </div>
          ) : (
            <ul className="chat-conversation-list">
              {conversations.map((conversation) => {
                const other = getConversationPartner(conversation);
                const isActive = conversation._id === activeConversationId;
                return (
                  <li
                    key={conversation._id}
                    className={`chat-conversation-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleSelectConversation(conversation)}
                  >
                    <div className="chat-conversation-avatar">
                      {other?.photoURL ? (
                        <img src={other.photoURL} alt={other.name} />
                      ) : (
                        <span>{other?.name?.[0]?.toUpperCase() || 'A'}</span>
                      )}
                    </div>
                    <div className="chat-conversation-info">
                      <div className="chat-conversation-title">
                        <span>{other?.name || 'Artist'}</span>
                        {conversation.lastMessage?.createdAt && (
                          <span className="chat-conversation-time">
                            {new Date(conversation.lastMessage.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                      </div>
                      <p className="chat-conversation-preview">
                        {conversation.lastMessage?.content || 'Tap to start chatting'}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

        <section className="chat-main">
          {activeConversation ? (
            <>
              <header className="chat-main-header">
                <div>
                  <h3>{partner?.name || 'Artist'}</h3>
                  {activeConversation.post?.title && (
                    <p className="chat-main-subtitle">{activeConversation.post.title}</p>
                  )}
                </div>
                {!isConnected && (
                  <span className="chat-connection-warning">
                    Reconnecting to live chat... messages will send when connected.
                  </span>
                )}
              </header>
              <div className="chat-messages">{renderMessages()}</div>
              <div className="chat-input-bar">
                <textarea
                  placeholder="Write a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  rows={2}
                />
                <button
                  className="chat-send-btn"
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || sendingMessage}
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="chat-placeholder">
              Select a conversation to get started with your favorite artist.
            </div>
          )}
        </section>
      </div>
      {error && <div className="chat-error-banner">{error}</div>}
    </div>
  );
};

export default Chat;


