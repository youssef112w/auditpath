// src/routes/vulns.js
const router = require('express').Router();
const auth   = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', auth, async (req, res) => {
  res.json(await prisma.vulnerability.findMany({ where: { userId: req.userId }, orderBy: { createdAt: 'desc' } }));
});
router.post('/', auth, async (req, res) => {
  try {
    const v = await prisma.vulnerability.create({ data: { ...req.body, userId: req.userId } });
    res.json(v);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
router.delete('/:id', auth, async (req, res) => {
  await prisma.vulnerability.deleteMany({ where: { id: parseInt(req.params.id), userId: req.userId } });
  res.json({ success: true });
});

module.exports = router;
