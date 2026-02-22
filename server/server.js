require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const router = require('./router');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());

// Vercel has a payload limit (approx 4.5MB). 
// 50mb will work locally but fail on Vercel for large images.
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Base route to check if API is working
app.get('/', (req, res) => {
    res.send("API is running...");
});

// Routes
app.use('/api', router);

const PORT = process.env.PORT || 5001;

// Only listen if not running on Vercel (for local development)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export the app for Vercel
module.exports = app;