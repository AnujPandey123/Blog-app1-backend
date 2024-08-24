const Post = require('../models/Post');

exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const newComment = {
      user: req.user.id,
      text: req.body.text,
      name: req.user.name,
    };

    post.comments.unshift(newComment);

    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('comments.user', ['name']);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
