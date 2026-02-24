const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    gameImage: {
        type: String, 
        required: true,
    },
    gameCategory: {
        type: String,
        required: true,
    },
    gameLink: {
        type: String,
        default: '',
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    rating: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
