// src/pages/PublicPortfolio.jsx
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

export default function PublicPortfolio() {
  const { username } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || ''
    axios.get(`${base}/api/portfolio/public/${username}`)
      .then(r => setData(r.data))
      .catch(() => setError(true))
  }, [username])

  if (error) return (
    <div style={{minHeight:'100vh',background:'#0a0a0f',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{fontFamily:'monospace',color:'#ff4444',fontSize:16}}>// user not found</div>
    </div>
  )

  if (!data) return (
    <div style={{minHeight:'100vh',background:'#0a0a0f',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{fontFamily:'monospace',color:'#00ff88',fontSize:14}}>loading...</div>
    </div>
  )

  const solved = data.challenges?.filter(c => c.solved).length || 0

  return (
    <div style={{minHeight:'100vh',background:'#0a0a0f',color:'#e2e8f0',fontFamily:'monospace',padding:'40px 20px'}}>
      <div style={{maxWidth:800,margin:'0 auto'}}>

        {/* Header */}
        <div style={{textAlign:'center',marginBottom:48}}>
          <div style={{fontSize:11,color:'#00ff88',letterSpacing:4,textTransform:'uppercase',marginBottom:8}}>AuditPath</div>
          <div style={{fontSize:32,fontWeight:700,color:'#00ff88',fontFamily:'monospace',marginBottom:4}}>
            Smart Contract Security Researcher
          </div>
          <div style={{fontSize:13,color:'#666',letterSpacing:2}}>@{data.user?.username}</div>
          <div style={{fontSize:10,color:'#444',letterSpacing:3,textTransform:'uppercase',marginTop:4}}>
            In Progress · Journey Started
          </div>
        </div>

        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:32}}>
          {[
            {val:`${(data.totalHours||0).toFixed(0)}h`, label:'Study Hours', color:'#00ff88'},
            {val:data.audits?.length||0, label:'Contracts', color:'#a78bfa'},
            {val:data.audits?.reduce((a,c)=>a+(c.vulns||0),0)||0, label:'Vulnerabilities', color:'#f472b6'},
            {val:solved, label:'Challenges', color:'#38bdf8'},
          ].map((s,i) => (
            <div key={i} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:12,padding:20,textAlign:'center'}}>
              <div style={{fontSize:28,fontWeight:700,color:s.color}}>{s.val}</div>
              <div style={{fontSize:9,color:'#555',letterSpacing:1,textTransform:'uppercase',marginTop:4}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Audits & Challenges */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:32}}>
          <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:12,padding:20}}>
            <div style={{fontSize:10,color:'#555',letterSpacing:2,textTransform:'uppercase',marginBottom:16}}>// Recent Audits</div>
            {!data.audits?.length ? (
              <div style={{textAlign:'center',padding:'20px 0',color:'#333',fontSize:11}}>لا يوجد بعد</div>
            ) : data.audits.slice(0,5).map((a,i) => (
              <div key={i} style={{padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontSize:12,color:'#aaa'}}>{a.name}</span>
                  <span style={{
                    fontSize:9,padding:'2px 6px',borderRadius:4,textTransform:'uppercase',letterSpacing:1,
                    background: a.severity==='critical'?'rgba(255,68,68,0.15)':a.severity==='high'?'rgba(255,150,50,0.15)':'rgba(255,220,0,0.15)',
                    color: a.severity==='critical'?'#ff4444':a.severity==='high'?'#ff9632':'#ffd700'
                  }}>{a.severity}</span>
                </div>
                <div style={{fontSize:10,color:'#444',marginTop:2}}>{a.date}</div>
              </div>
            ))}
          </div>

          <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:12,padding:20}}>
            <div style={{fontSize:10,color:'#555',letterSpacing:2,textTransform:'uppercase',marginBottom:16}}>// Challenges Solved</div>
            {!data.challenges?.filter(c=>c.solved).length ? (
              <div style={{textAlign:'center',padding:'20px 0',color:'#333',fontSize:11}}>لا يوجد بعد</div>
            ) : data.challenges.filter(c=>c.solved).slice(0,5).map((c,i) => (
              <div key={i} style={{padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontSize:12,color:'#aaa'}}>{c.name}</span>
                  <span style={{fontSize:9,padding:'2px 6px',borderRadius:4,background:'rgba(0,255,136,0.1)',color:'#00ff88'}}>{c.platform}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{textAlign:'center',color:'#333',fontSize:10,letterSpacing:2}}>
          POWERED BY AUDITPATH · auditpath-nine.vercel.app
        </div>
      </div>
    </div>
  )
}
