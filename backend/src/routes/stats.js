// src/routes/stats.js
const router = require('express').Router();
const auth   = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const [sessions, audits, vulns, challenges, roadmap] = await Promise.all([
      prisma.session.findMany({ where: { userId } }),
      prisma.audit.findMany({ where: { userId } }),
      prisma.vulnerability.findMany({ where: { userId } }),
      prisma.challenge.findMany({ where: { userId } }),
      prisma.roadmapProgress.findMany({ where: { userId } }),
    ]);

    const totalHours = sessions.reduce((a, s) => a + s.hours, 0);
    const solvedChallenges = challenges.filter(c => c.solved).length;
    const roadmapDone = roadmap.filter(r => r.done).length;

    // Streak calculation
    const dates = [...new Set(sessions.map(s => s.date))].sort();
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    let current = today;
    for (let i = dates.length - 1; i >= 0; i--) {
      if (dates[i] === current) {
        streak++;
        const d = new Date(current);
        d.setDate(d.getDate() - 1);
        current = d.toISOString().split('T')[0];
      } else break;
    }

    // Weekly data (last 7 days)
    const weekly = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const hrs = sessions.filter(s => s.date === key).reduce((a, s) => a + s.hours, 0);
      weekly.push({ date: key, hours: hrs });
    }

    // Heatmap (last 90 days)
    const heatmap = [];
    for (let i = 89; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const hrs = sessions.filter(s => s.date === key).reduce((a, s) => a + s.hours, 0);
      heatmap.push({ date: key, hours: hrs });
    }

    res.json({
      totalHours: parseFloat(totalHours.toFixed(1)),
      totalAudits: audits.length,
      totalVulns: vulns.length,
      totalChallenges: challenges.length,
      solvedChallenges,
      streak,
      roadmapDone,
      roadmapTotal: 22,
      weekly,
      heatmap,
      recentSessions: sessions.slice(-5).reverse(),
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
