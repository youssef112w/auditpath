// src/pages/Encyclopedia.jsx
import { useState, useEffect } from 'react'
import api from '../api'
import Modal from '../components/Modal'

export default function Encyclopedia({ notify }) {
  const [vulns, setVulns]       = useState([])
  const [showModal, setShowModal] = useState(false)
  const [detail, setDetail]     = useState(null)
  const [search, setSearch]     = useState('')
  const [form, setForm] = useState({ name:'', category:'', severity:'high', description:'', code:'', exploit:'', fix:'', refs:'', date:'' })

  useEffect(() => {
    api.get('/vulns').then(r => setVulns(r.data))
  }, [])

  const filtered = vulns.filter(v => v.name.toLowerCase().includes(search.toLowerCase()) || (v.category||'').toLowerCase().includes(search.toLowerCase()))

  const save = async () => {
    if (!form.name) return notify('اكتب اسم الثغرة')
    const date = new Date().toISOString().split('T')[0]
    const res  = await api.post('/vulns', { ...form, date })
    setVulns(prev => [res.data, ...prev])
    setShowModal(false)
    setForm({ name:'', category:'', severity:'high', description:'', code:'', exploit:'', fix:'', refs:'', date:'' })
    notify('تمت إضافة الثغرة ✓')
  }

  const del = async (id) => {
    await api.delete(`/vulns/${id}`)
    setVulns(prev => prev.filter(v => v.id !== id))
    setDetail(null)
    notify('تم الحذف')
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">الـ <span>Encyclopedia</span></div>
        <div className="page-sub">// قاعدة بياناتك الشخصية للثغرات</div>
      </div>
      <div className="mentor-card">
        <div className="mentor-title">🎓 نصيحة الـ Mentor</div>
        <div className="mentor-tip">كل ثغرة لازم تكتب <strong>كود مثال + طريقة الاستغلال + الحل</strong>. مجرد الاسم مش كفاية. ده اللي بيفرق بين حد بيقرأ وحد بيفهم.</div>
      </div>
      <div className="flex-between mb-16">
        <input className="form-input" style={{maxWidth:260}} placeholder="🔍 ابحث عن ثغرة..." value={search} onChange={e=>setSearch(e.target.value)} />
        <button className="btn btn-primary" onClick={()=>setShowModal(true)}>+ إضافة ثغرة</button>
      </div>
      {vulns.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">📖</div>ابدأ ببناء encyclopedia الخاصة بيك!</div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
          {filtered.map(v => (
            <div key={v.id} className="entry-card" onClick={()=>setDetail(v)}>
              <div className="flex-between mb-8">
                <div className="entry-title">{v.name}</div>
                <span className={`sev sev-${v.severity}`}>{v.severity}</span>
              </div>
              {v.category && <span className="tag">{v.category}</span>}
              <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--text3)',marginTop:8,lineHeight:1.5}}>{v.description?.slice(0,80)}...</div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title="+ إضافة ثغرة" onClose={()=>setShowModal(false)}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:0}}>
            <div className="form-group"><label className="form-label">الاسم *</label><input className="form-input" placeholder="Reentrancy" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
            <div className="form-group"><label className="form-label">الفئة</label><input className="form-input" placeholder="Access Control" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} /></div>
          </div>
          <div className="form-group"><label className="form-label">Severity</label><select className="form-select" value={form.severity} onChange={e=>setForm({...form,severity:e.target.value})}><option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></div>
          <div className="form-group"><label className="form-label">الشرح</label><textarea className="form-textarea" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
          <div className="form-group"><label className="form-label">كود المثال</label><textarea className="form-textarea" style={{fontFamily:'var(--font-code)',direction:'ltr'}} value={form.code} onChange={e=>setForm({...form,code:e.target.value})} /></div>
          <div className="form-group"><label className="form-label">طريقة الاستغلال</label><textarea className="form-textarea" value={form.exploit} onChange={e=>setForm({...form,exploit:e.target.value})} /></div>
          <div className="form-group"><label className="form-label">الحل</label><textarea className="form-textarea" value={form.fix} onChange={e=>setForm({...form,fix:e.target.value})} /></div>
          <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
            <button className="btn btn-secondary" onClick={()=>setShowModal(false)}>إلغاء</button>
            <button className="btn btn-primary" onClick={save}>حفظ</button>
          </div>
        </Modal>
      )}
      {detail && (
        <Modal title={detail.name} onClose={()=>setDetail(null)}>
          <div style={{display:'flex',gap:8,marginBottom:16}}><span className={`sev sev-${detail.severity}`}>{detail.severity}</span>{detail.category&&<span className="tag">{detail.category}</span>}</div>
          {detail.description&&<div className="form-group"><label className="form-label">الشرح</label><div style={{fontFamily:'var(--font-mono)',fontSize:12,color:'var(--text2)',lineHeight:1.7}}>{detail.description}</div></div>}
          {detail.code&&<><hr className="divider"/><div className="form-group"><label className="form-label">الكود</label><div className="code-block">{detail.code}</div></div></>}
          {detail.exploit&&<><hr className="divider"/><div className="form-group"><label className="form-label">الاستغلال</label><div style={{fontFamily:'var(--font-mono)',fontSize:12,color:'#ff6b6b',lineHeight:1.7}}>{detail.exploit}</div></div></>}
          {detail.fix&&<><hr className="divider"/><div className="form-group"><label className="form-label">الحل</label><div style={{fontFamily:'var(--font-mono)',fontSize:12,color:'var(--accent)',lineHeight:1.7}}>{detail.fix}</div></div></>}
          <hr className="divider"/>
          <button className="btn btn-danger btn-sm" onClick={()=>del(detail.id)}>حذف</button>
        </Modal>
      )}
    </div>
  )
}
