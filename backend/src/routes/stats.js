const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth   = require('../middleware/auth');

function lastNDays(n) {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

router.get('/', auth, async (req, res) => {
  try {
    const uid   = req.userId;
    const today = new Date().toISOString().split('T')[0];

    const d14 = new Date(); d14.setDate(d14.getDate() - 13);
    const d90 = new Date(); d90.setDate(d90.getDate() - 89);
    const from14 = d14.toISOString().split('T')[0];
    const from90 = d90.toISOString().split('T')[0];

    const [
      sessionAgg, auditCount, vulnCount,
      challengeCount, solvedCount, journalCount,
      streak, roadmapDone,
      recentSessions, weekly14, heatmap90,
    ] = await Promise.all([
      prisma.session.aggregate({ where: { userId: uid }, _sum: { hours: true }, _count: true }),
      prisma.auditLog.count({ where: { userId: uid } }),
      prisma.vulnerability.count({ where: { userId: uid } }),
      prisma.challenge.count({ where: { userId: uid } }),
      prisma.challenge.count({ where: { userId: uid, solved: true } }),
      prisma.journalEntry.count({ where: { userId: uid } }),
      prisma.streak.findUnique({ where: { userId: uid } }),
      prisma.roadmapProgress.count({ where: { userId: uid, done: true } }),
      prisma.session.findMany({
        where: { userId: uid },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { date: true, hours: true, note: true },
      }),
      prisma.session.findMany({
        where: { userId: uid, date: { gte: from14, lte: today } },
        select: { date: true, hours: true },
      }),
      prisma.session.findMany({
        where: { userId: uid, date: { gte: from90, lte: today } },
        select: { date: true, hours: true },
      }),
    ]);

    // weekly — 14 يوم
    const wMap = {};
    weekly14.forEach(s => { wMap[s.date] = (wMap[s.date] || 0) + s.hours; });
    const weekly = lastNDays(14).map(date => ({
      date, hours: parseFloat((wMap[date] || 0).toFixed(2)),
    }));

    // heatmap — 90 يوم
    const hMap = {};
    heatmap90.forEach(s => { hMap[s.date] = (hMap[s.date] || 0) + s.hours; });
    const heatmap = lastNDays(90).map(date => ({
      date, hours: parseFloat((hMap[date] || 0).toFixed(2)),
    }));

    res.json({
      totalHours:       sessionAgg._sum.hours || 0,
      sessionCount:     sessionAgg._count,
      totalAudits:      auditCount,
      totalVulns:       vulnCount,
      challengeCount,
      solvedChallenges: solvedCount,
      journalCount,
      streak:           streak?.current || 0,
      longestStreak:    streak?.longest || 0,
      roadmapDone,
      totalRoadmapTasks: 25,
      recentSessions,
      weekly,
      heatmap,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/heatmap', auth, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const d90   = new Date(); d90.setDate(d90.getDate() - 89);
    const from90 = d90.toISOString().split('T')[0];

    const sessions = await prisma.session.findMany({
      where: { userId: req.userId, date: { gte: from90, lte: today } },
      select: { date: true, hours: true },
    });

    const map = {};
    sessions.forEach(s => {
      map[s.date] = parseFloat(((map[s.date] || 0) + s.hours).toFixed(2));
    });
    res.json(map);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
