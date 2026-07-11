require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const os = require('os');
const path = require('path');
const mongoose = require('mongoose');
const { chat } = require('./controllers/chatController');
const { getPersonality } = require('./controllers/personalityController');
const { uploadChat } = require('./controllers/uploadController');

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/digital_clone';
console.log(`[database] Connecting to MongoDB at ${mongoURI}...`);
mongoose.connect(mongoURI)
  .then(() => console.log('[database] Connected to MongoDB successfully.'))
  .catch(err => {
    console.error('[database] MongoDB connection failed! Running in database-fallback mode.', err.message);
  });

// Configure multer: store file in OS temp dir, accept .txt only, 5 MB limit
const upload = multer({
  dest: os.tmpdir(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.txt' || ext === '.zip') {
      cb(null, true);
    } else {
      cb(new Error('Only .txt or .zip files are accepted.'));
    }
  }
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.method === 'POST') {
    const cleaned = { ...req.body };
    if (cleaned.history) cleaned.history = `[Array of ${cleaned.history.length} messages]`;
    console.log('Request Body:', cleaned);
  }
  next();
});

// Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working' });
});
app.post('/api/chat', chat);
app.get('/api/personality', getPersonality);
app.post('/api/upload-chat', upload.single('file'), uploadChat);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Prevent the process from crashing on unhandled promise rejections
// This keeps the server alive even if an async service (e.g. Gemini, MongoDB) throws unexpectedly
process.on('unhandledRejection', (reason, promise) => {
  console.error('[server] Unhandled Promise Rejection at:', promise, 'reason:', reason?.message || reason);
});

process.on('uncaughtException', (err) => {
  console.error('[server] Uncaught Exception:', err.message, err.stack);
});
