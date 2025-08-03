const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Import routes
const qbRoutes = require('./routes/qb');
const rbRoutes = require('./routes/rb');
const wrRoutes = require('./routes/wr');
const teRoutes = require('./routes/te');
const adpRoutes = require('./routes/adp');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/qb', qbRoutes);
app.use('/api/rb', rbRoutes);
app.use('/api/wr', wrRoutes);
app.use('/api/te', teRoutes);
app.use('/api/adp', adpRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Fantasy Football Rankings API is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Fantasy Football Rankings API',
    endpoints: {
      qb: '/api/qb',
      rb: '/api/rb',
      wr: '/api/wr',
      te: '/api/te',
      health: '/api/health'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app; 