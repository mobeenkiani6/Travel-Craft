const User = require('./models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Check if user is logged in via session
    if (!req.session.userId) {
      return res.status(401).json({ 
        message: "No token provided"
      });
    }

    // Find user by session userId
    const user = await User.findById(req.session.userId).select('-password');
    
    if (!user) {
      // Clear invalid session
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destruction error:', err);
        }
      });
      return res.status(401).json({ 
        message: "Invalid token"
      });
    }

    // Attach user to request (similar to how JWT decoded data was attached)
    req.user = {
      id: user._id,
      email: user.email,
      name: user.name
    };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      message: "Invalid token"
    });
  }
};

module.exports = authMiddleware;