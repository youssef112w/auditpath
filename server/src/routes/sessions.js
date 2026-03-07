const router = require('express').Router();
const prisma = require('../prisma');
const auth = require('../middleware/auth');

// Helper: update streak
async function updateStreak(userId, date) {
  let streak = await prisma.streak.findUnique({ where: { userId } });
  if (!streak) streak = await prisma.streak.create({ data: { userId } });

  const today = date;
  const last = streak.lastDate;
  let current = streak.current;

  if (last) {
    const lastD = new Date(last);
    const nowD = new Date(today);
    const diff = Math.round((nowD - lastD) / 86400000);
    if (diff === 1) current += 1;
    else if (diff === 0) current = current; // same day
    else current = 1; // streak broken
  } else {
    current = 1;
  }

  await prisma.streak.update({
    where: { userId },
    data: { current, longest: Math.max(current, streak.longest), lastDate: today }
  });

  return current;
}

// ─── CREATE SESSION ───────────────────────────────────────────
router.post('/', auth, async (req, res) => {
  try {
    const { hours, note, date, startedAt, endedAt } = req.body;
    if (!hours || !date) return res.status(400).json({ error: 'hours and date required' });

    const session = await prisma.session.create({
      data: {
        userId: req.userId,
        hours: parseFloat(hours),
        note: note || null,
        date,
        startedAt: startedAt ? new Date(startedAt) : null,
        endedAt: endedAt ? new Date(endedAt) : null,
      }
    });

    const streakCount = await updateStreak(req.userId, date);
    res.status(201).json({ session, streak: streakCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET ALL SESSIONS ─────────────────────────────────────────
router.get('/', auth, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const sessions = await prisma.session.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset),
    });

    const total = await prisma.session.aggregate({
      where: { userId: req.userId },
      _sum: { hours: true },
      _count: true,
    });

    res.json({
      sessions,
      totalHours: total._sum.hours || 0,
      count: total._count,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET WEEKLY DATA (for chart) ──────────────────────────────
router.get('/weekly', auth, async (req, res) => {
  try {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }

    const sessions = await prisma.session.findMany({
      where: { userId: req.userId, date: { in: days } },
    });

    const weekly = days.map(day => ({
      date: day,
      hours: sessions
        .filter(s => s.date === day)
        .reduce((sum, s) => sum + s.hours, 0)
    }));

    res.json(weekly);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE SESSION ───────────────────────────────────────────
router.delete('/:id', auth, async (req, res) => {
  try {
    const session = await prisma.session.findFirst({
      where: { id: req.params.id, userId: req.userId }
    });
    if (!session) return res.status(404).json({ error: 'Not found' });
    await prisma.session.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
