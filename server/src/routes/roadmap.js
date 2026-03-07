// ─── ROADMAP ROUTES ───────────────────────────────────────────
const router = require('express').Router();
const prisma = require('../prisma');
const auth = require('../middleware/auth');

// GET all progress
router.get('/', auth, async (req, res) => {
  try {
    const progress = await prisma.roadmapProgress.findMany({
      where: { userId: req.userId }
    });
    res.json(progress);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// TOGGLE a task
router.post('/toggle', auth, async (req, res) => {
  try {
    const { phase, taskIndex } = req.body;
    const existing = await prisma.roadmapProgress.findUnique({
      where: { userId_phase_taskIndex: { userId: req.userId, phase, taskIndex } }
    });

    if (existing) {
      const updated = await prisma.roadmapProgress.update({
        where: { id: existing.id },
        data: { done: !existing.done, doneAt: !existing.done ? new Date() : null }
      });
      return res.json(updated);
    }

    const created = await prisma.roadmapProgress.create({
      data: { userId: req.userId, phase, taskIndex, done: true, doneAt: new Date() }
    });
    res.status(201).json(created);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
