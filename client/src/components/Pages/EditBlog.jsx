import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import api from '../../api'; // Update path if needed
import toast, { Toaster } from 'react-hot-toast';
import './EditBlog.css';

const EditBlog = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const containerRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        gameImage: '',
        gameCategory: '',
        gameLink: '',
        rating: 0
    });

    const [previewImg, setPreviewImg] = useState('');

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

    useEffect(() => {
        fetchBlog();
    }, [id]);

    useGSAP(() => {
        if (!fetching) {
            // Smooth entry animation for the main card once data is loaded
            gsap.from('.onyx-eb-card', {
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });

            // Staggered reveal for form elements
            gsap.from('.onyx-eb-anim', {
                y: 20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                delay: 0.2,
                ease: 'power2.out'
            });
        }
    }, [fetching]);

    const fetchBlog = async () => {
        try {
            // Optional: Mock delay for the cool scanning effect
            await new Promise(r => setTimeout(r, 800));
            const res = await api.get(`/blog/${id}`);
            const blog = res.data;
            setFormData({
                title: blog.title,
                description: blog.description,
                gameImage: blog.gameImage,
                gameCategory: blog.gameCategory,
                gameLink: blog.gameLink || '',
                rating: blog.rating || 0
            });
            setPreviewImg(blog.gameImage);
        } catch (err) {
            cyberToast("SYSTEM_ERROR: UNABLE TO LOAD LOG.", 'error');
            navigate('/my-blogs');
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Professional Validation
            if (!file.type.startsWith('image/')) {
                return cyberToast('CRITICAL: ONLY IMAGE FILES ARE ALLOWED.', 'error');
            }
            if (file.size > 5 * 1024 * 1024) {
                return cyberToast('CRITICAL: IMAGE SIZE MUST BE UNDER 5MB.', 'error');
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, gameImage: reader.result });
                setPreviewImg(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.gameImage) {
            return cyberToast("SYSTEM_ERROR: GAME_IMAGE IS REQUIRED.", 'error');
        }

        setLoading(true);
        try {
            await api.put(`/blog/${id}`, formData);
            cyberToast('SYSTEM: LOG UPDATED SUCCESSFULLY.', 'success');
            setTimeout(() => {
                navigate(`/blog/${id}`);
            }, 1500);
        } catch (err) {
            cyberToast(err.response?.data?.message || 'UPDATE FAILED: SECURITY_OVERRIDE_REQUIRED.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // --- Loading State (Terminal Scanner) ---
    if (fetching) {
        return (
            <div className="onyx-eb-loader-container">
                <div className="onyx-eb-scanner"></div>
                <div className="onyx-eb-loader-text">RECOVERING_LOG_DATA...</div>
            </div>
        );
    }

    return (
        <div className="onyx-eb-container" ref={containerRef}>
            <Toaster position="top-center" reverseOrder={false} />

            <div className="onyx-eb-card">

                {/* Header */}
                <div className="onyx-eb-header onyx-eb-anim">
                    <div>
                        <div className="onyx-eb-sys-tag">EDIT MODE: ACTIVE</div>
                        <h1 className="onyx-eb-title">MODIFY_LOG_ENTRY</h1>
                    </div>
                    <div className="onyx-eb-status">
                        <span className="onyx-eb-dot"></span> LOG_SERIAL: {id.substring(0, 8)}
                    </div>
                </div>

                <form className="onyx-eb-form" onSubmit={handleSubmit}>

                    {/* Image Upload Zone */}
                    <div className="onyx-eb-upload-zone onyx-eb-anim">
                        <div className={`onyx-eb-drop-area ${previewImg ? 'has-image' : ''}`}>
                            {previewImg ? (
                                <img src={previewImg} alt="Preview" className="onyx-eb-preview-img" />
                            ) : (
                                <div className="onyx-eb-placeholder">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                    <span>UPLOAD_SATELLITE_IMAGE (JPEG/PNG)</span>
                                </div>
                            )}
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept="image/jpeg, image/png, image/webp"
                                className="onyx-eb-file-input"
                                id="edit-blog-image"
                            />
                            <label htmlFor="edit-blog-image" className="onyx-eb-upload-overlay">
                                {previewImg ? 'UPDATE_IMAGE_SOURCE' : 'SELECT_SOURCE'}
                            </label>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="onyx-eb-fields">

                        <div className="onyx-eb-input-group onyx-eb-anim">
                            <label>OPERATIONAL_TITLE</label>
                            <div className="onyx-eb-input-wrapper">
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                                <span className="onyx-eb-highlight"></span>
                            </div>
                        </div>

                        <div className="onyx-eb-input-group onyx-eb-anim">
                            <label>INTEL_DESCRIPTION</label>
                            <div className="onyx-eb-input-wrapper">
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows="6"
                                ></textarea>
                                <span className="onyx-eb-highlight"></span>
                            </div>
                        </div>

                        <div className="onyx-eb-grid-row">

                            <div className="onyx-eb-input-group onyx-eb-anim">
                                <label>GAME_SECTOR (CATEGORY)</label>
                                <div className="onyx-eb-input-wrapper">
                                    <select name="gameCategory" value={formData.gameCategory} onChange={handleChange} required>
                                        <option value="" disabled>Select Category...</option>
                                        <option value="Action">ACTION / ADVENTURE</option>
                                        <option value="RPG">ROLE PLAYING (RPG)</option>
                                        <option value="Strategy">STRATEGY / MOBA</option>
                                        <option value="Simulation">SIMULATION</option>
                                        <option value="FPS">FIRST PERSON SHOOTER</option>
                                    </select>
                                    <span className="onyx-eb-highlight"></span>
                                    <svg className="onyx-eb-select-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </div>
                            </div>

                            <div className="onyx-eb-input-group onyx-eb-anim">
                                <label>EXTERNAL_ACCESS (LINK)</label>
                                <div className="onyx-eb-input-wrapper">
                                    <input
                                        type="url"
                                        name="gameLink"
                                        value={formData.gameLink}
                                        onChange={handleChange}
                                        placeholder="https://store-link.com"
                                    />
                                    <span className="onyx-eb-highlight"></span>
                                </div>
                            </div>

                        </div>

                        {/* GAME RATING (5 STARS) */}
                        <div className="onyx-eb-rating-group onyx-eb-anim">
                            <label>MISSION_EVALUATION (RATING)</label>
                            <div className="onyx-eb-stars-container">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={`onyx-eb-star ${formData.rating >= star ? 'filled' : ''}`}
                                        onClick={() => setFormData({ ...formData, rating: star })}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                    >
                                        <svg viewBox="0 0 24 24" fill={(hoveredRating || formData.rating) >= star ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                        </svg>
                                    </button>
                                ))}
                            </div>
                            <span className="onyx-eb-rating-text">
                                {formData.rating > 0 ? `${formData.rating}/5 STARS` : 'SELECT RATING'}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="onyx-eb-actions onyx-eb-anim">
                        <button type="button" className="onyx-eb-btn-abort" onClick={() => navigate('/my-blogs')}>
                            CANCEL_EDITS
                        </button>
                        <button type="submit" className="onyx-eb-btn-transmit" disabled={loading}>
                            {loading ? 'SYNCHRONIZING...' : 'COMMIT_CHANGES'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EditBlog;