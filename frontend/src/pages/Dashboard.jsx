// src/pages/Dashboard.jsx
import { useState, useEffect, useRef } from 'react'
import api from '../api'

const MENTOR_TIPS = [
  'ابدأ كل يوم بفتح الـ Dashboard وتسجيل بداية الجلسة. الـ <strong>Timer</strong> هو أول حاجة بتعملها قبل أي كود.',
  'بعد كل عقد بتحلله، <strong>سجله في الـ Audit Lab فورًا</strong>. حتى لو لقيت 0 ثغرات، التوثيق هو السلاح الأقوى.',
  'الـ <strong>Vulnerability Encyclopedia</strong> دي كنزك الشخصي. كل ثغرة بتتعلمها حطها بكودها وطريقة استغلالها.',
  'الـ <strong>Streak</strong> مش بس رقم. كل يوم بتكسره بيكلفك 3 أيام للرجوع لنفس الزخم.',
  'اكتب في الـ <strong>Research Journal</strong> حتى لو مش عارف. سؤال بدون إجابة هو بداية أي بحث حقيقي.',
]

const ROADMAP_PHASES = [
  { phase: 1, tasks: 5 }, { phase: 2, tasks: 5 }, { phase: 3, tasks: 5 },
  { phase: 4, tasks: 5 }, { phase: 5, tasks: 4 },
]

