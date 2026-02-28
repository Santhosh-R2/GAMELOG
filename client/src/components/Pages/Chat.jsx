import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import api from '../../api';
import './Chat.css';

const Chat = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const messagesEndRef = useRef(null);

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUserId = currentUser.id || currentUser._id;

    // --- FETCH USERS ---
    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // --- FETCH MESSAGES ---
    const fetchMessages = async (userId) => {
        if (!userId) return;
        try {
            const response = await api.get(`/messages/${userId}`);
            setMessages(prev => {
                if (response.data.length !== prev.length) {
                    return response.data;
                }
                return prev;
            });
        } catch (error) {
            console.error("Failed to fetch messages", error);
        } finally {
            setIsLoadingMessages(false);
        }
    };

    // --- POLLING ---
    useEffect(() => {
        let chatInterval;
        let usersInterval;

        if (selectedUser) {
            setIsLoadingMessages(true);
            fetchMessages(selectedUser._id);
            fetchUsers();

            chatInterval = setInterval(() => {
                fetchMessages(selectedUser._id);
            }, 3000);
        }

        usersInterval = setInterval(() => {
            fetchUsers();
        }, 5000);

        return () => {
            if (chatInterval) clearInterval(chatInterval);
            if (usersInterval) clearInterval(usersInterval);
        };
    }, [selectedUser]);

    // --- SCROLL TO BOTTOM ---
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // --- SEND MESSAGE ---
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        try {
            const response = await api.post('/messages', {
                receiverId: selectedUser._id,
                content: newMessage
            });

            setMessages(prev => [...prev, response.data]);
            setNewMessage('');
        } catch (error) {
            toast.error("TRANSMISSION FAILED");
        }
    };

    // --- DELETE CHAT ---
    const confirmDeleteChat = async () => {
        if (!selectedUser) return;

        try {
            await api.delete(`/messages/${selectedUser._id}`);
            setMessages([]);
            setIsDeleteModalOpen(false);
            toast.success("CHAT LOGS PURGED");
        } catch (error) {
            console.error("Failed to delete chat", error);
            toast.error("PURGE FAILED");
        }
    };

    return (
        <div className="user-chat-container">

            {/* --- LEFT SIDEBAR --- */}
            <aside className="user-chat-sidebar">
                <div className="user-chat-sidebar-header">
                    <h2 className="user-chat-sidebar-title">COMMUNICATIONS</h2>
                </div>

                <div className="user-chat-users-list">
                    {isLoadingUsers ? (
                        <div className="user-chat-state-msg">Scanning network...</div>
                    ) : users.length === 0 ? (
                        <div className="user-chat-state-msg">No active signals found.</div>
                    ) : (
                        users.map(user => (
                            <div
                                key={user._id}
                                className={`user-chat-user-item ${selectedUser?._id === user._id ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedUser(user);
                                    setUsers(prev => prev.map(u => u._id === user._id ? { ...u, unreadCount: 0 } : u));
                                }}
                            >
                                <div className="user-chat-avatar-wrapper">
                                    <img
                                        src={user.profilePic || "https://images.unsplash.com/photo-1566411520896-01e7ca4726af?q=80&w=150"}
                                        alt={user.name}
                                        className="user-chat-avatar"
                                    />
                                    {user.unreadCount > 0 && selectedUser?._id !== user._id && (
                                        <div className="user-chat-unread-badge">
                                            {user.unreadCount}
                                        </div>
                                    )}
                                </div>
                                <div className="user-chat-user-info">
                                    <div className="user-chat-user-name">{user.name}</div>
                                    <div className="user-chat-user-role">{user.category || 'Operator'}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </aside>

            {/* --- RIGHT CHAT AREA --- */}
            <main className="user-chat-main">
                {selectedUser ? (
                    <>
                        {/* Header */}
                        <header className="user-chat-header">
                            <div className="user-chat-header-left">
                                <img
                                    src={selectedUser.profilePic || "https://images.unsplash.com/photo-1566411520896-01e7ca4726af?q=80&w=150"}
                                    alt={selectedUser.name}
                                    className="user-chat-header-avatar"
                                />
                                <div className="user-chat-header-info">
                                    <h2 className="user-chat-header-name">{selectedUser.name}</h2>
                                    <span className="user-chat-header-status">Secure Connection Established</span>
                                </div>
                            </div>
                            
                            <div className="user-chat-header-actions">
                                <button onClick={() => setIsDeleteModalOpen(true)} className="user-chat-delete-btn" title="Purge Chat History">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                    </svg>
                                    PURGE
                                </button>
                            </div>
                        </header>

                        {/* Messages Feed */}
                        <div className="user-chat-feed">
                            {isLoadingMessages && messages.length === 0 ? (
                                <div className="user-chat-state-msg">Decrypting transmissions...</div>
                            ) : messages.length === 0 ? (
                                <div className="user-chat-state-msg">No prior transmissions. Start sequence.</div>
                            ) : (
                                messages.map((msg, idx) => {
                                    const isMine = msg.senderId === currentUserId;
                                    return (
                                        <div key={msg._id || idx} className={`user-chat-msg-row ${isMine ? 'mine' : 'theirs'}`}>
                                            <div className="user-chat-msg-bubble">
                                                {msg.content}
                                            </div>
                                            <span className="user-chat-msg-time">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    )
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="user-chat-input-area">
                            <form onSubmit={handleSendMessage} className="user-chat-form">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Enter transmission..."
                                    className="user-chat-input"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="user-chat-send-btn"
                                >
                                    SEND
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    /* Empty State */
                    <div className="user-chat-empty-state">
                        <svg className="user-chat-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <h3 className="user-chat-empty-text">Select a target to initiate secure link</h3>
                    </div>
                )}
            </main>

            {/* --- DELETE CONFIRMATION MODAL --- */}
            {isDeleteModalOpen && (
                <div className="user-chat-modal-backdrop" onClick={() => setIsDeleteModalOpen(false)}>
                    <div className="user-chat-modal-card" onClick={(e) => e.stopPropagation()}>
                        
                        <div className="user-chat-modal-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </div>
                        
                        <h2 className="user-chat-modal-title">PURGE_RECORDS?</h2>
                        <p className="user-chat-modal-desc">
                            Are you sure you want to permanently delete all encrypted transmissions with
                            <strong className="user-chat-highlight">{selectedUser?.name}</strong>?
                            This action cannot be reversed.
                        </p>
                        
                        <div className="user-chat-modal-actions">
                            <button className="user-chat-btn-abort" onClick={() => setIsDeleteModalOpen(false)}>
                                ABORT
                            </button>
                            <button className="user-chat-btn-confirm" onClick={confirmDeleteChat}>
                                CONFIRM_PURGE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;