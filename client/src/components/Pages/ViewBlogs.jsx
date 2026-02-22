import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import api from '../../api'; // Update path if needed
import toast from 'react-hot-toast';
import './ViewBlogs.css';

const ViewBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');


    useEffect(() => {
        fetchBlogs();
    }, []);

    // useGSAP(() => {
    //     if (!loading && blogs.length > 0) {
    //         // Header animation
    //         gsap.from('.onyx-vb-header', {
    //             y: -30,
    //             opacity: 0,
    //             duration: 0.8,
    //             ease: 'power3.out'
    //         });

    //         // Staggered Cards Reveal
    //         gsap.from('.onyx-vb-card-wrapper', {
    //             y: 50,
    //             opacity: 0,
    //             duration: 0.6,
    //             stagger: 0.1,
    //             ease: 'back.out(1.2)'
    //         });
    //     }
    // }, [loading, blogs]);

    const fetchBlogs = async () => {
        try {
            // Mock delay for scanning effect
            await new Promise(r => setTimeout(r, 800));
            const res = await api.get('/blogs');
            setBlogs(res.data);
        } catch (err) {
            toast.error("CRITICAL_ERROR: UNABLE TO CONTACT GLOBAL ARCHIVE.");
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (id) => {
        try {
            const res = await api.post(`/blog/${id}/like`);
            setBlogs(blogs.map(blog =>
                blog._id === id
                    ? { ...blog, likes: res.data.isLiked ? [...blog.likes, currentUser.id] : blog.likes.filter(l => l !== currentUser.id) }
                    : blog
            ));
        } catch (err) {
            toast.error(err.response?.data?.message || "SYSTEM_FAILURE: LIKE_PROTOCOL_ERROR.");
        }
    };

    if (loading) {
        return (
            <div className="onyx-vb-loader-container">
                <div className="onyx-vb-scanner"></div>
                <div className="onyx-vb-loader-text">SCANNING_DATA_STREAMS...</div>
            </div>
        );
    }

    return (
        <div className="onyx-vb-container" ref={containerRef}>

            {/* HEADER */}
            <div className="onyx-vb-header">
                <div>
                    <h1 className="onyx-vb-title">GLOBAL_ARCHIVE</h1>
                    <p className="onyx-vb-subtitle">
                        ACCESSING_LOGS // <span className="text-cyan">{blogs.length} RECORDS FOUND</span>
                    </p>
                </div>
                <div className="onyx-vb-status-badge">
                    <span className="onyx-vb-dot"></span> LIVE FEED
                </div>
            </div>

            {/* EMPTY STATE */}
            {blogs.length === 0 && (
                <div className="onyx-vb-empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <h2>NO DATA FOUND IN ARCHIVE</h2>
                    <p>Be the first to transmit a log to the network.</p>
                </div>
            )}

            {/* BLOG GRID */}
            <div className="onyx-vb-grid">
                {blogs.map((blog) => {
                    const isLiked = blog.likes?.includes(currentUser.id);

                    return (
                        <div className="onyx-vb-card-wrapper" key={blog._id}>
                            <div className="onyx-vb-animated-border"></div> {/* ROTATING BORDER */}

                            <div className="onyx-vb-card">

                                {/* Image & Category Overlay */}
                                <div className="onyx-vb-card-image">
                                    <img src={blog.gameImage || 'https://via.placeholder.com/600x400/111/00f3ff?text=NO+IMAGE'} alt={blog.title} />
                                    <div className="onyx-vb-category-badge">{blog.gameCategory}</div>
                                    <div className="onyx-vb-image-overlay"></div>
                                </div>

                                {/* Card Content */}
                                <div className="onyx-vb-card-content">

                                    {/* Author Strip */}
                                    <div className="onyx-vb-author-strip">
                                        <img
                                            src={blog.author?.profilePic || "https://images.unsplash.com/photo-1566411520896-01e7ca4726af?q=80&w=150&auto=format&fit=crop"}
                                            alt="Author"
                                            className="onyx-vb-author-avatar"
                                        />
                                        <div className="onyx-vb-author-info">
                                            <span className="onyx-vb-author-label">AUTHOR</span>
                                            <span className="onyx-vb-author-name">{blog.author?.name || "REDACTED"}</span>
                                        </div>
                                    </div>

                                    {/* Text Data */}
                                    {blog.rating > 0 && (
                                        <div className="onyx-vb-rating-stars">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <svg
                                                    key={star}
                                                    viewBox="0 0 24 24"
                                                    fill={blog.rating >= star ? "var(--vb-cyan)" : "none"}
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    className="onyx-vb-star-icon"
                                                >
                                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                                </svg>
                                            ))}
                                        </div>
                                    )}
                                    <h2 className="onyx-vb-blog-title">{blog.title}</h2>

                                    {/* Footer & Actions */}
                                    <div className="onyx-vb-card-footer">

                                        <button
                                            className={`onyx-vb-like-btn ${isLiked ? 'liked' : ''}`}
                                            onClick={() => handleLike(blog._id)}
                                        >
                                            <svg viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                            </svg>
                                            <span>{blog.likes?.length || 0}</span>
                                        </button>

                                        <div className="onyx-vb-action-links">
                                            {blog.gameLink && (
                                                <a href={blog.gameLink} target="_blank" rel="noopener noreferrer" className="onyx-vb-external-btn">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                                        <polyline points="15 3 21 3 21 9"></polyline>
                                                        <line x1="10" y1="14" x2="21" y2="3"></line>
                                                    </svg>
                                                    <span>SOURCE</span>
                                                </a>
                                            )}
                                            <NavLink to={`/blog/${blog._id}`} className="onyx-vb-read-btn">
                                                VIEW_INTEL
                                            </NavLink>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ViewBlogs;