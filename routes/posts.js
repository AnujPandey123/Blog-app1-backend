const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getPosts, createPost, getPostById, updatePost, deletePost } = require('../controllers/postController');
const auth = require('../middleware/auth');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// @route   GET /posts
// @desc    Get all posts
// @access  Public
router.get('/', getPosts);

// @route   POST /posts
// @desc    Create a post
// @access  Private
router.post('/', auth, upload.single('image'), createPost);

// @route   GET /posts/:id
// @desc    Get post by ID
// @access  Public
router.get('/:id', getPostById);

// @route   PUT /posts/:id
// @desc    Update a post
// @access  Private
router.put('/:id', auth, upload.single('image'), updatePost);

// @route   DELETE /posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, deletePost);

module.exports = router;
