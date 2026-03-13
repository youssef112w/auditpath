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
    <div style={{minHeight:'100vh',background:'#0a0a0f',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16}}>
      <div style={{fontFamily:'monospace',color:'#ff4444',fontSize:20}}>404</div>
      <div style={{fontFamily:'monospace',color:'#555',fontSize:13}}>// user not found</div>
    </div>
  )

  if (!data) return (
    <div style={{minHeight:'100vh',background:'#0a0a0f',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{fontFamily:'monospace',color:'#00ff88',fontSize:13,letterSpacing:2}}>loading...</div>
    </div>
  )

  const solvedChallenges = data.challenges?.filter(c => c.solved) || []
  const joinDate = data.user?.createdAt ? new Date(data.user.createdAt).toLocaleDateString('en', {month:'long',year:'numeric'}) : ''

  return (
    <div style={{minHeight:'100vh',background:'#0a0a0f',color:'#e2e8f0'}}>
      {/* Top bar */}
      <div style={{borderBottom:'1px solid rgba(255,255,255,0.06)',padding:'12px 32px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontFamily:'monospace',fontSize:12,color:'#00ff88',letterSpacing:3,fontWeight:700}}>AUDITPATH</div>
        <div style={{fontFamily:'monospace',fontSize:10,color:'#444',letterSpacing:2}}>SMART CONTRACT AUDITOR</div>
      </div>

      <div style={{maxWidth:860,margin:'0 auto',padding:'48px 24px'}}>

        {/* Hero */}
        <div style={{
          background:'linear-gradient(135deg,rgba(0,255,136,0.06),rgba(124,58,237,0.08))',
          border:'1px solid rgba(0,255,136,0.15)',
          borderRadius:20,padding:'40px 36px',marginBottom:32,position:'relative',overflow:'hidden'
        }}>
          {/* BG decoration */}
          <div style={{position:'absolute',top:-40,right:-40,width:200,height:200,borderRadius:'50%',background:'rgba(0,255,136,0.04)',pointerEvents:'none'}} />

          <div style={{fontFamily:'monospace',fontSize:10,color:'#00ff88',letterSpacing:4,textTransform:'uppercase',marginBottom:12}}>
            Smart Contract Security Researcher
          </div>
          <div style={{fontFamily:'monospace',fontSize:36,fontWeight:800,color:'#fff',marginBottom:6}}>
            @{data.user?.username}
          </div>
          <div style={{fontFamily:'monospace',fontSize:11,color:'#555',letterSpacing:2,marginBottom:28}}>
            IN PROGRESS · STARTED {joinDate.toUpperCase()}
          </div>

          {/* Stats */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:20}}>
            {[
              {val:`${(data.totalHours||0).toFixed(0)}h`, label:'Study Hours', color:'#00ff88'},
              {val:data.audits?.length||0, label:'Contracts Audited', color:'#a78bfa'},
              {val:data.audits?.reduce((a,c)=>a+(c.vulns||0),0)||0, label:'Vulns Found', color:'#f472b6'},
              {val:solvedChallenges.length, label:'Challenges Solved', color:'#38bdf8'},
            ].map((s,i) => (
              <div key={i} style={{textAlign:'center',padding:'16px 0'}}>
                <div style={{fontFamily:'monospace',fontSize:32,fontWeight:800,color:s.color,lineHeight:1}}>{s.val}</div>
                <div style={{fontFamily:'monospace',fontSize:9,color:'#555',letterSpacing:1,textTransform:'uppercase',marginTop:6}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Audits + Challenges */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20}}>

          {/* Audits */}
          <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:24}}>
            <div style={{fontFamily:'monospace',fontSize:10,color:'#555',letterSpacing:2,textTransform:'uppercase',marginBottom:18,display:'flex',justifyContent:'space-between'}}>
              <span>// Audited Contracts</span>
              <span style={{color:'#a78bfa'}}>{data.audits?.length||0}</span>
            </div>
            {!data.audits?.length ? (
              <div style={{textAlign:'center',padding:'24px 0',color:'#333',fontSize:11}}>لا يوجد بعد</div>
            ) : data.audits.slice(0,6).map((a,i) => (
              <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                <div>
                  <div style={{fontFamily:'monospace',fontSize:12,color:'#ccc'}}>{a.name}</div>
                  <div style={{fontFamily:'monospace',fontSize:9,color:'#444',marginTop:2}}>{a.date}</div>
                </div>
                <span style={{
                  fontFamily:'monospace',fontSize:9,padding:'3px 8px',borderRadius:6,textTransform:'uppercase',letterSpacing:1,
                  background:a.severity==='critical'?'rgba(255,68,68,0.15)':a.severity==='high'?'rgba(255,150,50,0.15)':a.severity==='medium'?'rgba(255,220,0,0.12)':'rgba(100,200,100,0.12)',
                  color:a.severity==='critical'?'#ff4444':a.severity==='high'?'#ff9632':a.severity==='medium'?'#ffd700':'#88cc88',
                  border:`1px solid ${a.severity==='critical'?'rgba(255,68,68,0.3)':a.severity==='high'?'rgba(255,150,50,0.3)':'rgba(255,255,255,0.1)'}`,
                }}>{a.severity}</span>
              </div>
            ))}
          </div>

          {/* Challenges */}
          <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:24}}>
            <div style={{fontFamily:'monospace',fontSize:10,color:'#555',letterSpacing:2,textTransform:'uppercase',marginBottom:18,display:'flex',justifyContent:'space-between'}}>
              <span>// Challenges Solved</span>
              <span style={{color:'#38bdf8'}}>{solvedChallenges.length}</span>
            </div>
            {!solvedChallenges.length ? (
              <div style={{textAlign:'center',padding:'24px 0',color:'#333',fontSize:11}}>لا يوجد بعد</div>
            ) : solvedChallenges.slice(0,6).map((c,i) => (
              <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                <div>
                  <div style={{fontFamily:'monospace',fontSize:12,color:'#ccc'}}>{c.name}</div>
                  <div style={{fontFamily:'monospace',fontSize:9,color:'#444',marginTop:2}}>{c.date}</div>
                </div>
                <span style={{fontFamily:'monospace',fontSize:9,padding:'3px 8px',borderRadius:6,background:'rgba(0,255,136,0.08)',color:'#00ff88',border:'1px solid rgba(0,255,136,0.2)'}}>{c.platform}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Journal / Writeups */}
        {data.journals?.length > 0 && (
          <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:24,marginBottom:20}}>
            <div style={{fontFamily:'monospace',fontSize:10,color:'#555',letterSpacing:2,textTransform:'uppercase',marginBottom:18}}>
              // Public Research & Writeups
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              {data.journals.slice(0,4).map((j,i) => (
                <div key={i} style={{padding:16,background:'rgba(255,255,255,0.02)',borderRadius:10,border:'1px solid rgba(255,255,255,0.05)'}}>
                  <div style={{fontFamily:'monospace',fontSize:12,color:'#ddd',marginBottom:6,fontWeight:600}}>{j.title}</div>
                  <div style={{fontFamily:'monospace',fontSize:10,color:'#555',lineHeight:1.6}}>{j.content?.slice(0,80)}...</div>
                  <div style={{fontFamily:'monospace',fontSize:9,color:'#444',marginTop:8}}>{j.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{textAlign:'center',paddingTop:24,borderTop:'1px solid rgba(255,255,255,0.05)'}}>
          <div style={{fontFamily:'monospace',fontSize:10,color:'#333',letterSpacing:2}}>
            POWERED BY <span style={{color:'#00ff88'}}>AUDITPATH</span> · auditpath-nine.vercel.app
          </div>
        </div>
      </div>
    </div>
  )
}
