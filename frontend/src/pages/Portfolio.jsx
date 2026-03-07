// src/pages/Portfolio.jsx
import { useState, useEffect } from 'react'
import api from '../api'
import { useAuth } from '../AuthContext'

export default function Portfolio({ notify }) {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [audits, setAudits] = useState([])
  const [challenges, setChallenges] = useState([])

  useEffect(() => {
    Promise.all([api.get('/stats'), api.get('/audits'), api.get('/challenges')]).then(([s,a,c]) => {
      setStats(s.data); setAudits(a.data); setChallenges(c.data)
    })
  }, [])

  if (!stats) return <div className="loading">جاري التحميل...</div>

  const solved = challenges.filter(c => c.solved).length

  return (
    <div>
      <div className="page-header">
        <div className="page-title">الـ <span>Portfolio</span></div>
        <div className="page-sub">// ما ستعرضه للعالم</div>
      </div>
      <div className="mentor-card">
        <div className="mentor-title">🎓 نصيحة الـ Mentor</div>
        <div className="mentor-tip">الـ Portfolio هو <strong>إثبات الإنتاج</strong>. مش CV. كل audit حقيقي وكل writeup تنشره هو استثمار. <strong>لا تنتظر ما تكون "مستعد".</strong> ابدأ النشر من أول شهر.</div>
      </div>

      <div style={{background:'linear-gradient(135deg,rgba(0,255,136,0.08),rgba(124,58,237,0.06))',border:'1px solid rgba(0,255,136,0.2)',borderRadius:16,padding:28,marginBottom:24}}>
        <div style={{fontFamily:'var(--font-code)',fontSize:22,fontWeight:700,color:'var(--accent)',marginBottom:4}}>Smart Contract Security Researcher</div>
        <div style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text3)',letterSpacing:2,marginBottom:4}}>@{user?.username}</div>
        <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--text3)',letterSpacing:2,textTransform:'uppercase',marginBottom:20}}>In Progress · Journey Started</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
          {[
            {val:`${(stats.totalHours||0).toFixed(0)}h`,label:'Study Hours',color:'var(--accent)'},
            {val:stats.totalAudits||0,label:'Contracts',color:'var(--accent2)'},
            {val:stats.totalVulns||0,label:'Vulnerabilities',color:'var(--accent3)'},
            {val:solved,label:'Challenges',color:'var(--accent5)'},
          ].map((s,i) => (
            <div key={i} style={{textAlign:'center'}}>
              <div style={{fontFamily:'var(--font-code)',fontSize:28,color:s.color,fontWeight:700}}>{s.val}</div>
              <div style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--text3)',letterSpacing:1,textTransform:'uppercase'}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <div className="card">
          <div className="card-title">// RECENT AUDITS</div>
          {audits.length === 0 ? (
            <div className="empty-state" style={{padding:'24px 0'}}><div className="empty-icon" style={{fontSize:24}}>📄</div><div style={{fontSize:11}}>لا يوجد بعد</div></div>
          ) : audits.slice(0,5).map(a => (
            <div key={a.id} style={{padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
              <div className="flex-between">
                <span style={{fontFamily:'var(--font-mono)',fontSize:12,color:'var(--text2)'}}>{a.name}</span>
                <span className={`sev sev-${a.severity}`}>{a.severity}</span>
              </div>
              <span className="entry-date">{a.date}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title">// CHALLENGES SOLVED</div>
          {challenges.filter(c=>c.solved).length === 0 ? (
            <div className="empty-state" style={{padding:'24px 0'}}><div className="empty-icon" style={{fontSize:24}}>🏆</div><div style={{fontSize:11}}>لا يوجد بعد</div></div>
          ) : challenges.filter(c=>c.solved).slice(0,5).map(c => (
            <div key={c.id} style={{padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
              <div className="flex-between">
                <span style={{fontFamily:'var(--font-mono)',fontSize:12,color:'var(--text2)'}}>{c.name}</span>
                <span className="tag">{c.platform}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{marginTop:16}}>
        <div className="card-title">// PUBLIC URL</div>
        <div style={{fontFamily:'var(--font-code)',fontSize:13,color:'var(--accent)',marginTop:8}}>
          {window.location.origin}/api/portfolio/public/{user?.username}
        </div>
        <div style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text3)',marginTop:6}}>
          شارك الـ URL ده مع الـ audit firms والـ security community
        </div>
      </div>
    </div>
  )
}
