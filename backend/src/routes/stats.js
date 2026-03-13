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
      streak, roadmapDone,
    ] = await Promise.all([
      prisma.session.aggregate({ where:{userId:uid}, _sum:{hours:true}, _count:true }),
      prisma.audit.count({ where:{userId:uid} }),
      prisma.vulnerability.count({ where:{userId:uid} }),
      prisma.challenge.count({ where:{userId:uid} }),
      prisma.challenge.count({ where:{userId:uid, solved:true} }),
      prisma.journal.count({ where:{userId:uid} }),
      prisma.streak.findUnique({ where:{userId:uid} }),
      prisma.roadmapProgress.count({ where:{userId:uid, done:true} }),
    ]);
    const recentSessions = await prisma.session.findMany({
      where:{userId:uid}, orderBy:{createdAt:'desc'},
      take:10, select:{date:true,hours:true,note:true},
    });
    const d90 = new Date(); d90.setDate(d90.getDate()-89);
    const from90 = d90.toISOString().split('T')[0];
    const today  = new Date().toISOString().split('T')[0];
    const heatmapRows = await prisma.session.findMany({
      where:{userId:uid, date:{gte:from90, lte:today}},
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
      where:{userId:uid, date:{gte:from7, lte:today}},
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
      streak:           streak?.current||0,
      longestStreak:    streak?.longest||0,
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
