const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const authMiddleware = require('../authMiddleware');

// GET only posts for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a post linked to the logged-in user
router.post('/', authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }
  
  const newPost = new Post({ 
    title, 
    description, 
    user: req.user.id 
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a specific post by ID (only if owned by user)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, user: req.user.id });
    if (!post) {
      return res.status(404).json({ message: 'Post not found or not owned by user' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a post (only if owned by user)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;
    const post = await Post.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found or not owned by user' });
    }

    post.title = title || post.title;
    post.description = description || post.description;
    
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a post (only if owned by user)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, user: req.user.id });
    if (!post) {
      return res.status(404).json({ message: 'Post not found or not owned by user' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;