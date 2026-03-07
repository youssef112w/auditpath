// src/pages/Journal.jsx
import { useState, useEffect } from 'react'
import api from '../api'
import Modal from '../components/Modal'

const TAGS = ['DeFi','MEV','Oracle','Flash Loan','Reentrancy','Access Control','Bridge','AMM','Staking','Research']

export default function Journal({ notify }) {
  const [entries, setEntries]   = useState([])
  const [showModal, setShowModal] = useState(false)
  const [detail, setDetail]     = useState(null)
  const [form, setForm] = useState({ title:'', content:'', tags:'', isPublic:false })

  useEffect(() => { api.get('/journal').then(r => setEntries(r.data)) }, [])

  const save = async () => {
    if (!form.title || !form.content) return notify('اكتب عنوان ومحتوى')
    const date = new Date().toISOString().split('T')[0]
    const res  = await api.post('/journal', { ...form, date })
    setEntries(prev => [res.data, ...prev])
    setShowModal(false)
    setForm({ title:'', content:'', tags:'', isPublic:false })
    notify('تم حفظ المقالة ✓')
  }

  const del = async (id) => {
    await api.delete(`/journal/${id}`)
    setEntries(prev => prev.filter(j => j.id !== id))
    setDetail(null)
    notify('تم الحذف')
  }

  const toggleTag = (t) => {
    const tags = form.tags.split(',').map(x=>x.trim()).filter(Boolean)
    const idx  = tags.indexOf(t)
    if (idx > -1) tags.splice(idx, 1); else tags.push(t)
    setForm({ ...form, tags: tags.join(', ') })
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">الـ <span>Research Journal</span></div>
        <div className="page-sub">// أفكارك + تحليلاتك + اكتشافاتك</div>
      </div>
      <div className="mentor-card">
        <div className="mentor-title">🎓 نصيحة الـ Mentor</div>
        <div className="mentor-tip">الـ Journal مش لازم يكون مكتمل. اكتب <strong>الأسئلة</strong> اللي عندك، <strong>الأشياء اللي مش فاهمها</strong>، أفكار عشوائية. أفضل اكتشافات الـ security researchers جت من يوميات مكتوبة.</div>
      </div>
      <div className="flex-between mb-16">
        <span className="text-muted">{entries.length} مقالة</span>
        <button className="btn btn-primary" onClick={()=>setShowModal(true)}>+ كتابة جديدة</button>
      </div>
      {entries.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">📓</div>اكتب أول فكرة — حتى لو كانت سؤال!</div>
      ) : (
        entries.map(j => (
          <div key={j.id} className="entry-card" onClick={()=>setDetail(j)}>
            <div className="entry-title">{j.title}</div>
            <div className="entry-meta">
              {j.tags && j.tags.split(',').map(t=>t.trim()).filter(Boolean).map(t=><span key={t} className="tag">{t}</span>)}
              {j.isPublic && <span className="tag" style={{color:'var(--accent)',borderColor:'rgba(0,255,136,0.3)'}}>PUBLIC</span>}
              <span className="entry-date">{j.date}</span>
            </div>
            <div style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text3)',marginTop:8,lineHeight:1.6}}>{j.content.slice(0,150)}{j.content.length>150?'...':''}</div>
          </div>
        ))
      )}
      {showModal && (
        <Modal title="+ مقالة جديدة" onClose={()=>setShowModal(false)}>
          <div className="form-group"><label className="form-label">العنوان *</label><input className="form-input" placeholder="فكرة، سؤال، تحليل..." value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></div>
          <div className="form-group">
            <label className="form-label">Tags</label>
            <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:8}}>
              {TAGS.map(t => {
                const active = form.tags.includes(t)
                return <span key={t} className="tag" style={{cursor:'pointer',background:active?'rgba(0,255,136,0.15)':'',borderColor:active?'rgba(0,255,136,0.4)':''}} onClick={()=>toggleTag(t)}>{t}</span>
              })}
            </div>
          </div>
          <div className="form-group"><label className="form-label">المحتوى *</label><textarea className="form-textarea" rows={8} placeholder="اكتب فكرتك هنا..." value={form.content} onChange={e=>setForm({...form,content:e.target.value})} /></div>
          <div className="form-group" style={{display:'flex',gap:10,alignItems:'center'}}>
            <input type="checkbox" id="pub" checked={form.isPublic} onChange={e=>setForm({...form,isPublic:e.target.checked})} style={{accentColor:'var(--accent)'}} />
            <label htmlFor="pub" style={{fontFamily:'var(--font-mono)',fontSize:12,color:'var(--text2)',cursor:'pointer'}}>نشر في الـ Portfolio العام</label>
          </div>
          <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
            <button className="btn btn-secondary" onClick={()=>setShowModal(false)}>إلغاء</button>
            <button className="btn btn-primary" onClick={save}>حفظ</button>
          </div>
        </Modal>
      )}
      {detail && (
        <Modal title={detail.title} onClose={()=>setDetail(null)}>
          <div className="entry-meta" style={{marginBottom:16}}>
            {detail.tags && detail.tags.split(',').map(t=>t.trim()).filter(Boolean).map(t=><span key={t} className="tag">{t}</span>)}
            <span className="entry-date">{detail.date}</span>
          </div>
          <div style={{fontFamily:'var(--font-mono)',fontSize:12,color:'var(--text2)',lineHeight:1.9,whiteSpace:'pre-wrap'}}>{detail.content}</div>
          <hr className="divider"/>
          <button className="btn btn-danger btn-sm" onClick={()=>del(detail.id)}>حذف</button>
        </Modal>
      )}
    </div>
  )
}
