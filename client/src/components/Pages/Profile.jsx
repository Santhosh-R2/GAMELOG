import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api'; // Update path if needed
import toast, { Toaster } from 'react-hot-toast';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
        category: '',
        profilePic: ''
    });

    const [previewImg, setPreviewImg] = useState('');

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (storedUser && Object.keys(storedUser).length > 0) {
            setUserData({
                name: storedUser.name || '',
                email: storedUser.email || '',
                phone: storedUser.phone || '',
                category: storedUser.category || '',
                profilePic: storedUser.profilePic || ''
            });
            setPreviewImg(storedUser.profilePic || '');
        }
    }, []);

    // --- CUSTOM CYBER TOAST NOTIFICATIONS ---
    const cyberToast = (message, type = 'success') => {
        toast[type](message, {
            style: {
                borderRadius: '4px',
                background: '#0a0a0a',
                border: `1px solid ${type === 'success' ? '#00f3ff' : '#ff3333'}`,
                color: type === 'success' ? '#00f3ff' : '#ff3333',
                fontFamily: '"Orbitron", sans-serif',
                letterSpacing: '1px',
                boxShadow: `0 0 15px ${type === 'success' ? 'rgba(0, 243, 255, 0.2)' : 'rgba(255, 51, 51, 0.2)'}`
            },
        });
    };

    // --- STRICT REAL-TIME VALIDATIONS ---
    const handleNameChange = (e) => {
        // Allow ONLY alphabets and spaces
        const validatedValue = e.target.value.replace(/[^a-zA-Z ]/g, '');
        setUserData({ ...userData, name: validatedValue });
    };

    const handlePhoneChange = (e) => {
        // Allow ONLY numbers, strictly limited to 10 characters
        const validatedValue = e.target.value.replace(/\D/g, '').slice(0, 10);
        setUserData({ ...userData, phone: validatedValue });
    };

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    // --- AVATAR UPLOAD & VALIDATION ---
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                cyberToast('CRITICAL: ONLY IMAGE FILES ARE ALLOWED.', 'error');
                return;
            }
            // Validate file size (Max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                cyberToast('CRITICAL: IMAGE SIZE MUST BE UNDER 5MB.', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setUserData({ ...userData, profilePic: reader.result });
                setPreviewImg(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // --- FORM SUBMIT ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final Pre-Submit Checks
        if (userData.phone.length !== 10) {
            cyberToast('COMM-LINK ERROR: PHONE MUST BE EXACTLY 10 DIGITS.', 'error');
            return;
        }

        setLoading(true);
        try {
            const res = await api.put('/profile', userData);
            // Sync local storage with actual server response
            localStorage.setItem('user', JSON.stringify(res.data.user));

            cyberToast('SYSTEM: PROFILE DATA ENCRYPTED AND UPDATED.', 'success');

            // Broadcast event for real-time UI synchronization
            window.dispatchEvent(new CustomEvent('profileUpdated', { detail: res.data.user }));

        } catch (err) {
            cyberToast(err.response?.data?.message || 'CRITICAL_ERROR: UPDATE FAILED.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-container">
            {/* Added Toaster for notifications */}
            <Toaster position="top-center" reverseOrder={false} />

            <div className="profile-glass-card">

                <div className="profile-header">
                    <h1 className="cyber-title">USER_PROFILE</h1>
                    <div className="status-badge">
                        <span className="blinking-dot"></span> STATUS: ONLINE / SECURE
                    </div>
                </div>

                <form className="profile-form" onSubmit={handleSubmit}>

                    {/* Avatar Section */}
                    <div className="avatar-upload-section">
                        <div className="avatar-preview-wrapper">
                            <img
                                src={previewImg || "https://images.unsplash.com/photo-1566411520896-01e7ca4726af?q=80&w=150&auto=format&fit=crop"}
                                alt="Avatar"
                                className="profile-avatar-big"
                            />
                            {/* Animated spinning ring */}
                            <div className="avatar-spinning-ring"></div>

                            <div className="avatar-overlay">
                                <label htmlFor="avatar-input" className="upload-label">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                        <circle cx="12" cy="13" r="4"></circle>
                                    </svg>
                                    <span>UPDATE_AVATAR</span>
                                </label>
                                <input id="avatar-input" type="file" hidden onChange={handleFileChange} accept="image/*" />
                            </div>
                        </div>
                    </div>

                    {/* Inputs Grid */}
                    <div className="form-grid">
                        <div className="input-group">
                            <label>ALIAS (A-Z ONLY)</label>
                            <div className="input-wrapper">
                                <input type="text" name="name" value={userData.name} onChange={handleNameChange} placeholder="Enter your display name" required />
                                <span className="input-highlight"></span>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>NETWORK_ID (EMAIL)</label>
                            <div className="input-wrapper">
                                <input type="email" name="email" value={userData.email} onChange={handleChange} required placeholder="email@example.com" />
                                <span className="input-highlight"></span>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>COMMS_ID (10 DIGITS)</label>
                            <div className="input-wrapper">
                                <input type="text" name="phone" value={userData.phone} onChange={handlePhoneChange} placeholder="0000000000" required />
                                <span className="input-highlight"></span>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>FACTION (CATEGORY)</label>
                            <div className="input-wrapper select-wrapper">
                                <select name="category" value={userData.category} onChange={handleChange} required>
                                    <option value="" disabled>Select your primary genre...</option>
                                    <option value="Action">ACTION / ADVENTURE</option>
                                    <option value="RPG">ROLE PLAYING (RPG)</option>
                                    <option value="Strategy">STRATEGY / MOBA</option>
                                    <option value="Simulation">SIMULATION</option>
                                    <option value="FPS">FIRST PERSON SHOOTER</option>
                                </select>
                                <span className="input-highlight"></span>
                                {/* Custom Dropdown Arrow */}
                                <svg className="custom-select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="profile-actions">
                        <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')}>
                            ABORT_CHANGES
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'TRANSMITTING...' : 'SAVE_EDITS'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;