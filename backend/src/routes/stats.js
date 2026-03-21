// backend/src/routes/stats.js
const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth   = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const uid = req.userId;

    const [
      sessionAgg, auditCount, vulnCount,
      roadmapDone,
    ] = await Promise.all([
      prisma.session.aggregate({ where:{ userId:uid }, _sum:{ hours:true }, _count:true }),
      prisma.audit.count({ where:{ userId:uid } }),
      prisma.vulnerability.count({ where:{ userId:uid } }),
      prisma.roadmapProgress.count({ where:{ userId:uid, done:true } }),
    ]);

    // ── Streak ───────────────────────────────────────────────────────────────
    const allSessions = await prisma.session.findMany({
      where:   { userId: uid },
      select:  { date: true },
      orderBy: { date: 'desc' },
    });

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
      if (weeklyMap.hasOwnProperty(s.date)) weeklyMap[s.date]++;
    });

    const weeklySessions = await prisma.session.findMany({
      where:   { userId: uid, date: { in: Object.keys(weeklyMap) } },
      select:  { date: true, hours: true },
    });
    const weeklyHrsMap = { ...weeklyMap };
    Object.keys(weeklyHrsMap).forEach(k => weeklyHrsMap[k] = 0);
    weeklySessions.forEach(s => {
      if (weeklyHrsMap.hasOwnProperty(s.date)) weeklyHrsMap[s.date] += s.hours || 0;
    });
    const weekly = Object.entries(weeklyHrsMap).map(([date, hours]) => ({ date, hours: +hours.toFixed(2) }));

    // ── Heatmap (last 90 days) ───────────────────────────────────────────────
    const heatmapMap = {};
    for (let i = 89; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      heatmapMap[d.toISOString().split('T')[0]] = 0;
    }
    const heatmapSessions = await prisma.session.findMany({
      where:  { userId: uid, date: { in: Object.keys(heatmapMap) } },
      select: { date: true, hours: true },
    });
    heatmapSessions.forEach(s => {
      if (heatmapMap.hasOwnProperty(s.date)) heatmapMap[s.date] += s.hours || 0;
    });
    const heatmap = Object.entries(heatmapMap).map(([date, hours]) => ({ date, hours: +hours.toFixed(2) }));

    // ── Roadmap by phase ─────────────────────────────────────────────────────
    const roadmapItems = await prisma.roadmapProgress.findMany({
      where:  { userId: uid, done: true },
      select: { phase: true },
    });
    const roadmapByPhase = {};
    roadmapItems.forEach(r => {
      roadmapByPhase[r.phase] = (roadmapByPhase[r.phase] || 0) + 1;
    });

    // ── Recent sessions — مع الـ id عشان الحذف يشتغل ──────────────────────
    const recentRaw = await prisma.session.findMany({
      where:   { userId: uid },
      orderBy: { createdAt: 'desc' },
      take:    10,
      select:  { id: true, date: true, hours: true, note: true },
    });
    const recentSessions = recentRaw.map(s => ({
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
      roadmapByPhase,
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;