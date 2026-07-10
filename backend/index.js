require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { chat } = require('./controllers/chatController');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working' });
});
app.post('/api/chat', chat);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
