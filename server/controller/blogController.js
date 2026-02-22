const Blog = require('../schema/Blog');

const createBlog = async (req, res) => {
    try {
        const { title, description, gameImage, gameCategory, gameLink, rating } = req.body;
        const newBlog = new Blog({
            title,
            description,
            gameImage,
            gameCategory,
            gameLink,
            author: req.user.id,
            rating: rating || 0
        });
        await newBlog.save();
        res.status(201).json({ message: "SYSTEM: LOG TRANSMISSION SUCCESSFUL.", blog: newBlog });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('author', 'name profilePic category').sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSingleBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author', 'name profilePic category email');
        if (!blog) return res.status(404).json({ message: "LOG NOT FOUND IN ARCHIVE." });
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBlog = async (req, res) => {
    try {
        const { title, description, gameImage, gameCategory, gameLink, rating } = req.body;
        const blog = await Blog.findById(req.params.id);

        if (!blog) return res.status(404).json({ message: "LOG NOT FOUND." });

        // Authorization check
        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "UNAUTHORIZED: ACCESS DENIED TO ENCRYPTED LOG." });
        }

        if (title) blog.title = title;
        if (description) blog.description = description;
        if (gameImage) blog.gameImage = gameImage;
        if (gameCategory) blog.gameCategory = gameCategory;
        if (gameLink) blog.gameLink = gameLink;
        if (rating !== undefined) blog.rating = rating;

        await blog.save();
        res.json({ message: "SYSTEM: LOG UPDATED SUCCESSFULLY.", blog });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "LOG NOT FOUND." });

        // Authorization check
        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "UNAUTHORIZED: CANNOT DELETE FOREIGN ARCHIVE." });
        }

        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: "SYSTEM: LOG REMOVED FROM DATABASE." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const likeBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "LOG NOT FOUND." });

        const userId = req.user.id;
        const likeIndex = blog.likes.indexOf(userId);

        if (likeIndex === -1) {
            // Like
            blog.likes.push(userId);
            await blog.save();
            res.json({ message: "SYSTEM: ENDORSEMENT RECORDED.", likes: blog.likes.length, isLiked: true });
        } else {
            // Unlike
            blog.likes.splice(likeIndex, 1);
            await blog.save();
            res.json({ message: "SYSTEM: ENDORSEMENT WITHDRAWN.", likes: blog.likes.length, isLiked: false });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBlog,
    getAllBlogs,
    getSingleBlog,
    updateBlog,
    deleteBlog,
    likeBlog
};
