const User = require('../schema/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const register = async (req, res) => {
    try {
        const { name, phone, email, category, password, profilePic } = req.body;

        let user = await User.findOne({ $or: [{ email }, { phone }] });
        if (user) {
            return res.status(400).json({ message: "User already exists with this email or phone" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({
            name,
            phone,
            email,
            category,
            password: hashedPassword,
            profilePic // Base64 string
        });

        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, profilePic: user.profilePic, category: user.category, phone: user.phone } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // --- PROFESSIONAL HTML EMAIL TEMPLATE ---
        const emailTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #050505;
                    color: #ffffff;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 40px auto;
                    background-color: #0a0a0c;
                    border: 1px solid #1a1a1a;
                    border-top: 4px solid #00f3ff;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .header {
                    background-color: #111111;
                    padding: 30px 40px;
                    text-align: center;
                    border-bottom: 1px solid #1a1a1a;
                }
                .logo {
                    font-size: 28px;
                    font-weight: 900;
                    letter-spacing: 4px;
                    color: #ffffff;
                    margin: 0;
                }
                .logo-accent {
                    color: #00f3ff;
                }
                .content {
                    padding: 40px;
                }
                .title {
                    font-size: 20px;
                    font-weight: 600;
                    color: #ffffff;
                    margin-top: 0;
                    margin-bottom: 20px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .text {
                    font-size: 15px;
                    line-height: 1.6;
                    color: #a1a1aa;
                    margin-bottom: 30px;
                }
                .otp-box {
                    background-color: rgba(0, 243, 255, 0.05);
                    border: 1px dashed #00f3ff;
                    border-radius: 6px;
                    padding: 20px;
                    text-align: center;
                    margin-bottom: 30px;
                }
                .otp-code {
                    font-size: 36px;
                    font-weight: 700;
                    letter-spacing: 12px;
                    color: #00f3ff;
                    margin: 0;
                    font-family: monospace;
                }
                .warning {
                    font-size: 13px;
                    color: #ef4444;
                    margin-top: 0;
                }
                .footer {
                    background-color: #050505;
                    padding: 20px 40px;
                    text-align: center;
                    border-top: 1px solid #1a1a1a;
                }
                .footer-text {
                    font-size: 12px;
                    color: #666666;
                    margin: 5px 0;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1 class="logo">GAMER<span class="logo-accent">LOG</span></h1>
                </div>
                <div class="content">
                    <h2 class="title">Security Protocol: Access Recovery</h2>
                    <p class="text">
                        We received a request to reset the encryption key (password) associated with your GamerLog network ID. Please use the authorization code below to verify your identity.
                    </p>
                    
                    <div class="otp-box">
                        <p class="otp-code">${otp}</p>
                    </div>
                    
                    <p class="text">
                        <strong>Note:</strong> This authorization code will expire in exactly <strong>1 hour</strong>. For security reasons, do not share this code with anyone.
                    </p>
                    
                    <p class="warning">
                        If you did not initiate this request, please ignore this email. Your account remains secure and no changes have been made.
                    </p>
                </div>
                <div class="footer">
                    <p class="footer-text">This is an automated system message. Please do not reply.</p>
                    <p class="footer-text">&copy; 2026 GamerLog Network. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        const mailOptions = {
            from: `"GamerLog Security" <${process.env.EMAIL_USER}>`, // Professional sender name
            to: email,
            subject: 'GamerLog: Password Reset Authorization Code',
            html: emailTemplate, // Send the HTML template
            text: `Your GamerLog OTP for password reset is: ${otp}. It will expire in 1 hour.`, // Fallback for clients that block HTML
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "OTP sent to your email" });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        // Fixed the typo "jso n" to "json" from your code
        res.status(500).json({ message: "Internal server error while sending email." });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

        res.json({ message: "OTP verified successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

        user.password = await bcrypt.hash(newPassword, 10);
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, email, phone, category, profilePic } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check for uniqueness if email or phone is being changed
        if (email || phone) {
            const conflictQuery = {
                _id: { $ne: userId },
                $or: []
            };
            if (email) conflictQuery.$or.push({ email });
            if (phone) conflictQuery.$or.push({ phone });

            if (conflictQuery.$or.length > 0) {
                const existingConflict = await User.findOne(conflictQuery);
                if (existingConflict) {
                    const field = existingConflict.email === email ? "Email" : "Phone number";
                    return res.status(400).json({ message: `${field.toUpperCase()} ALREADY REGISTERED TO ANOTHER OPERATIVE.` });
                }
            }
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (category) user.category = category;
        if (profilePic) user.profilePic = profilePic;

        await user.save();
        res.json({
            message: "Profile updated successfully", user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                category: user.category,
                profilePic: user.profilePic
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    register,
    login,
    forgotPassword,
    verifyOTP,
    resetPassword,
    getProfile,
    updateProfile
};
