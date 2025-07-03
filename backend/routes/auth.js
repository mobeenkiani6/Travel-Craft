const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const authMiddleware = require('../authMiddleware');

// SIGN UP
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ name, email, password });
    await user.save();

    // Create session instead of JWT token
    req.session.userId = user._id;
    req.session.userEmail = user.email;

    res.status(201).json({
      message: 'User Sign Up successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      // Remove token, add session indicator
      sessionId: req.session.id
    });
  } catch (err) {
    res.status(500).json({ message: 'Error Signing Up user', error: err.message });
  }
});

// SIGN IN
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ No user found with email:", email);
      return res.status(400).json({ message: 'Invalid credentials (email)' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(400).json({ message: 'Invalid credentials (password)' });
    }

    // Create session instead of JWT token
    req.session.userId = user._id;
    req.session.userEmail = user.email;

    res.status(200).json({
      message: 'Sign In successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      // Remove token, add session indicator
      sessionId: req.session.id
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// LOGOUT
router.post('/logout', authMiddleware, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Could not log out, please try again' });
    }
    
    res.clearCookie('sessionId'); // Clear the session cookie
    res.json({ 
      message: 'Logout successful'
    });
  });
});

// Check authentication status
router.get('/me', authMiddleware, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    }
  });
});

// Verify session route
router.get('/verify-session', (req, res) => {
  if (req.session.userId) {
    res.json({ 
      isAuthenticated: true,
      sessionId: req.session.id 
    });
  } else {
    res.json({ 
      isAuthenticated: false 
    });
  }
});

// backend/routes/auth.js

router.get('/heartbeat', (req, res) => {
  if (req.session.userId) {
    return res.status(200).json({ authenticated: true });
  } else {
    return res.status(401).json({ authenticated: false });
  }
});

module.exports = router;