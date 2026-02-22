import React, { useState, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Shuffle from '../common/Shuffle';
import api from '../../api';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const containerRef = useRef(null);
    const navigate = useNavigate();

    useGSAP(() => {
        // Initial entrance of the HUD module
        gsap.from('.forgot-pass-card', {
            width: "0%",
            opacity: 0,
            duration: 1.2,
            ease: "expo.inOut"
        });

        gsap.from('.forgot-pass-anim', {
            y: 20,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            delay: 0.6
        });
    }, { scope: containerRef });

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/forgot-password', { email });
            setStep(2);
            toast.success('DECRYPTION CODE SENT TO YOUR NETWORK ID.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'SYSTEM ERROR. ID NOT FOUND.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/verify-otp', { email, otp });
            setStep(3);
            toast.success('IDENTITY VERIFIED.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'INVALID ENCRYPTION KEY.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('KEY MISMATCH. RE-ENTER CREDENTIALS.');
            return;
        }
        setLoading(true);
        try {
            await api.post('/reset-password', { email, otp, newPassword });
            toast.success('SECURITY KEY UPDATED. REDIRECTING...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'ENCRYPTION FAILED.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div ref={containerRef} className="forgot-pass-root">
            {/* FIXED GLOBAL VIDEO BACKGROUND */}
            <div className="forgot-pass-bg-viewport">
                <div className="forgot-pass-video-overlay" />
                <video autoPlay loop muted playsInline className="forgot-pass-bg-video">
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-set-of-different-futuristic-scenes-34442-large.mp4" type="video/mp4" />
                </video>
            </div>

            <main className="forgot-pass-wrapper">
                <div className="forgot-pass-card">

                    {/* LEFT: TACTICAL PROGRESS SIDEBAR */}
                    <aside className="forgot-pass-sidebar forgot-pass-anim">
                        <div className="forgot-pass-sidebar-header">
                            <div className="forgot-pass-pulse" />
                            <span>CORE_ACCESS_RECOVERY</span>
                        </div>

                        <div className="forgot-pass-steps">
                            {[1, 2, 3].map((num) => (
                                <div key={num} className={`forgot-pass-step-item ${step === num ? 'active' : ''} ${step > num ? 'complete' : ''}`}>
                                    <div className="forgot-pass-step-number">0{num}</div>
                                    <div className="forgot-pass-step-label">
                                        {num === 1 && "IDENTIFICATION"}
                                        {num === 2 && "VERIFICATION"}
                                        {num === 3 && "RE-ENCRYPTION"}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="forgot-pass-sidebar-footer">
                            <div className="forgot-pass-data-string">LOC: {window.location.hostname}</div>
                            <div className="forgot-pass-data-string">SEC_LEVEL: ALPHA</div>
                        </div>
                    </aside>

                    {/* RIGHT: OPERATIONAL TERMINAL FORM */}
                    <section className="forgot-pass-terminal forgot-pass-anim">
                        <div className="forgot-pass-terminal-header">
                            <h1 className="forgot-pass-terminal-title">
                                <Shuffle text={step === 1 ? "AUTHORIZE_USER" : step === 2 ? "INPUT_IDENTITY_KEY" : "RESET_ENCRYPTION"} />
                            </h1>
                            <p className="forgot-pass-terminal-subtitle">
                                {step === 1 && "Transmit your network ID to initiate the recovery protocol."}
                                {step === 2 && "A 6-digit access key has been dispatched to your terminal."}
                                {step === 3 && "Establish new high-level security credentials."}
                            </p>
                        </div>

                        {step === 1 && (
                            <form className="forgot-pass-form" onSubmit={handleSendOTP} autoComplete="off">
                                <div className="forgot-pass-input-group">
                                    <label>NETWORK_EMAIL</label>
                                    <input type="email" placeholder="player@gamerlog.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off" spellCheck="false" required />
                                    <div className="forgot-pass-glitch-border" />
                                </div>
                                <div className="forgot-pass-actions">
                                    <button type="submit" className="forgot-pass-btn" disabled={loading}>
                                        {loading ? "TRANSMITTING..." : "SEND_ACCESS_KEY"}
                                    </button>
                                    <Link to="/login" className="forgot-pass-link">TERMINATE_SESSION</Link>
                                </div>
                            </form>
                        )}

                        {step === 2 && (
                            <form className="forgot-pass-form" onSubmit={handleVerifyOTP} autoComplete="off">
                                <div className="forgot-pass-input-group">
                                    <label>ACCESS_KEY</label>
                                    <input type="text" maxLength="6" className="forgot-pass-otp-input" placeholder="000000" value={otp} onChange={(e) => setOtp(e.target.value)} autoComplete="one-time-code" spellCheck="false" required />
                                    <div className="forgot-pass-glitch-border" />
                                </div>
                                <div className="forgot-pass-actions">
                                    <button type="submit" className="forgot-pass-btn" disabled={loading}>
                                        {loading ? "VERIFYING..." : "AUTHORIZE_KEY"}
                                    </button>
                                    <Link to="/login" className="forgot-pass-link">TERMINATE_SESSION</Link>
                                </div>
                            </form>
                        )}

                        {step === 3 && (
                            <form className="forgot-pass-form" onSubmit={handleResetPassword} autoComplete="off">
                                <div className="forgot-pass-input-group">
                                    <label>NEW_PASSWORD</label>
                                    <div className="forgot-pass-input-wrapper">
                                        <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" spellCheck="false" required />
                                        <button type="button" className="forgot-pass-toggle-eye" onClick={() => setShowPassword(!showPassword)}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                {showPassword ? (
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                ) : (
                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
                                                )}
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        </button>
                                        <div className="forgot-pass-glitch-border" />
                                    </div>
                                </div>
                                <div className="forgot-pass-input-group" style={{ marginTop: '20px' }}>
                                    <label>CONFIRM_NEW_PASSWORD</label>
                                    <div className="forgot-pass-input-wrapper">
                                        <input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" spellCheck="false" required />
                                        <button type="button" className="forgot-pass-toggle-eye" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                {showConfirmPassword ? (
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                ) : (
                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
                                                )}
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        </button>
                                        <div className="forgot-pass-glitch-border" />
                                    </div>
                                </div>
                                <div className="forgot-pass-actions">
                                    <button type="submit" className="forgot-pass-btn" disabled={loading}>
                                        {loading ? "CONFIGURING..." : "RE-ENCRYPT_ID"}
                                    </button>
                                    <Link to="/login" className="forgot-pass-link">TERMINATE_SESSION</Link>
                                </div>
                            </form>
                        )}
                    </section>

                    {/* HUD DECORATIONS */}
                    <div className="forgot-pass-hud-bracket tl" />
                    <div className="forgot-pass-hud-bracket tr" />
                    <div className="forgot-pass-hud-bracket bl" />
                    <div className="forgot-pass-hud-bracket br" />
                </div>
            </main>
        </div>
    );
};

export default ForgotPassword;