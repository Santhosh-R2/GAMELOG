import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import api from '../../api';
import toast from 'react-hot-toast';
import './AddBlog.css';

const AddBlog = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [hoveredRating, setHoveredRating] = useState(0);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        gameImage: '',
        gameCategory: 'Action',
        gameLink: '',
        rating: 0
    });

    const [previewImg, setPreviewImg] = useState('');

    useGSAP(() => {
        gsap.from('.onyx-ab-card', {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });

        gsap.from('.onyx-ab-anim', {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            delay: 0.2,
            ease: 'power2.out'
        });
    }, { scope: containerRef });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                return toast.error('CRITICAL: ONLY IMAGE FILES ARE ALLOWED.');
            }
            if (file.size > 5 * 1024 * 1024) {
                return toast.error('CRITICAL: IMAGE SIZE MUST BE UNDER 5MB.');
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
            return toast.error("SYSTEM_ERROR: GAME_IMAGE IS REQUIRED FOR TRANSMISSION.");
        }

        setLoading(true);
        try {
            await api.post('/blog', formData);
            toast.success('ADDED SUCCESSFULLY');
            setTimeout(() => {
                navigate('/view-blogs');
            }, 1500);
        } catch (err) {
            toast.error(err.response?.data?.message || 'TRANSMISSION FAILED: NETWORK_ERROR.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="onyx-ab-container" ref={containerRef}>


            <div className="onyx-ab-card">
                <div className="onyx-ab-header onyx-ab-anim">
                    <div>
                        <div className="onyx-ab-sys-tag">ENCRYPTION LEVEL: MAXIMUM</div>
                        <h1 className="onyx-ab-title">TRANSMIT_NEW_LOG</h1>
                    </div>
                    <div className="onyx-ab-status">
                        <span className="onyx-ab-dot"></span> UPLINK READY
                    </div>
                </div>

                <form className="onyx-ab-form" onSubmit={handleSubmit} autoComplete="off">
                    <div className="onyx-ab-upload-zone onyx-ab-anim">
                        <div className={`onyx-ab-drop-area ${previewImg ? 'has-image' : ''}`}>
                            {previewImg ? (
                                <img src={previewImg} alt="Preview" className="onyx-ab-preview-img" />
                            ) : (
                                <div className="onyx-ab-placeholder">
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
                                className="onyx-ab-file-input"
                                id="blog-image"
                            />
                            <label htmlFor="blog-image" className="onyx-ab-upload-overlay">
                                {previewImg ? 'CHANGE_IMAGE_SOURCE' : 'SELECT_SOURCE'}
                            </label>
                        </div>
                    </div>

                    <div className="onyx-ab-fields">

                        <div className="onyx-ab-input-group onyx-ab-anim">
                            <label>OPERATIONAL_TITLE</label>
                            <div className="onyx-ab-input-wrapper">
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter Mission or Review Name..."
                                    autoComplete="off"
                                    spellCheck="false"
                                    required
                                />
                                <span className="onyx-ab-highlight"></span>
                            </div>
                        </div>

                        <div className="onyx-ab-input-group onyx-ab-anim">
                            <label>INTEL_DESCRIPTION</label>
                            <div className="onyx-ab-input-wrapper">
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Input detailed reconnaissance data, strategy guides, or review logs..."
                                    autoComplete="off"
                                    spellCheck="false"
                                    required
                                    rows="6"
                                ></textarea>
                                <span className="onyx-ab-highlight"></span>
                            </div>
                        </div>
                        <div className="onyx-ab-grid-row">

                            <div className="onyx-ab-input-group onyx-ab-anim">
                                <label>GAME_SECTOR (CATEGORY)</label>
                                <div className="onyx-ab-input-wrapper">
                                    <select name="gameCategory" value={formData.gameCategory} onChange={handleChange}>
                                        <option value="Action">ACTION / ADVENTURE</option>
                                        <option value="RPG">ROLE PLAYING (RPG)</option>
                                        <option value="Strategy">STRATEGY / MOBA</option>
                                        <option value="Simulation">SIMULATION</option>
                                        <option value="FPS">FIRST PERSON SHOOTER</option>
                                    </select>
                                    <span className="onyx-ab-highlight"></span>
                                    <svg className="onyx-ab-select-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </div>
                            </div>

                            <div className="onyx-ab-input-group onyx-ab-anim">
                                <label>EXTERNAL_ACCESS (LINK)</label>
                                <div className="onyx-ab-input-wrapper">
                                    <input
                                        type="url"
                                        name="gameLink"
                                        value={formData.gameLink}
                                        onChange={handleChange}
                                        placeholder="https://store-link.com"
                                    />
                                    <span className="onyx-ab-highlight"></span>
                                </div>
                            </div>
                        </div>

                        <div className="onyx-ab-rating-group onyx-ab-anim">
                            <label>MISSION_EVALUATION (RATING)</label>
                            <div className="onyx-ab-stars-container">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={`onyx-ab-star ${formData.rating >= star ? 'filled' : ''}`}
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
                            <span className="onyx-ab-rating-text">
                                {formData.rating > 0 ? `${formData.rating}/5 STARS` : 'SELECT RATING'}
                            </span>
                        </div>
                    </div>

                    <div className="onyx-ab-actions onyx-ab-anim">
                        <button type="button" className="onyx-ab-btn-abort" onClick={() => navigate('/dashboard')}>
                            ABORT_MISSION
                        </button>
                        <button type="submit" className="onyx-ab-btn-transmit" disabled={loading}>
                            {loading ? 'TRANSMITTING DATA...' : 'INITIATE_TRANSMISSION'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddBlog;