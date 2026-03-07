// src/pages/AuditLab.jsx
import { useState, useEffect } from 'react'
import api from '../api'
import Modal from '../components/Modal'

export default function AuditLab({ notify }) {
  const [audits, setAudits]     = useState([])
  const [showModal, setShowModal] = useState(false)
  const [detail, setDetail]     = useState(null)
  const [loading, setLoading]   = useState(true)
  const [form, setForm] = useState({ name:'', link:'', problem:'', cause:'', fix:'', severity:'medium', type:'ctf', notes:'', isPublic:false })

  useEffect(() => {
    api.get('/audits').then(r => { setAudits(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const save = async () => {
    if (!form.name || !form.problem) return notify('اكتب اسم العقد والمشكلة على الأقل')
    try {
      const date = new Date().toISOString().split('T')[0]
      const res  = await api.post('/audits', { ...form, date })
      setAudits(prev => [res.data, ...prev])
      setShowModal(false)
      setForm({ name:'', link:'', problem:'', cause:'', fix:'', severity:'medium', type:'ctf', notes:'', isPublic:false })
      notify('تم تسجيل الـ Audit ✓')
    } catch (e) { notify('خطأ في الحفظ') }
  }

  const del = async (id) => {
    await api.delete(`/audits/${id}`)
    setAudits(prev => prev.filter(a => a.id !== id))
    setDetail(null)
    notify('تم الحذف')
  }

  if (loading) return <div className="loading">جاري التحميل...</div>

  return (
    <div>
      <div className="page-header">
        <div className="page-title">الـ <span>Audit Lab</span></div>
        <div className="page-sub">// سجل كل عقد حللته</div>
      </div>
      <div className="mentor-card">
        <div className="mentor-title">🎓 نصيحة الـ Mentor</div>
        <div className="mentor-tip"><strong>الكيف مش الكم.</strong> عقد واحد بتفهمه كويس أحسن من 10 بتمشي عليهم. لما بتسجل، اكتب <strong>السبب الجذري</strong> بكلامك أنت.</div>
      </div>
      <div className="flex-between mb-16">
        <div className="text-muted">إجمالي: {audits.length} عقد</div>
        <button className="btn btn-primary" onClick={()=>setShowModal(true)}>+ سجل عقد جديد</button>
      </div>
      {audits.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">🔬</div>لا يوجد شيء بعد — حلل أول عقد وسجله!</div>
      ) : (
        audits.map(a => (
          <div key={a.id} className="entry-card" onClick={()=>setDetail(a)}>
            <div className="flex-between">
              <div className="entry-title">{a.name}</div>
              <span className={`sev sev-${a.severity}`}>{a.severity}</span>
            </div>
            <div className="entry-meta">
              <span className="tag">{a.type==='ctf'?'CTF':a.type==='real'?'Real Project':'Practice'}</span>
              {a.isPublic && <span className="tag" style={{color:'var(--accent)',borderColor:'rgba(0,255,136,0.3)'}}>PUBLIC</span>}
              <span className="entry-date">{a.date}</span>
            </div>
            <div style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text3)',marginTop:8,lineHeight:1.5}}>{a.problem?.slice(0,100)}{a.problem?.length>100?'...':''}</div>
          </div>
        ))
      )}

      {showModal && (
        <Modal title="+ تسجيل عقد جديد" onClose={()=>setShowModal(false)}>
          <div className="form-group"><label className="form-label">اسم العقد / المشروع *</label><input className="form-input" placeholder="Ethernaut Level 10" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:0}}>
            <div className="form-group"><label className="form-label">Severity</label><select className="form-select" value={form.severity} onChange={e=>setForm({...form,severity:e.target.value})}><option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></div>
            <div className="form-group"><label className="form-label">النوع</label><select className="form-select" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option value="ctf">CTF</option><option value="real">Real Project</option><option value="practice">Practice</option></select></div>
          </div>
          <div className="form-group"><label className="form-label">المشكلة / الثغرة *</label><textarea className="form-textarea" placeholder="وصف المشكلة بكلامك..." value={form.problem} onChange={e=>setForm({...form,problem:e.target.value})} /></div>
          <div className="form-group"><label className="form-label">السبب الجذري</label><textarea className="form-textarea" placeholder="ليه حصلت المشكلة دي؟" value={form.cause} onChange={e=>setForm({...form,cause:e.target.value})} /></div>
          <div className="form-group"><label className="form-label">طريقة الإصلاح</label><textarea className="form-textarea" placeholder="إزاي تتصلح؟" value={form.fix} onChange={e=>setForm({...form,fix:e.target.value})} /></div>
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
        <Modal title={detail.name} onClose={()=>setDetail(null)}>
          <div className="entry-meta" style={{marginBottom:16}}><span className={`sev sev-${detail.severity}`}>{detail.severity}</span><span className="tag">{detail.type}</span><span className="entry-date">{detail.date}</span></div>
          <div className="form-group"><label className="form-label">المشكلة</label><div style={{fontFamily:'var(--font-mono)',fontSize:12,color:'var(--text2)',lineHeight:1.7}}>{detail.problem}</div></div>
          {detail.cause && <><hr className="divider"/><div className="form-group"><label className="form-label">السبب الجذري</label><div style={{fontFamily:'var(--font-mono)',fontSize:12,color:'var(--text2)',lineHeight:1.7}}>{detail.cause}</div></div></>}
          {detail.fix && <><hr className="divider"/><div className="form-group"><label className="form-label">الإصلاح</label><div style={{fontFamily:'var(--font-mono)',fontSize:12,color:'var(--accent)',lineHeight:1.7}}>{detail.fix}</div></div></>}
          <hr className="divider"/>
          <button className="btn btn-danger btn-sm" onClick={()=>del(detail.id)}>حذف</button>
        </Modal>
      )}
    </div>
  )
}
