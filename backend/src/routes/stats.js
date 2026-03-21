// backend/src/routes/stats.js
const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth   = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const uid = req.userId;

    // ── Counts ───────────────────────────────────────────────────────────────
    const [
      sessionAgg, auditCount, vulnCount, roadmapDone,
    ] = await Promise.all([
      prisma.session.aggregate({ where:{ userId:uid }, _sum:{ hours:true }, _count:true }),
      prisma.audit.count({ where:{ userId:uid } }),
      prisma.vulnerability.count({ where:{ userId:uid } }),
      prisma.roadmapProgress.count({ where:{ userId:uid, done:true } }),
    ]);

    // ── All sessions for streak + weekly + heatmap ───────────────────────────
    const allSessions = await prisma.session.findMany({
      where:   { userId: uid },
      select:  { id: true, date: true, hours: true, note: true },
      orderBy: { date: 'desc' },
    });

    // ── Streak ───────────────────────────────────────────────────────────────
    const uniqueDates = [...new Set(allSessions.map(s => s.date))].sort((a,b) => b.localeCompare(a));
    let current = 0, longest = 0;
    const today     = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (uniqueDates.length > 0 && (uniqueDates[0] === today || uniqueDates[0] === yesterday)) {
      current = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        const prev = new Date(uniqueDates[i-1]);
        const curr = new Date(uniqueDates[i]);
        const diff = (prev - curr) / 86400000;
        if (diff === 1) { current++; } else { break; }
      }
    }

    let tmp = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const prev = new Date(uniqueDates[i-1]);
      const curr = new Date(uniqueDates[i]);
      const diff = (prev - curr) / 86400000;
      if (diff === 1) { tmp++; longest = Math.max(longest, tmp); }
      else { tmp = 1; }
    }
    longest = Math.max(longest, current);

    // ── Weekly (last 7 days) ─────────────────────────────────────────────────
    const weeklyMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      weeklyMap[d.toISOString().split('T')[0]] = 0;
    }
    allSessions.forEach(s => {
      if (weeklyMap.hasOwnProperty(s.date)) weeklyMap[s.date] += s.hours || 0;
    });
    const weekly = Object.entries(weeklyMap).map(([date, hours]) => ({ date, hours: +hours.toFixed(2) }));

    // ── Heatmap (last 90 days) ───────────────────────────────────────────────
    const heatmapMap = {};
    for (let i = 89; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      heatmapMap[d.toISOString().split('T')[0]] = 0;
    }
    allSessions.forEach(s => {
      if (heatmapMap.hasOwnProperty(s.date)) heatmapMap[s.date] += s.hours || 0;
    });
    const heatmap = Object.entries(heatmapMap).map(([date, hours]) => ({ date, hours: +hours.toFixed(2) }));

    // ── Recent sessions (last 10) مع id للحذف ────────────────────────────────
    const recentSessions = allSessions.slice(0, 10).map(s => ({
      id:    s.id,
      date:  s.date,
      hours: s.hours,
      note:  s.note,
    }));

    res.json({
      totalHours:    +(sessionAgg._sum.hours || 0).toFixed(2),
      totalAudits:   auditCount,
      totalVulns:    vulnCount,
      streak:        current,
      longest,
      weekly,
      heatmap,
      recentSessions,
      roadmapDone,
      roadmapByPhase: {},   // placeholder — الـ schema مش عنده phase field
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;