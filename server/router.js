const express = require('express');
const router = express.Router();
const userController = require('./controller/userController');
const blogController = require('./controller/blogController');
const chatController = require('./controller/chatController');
const dashboardController = require('./controller/dashboardController');
const auth = require('./middleware/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/verify-otp', userController.verifyOTP);
router.post('/reset-password', userController.resetPassword);

router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.post('/blog', auth, blogController.createBlog);
router.get('/blogs', blogController.getAllBlogs);
router.get('/blog/:id', blogController.getSingleBlog);
router.put('/blog/:id', auth, blogController.updateBlog);
router.delete('/blog/:id', auth, blogController.deleteBlog);
router.post('/blog/:id/like', auth, blogController.likeBlog);

router.get('/users', auth, chatController.getUsers);
router.get('/messages/unread', auth, chatController.getTotalUnread);
router.get('/messages/:targetUserId', auth, chatController.getMessages);
router.post('/messages', auth, chatController.sendMessage);
router.delete('/messages/:targetUserId', auth, chatController.deleteChat);

router.get('/dashboard-stats', auth, dashboardController.getDashboardStats);

module.exports = router;
