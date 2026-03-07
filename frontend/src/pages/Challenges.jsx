// src/pages/Challenges.jsx
import { useState, useEffect } from 'react'
import api from '../api'
import Modal from '../components/Modal'

const PLATFORMS = ['Ethernaut','Damn Vulnerable DeFi','Code4rena','Sherlock','Immunefi','CTF','Other']

export default function Challenges({ notify }) {
  const [challenges, setChallenges] = useState([])
  const [showModal, setShowModal]   = useState(false)
  const [form, setForm] = useState({ name:'', platform:'Ethernaut', difficulty:'medium', solved:false, time:'', writeup:'' })

  useEffect(() => { api.get('/challenges').then(r => setChallenges(r.data)) }, [])

  const save = async () => {
    if (!form.name) return notify('اكتب اسم التحدي')
    const date = new Date().toISOString().split('T')[0]
    const res  = await api.post('/challenges', { ...form, date })
    setChallenges(prev => [res.data, ...prev])
    setShowModal(false)
    setForm({ name:'', platform:'Ethernaut', difficulty:'medium', solved:false, time:'', writeup:'' })
    notify('تم تسجيل التحدي ✓')
  }

  const toggleSolved = async (c) => {
    await api.put(`/challenges/${c.id}`, { solved: !c.solved })
    setChallenges(prev => prev.map(x => x.id===c.id ? {...x,solved:!x.solved} : x))
    notify(!c.solved ? 'مبروك! تم تحديده كمحلول 🎉' : 'تم إلغاء الحل')
  }

  const del = async (id) => {
    await api.delete(`/challenges/${id}`)
    setChallenges(prev => prev.filter(c => c.id !== id))
    notify('تم الحذف')
  }

  const solved = challenges.filter(c => c.solved).length

  return (
    <div>
      <div className="page-header">
        <div className="page-title">الـ <span>Challenges</span></div>
        <div className="page-sub">// CTF / Security Labs Tracker</div>
      </div>
      <div className="mentor-card">
        <div className="mentor-title">🎓 نصيحة الـ Mentor</div>
        <div className="mentor-tip"><strong>Ethernaut</strong> هو بداية مثالية. ابدأ بيه. كل level فيه درس اكتب عنه writeup حتى لو مختصر. الـ writeup هو اللي بيثبت الفهم.</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:20}}>
        <div className="stat-card blue"><div className="stat-value">{challenges.length}</div><div className="stat-label">TOTAL</div></div>
        <div className="stat-card green"><div className="stat-value">{solved}</div><div className="stat-label">SOLVED</div></div>
        <div className="stat-card yellow"><div className="stat-value">{challenges.length-solved}</div><div className="stat-label">PENDING</div></div>
      </div>
      <div className="flex-between mb-16">
        <span className="text-muted">{challenges.length} تحدي مسجل</span>
        <button className="btn btn-primary" onClick={()=>setShowModal(true)}>+ تحدي جديد</button>
      </div>
      {challenges.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">🏆</div>ابدأ بـ Ethernaut Level 1!</div>
      ) : (
        challenges.map(c => (
          <div key={c.id} className="entry-card">
            <div className="flex-between">
              <div className="entry-title">{c.name}</div>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <span className={`sev ${c.difficulty==='easy'?'sev-low':c.difficulty==='medium'?'sev-medium':c.difficulty==='hard'?'sev-high':'sev-critical'}`}>{c.difficulty}</span>
                {c.solved ? <span style={{color:'var(--accent)',fontSize:18}}>✓</span> : <span style={{color:'var(--text3)',fontSize:14}}>○</span>}
              </div>
            </div>
            <div className="entry-meta">
              <span className="tag">{c.platform}</span>
              {c.time && <span className="entry-date">⏱ {c.time}</span>}
              <span className="entry-date">{c.date}</span>
            </div>
            {c.writeup && <div style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text3)',marginTop:8,lineHeight:1.5}}>{c.writeup.slice(0,120)}{c.writeup.length>120?'...':''}</div>}
            <div style={{display:'flex',gap:8,marginTop:10}}>
              <button className="btn btn-sm" style={{background:c.solved?'rgba(0,255,136,0.1)':'rgba(255,255,255,0.05)',color:c.solved?'var(--accent)':'var(--text3)',border:`1px solid ${c.solved?'rgba(0,255,136,0.3)':'var(--border)'}`}} onClick={()=>toggleSolved(c)}>
                {c.solved ? '✓ محلول' : 'حدده كمحلول'}
              </button>
              <button className="btn btn-danger btn-sm" onClick={()=>del(c.id)}>حذف</button>
            </div>
          </div>
        ))
      )}
      {showModal && (
        <Modal title="+ تحدي جديد" onClose={()=>setShowModal(false)}>
          <div className="form-group"><label className="form-label">اسم التحدي *</label><input className="form-input" placeholder="Ethernaut Level 1 — Fallback" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:0}}>
            <div className="form-group"><label className="form-label">المنصة</label><select className="form-select" value={form.platform} onChange={e=>setForm({...form,platform:e.target.value})}>{PLATFORMS.map(p=><option key={p}>{p}</option>)}</select></div>
            <div className="form-group"><label className="form-label">الصعوبة</label><select className="form-select" value={form.difficulty} onChange={e=>setForm({...form,difficulty:e.target.value})}><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option><option value="extreme">Extreme</option></select></div>
          </div>
          <div className="form-group"><label className="form-label">وقت الحل</label><input className="form-input" placeholder="2 ساعة" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} /></div>
          <div className="form-group"><label className="form-label">Writeup</label><textarea className="form-textarea" rows={4} value={form.writeup} onChange={e=>setForm({...form,writeup:e.target.value})} /></div>
          <div className="form-group" style={{display:'flex',gap:10,alignItems:'center'}}>
            <input type="checkbox" id="solved" checked={form.solved} onChange={e=>setForm({...form,solved:e.target.checked})} style={{accentColor:'var(--accent)'}} />
            <label htmlFor="solved" style={{fontFamily:'var(--font-mono)',fontSize:12,color:'var(--text2)',cursor:'pointer'}}>محلول بالفعل</label>
          </div>
          <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
            <button className="btn btn-secondary" onClick={()=>setShowModal(false)}>إلغاء</button>
            <button className="btn btn-primary" onClick={save}>حفظ</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
