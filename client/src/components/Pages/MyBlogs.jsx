import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import './MyBlogs.css';

const MyBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    // Modal State
    const [deleteModal, setDeleteModal] = useState({ show: false, blogId: null });

    // Custom Cyber Toast
    const cyberToast = (message, type = 'success') => {
        toast[type](message, {
            style: {
                borderRadius: '4px',
                background: '#0a0a0c',
                border: `1px solid ${type === 'success' ? '#00f3ff' : '#ff3333'}`,
                color: type === 'success' ? '#00f3ff' : '#ff3333',
                fontFamily: '"Orbitron", sans-serif',
                letterSpacing: '1px',
                boxShadow: `0 0 15px ${type === 'success' ? 'rgba(0, 243, 255, 0.2)' : 'rgba(255, 51, 51, 0.2)'}`
            },
        });
    };

    // useGSAP(() => {
    //     if (!loading) {
    //         // Header animation
    //         gsap.from('.onyx-mb-header', {
    //             y: -30,
    //             opacity: 0,
    //             duration: 0.8,
    //             ease: 'power3.out'
    //         });

    //         // Empty state animation
    //         if (blogs.length === 0) {
    //             gsap.from('.onyx-mb-empty', {
    //                 scale: 0.9,
    //                 opacity: 0,
    //                 duration: 0.8,
    //                 delay: 0.2,
    //                 ease: 'back.out(1.5)'
    //             });
    //         }

    //         // Staggered Cards Reveal
    //         if (blogs.length > 0) {
    //             gsap.from('.onyx-mb-card', {
    //                 y: 50,
    //                 opacity: 0,
    //                 duration: 0.6,
    //                 stagger: 0.1,
    //                 ease: 'back.out(1.2)'
    //             });
    //         }
    //     }
    // }, [loading, blogs]);

    useEffect(() => {
        fetchMyBlogs();
    }, []);

    const fetchMyBlogs = async () => {
        try {
            // Optional: Mock delay for scanning effect
            await new Promise(r => setTimeout(r, 800));
            const res = await api.get('/blogs');
            const currentUserId = currentUser.id || currentUser._id;
            const myLogs = res.data.filter(blog => (blog.author?._id || blog.author) === currentUserId);
            setBlogs(myLogs);
        } catch (err) {
            cyberToast("SYSTEM_FAILURE: UNABLE TO RETRIEVE PERSONAL ARCHIVES.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteModal({ show: true, blogId: id });
    };

    const confirmDelete = async () => {
        const id = deleteModal.blogId;
        setDeleteModal({ show: false, blogId: null });

        try {
            await api.delete(`/blog/${id}`);
            // Animate card removal visually before deleting from state
            gsap.to(`#card-${id}`, {
                scale: 0.8,
                opacity: 0,
                duration: 0.4,
                onComplete: () => {
                    setBlogs(blogs.filter(blog => blog._id !== id));
                    cyberToast("DELETED SUCCESSFULLY", "success");
                }
            });
        } catch (err) {
            cyberToast(err.response?.data?.message || "DELETION_FAILED: AUTH_REQUIRED.", "error");
        }
    };

    // --- Loading State ---
    if (loading) {
        return (
            <div className="onyx-mb-loader-container">
                <div className="onyx-mb-scanner"></div>
                <div className="onyx-mb-loader-text">DECRYPTING_PRIVATE_DATA...</div>
            </div>
        );
    }

    return (
        <div className="onyx-mb-container" ref={containerRef}>
            <Toaster position="top-center" reverseOrder={false} />

            <div className="onyx-mb-header">
                <div>
                    <h1 className="onyx-mb-title">MY_ARCHIVES</h1>
                    <p className="onyx-mb-subtitle">TOTAL_LOGS_TRANSMITTED: <span className="text-cyan">{blogs.length}</span></p>
                </div>
                <div className="onyx-mb-status-badge">
                    <span className="onyx-mb-dot"></span> SECURE SECTOR
                </div>
            </div>

            {blogs.length === 0 ? (
                <div className="onyx-mb-empty">
                    <div className="onyx-mb-empty-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="9" y1="3" x2="9" y2="21"></line>
                        </svg>
                    </div>
                    <h2>NO PERSONAL LOGS FOUND IN THE SECURE SECTOR.</h2>
                    <p>Your archive is currently empty. Start documenting your journey.</p>
                    <button className="onyx-mb-btn-primary" onClick={() => navigate('/add-blog')}>
                        INITIATE_FIRST_LOG
                    </button>
                </div>
            ) : (
                <div className="onyx-mb-grid">
                    {blogs.map((blog) => (
                        <div className="onyx-mb-card" key={blog._id} id={`card-${blog._id}`}>

                            <div className="onyx-mb-card-image">
                                <img src={blog.gameImage || 'https://via.placeholder.com/600x400/111/00f3ff?text=NO+IMAGE'} alt={blog.title} />
                                <div className="onyx-mb-category-badge">{blog.gameCategory}</div>
                                <div className="onyx-mb-image-overlay"></div>
                            </div>

                            <div className="onyx-mb-card-content">
                                {blog.rating > 0 && (
                                    <div className="onyx-mb-rating-stars">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg
                                                key={star}
                                                viewBox="0 0 24 24"
                                                fill={blog.rating >= star ? "var(--mb-cyan)" : "none"}
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                className="onyx-mb-star-icon"
                                            >
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                            </svg>
                                        ))}
                                    </div>
                                )}
                                <h2 className="onyx-mb-blog-title">{blog.title}</h2>

                                <div className="onyx-mb-card-footer">

                                    <div className="onyx-mb-stats-group">
                                        <div className="onyx-mb-stat-item">
                                            <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                            </svg>
                                            <span>{blog.likes?.length || 0} LIKES</span>
                                        </div>
                                    </div>

                                    <div className="onyx-mb-action-buttons">

                                        {/* Edit Button */}
                                        <button
                                            className="onyx-mb-icon-btn edit"
                                            onClick={() => navigate(`/edit-blog/${blog._id}`)}
                                            title="Modify Log"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path>
                                            </svg>
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            className="onyx-mb-icon-btn delete"
                                            onClick={() => handleDeleteClick(blog._id)}
                                            title="Purge Log"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            </svg>
                                        </button>

                                        {/* Read Button */}
                                        <button
                                            className="onyx-mb-btn-view"
                                            onClick={() => navigate(`/blog/${blog._id}`)}
                                        >
                                            VIEW_INTEL
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* DELETE MODAL */}
            {deleteModal.show && (
                <div className="onyx-mb-modal-overlay">
                    <div className="onyx-mb-modal">
                        <div className="onyx-mb-modal-glow"></div>
                        <div className="onyx-mb-modal-content">
                            <div className="onyx-mb-modal-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                    <line x1="12" y1="9" x2="12" y2="13"></line>
                                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                </svg>
                            </div>
                            <div className="onyx-mb-modal-header">
                                <h3>CRITICAL_PROTOCOL: DELETE_LOG</h3>
                                <div className="onyx-mb-modal-subtitle">LOG_ID: {deleteModal.blogId}</div>
                            </div>
                            <p className="onyx-mb-modal-text">WARNING: ARE YOU CERTAIN YOU WISH TO PURGE THIS LOG? THIS ACTION WILL PERMANENTLY ERASE ALL ENCRYPTED DATA FROM THE ARCHIVE.</p>
                            <div className="onyx-mb-modal-actions">
                                <button className="onyx-mb-modal-btn cancel" onClick={() => setDeleteModal({ show: false, blogId: null })}>
                                    ABORT_SEQUENCE
                                </button>
                                <button className="onyx-mb-modal-btn confirm" onClick={confirmDelete}>
                                    EXECUTE_PURGE
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBlogs;