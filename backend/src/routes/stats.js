const router = require('express').Router();
const prisma = require('../prisma');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const uid = req.userId;

    const [
      sessionAgg,
      auditCount,
      vulnCount,
      challengeCount,
      solvedCount,
      journalCount,
      streak,
      roadmapDone,
    ] = await Promise.all([
      prisma.session.aggregate({ where: { userId: uid }, _sum: { hours: true }, _count: true }),
      prisma.auditLog.count({ where: { userId: uid } }),
      prisma.vulnerability.count({ where: { userId: uid } }),
      prisma.challenge.count({ where: { userId: uid } }),
      prisma.challenge.count({ where: { userId: uid, solved: true } }),
      prisma.journalEntry.count({ where: { userId: uid } }),
      prisma.streak.findUnique({ where: { userId: uid } }),
      prisma.roadmapProgress.count({ where: { userId: uid, done: true } }),
    ]);

    res.json({
      totalHours: sessionAgg._sum.hours || 0,
      sessionCount: sessionAgg._count,
      auditCount,
      vulnCount,
      challengeCount,
      solvedChallenges: solvedCount,
      journalCount,
      streak: streak || { current: 0, longest: 0 },
      roadmapDoneTasks: roadmapDone,
      totalRoadmapTasks: 22, // sum of all roadmap tasks
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Heatmap — last 90 days
router.get('/heatmap', auth, async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      where: { userId: req.userId },
      select: { date: true, hours: true }
    });

    const map = {};
    sessions.forEach(s => {
      map[s.date] = (map[s.date] || 0) + s.hours;
    });

    res.json(map); // { "2025-01-01": 2.5, ... }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
