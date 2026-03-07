const router = require('express').Router();
const prisma = require('../prisma');
const auth = require('../middleware/auth');

// Public portfolio by username (no auth needed)
router.get('/:username', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: req.params.username },
      select: { id: true, username: true, bio: true, createdAt: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const [audits, vulns, challenges, journals, sessionAgg, streak] = await Promise.all([
      prisma.auditLog.findMany({ where: { userId: user.id, isPublic: true }, orderBy: { createdAt: 'desc' } }),
      prisma.vulnerability.findMany({ where: { userId: user.id, isPublic: true }, orderBy: { createdAt: 'desc' } }),
      prisma.challenge.findMany({ where: { userId: user.id, isPublic: true }, orderBy: { createdAt: 'desc' } }),
      prisma.journalEntry.findMany({ where: { userId: user.id, isPublic: true }, orderBy: { createdAt: 'desc' } }),
      prisma.session.aggregate({ where: { userId: user.id }, _sum: { hours: true } }),
      prisma.streak.findUnique({ where: { userId: user.id } }),
    ]);

    res.json({
      user,
      stats: {
        totalHours: sessionAgg._sum.hours || 0,
        auditsCount: audits.length,
        vulnsCount: vulns.length,
        solvedChallenges: challenges.filter(c => c.solved).length,
        longestStreak: streak?.longest || 0,
      },
      audits,
      vulns,
      challenges,
      journals,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
