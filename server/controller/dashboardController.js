const User = require('../schema/User');
const Blog = require('../schema/Blog');
const mongoose = require('mongoose');

const getDashboardStats = async (req, res) => {
    try {
        // 1. Total counts
        const totalUsers = await User.countDocuments({});
        const totalBlogs = await Blog.countDocuments({});

        // 2. Users by category
        const usersByCategory = await User.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $project: { name: "$_id", value: "$count", _id: 0 } }
        ]);

        // 3. Blogs by game category
        const blogsByCategory = await Blog.aggregate([
            { $group: { _id: "$gameCategory", count: { $sum: 1 } } },
            { $project: { name: "$_id", count: "$count", _id: 0 } },
            { $sort: { count: -1 } },
            { $limit: 10 } // Top 10 categories
        ]);

        // 4. Blogs posted over the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const blogsByDate = await Blog.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            { $project: { date: "$_id", count: "$count", _id: 0 } }
        ]);
        
        // 5. Most liked blogs
        const topBlogs = await Blog.aggregate([
            { $project: { title: 1, likesCount: { $size: { $ifNull: ["$likes", []] } } } },
            { $sort: { likesCount: -1 } },
            { $limit: 5 }
        ]);


        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalUsers,
                    totalBlogs
                },
                usersByCategory,
                blogsByCategory,
                blogsByDate,
                topBlogs
            }
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics"
        });
    }
};

module.exports = {
    getDashboardStats
};
