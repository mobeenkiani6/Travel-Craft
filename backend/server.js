require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const postRoutes = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy (required when deploying behind reverse proxies like Vercel, Railway, etc.)
app.set('trust proxy', 1);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected successfully');
});
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔌 MongoDB connection closed due to app termination');
  process.exit(0);
});

// ----------------------
// ✅ CORS Configuration
// ----------------------
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true, // Important for cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// ------------------------
// ✅ Body Parsing Middleware
// ------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------------
// ✅ Session Configuration
// ------------------------
app.use(session({
  name: 'sessionId',
  secret: process.env.SESSION_SECRET || '4f!9@c72d$8e%1a&0b^3g*5h(6j)z10c',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
  secure: false, // force false for local testing
  httpOnly: true,
  maxAge: 30 * 60 * 1000,
  sameSite: 'lax' // allow cookies for localhost
},
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    touchAfter: 24 * 3600 // 1 day
  })
}));

// ------------------------
// ✅ Routes
// ------------------------
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/posts', postRoutes);

// ------------------------
// ✅ Session Cleanup
// ------------------------
app.post('/api/auth/cleanup-session', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Could not log out' });
    res.clearCookie('sessionId');
    res.json({ message: 'Session cleaned up' });
  });
});

// ------------------------
// ✅ Heartbeat Route
// ------------------------
app.get('/api/auth/heartbeat', (req, res) => {
  if (req.session && req.session.userId) {
    res.json({ authenticated: true, userId: req.session.userId });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

// ------------------------
// ✅ Health Check
// ------------------------
app.get('/api/health', (req, res) => {
  res.json({
    message: '✅ Server is running',
    sessionId: req.sessionID,
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ------------------------
// ✅ Global Error Handler
// ------------------------
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// ------------------------
// ✅ 404 Handler
// ------------------------
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ------------------------
// ✅ Start Server
// ------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});
