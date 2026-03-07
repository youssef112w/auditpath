const router = require('express').Router();
const prisma = require('../prisma');
const auth = require('../middleware/auth');

// GET all audits
router.get('/', auth, async (req, res) => {
  try {
    const audits = await prisma.auditLog.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(audits);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET single audit
router.get('/:id', auth, async (req, res) => {
  try {
    const audit = await prisma.auditLog.findFirst({
      where: { id: req.params.id, userId: req.userId }
    });
    if (!audit) return res.status(404).json({ error: 'Not found' });
    res.json(audit);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// CREATE audit
router.post('/', auth, async (req, res) => {
  try {
    const { name, link, problem, cause, fix, notes, severity, type, isPublic, date } = req.body;
    if (!name || !problem) return res.status(400).json({ error: 'name and problem required' });

    const audit = await prisma.auditLog.create({
      data: {
        userId: req.userId,
        name, link, problem, cause, fix, notes,
        severity: (severity || 'medium').toUpperCase(),
        type: (type || 'practice').toUpperCase(),
        isPublic: isPublic || false,
        date: date || new Date().toISOString().split('T')[0]
      }
    });
    res.status(201).json(audit);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// UPDATE audit
router.patch('/:id', auth, async (req, res) => {
  try {
    const exists = await prisma.auditLog.findFirst({
      where: { id: req.params.id, userId: req.userId }
    });
    if (!exists) return res.status(404).json({ error: 'Not found' });

    const { name, link, problem, cause, fix, notes, severity, type, isPublic } = req.body;
    const updated = await prisma.auditLog.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }), ...(link !== undefined && { link }),
        ...(problem && { problem }), ...(cause !== undefined && { cause }),
        ...(fix !== undefined && { fix }), ...(notes !== undefined && { notes }),
        ...(severity && { severity: severity.toUpperCase() }),
        ...(type && { type: type.toUpperCase() }),
        ...(isPublic !== undefined && { isPublic })
      }
    });
    res.json(updated);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE audit
router.delete('/:id', auth, async (req, res) => {
  try {
    const exists = await prisma.auditLog.findFirst({
      where: { id: req.params.id, userId: req.userId }
    });
    if (!exists) return res.status(404).json({ error: 'Not found' });
    await prisma.auditLog.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
