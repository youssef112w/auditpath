// src/routes/portfolio.js
const router = require('express').Router();
const auth   = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Public portfolio by username
router.get('/public/:username', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { username: req.params.username } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const [audits, challenges, journals, sessions] = await Promise.all([
      prisma.audit.findMany({ where: { userId: user.id, isPublic: true }, orderBy: { createdAt: 'desc' } }),
      prisma.challenge.findMany({ where: { userId: user.id, solved: true }, orderBy: { createdAt: 'desc' } }),
      prisma.journal.findMany({ where: { userId: user.id, isPublic: true }, orderBy: { createdAt: 'desc' } }),
      prisma.session.findMany({ where: { userId: user.id } }),
    ]);
    const totalHours = sessions.reduce((a, s) => a + s.hours, 0);
    res.json({ user: { username: user.username, createdAt: user.createdAt }, audits, challenges, journals, totalHours });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/posts', auth, async (req, res) => {
  res.json(await prisma.portfolioPost.findMany({ where: { userId: req.userId }, orderBy: { createdAt: 'desc' } }));
});
router.post('/posts', auth, async (req, res) => {
  try {
    const p = await prisma.portfolioPost.create({ data: { ...req.body, userId: req.userId } });
    res.json(p);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
router.delete('/posts/:id', auth, async (req, res) => {
  await prisma.portfolioPost.deleteMany({ where: { id: parseInt(req.params.id), userId: req.userId } });
  res.json({ success: true });
});

module.exports = router;
