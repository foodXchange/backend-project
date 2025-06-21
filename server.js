// Load environment variables
require('dotenv').config();

// Import dependencies
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

// Import configurations
const connectDB = require('./src/config/db');
const { testConnection } = require('./src/config/elasticsearch');
const { errorHandler } = require('./src/middleware/errorHandler');
const cronJobs = require('./src/utils/cronJobs');

// Import routes
const routes = require('./src/routes');

// Create Express app
const app = express();

// Connect to database
connectDB();

// Test Elasticsearch connection
testConnection();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// Home Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to FoodXchange API',
    version: '1.0.0',
    documentation: '/api/v1',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      projects: '/api/v1/projects',
      proposals: '/api/v1/proposals',
      notifications: '/api/v1/notifications',
      search: '/api/v1/search'
    }
  });
});

// API Routes - all under /api/v1
app.use('/api/v1', routes);

// Error Handler Middleware (must be last)
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/v1`);
  
  // Start cron jobs
  cronJobs.startAll();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  cronJobs.stopAll();
  app.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = app;