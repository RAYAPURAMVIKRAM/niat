const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./src/routes/auth');
const eventRoutes = require('./src/routes/events');
const teamRoutes = require('./src/routes/teams');
const travelRoutes = require('./src/routes/travel');
const messageRoutes = require('./src/routes/messages');
const aiRoutes = require('./src/routes/ai');

// Import seed service
const { seedDemoDataIfEmpty } = require('./src/services/seedService');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// Body parsers with 50mb limit for multimodal image uploads (ID card verification)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Simple request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Root route - Overview and directory of endpoints
app.get('/', (req, res) => {
  res.json({
    name: 'HackSphere AI Backend',
    tagline: 'Agentic AI Social Platform for Tech Events, Hackathons, Skill-Based Teammate Matching, College ID Trust Verification, and Student Outstation Travel Pods',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      health: 'GET /api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
      },
      events: {
        list: 'GET /api/events',
        create: 'POST /api/events',
        getById: 'GET /api/events/:id',
      },
      teams: {
        list: 'GET /api/teams',
        create: 'POST /api/teams',
        getById: 'GET /api/teams/:id',
        join: 'POST /api/teams/:id/join',
      },
      travel: {
        list: 'GET /api/travel',
        create: 'POST /api/travel',
        getById: 'GET /api/travel/:id',
        join: 'POST /api/travel/:id/join',
      },
      messages: {
        listByRoom: 'GET /api/messages/:roomId',
        post: 'POST /api/messages',
      },
      ai: {
        agentOrchestrate: 'POST /api/ai/agent-orchestrate',
        verifyId: 'POST /api/ai/verify-id',
      },
    },
  });
});

// 1. Health check endpoint (Strict rubric requirement)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'HackSphere Agentic AI Backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/travel', travelRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/ai', aiRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    requested_url: req.originalUrl,
    method: req.method,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  });
});

// Start the Express server
app.listen(PORT, async () => {
  console.log('====================================================');
  console.log(`🚀 HackSphere AI Backend is LIVE on port ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
  console.log('====================================================');

  // Check and seed sample demo data if database is empty
  await seedDemoDataIfEmpty();
});

module.exports = app;
