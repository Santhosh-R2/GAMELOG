import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import Shuffle from '../common/Shuffle';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../api';

const Register = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: '',
    password: '',
    confirmPassword: '',
  });

  const [profilePic, setProfilePic] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useGSAP(() => {
    gsap.from('.register-console-card', {
      scale: 0.98,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from('.register-anim-element', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      delay: 0.3,
      ease: 'power2.out'
    });
  }, { scope: containerRef });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (e) => {
    const validatedValue = e.target.value.replace(/[^a-zA-Z ]/g, '');
    setFormData({ ...formData, name: validatedValue });
  };

  const handlePhoneChange = (e) => {
    const validatedValue = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData({ ...formData, phone: validatedValue });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('ONLY GMAIL.COM IS ALLOWED.');
      setLoading(false);
      return;
    }

    if (!profilePic) {
      toast.error('SECURITY ERROR: PROFILE PICTURE IS MANDATORY.');
      setLoading(false);
      return;
    }

    if (formData.phone.length !== 10) {
      toast.error('COMM-LINK ERROR: PHONE NUMBER MUST BE 10 DIGITS.');
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('SECURITY ERROR: PASSWORDS DO NOT MATCH.');
      setLoading(false);
      return;
    }

    try {
      const payload = { ...formData, profilePic };
      delete payload.confirmPassword;
      await api.post('/register', payload);
      toast.success("SYSTEM: ACCOUNT CREATED SUCCESSFULLY. PLEASE LOGIN.");
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'REGISTRATION FAILED. SYSTEM_ERROR.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="register-viewport" ref={containerRef}>
      <div className="register-console-card">
        <header className="register-header register-anim-element">
          <div className="register-sys-tag">IDENTITY_INITIALIZATION_v2.0</div>
          <h1 className="register-main-title">
            <Shuffle text="JOIN THE NETWORK" shuffleTimes={4} duration={1} colorTo="#00f3ff" />
          </h1>
        </header>
        <div className="register-avatar-row register-anim-element">
          <div className="register-upload-wrapper">
            <label htmlFor="registerAvatar" className="register-upload-label">
              <div
                className="register-avatar-preview"
                style={{ backgroundImage: profilePic ? `url(${profilePic})` : 'none' }}
              >
                {!profilePic && (
                  <div className="register-upload-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                    </svg>
                    <span>UPLOAD</span>
                  </div>
                )}
              </div>
              <div className="register-avatar-ring"></div>
            </label>
            <input type="file" id="registerAvatar" accept="image/*" onChange={handleImageUpload} className="register-hidden-file" />
          </div>
        </div>


        <form className="register-data-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="register-2col-grid">

            <div className="register-input-cell register-anim-element">
              <label className="register-field-label">PLAYER ALIAS</label>
              <div className="register-field-wrapper">
                <input type="text" name="name" value={formData.name} onChange={handleNameChange} className="register-text-input" placeholder="Enter Username" autoComplete="off" spellCheck="false" required />
                <div className="register-input-border"></div>
              </div>
            </div>

            <div className="register-input-cell register-anim-element">
              <label className="register-field-label">COMM-LINK (PHONE)</label>
              <div className="register-field-wrapper">
                <input type="text" name="phone" value={formData.phone} onChange={handlePhoneChange} className="register-text-input" placeholder="Enter Phone Number" autoComplete="off" spellCheck="false" required />
                <div className="register-input-border"></div>
              </div>
            </div>

            <div className="register-input-cell register-anim-element">
              <label className="register-field-label">NETWORK ID (EMAIL)</label>
              <div className="register-field-wrapper">
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="register-text-input" placeholder="player@gamerlog.com" autoComplete="off" spellCheck="false" required />
                <div className="register-input-border"></div>
              </div>
            </div>

            <div className="register-input-cell register-anim-element">
              <label className="register-field-label">FACTION (GENRE)</label>
              <div className="register-field-wrapper">
                <select name="category" value={formData.category} onChange={handleChange} className="register-text-input register-dropdown" required>
                  <option value="" disabled>Select Genre...</option>
                  <option value="Action">Action / Adventure</option>
                  <option value="RPG">RPG</option>
                  <option value="FPS">FPS / Shooter</option>
                  <option value="Sim">Simulator</option>
                </select>
                <div className="register-input-border"></div>
              </div>
            </div>

            <div className="register-input-cell register-anim-element">
              <label className="register-field-label">ENCRYPTION KEY</label>
              <div className="register-field-wrapper">
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} className="register-text-input register-pad-right" placeholder="Password" autoComplete="new-password" spellCheck="false" required />
                <div className="register-input-border"></div>
                <button type="button" className="register-toggle-eye" onClick={() => setShowPassword(!showPassword)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {showPassword ? (
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    ) : (
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
                    )}
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="register-input-cell register-anim-element">
              <label className="register-field-label">CONFIRM KEY</label>
              <div className="register-field-wrapper">
                <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="register-text-input register-pad-right" placeholder="Confirm Password" autoComplete="new-password" spellCheck="false" required />
                <div className="register-input-border"></div>
                <button type="button" className="register-toggle-eye" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {showConfirmPassword ? (
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    ) : (
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
                    )}
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>

          </div>

          <div className="register-action-zone register-anim-element">
            <button type="submit" className="register-action-btn" disabled={loading}>
              {loading ? 'INITIALIZING...' : 'INITIALIZE ACCOUNT'}
            </button>
            <p className="register-login-prompt">
              ALREADY REGISTERED? <a href="/login" className="register-login-link">LOGIN_SYSTEM</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
