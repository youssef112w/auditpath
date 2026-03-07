const router = require('express').Router();
const prisma = require('../prisma');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const items = await prisma.challenge.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { name, platform, difficulty, solved, timeSpent, writeup, isPublic, date } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    const item = await prisma.challenge.create({
      data: {
        userId: req.userId, name,
        platform: platform || 'Other',
        difficulty: difficulty || 'medium',
        solved: solved || false,
        solvedAt: solved ? new Date() : null,
        timeSpent, writeup,
        isPublic: isPublic || false,
        date: date || new Date().toISOString().split('T')[0]
      }
    });
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Toggle solved
router.patch('/:id/toggle', auth, async (req, res) => {
  try {
    const item = await prisma.challenge.findFirst({
      where: { id: req.params.id, userId: req.userId }
    });
    if (!item) return res.status(404).json({ error: 'Not found' });
    const updated = await prisma.challenge.update({
      where: { id: req.params.id },
      data: { solved: !item.solved, solvedAt: !item.solved ? new Date() : null }
    });
    res.json(updated);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/:id', auth, async (req, res) => {
  try {
    const item = await prisma.challenge.findFirst({ where: { id: req.params.id, userId: req.userId } });
    if (!item) return res.status(404).json({ error: 'Not found' });
    const { name, platform, difficulty, solved, timeSpent, writeup, isPublic } = req.body;
    const updated = await prisma.challenge.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }), ...(platform && { platform }),
        ...(difficulty && { difficulty }), ...(solved !== undefined && { solved }),
        ...(timeSpent !== undefined && { timeSpent }), ...(writeup !== undefined && { writeup }),
        ...(isPublic !== undefined && { isPublic })
      }
    });
    res.json(updated);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await prisma.challenge.findFirst({ where: { id: req.params.id, userId: req.userId } });
    if (!item) return res.status(404).json({ error: 'Not found' });
    await prisma.challenge.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
