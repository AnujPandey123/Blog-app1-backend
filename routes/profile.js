// routes/profile.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth'); // Ensure you have authentication middleware

// @route   GET /api/profile
// @desc    Get user profile and posts
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Get user ID from authentication middleware
        const userId = req.user.id;

        // Fetch user data
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Fetch user posts
        const posts = await Post.find({ author: userId });

        // Respond with user data and posts
        res.json({
            profile: {
                name: user.name,
                email: user.email
            },
            posts
        });
    } catch (error) {
        console.error('Error fetching profile data:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
