require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');

// Load Passport strategies
require('./config/passport-google');
require('./config/passport-facebook');

// Routes
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const bookmarksRoutes = require('./routes/bookmarks');

const app = express();

// Middleware
app.use(express.json());

// Session (needed for Passport OAuth)
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);
app.use('/bookmarks', bookmarksRoutes);

// Health check route (optional, for Render testing)
app.get('/health', (req, res) => {
  res.send('✅ Backend is healthy and running');
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB error:', err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));