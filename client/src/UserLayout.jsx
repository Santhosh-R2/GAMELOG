import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import api from './api';
import './UserLayout.css';

const UserLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [totalUnread, setTotalUnread] = useState(0);
    const navigate = useNavigate();

    // Use State for Reactive User Data
    const [userData, setUserData] = React.useState(() => {
        const stored = JSON.parse(localStorage.getItem('user') || '{}');
        return {
            name: stored.name || "Unknown Player",
            role: stored.category || "No Faction",
            avatar: stored.profilePic || "https://images.unsplash.com/photo-1566411520896-01e7ca4726af?q=80&w=150&auto=format&fit=crop"
        };
    });

    // Listen for Profile Updates
    React.useEffect(() => {
        const handleUpdate = (e) => {
            const updated = e.detail;
            setUserData({
                name: updated.name,
                role: updated.category,
                avatar: updated.profilePic
            });
        };

        window.addEventListener('profileUpdated', handleUpdate);
        return () => window.removeEventListener('profileUpdated', handleUpdate);
    }, []);

    // Polling for global unread messages
    useEffect(() => {
        const fetchUnread = async () => {
            try {
                if (localStorage.getItem('token')) {
                    const { data } = await api.get('/messages/unread');
                    setTotalUnread(data.totalUnread || 0);
                }
            } catch (error) {
                console.error("Failed to fetch unread total", error);
            }
        };

        fetchUnread();
        const interval = setInterval(fetchUnread, 5000);
        return () => clearInterval(interval);
    }, []);

    const user = userData;

    const menuItems = [
        {
            name: 'DASHBOARD',
            path: '/dashboard',
            icon: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        },
        {
            name: 'TRANSMIT LOG',
            path: '/add-blog',
            icon: <path d="M12 5v14M5 12h14" />
        },
        {
            name: 'GLOBAL ARCHIVE',
            path: '/view-blogs',
            icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        },
        {
            name: 'MY ARCHIVES',
            path: '/my-blogs',
            icon: <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        },
        {
            name: 'COMMUNICATIONS',
            path: '/chat',
            icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        }
    ];

    const handleLogoutConfirm = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLogoutModalOpen(false);
        console.log("System Disconnected.");
        navigate('/login');
    };

    return (
        <div className="layout-container">

            {/* --- SIDEBAR --- */}
            <aside className={`layout-sidebar ${isSidebarOpen ? 'open' : ''}`}>

                {/* Sidebar Header / Logo */}
                <div className="sidebar-header">
                    <svg className="sidebar-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="6" width="20" height="12" rx="4" />
                        <path d="M6 12h4" /><path d="M8 10v4" /><circle cx="15" cy="13" r="1" /><circle cx="18" cy="11" r="1" />
                    </svg>
                    <span className="sidebar-logo-text">GAMER<span className="text-cyan">LOG</span></span>
                </div>

                {/* Navigation Menu */}
                <nav className="sidebar-nav">
                    <div className="nav-label">SYSTEM_MENU</div>
                    <ul className="nav-list">
                        {menuItems.map((item, index) => (
                            <li key={index} className="nav-item">
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                                    onClick={() => setIsSidebarOpen(false)}
                                    style={{ position: 'relative' }}
                                >
                                    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        {item.icon}
                                    </svg>
                                    {item.name}
                                    {item.name === 'COMMUNICATIONS' && totalUnread > 0 && (
                                        <span style={{
                                            position: 'absolute',
                                            right: '0px',
                                            backgroundColor: '#ff003c',
                                            color: '#fff',
                                            fontSize: '0.7rem',
                                            fontWeight: 'bold',
                                            padding: '2px 6px',
                                            borderRadius: '10px',
                                            boxShadow: '0 0 10px #ff003c'
                                        }}>
                                            {totalUnread}
                                        </span>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Logout Button */}
                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={() => setIsLogoutModalOpen(true)}>
                        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        DISCONNECT
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
            )}

            {/* --- MAIN CONTENT AREA --- */}
            <main className="layout-main">

                {/* Top Navbar */}
                <header className="layout-navbar">

                    <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>

                    <div className="navbar-breadcrumb">
                        <span className="pulsing-status"></span>
                        NETWORK ONLINE
                    </div>

                    {/* User Profile Section - Click to go to Profile Page */}
                    <div className="navbar-user-profile" onClick={() => navigate('/profile')}>
                        <div className="user-info">
                            <span className="user-name">{user.name}</span>
                            <span className="user-role">{user.role}</span>
                        </div>
                        <div className="user-avatar-wrapper">
                            <img src={user.avatar} alt="User Avatar" className="user-avatar" />
                            <div className="avatar-ring"></div>
                        </div>
                    </div>
                </header>

                {/* Dynamic Page Content */}
                <div className="layout-content-scroll">
                    <div className="layout-page-container">
                        {children}
                    </div>
                </div>

            </main>

            {/* --- LOGOUT CONFIRMATION MODAL --- */}
            {isLogoutModalOpen && (
                <div className="modal-backdrop" onClick={() => setIsLogoutModalOpen(false)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-glitch-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                                <line x1="12" y1="2" x2="12" y2="12"></line>
                            </svg>
                        </div>
                        <h2 className="modal-title">TERMINATE_SESSION?</h2>
                        <p className="modal-desc">Are you sure you want to disconnect from the network? All active data transmissions will be halted.</p>
                        <div className="modal-actions">
                            <button className="btn-abort" onClick={() => setIsLogoutModalOpen(false)}>ABORT</button>
                            <button className="btn-confirm" onClick={handleLogoutConfirm}>CONFIRM_EXIT</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserLayout;