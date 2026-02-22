const express = require('express');
const router = express.Router();
const userController = require('./controller/userController');
const blogController = require('./controller/blogController');
const auth = require('./middleware/auth');

// Auth Routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/verify-otp', userController.verifyOTP);
router.post('/reset-password', userController.resetPassword);

// Profile Routes
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);

// Blog Routes
router.post('/blog', auth, blogController.createBlog);
router.get('/blogs', blogController.getAllBlogs);
router.get('/blog/:id', blogController.getSingleBlog);
router.put('/blog/:id', auth, blogController.updateBlog);
router.delete('/blog/:id', auth, blogController.deleteBlog);
router.post('/blog/:id/like', auth, blogController.likeBlog);

module.exports = router;
