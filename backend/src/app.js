const express = require('express');
const cors = require('cors');
const authroutes = require('./routes/authroutes');
const eventroutes = require('./routes/eventroutes');
const bookingroutes = require('./routes/bookingroutes');

const app = express();

const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  return res.status(200).json({ success: true, message: 'API is running' });
});

app.use('/api/auth', authroutes);
app.use('/api/events', eventroutes);
app.use('/api/booking', bookingroutes);

app.use((req, res) => {
  return res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.statusCode ? err.message : 'Internal server error',
  });
});

module.exports = app;
