const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma');
const authMiddleware = require('../middleware/auth');

// ─── REGISTER ─────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ error: 'All fields required' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const exists = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });
    if (exists) return res.status(409).json({ error: 'Username or email already taken' });

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { username, email, password: hashed }
    });

    // Create initial streak record
    await prisma.streak.create({ data: { userId: user.id } });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

    res.status(201).json({
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── LOGIN ────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET CURRENT USER ─────────────────────────────────────────
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, username: true, email: true, bio: true, createdAt: true }
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── UPDATE PROFILE ───────────────────────────────────────────
router.patch('/profile', authMiddleware, async (req, res) => {
  try {
    const { bio, username } = req.body;
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { ...(bio !== undefined && { bio }), ...(username && { username }) },
      select: { id: true, username: true, email: true, bio: true }
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
