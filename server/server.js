const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes API
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy!' });
});

const path = require('path');

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
    } else {
      res.status(404).json({ success: false, message: 'API Endpoint not found' });
    }
  });
} else {
  // 404 Route handler
  app.use((req, res, next) => {
    res.status(404).json({ success: false, message: 'Endpoint not found' });
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
