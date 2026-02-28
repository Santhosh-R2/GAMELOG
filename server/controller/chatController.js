const Message = require('../schema/Message');
const User = require('../schema/User');
const mongoose = require('mongoose');

exports.getUsers = async (req, res) => {
    try {
        const currentUserId = req.user.id; // Provided by auth middleware
        // Fetch all users except the current logged-in user
        const users = await User.find({ _id: { $ne: currentUserId } }).select('-password -otp -otpExpiry').lean();

        // Get unread counts per user
        const unreadCounts = await Message.aggregate([
            { $match: { receiverId: new mongoose.Types.ObjectId(currentUserId), isRead: false } },
            { $group: { _id: "$senderId", count: { $sum: 1 } } }
        ]);

        const unreadMap = unreadCounts.reduce((acc, curr) => {
            acc[curr._id.toString()] = curr.count;
            return acc;
        }, {});

        const usersWithCounts = users.map(user => ({
            ...user,
            unreadCount: unreadMap[user._id.toString()] || 0
        }));

        res.status(200).json(usersWithCounts);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error while fetching users" });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { targetUserId } = req.params;
        const currentUserId = req.user.id;

        // Mark unread messages sent by targetUser to currentUser as read
        await Message.updateMany(
            { senderId: targetUserId, receiverId: currentUserId, isRead: false },
            { $set: { isRead: true } }
        );

        const messages = await Message.find({
            $or: [
                { senderId: currentUserId, receiverId: targetUserId },
                { senderId: targetUserId, receiverId: currentUserId }
            ]
        }).sort({ createdAt: 1 }); // Oldest first for chat history

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Server error while fetching messages" });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const senderId = req.user.id;

        if (!receiverId || !content) {
            return res.status(400).json({ message: "Receiver and content are required." });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            content
        });

        await newMessage.save();

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Server error while sending message" });
    }
};

exports.getTotalUnread = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const totalUnread = await Message.countDocuments({
            receiverId: currentUserId,
            isRead: false
        });
        res.status(200).json({ totalUnread });
    } catch (error) {
        console.error("Error fetching total unread:", error);
        res.status(500).json({ message: "Server error while fetching unread counts" });
    }
};

exports.deleteChat = async (req, res) => {
    try {
        const { targetUserId } = req.params;
        const currentUserId = req.user.id;

        await Message.deleteMany({
            $or: [
                { senderId: currentUserId, receiverId: targetUserId },
                { senderId: targetUserId, receiverId: currentUserId }
            ]
        });

        res.status(200).json({ message: "Chat deleted successfully" });
    } catch (error) {
        console.error("Error deleting chat:", error);
        res.status(500).json({ message: "Server error while deleting chat" });
    }
};
