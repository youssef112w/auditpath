// src/routes/roadmap.js
const router = require('express').Router();
const auth   = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', auth, async (req, res) => {
  const items = await prisma.roadmapProgress.findMany({ where: { userId: req.userId } });
  const map = {};
  items.forEach(i => { map[i.key] = i.done; });
  res.json(map);
});

router.post('/toggle', auth, async (req, res) => {
  const { key } = req.body;
  const existing = await prisma.roadmapProgress.findUnique({ where: { userId_key: { userId: req.userId, key } } });
  if (existing) {
    const updated = await prisma.roadmapProgress.update({ where: { id: existing.id }, data: { done: !existing.done } });
    res.json(updated);
  } else {
    const created = await prisma.roadmapProgress.create({ data: { userId: req.userId, key, done: true } });
    res.json(created);
  }
});

module.exports = router;
