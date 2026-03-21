const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth   = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const uid = req.userId;
    const [
      sessionAgg, auditCount, vulnCount,
      challengeCount, solvedCount, journalCount,
      roadmapDone,
    ] = await Promise.all([
      prisma.session.aggregate({ where:{userId:uid}, _sum:{hours:true}, _count:true }),
      prisma.audit.count({ where:{userId:uid} }),
      prisma.vulnerability.count({ where:{userId:uid} }),
      prisma.challenge.count({ where:{userId:uid} }),
      prisma.challenge.count({ where:{userId:uid, solved:true} }),
      prisma.journal.count({ where:{userId:uid} }),
      prisma.roadmapProgress.count({ where:{userId:uid, done:true} }),
    ]);

    // حساب الـ streak من الـ sessions مباشرة
    const allSessions = await prisma.session.findMany({
      where: { userId: uid },
      select: { date: true },
      orderBy: { date: 'desc' },
    });
    const uniqueDates = [...new Set(allSessions.map(s => s.date))].sort((a,b) => b.localeCompare(a));
    let current = 0, longest = 0;
    const today = new Date().toISOString().split('T')[0];
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

    const recentSessions = await prisma.session.findMany({
      where:{userId:uid}, orderBy:{createdAt:'desc'},
      take:10, select:{date:true,hours:true,note:true},
    });

    const todayStr = new Date().toISOString().split('T')[0];
    const d90 = new Date(); d90.setDate(d90.getDate()-89);
    const from90 = d90.toISOString().split('T')[0];
    const heatmapRows = await prisma.session.findMany({
      where:{userId:uid, date:{gte:from90, lte:todayStr}},
      select:{date:true,hours:true},
    });
    const hMap = {};
    heatmapRows.forEach(s=>{ hMap[s.date]=(hMap[s.date]||0)+s.hours; });
    const heatmap = [];
    for(let i=89;i>=0;i--){
      const d=new Date(); d.setDate(d.getDate()-i);
      const dt=d.toISOString().split('T')[0];
      heatmap.push({date:dt, hours:parseFloat((hMap[dt]||0).toFixed(2))});
    }

    const d7 = new Date(); d7.setDate(d7.getDate()-6);
    const from7 = d7.toISOString().split('T')[0];
    const weeklyRows = await prisma.session.findMany({
      where:{userId:uid, date:{gte:from7, lte:todayStr}},
      select:{date:true,hours:true},
    });
    const wMap = {};
    weeklyRows.forEach(s=>{ wMap[s.date]=(wMap[s.date]||0)+s.hours; });
    const weekly = [];
    for(let i=6;i>=0;i--){
      const d=new Date(); d.setDate(d.getDate()-i);
      const dt=d.toISOString().split('T')[0];
      weekly.push({date:dt, hours:parseFloat((wMap[dt]||0).toFixed(2))});
    }

    res.json({
      totalHours:       sessionAgg._sum.hours||0,
      sessionCount:     sessionAgg._count,
      totalAudits:      auditCount,
      totalVulns:       vulnCount,
      challengeCount,
      solvedChallenges: solvedCount,
      journalCount,
      streak:           current,
      longestStreak:    longest,
      roadmapDone,
      totalRoadmapTasks:25,
      recentSessions,
      weekly,
      heatmap,
    });
  } catch(err){
    console.error(err);
    res.status(500).json({error:err.message});
  }
});

router.get('/heatmap', auth, async (req,res)=>{
  try{
    const sessions = await prisma.session.findMany({
      where:{userId:req.userId},
      select:{date:true,hours:true},
    });
    const map={};
    sessions.forEach(s=>{ map[s.date]=(map[s.date]||0)+s.hours; });
    res.json(map);
  }catch(err){ res.status(500).json({error:err.message}); }
});

module.exports = router;
