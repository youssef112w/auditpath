require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// ─── MIDDLEWARE ───────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// ─── ROUTES ───────────────────────────────────────────────────
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/sessions',    require('./routes/sessions'));
app.use('/api/roadmap',     require('./routes/roadmap'));
app.use('/api/audits',      require('./routes/audits'));
app.use('/api/vulns',       require('./routes/vulns'));
app.use('/api/challenges',  require('./routes/challenges'));
app.use('/api/journal',     require('./routes/journal'));
app.use('/api/stats',       require('./routes/stats'));
app.use('/api/portfolio',   require('./routes/portfolio'));

// ─── HEALTH CHECK ─────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// ─── ERROR HANDLER ────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 AuditPath Server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV}`);
});
