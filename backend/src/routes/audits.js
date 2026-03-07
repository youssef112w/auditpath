// src/routes/audits.js
const router = require('express').Router();
const auth   = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', auth, async (req, res) => {
  const audits = await prisma.audit.findMany({ where: { userId: req.userId }, orderBy: { createdAt: 'desc' } });
  res.json(audits);
});

router.post('/', auth, async (req, res) => {
  try {
    const { name, link, problem, cause, fix, severity, type, notes, isPublic, date } = req.body;
    const audit = await prisma.audit.create({
      data: { userId: req.userId, name, link, problem, cause, fix, severity, type, notes, isPublic: !!isPublic, date }
    });
    res.json(audit);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const audit = await prisma.audit.updateMany({
      where: { id: parseInt(req.params.id), userId: req.userId },
      data: req.body
    });
    res.json(audit);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  await prisma.audit.deleteMany({ where: { id: parseInt(req.params.id), userId: req.userId } });
  res.json({ success: true });
});

module.exports = router;
