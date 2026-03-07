// src/routes/sessions.js
const router = require('express').Router();
const auth   = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all sessions
router.get('/', auth, async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(sessions);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST new session
router.post('/', auth, async (req, res) => {
  try {
    const { date, hours, note } = req.body;
    const session = await prisma.session.create({
      data: { userId: req.userId, date, hours: parseFloat(hours), note }
    });
    res.json(session);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE session
router.delete('/:id', auth, async (req, res) => {
  try {
    await prisma.session.deleteMany({ where: { id: parseInt(req.params.id), userId: req.userId } });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
