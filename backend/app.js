  const express = require('express');
  const connectDB = require('./config/dbConfig');
  const authRoutes = require('./routes/authRoutes');
  const userRoutes = require('./routes/userRoutes');
  const propertyRoutes = require('./routes/propertyRoutes');
  const bookingRoutes = require('./routes/bookingRoutes');
  const locationRoutes = require('./routes/locationRoutes');
  const chatRoute = require('./routes/chatRoute');
  const cors = require('cors');
  const path = require('path');

  const app = express();

  // Connect to MongoDB
  connectDB();

  // Middleware
  app.use(express.json());
  app.use(cors({
      origin: ['https://mod8gxnqcb.execute-api.us-west-1.amazonaws.com', 'https://dre73xutwm9tl.cloudfront.net', 'http://localhost:3000'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    }));
  app.options('*', cors()); // enable pre-flight across-the-board


  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/properties', propertyRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/location', locationRoutes);
  app.use('/api/chat', chatRoute);

  module.exports = app;
