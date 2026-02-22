import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import Shuffle from '../common/Shuffle'; // Your text animation component
import './Login.css';
import loginImg from '../../assets/login.jpg';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../api';

const Login = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for Eye Icon

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/login', formData);
      console.log(res.data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('LOGIN SUCCESSFUL');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AUTHENTICATION FAILED. CHECK CREDENTIALS.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" ref={containerRef}>

      {/* --- LEFT SIDE: IMAGE --- */}
      <div className="login-image-side">
        <img
          src={loginImg}
          alt="Gaming Setup"
          className="login-cover-img"
        />
        <div className="login-image-overlay"></div>

        {/* Decorative HUD Elements over Image */}
        <div className="login-hud-top">
          <span className="login-dot"></span> SECURE CONNECTION
        </div>
        <div className="login-hud-bottom">
          <h2 className="login-brand-title">GAMERLOG</h2>
          <p className="login-brand-subtitle">The Ultimate Gaming Archive</p>
        </div>
      </div>

      {/* --- RIGHT SIDE: FORM --- */}
      <div className="login-form-side">
        <div className="login-form-box">

          <div className="login-header login-anim-item">
            <h1 className="login-title">
              <Shuffle text="AUTHENTICATE" shuffleTimes={5} duration={1} colorTo="#00f3ff" />
            </h1>
            <p className="login-subtitle">Enter your credentials to access the network.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>

            {/* Email Input */}
            <div className="login-input-group login-anim-item">
              <label htmlFor="email" className="login-label">EMAIL ADDRESS // ID</label>
              <div className="login-input-wrapper">
                <input
                  type="email"
                  id="email"
                  className="login-input"
                  placeholder="player_one@network.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <span className="login-input-highlight"></span>
              </div>
            </div>

            {/* Password Input with Eye Icon */}
            <div className="login-input-group login-anim-item">
              <label htmlFor="password" className="login-label">PASSWORD // KEY</label>
              <div className="login-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="login-input login-pad-right"
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span className="login-input-highlight"></span>

                {/* Eye Icon Button */}
                <button
                  type="button"
                  className="login-toggle-eye"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {showPassword ? (
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /> // Open Eye
                    ) : (
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" /> // Closed Eye
                    )}
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Options (Remember me & Forgot Password) */}
            <div className="login-options login-anim-item">
              <label className="login-checkbox-label">
                <input type="checkbox" className="login-checkbox" />
                <span className="login-checkbox-custom"></span>
                REMEMBER RIG
              </label>
              <Link to="/forgot-password" name="forgotkey" className="login-forgot-link">FORGOT KEY?</Link>
            </div>

            <button type="submit" className="login-submit-btn login-anim-item" disabled={loading}>
              {loading ? 'INITIALIZING...' : 'INITIALIZE LOGIN'}
            </button>

          </form>

          {/* Footer (Sign Up) */}
          <div className="login-footer login-anim-item">
            <p className="login-footer-text">
              NEW TO THE NETWORK? <Link to="/register" className="login-signup-link">CREATE PROFILE</Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Login;