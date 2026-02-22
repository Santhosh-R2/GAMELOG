import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import api from '../../api';
import toast from 'react-hot-toast';
import './BlogDetails.css';

const BlogDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const containerRef = useRef(null);

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');


    useEffect(() => {
        fetchBlogDetails();
    }, [id]);


    const fetchBlogDetails = async () => {
        try {
            await new Promise(r => setTimeout(r, 800));
            const res = await api.get(`/blog/${id}`);
            setBlog(res.data);
        } catch (err) {
            toast.error("SYSTEM_FAILURE: LOG ACCESS DENIED OR FILE CORRUPTED.");
            navigate('/view-blogs');
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        try {
            const res = await api.post(`/blog/${id}/like`);
            setBlog({
                ...blog,
                likes: res.data.isLiked
                    ? [...blog.likes, currentUser.id]
                    : blog.likes.filter(l => l !== currentUser.id)
            });
        } catch (err) {
            toast.error(err.response?.data?.message || "LIKE_PROTOCOL_ERROR.");
        }
    };

    if (loading) {
        return (
            <div className="onyx-bd-loader-container">
                <div className="onyx-bd-scanner"></div>
                <div className="onyx-bd-loader-text">DECRYPTING_FULL_INTEL...</div>
            </div>
        );
    }

    if (!blog) return null;

    return (
        <div className="onyx-bd-container" ref={containerRef}>


            <button className="onyx-bd-back-btn" onClick={() => navigate(-1)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                EXIT_INTEL
            </button>

            <article className="onyx-bd-card">

                <div className="onyx-bd-hero onyx-bd-anim">
                    <img
                        src={blog.gameImage || "https://via.placeholder.com/1200x600/111/00f3ff?text=NO+IMAGE+DATA"}
                        alt={blog.title}
                        className="onyx-bd-main-img"
                    />
                    <div className="onyx-bd-hero-overlay">
                        <span className="onyx-bd-sector-badge">{blog.gameCategory}</span>
                        <h1 className="onyx-bd-title">{blog.title}</h1>
                    </div>
                </div>

                <div className="onyx-bd-meta onyx-bd-anim">

                    <div className="onyx-bd-author">
                        <div className="onyx-bd-avatar-wrapper">
                            <img
                                src={blog.author?.profilePic || "https://images.unsplash.com/photo-1566411520896-01e7ca4726af?q=80&w=150&auto=format&fit=crop"}
                                alt="Author"
                                className="onyx-bd-avatar"
                            />
                        </div>
                        <div className="onyx-bd-author-info">
                            <span className="onyx-bd-author-label">SIGNAL_FROM</span>
                            <span className="onyx-bd-author-name">{blog.author?.name || "REDACTED"}</span>
                        </div>
                    </div>

                    <div className="onyx-bd-actions-bar">

                        <button
                            className={`onyx-bd-like-btn ${blog.likes?.includes(currentUser.id) ? 'liked' : ''}`}
                            onClick={handleLike}
                        >
                            <svg viewBox="0 0 24 24" fill={blog.likes?.includes(currentUser.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            <span>{blog.likes?.length || 0} ENDORSEMENTS</span>
                        </button>

                        {currentUser.id === blog.author?._id && (
                            <button className="onyx-bd-edit-btn" onClick={() => navigate(`/edit-blog/${blog._id}`)}>
                                EDIT_ENTRY
                            </button>
                        )}

                        {blog.gameLink && (
                            <a href={blog.gameLink} target="_blank" rel="noopener noreferrer" className="onyx-bd-external-btn">
                                ACCESS_SOURCE_NET
                            </a>
                        )}
                    </div>
                </div>

                <div className="onyx-bd-content onyx-bd-anim">
                    <div className="onyx-bd-content-header">
                        <h3 className="onyx-bd-content-heading">MISSION_RECON_DATA</h3>
                        {blog.rating > 0 && (
                            <div className="onyx-bd-rating-box">
                                <span className="onyx-bd-rating-label">EVALUATION:</span>
                                <div className="onyx-bd-stars">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg
                                            key={star}
                                            viewBox="0 0 24 24"
                                            fill={blog.rating >= star ? "var(--bd-cyan)" : "none"}
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className="onyx-bd-star-icon"
                                        >
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                        </svg>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <p className="onyx-bd-desc-text">{blog.description}</p>
                </div>

                <div className="onyx-bd-footer onyx-bd-anim">
                    <span className="onyx-bd-timestamp">TRANSMITTED_ON: {new Date(blog.createdAt).toLocaleString()}</span>
                    <span className="onyx-bd-log-id">LOG_ID: {blog._id}</span>
                </div>

            </article>
        </div>
    );
};

export default BlogDetails;