// src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes      = require('./routes/auth');
const sessionRoutes   = require('./routes/sessions');
const roadmapRoutes   = require('./routes/roadmap');
const auditRoutes     = require('./routes/audits');
const vulnRoutes      = require('./routes/vulns');
const challengeRoutes = require('./routes/challenges');
const journalRoutes   = require('./routes/journal');
const portfolioRoutes = require('./routes/portfolio');
const statsRoutes     = require('./routes/stats');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth',       authRoutes);
app.use('/api/sessions',   sessionRoutes);
app.use('/api/roadmap',    roadmapRoutes);
app.use('/api/audits',     auditRoutes);
app.use('/api/vulns',      vulnRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/journal',    journalRoutes);
app.use('/api/portfolio',  portfolioRoutes);
app.use('/api/stats',      statsRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 AuditPath API running on http://localhost:${PORT}`));
