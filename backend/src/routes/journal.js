// src/routes/journal.js
const router = require('express').Router();
const auth   = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', auth, async (req, res) => {
  res.json(await prisma.journal.findMany({ where: { userId: req.userId }, orderBy: { createdAt: 'desc' } }));
});
router.post('/', auth, async (req, res) => {
  try {
    const j = await prisma.journal.create({ data: { ...req.body, userId: req.userId } });
    res.json(j);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
router.put('/:id', auth, async (req, res) => {
  await prisma.journal.updateMany({ where: { id: parseInt(req.params.id), userId: req.userId }, data: req.body });
  res.json({ success: true });
});
router.delete('/:id', auth, async (req, res) => {
  await prisma.journal.deleteMany({ where: { id: parseInt(req.params.id), userId: req.userId } });
  res.json({ success: true });
});

module.exports = router;