export default function Dashboard({ notify, onStreakChange }) {
  const [stats, setStats]     = useState(null)
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [note, setNote]       = useState('')
  const [loading, setLoading] = useState(true)
  const timerRef = useRef(null)

  const loadStats = async () => {
    try {
      const res = await api.get('/stats')
      setStats(res.data)
      onStreakChange(res.data.streak)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { loadStats() }, [])

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setElapsed(Date.now() - startTime), 1000)
    } else { clearInterval(timerRef.current) }
    return () => clearInterval(timerRef.current)
  }, [running, startTime])

  const fmt = ms => {
    const s = Math.floor(ms / 1000)
    return `${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor((s%3600)/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
  }

  const startSession = () => {
    const t = Date.now()
    setStartTime(t); setElapsed(0); setRunning(true)
    notify('بدأت الجلسة! 🚀')
  }

  const endSession = async () => {
    if (!running) return
    setRunning(false)
    const hours = parseFloat((elapsed / 3600000).toFixed(2))
    const date  = new Date().toISOString().split('T')[0]
    try {
      await api.post('/sessions', { date, hours, note })
      await loadStats()
      notify(`جلسة محفوظة: ${fmt(elapsed)} ✓`)
    } catch (e) { notify('خطأ في حفظ الجلسة') }
    setElapsed(0); setNote('')
  }

  const tip = MENTOR_TIPS[new Date().getDay() % MENTOR_TIPS.length]

  if (loading) return <div className="loading">جاري التحميل...</div>

  const { totalHours, totalAudits, totalVulns, streak, weekly = [], heatmap = [], recentSessions = [], roadmapDone = 0 } = stats || {}
  const maxHrs = Math.max(...(weekly.map(w => w.hours) || [1]), 1)
  const days   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

  return (
    <div>
      <div className="page-header">
        <div className="page-title">الـ <span>Dashboard</span></div>
        <div className="page-sub">// أداتك اليومية — {new Date().toLocaleDateString('ar-EG', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}</div>
      </div>

      <div className="mentor-card">
        <div className="mentor-title">🎓 نصيحة الـ Mentor اليوم</div>
        <div className="mentor-tip" dangerouslySetInnerHTML={{__html: tip}} />
      </div>

      <div className="grid-4">
        <div className="stat-card green"><div className="stat-value">{(totalHours||0).toFixed(1)}h</div><div className="stat-label">TOTAL HOURS</div></div>
        <div className="stat-card purple"><div className="stat-value">{totalAudits||0}</div><div className="stat-label">CONTRACTS AUDITED</div></div>
        <div className="stat-card yellow"><div className="stat-value">{totalVulns||0}</div><div className="stat-label">VULNS LEARNED</div></div>
        <div className="stat-card red"><div className="stat-value">🔥{streak||0}</div><div className="stat-label">DAY STREAK</div></div>
      </div>

      <div className="timer-card">
        <div className="card-title">// SESSION TIMER</div>
        <div className="timer-display">{fmt(elapsed)}</div>
        {running && (
          <div style={{marginBottom:16}}>
            <input className="form-input" placeholder="ملاحظة عن الجلسة (اختياري)" value={note} onChange={e=>setNote(e.target.value)} />
          </div>
        )}
        <div className="timer-buttons">
          {!running ? (
            <button className="btn btn-primary" onClick={startSession}>▶ ابدأ الجلسة</button>
          ) : (
            <>
              <button className="btn btn-danger" onClick={endSession}>⏹ أنهِ وسجل</button>
              <button className="btn btn-secondary" onClick={()=>{setRunning(false);setElapsed(0)}}>✕ إلغاء</button>
            </>
          )}
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">// WEEKLY HOURS</div>
          <div className="mini-chart">
            {weekly.map((w,i) => (
              <div key={i} className="chart-bar" style={{height:`${(w.hours/maxHrs)*100}%`}} title={`${days[new Date(w.date).getDay()]}: ${w.hours}h`} />
            ))}
          </div>
          <div className="chart-labels">
            {weekly.map((w,i) => <div key={i} className="chart-label">{days[new Date(w.date).getDay()]}</div>)}
          </div>
        </div>

        <div className="card">
          <div className="card-title">// ROADMAP PROGRESS</div>
          <div style={{marginTop:8}}>
            <div className="flex-between mb-8">
              <span style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text2)'}}>Overall</span>
              <span style={{fontFamily:'var(--font-code)',fontSize:13,color:'var(--accent)'}}>{Math.round((roadmapDone/22)*100)}%</span>
            </div>
            <div className="progress-bar"><div className="progress-fill green" style={{width:`${Math.round((roadmapDone/22)*100)}%`}} /></div>
          </div>
          {ROADMAP_PHASES.map((p,i) => {
            const colors = ['green','purple','yellow','blue','red']
            return (
              <div key={p.phase} style={{marginTop:12}}>
                <div className="flex-between mb-8">
                  <span style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--text3)'}}>Phase {p.phase}</span>
                </div>
                <div className="progress-bar"><div className={`progress-fill ${colors[i]}`} style={{width:'0%'}} /></div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card">
        <div className="card-title">// ACTIVITY HEATMAP (90 DAYS)</div>
        <div className="heatmap">
          {heatmap.map((h,i) => {
            const lvl = h.hours===0?'':h.hours<1?'l1':h.hours<2?'l2':h.hours<3?'l3':'l4'
            return <div key={i} className={`heat-cell ${lvl}`} title={`${h.date}: ${h.hours}h`} />
          })}
        </div>
        <div style={{display:'flex',gap:8,marginTop:8,alignItems:'center'}}>
          <span style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--text3)'}}>Less</span>
          {['','l1','l2','l3','l4'].map(l=><div key={l} className={`heat-cell ${l}`} style={{width:10,height:10}} />)}
          <span style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--text3)'}}>More</span>
        </div>
      </div>

      <div className="card" style={{marginTop:16}}>
        <div className="card-title">// RECENT SESSIONS</div>
        {recentSessions.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">⏱</div>لا توجد جلسات بعد — ابدأ الجلسة الأولى!</div>
        ) : (
          recentSessions.map((s,i) => (
            <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
              <span style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text2)'}}>{s.note||'جلسة دراسة'}</span>
              <div style={{display:'flex',gap:16}}>
                <span style={{fontFamily:'var(--font-code)',fontSize:12,color:'var(--accent)'}}>{s.hours}h</span>
                <span style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--text3)'}}>{s.date}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
