const express = require('express');
const router = express.Router();
const { addComment, getComments } = require('../controllers/commentController');
const auth = require('../middleware/auth');

// @route   POST /posts/:id/comments
// @desc    Add a comment to a post
// @access  Private
router.post('/:id/comments', auth, addComment);

// @route   GET /posts/:id/comments
// @desc    Get all comments for a post
// @access  Public
router.get('/:id/comments', getComments);

module.exports = router;
