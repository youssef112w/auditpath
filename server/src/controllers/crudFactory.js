// ─── SHARED CRUD FACTORY ─────────────────────────────────────
// Used by vulns, challenges, journal — all follow same pattern

const makeRouter = (model, requiredFields, buildData) => {
  const router = require('express').Router();
  const prisma = require('../prisma');
  const auth = require('../middleware/auth');

  router.get('/', auth, async (req, res) => {
    try {
      const items = await prisma[model].findMany({
        where: { userId: req.userId },
        orderBy: { createdAt: 'desc' }
      });
      res.json(items);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  router.post('/', auth, async (req, res) => {
    try {
      for (const f of requiredFields) {
        if (!req.body[f]) return res.status(400).json({ error: `${f} is required` });
      }
      const item = await prisma[model].create({
        data: { userId: req.userId, ...buildData(req.body) }
      });
      res.status(201).json(item);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  router.patch('/:id', auth, async (req, res) => {
    try {
      const exists = await prisma[model].findFirst({
        where: { id: req.params.id, userId: req.userId }
      });
      if (!exists) return res.status(404).json({ error: 'Not found' });
      const updated = await prisma[model].update({
        where: { id: req.params.id },
        data: buildData(req.body)
      });
      res.json(updated);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  router.delete('/:id', auth, async (req, res) => {
    try {
      const exists = await prisma[model].findFirst({
        where: { id: req.params.id, userId: req.userId }
      });
      if (!exists) return res.status(404).json({ error: 'Not found' });
      await prisma[model].delete({ where: { id: req.params.id } });
      res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  return router;
};

module.exports = makeRouter;
