const router = require('express').Router();
const prisma = require('../prisma');
const auth   = require('../middleware/auth');

// ── helper: اعمل list بتاريخ لآخر N يوم ──────────────────────
function lastNDays(n) {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]); // "YYYY-MM-DD"
  }
  return days;
}

// ── GET /api/stats ────────────────────────────────────────────
router.get('/', auth, async (req, res) => {
  try {
    const uid = req.userId;

    // تاريخ 14 يوم فات (للـ weekly comparison)
    const today     = new Date().toISOString().split('T')[0];
    const days14ago = new Date();
    days14ago.setDate(days14ago.getDate() - 13);
    const from14 = days14ago.toISOString().split('T')[0];

    // تاريخ 90 يوم فات (للـ heatmap)
    const days90ago = new Date();
    days90ago.setDate(days90ago.getDate() - 89);
    const from90 = days90ago.toISOString().split('T')[0];

    const [
      sessionAgg,
      auditCount,
      vulnCount,
      challengeCount,
      solvedCount,
      journalCount,
      streak,
      roadmapDone,
      recentSessions,
      weekly14Sessions,
      heatmapSessions,
    ] = await Promise.all([
      // إجماليات
      prisma.session.aggregate({
        where: { userId: uid },
        _sum: { hours: true },
        _count: true,
      }),
      prisma.auditLog.count({ where: { userId: uid } }),
      prisma.vulnerability.count({ where: { userId: uid } }),
      prisma.challenge.count({ where: { userId: uid } }),
      prisma.challenge.count({ where: { userId: uid, solved: true } }),
      prisma.journalEntry.count({ where: { userId: uid } }),
      prisma.streak.findUnique({ where: { userId: uid } }),
      prisma.roadmapProgress.count({ where: { userId: uid, done: true } }),

      // آخر 10 جلسات للعرض
      prisma.session.findMany({
        where: { userId: uid },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { date: true, hours: true, note: true },
      }),

      // جلسات آخر 14 يوم للـ weekly comparison
      prisma.session.findMany({
        where: {
          userId: uid,
          date: { gte: from14, lte: today },
        },
        select: { date: true, hours: true },
      }),

      // جلسات آخر 90 يوم للـ heatmap
      prisma.session.findMany({
        where: {
          userId: uid,
          date: { gte: from90, lte: today },
        },
        select: { date: true, hours: true },
      }),
    ]);

    // ── بناء weekly array (14 يوم) ───────────────────────────
    // نجمع ساعات كل يوم في map أولاً
    const weeklyMap = {};
    weekly14Sessions.forEach(s => {
      weeklyMap[s.date] = (weeklyMap[s.date] || 0) + s.hours;
    });
    // نبني array كامل لآخر 14 يوم حتى لو يوم فيه 0
    const weekly = lastNDays(14).map(date => ({
      date,
      hours: parseFloat((weeklyMap[date] || 0).toFixed(2)),
    }));

    // ── بناء heatmap array (90 يوم) ──────────────────────────
    const heatmapMap = {};
    heatmapSessions.forEach(s => {
      heatmapMap[s.date] = (heatmapMap[s.date] || 0) + s.hours;
    });
    const heatmap = lastNDays(90).map(date => ({
      date,
      hours: parseFloat((heatmapMap[date] || 0).toFixed(2)),
    }));

    res.json({
      totalHours:      sessionAgg._sum.hours || 0,
      sessionCount:    sessionAgg._count,
      totalAudits:     auditCount,
      totalVulns:      vulnCount,
      challengeCount,
      solvedChallenges: solvedCount,
      journalCount,
      streak:          streak?.current || 0,
      longestStreak:   streak?.longest || 0,
      roadmapDone,
      totalRoadmapTasks: 25,
      recentSessions,  // آخر 10 جلسات
      weekly,          // 14 يوم للـ WeeklyComparison widget
      heatmap,         // 90 يوم للـ heatmap
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/stats/heatmap (لو في كود قديم بيستدعيه) ─────────
router.get('/heatmap', auth, async (req, res) => {
  try {
    const days90ago = new Date();
    days90ago.setDate(days90ago.getDate() - 89);
    const from90 = days90ago.toISOString().split('T')[0];
    const today  = new Date().toISOString().split('T')[0];

    const sessions = await prisma.session.findMany({
      where: {
        userId: req.userId,
        date: { gte: from90, lte: today },
      },
      select: { date: true, hours: true },
    });

    const map = {};
    sessions.forEach(s => {
      map[s.date] = parseFloat(((map[s.date] || 0) + s.hours).toFixed(2));
    });

    res.json(map);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
```

---

## ثانياً: نقل الـ Database لـ Neon (مجاني دايم)

### الخطوات بالترتيب:

**1. اعمل حساب على Neon**
- روح https://neon.tech وسجل بـ GitHub
- اعمل project جديد — اختار region: `AWS eu-central-1` (أقرب لمصر)
- هييجيلك `DATABASE_URL` على طول

**2. خد الـ connection string**
في dashboard بتاع Neon، هتلاقي:
```
postgresql://username:password@ep-xxxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

**3. عدّل الـ Railway environment variable**
في Railway → موقعك → Variables:
```
DATABASE_URL=postgresql://username:password@ep-xxxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
