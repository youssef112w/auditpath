// backend/src/routes/stats.js
// ─────────────────────────────────────────────────────────────────────────────
// PATCH: Streak calculation now respects a custom "day start hour".
//
// The frontend sends ?dayStartHour=N (default 0 = midnight).
// Sessions stored with date = the "logical date" (already shifted by frontend).
// The streak logic counts consecutive logical dates that have at least 1 session.
// ─────────────────────────────────────────────────────────────────────────────

const router = require('express').Router();
const auth   = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ── Helper: get logical date string given a real timestamp and dayStartHour ──
function getLogicalDate(timestamp, dayStartHour) {
  const d = new Date(timestamp);
  if (d.getHours() < dayStartHour) {
    d.setDate(d.getDate() - 1);
  }
  return d.toISOString().split('T')[0];
}

// ── Helper: compute streak from an array of date strings ─────────────────────
// dates: string[] of 'YYYY-MM-DD', may have duplicates, unsorted
// todayStr: the current logical date (already shifted)
function computeStreak(dates, todayStr) {
  if (!dates || dates.length === 0) return 0;

  // Unique set of dates that have sessions
  const dateSet = new Set(dates);

  let streak  = 0;
  const cur   = new Date(todayStr + 'T12:00:00Z'); // use noon UTC to avoid DST edge cases

  // Walk backwards day by day from today
  while (true) {
    const key = cur.toISOString().split('T')[0];
    if (dateSet.has(key)) {
      streak++;
      cur.setUTCDate(cur.getUTCDate() - 1);
    } else {
      // If today itself has no session yet, don't break the streak —
      // the user still has time until the day boundary.
      if (key === todayStr && streak === 0) {
        // Check yesterday before giving up
        cur.setUTCDate(cur.getUTCDate() - 1);
        const yesterday = cur.toISOString().split('T')[0];
        if (dateSet.has(yesterday)) {
          // Streak is still alive — count from yesterday
          streak++;
          cur.setUTCDate(cur.getUTCDate() - 1);
          continue;
        }
      }
      break;
    }
  }

  return streak;
}

// GET /api/stats?dayStartHour=0
router.get('/', auth, async (req, res) => {
  try {
    const dayStartHour = parseInt(req.query.dayStartHour || '0');
    const userId       = req.userId;

    // ── Logical today ────────────────────────────────────────────────────────
    const logicalToday = getLogicalDate(Date.now(), dayStartHour);

    // ── Fetch all sessions for this user ─────────────────────────────────────
    const sessions = await prisma.session.findMany({
      where:   { userId },
      orderBy: { createdAt: 'desc' },
    });

    // ── Streak: use the `date` field stored on the session (already logical) ─
    // If sessions were saved before this patch, their `date` field is the raw
    // calendar date which might be wrong for late-night sessions.
    // After the patch, the frontend sends the correct logical date.
    const sessionDates = sessions.map(s => s.date);
    const streak       = computeStreak(sessionDates, logicalToday);

    // ── Total hours ───────────────────────────────────────────────────────────
    const totalHours = sessions.reduce((sum, s) => sum + (s.hours || 0), 0);

    // ── Weekly (last 7 logical days) ──────────────────────────────────────────
    const weeklyMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(logicalToday + 'T12:00:00Z');
      d.setUTCDate(d.getUTCDate() - i);
      const key = d.toISOString().split('T')[0];
      weeklyMap[key] = 0;
    }
    sessions.forEach(s => {
      if (weeklyMap.hasOwnProperty(s.date)) {
        weeklyMap[s.date] += s.hours || 0;
      }
    });
    const weekly = Object.entries(weeklyMap).map(([date, hours]) => ({ date, hours: +hours.toFixed(2) }));

    // ── Heatmap (last 90 logical days) ───────────────────────────────────────
    const heatmapMap = {};
    for (let i = 89; i >= 0; i--) {
      const d = new Date(logicalToday + 'T12:00:00Z');
      d.setUTCDate(d.getUTCDate() - i);
      heatmapMap[d.toISOString().split('T')[0]] = 0;
    }
    sessions.forEach(s => {
      if (heatmapMap.hasOwnProperty(s.date)) {
        heatmapMap[s.date] += s.hours || 0;
      }
    });
    const heatmap = Object.entries(heatmapMap).map(([date, hours]) => ({ date, hours: +hours.toFixed(2) }));

    // ── Other counts ──────────────────────────────────────────────────────────
    const [totalAudits, totalVulns, roadmapDone] = await Promise.all([
      prisma.audit.count({ where: { userId } }),
      prisma.vuln.count({  where: { userId } }),
      prisma.roadmapItem.count({ where: { userId, done: true } }),
    ]);

    // ── Recent sessions (last 10) ─────────────────────────────────────────────
    const recentSessions = sessions.slice(0, 10).map(s => ({
      date:  s.date,
      hours: s.hours,
      note:  s.note,
    }));

    res.json({
      totalHours:     +totalHours.toFixed(2),
      totalAudits,
      totalVulns,
      streak,
      logicalToday,   // ← expose so frontend can display it
      weekly,
      heatmap,
      recentSessions,
      roadmapDone,
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
