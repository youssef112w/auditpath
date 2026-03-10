// src/pages/Dashboard.jsx
import { useState, useEffect, useRef, useMemo } from 'react'
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

const TIMER_KEY   = 'ap_timerStart'
const RUNNING_KEY = 'ap_timerRunning'
const PAUSED_KEY  = 'ap_timerPaused'
const NOTE_KEY    = 'ap_timerNote'
const LAPS_KEY    = 'ap_timerLaps'

function fmt(ms) {
  const s = Math.floor(Math.abs(ms) / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
}

function fmtShort(ms) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (Math.floor(s / 3600) > 0) return fmt(ms)
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
}

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAY_LABELS  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

function buildHeatmapGrid(heatmap) {
  const map = {}
  heatmap.forEach(h => { map[h.date] = h.hours })
  const today = new Date()
  const cells = []
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = d.toISOString().split('T')[0]
    cells.push({ date: key, hours: map[key] || 0, dow: d.getDay(), d })
  }
  return cells
}

function getWeekColumns(cells) {
  const weeks = []
  let week = []
  const firstDow = cells[0].dow
  for (let i = 0; i < firstDow; i++) week.push(null)
  cells.forEach(c => {
    week.push(c)
    if (week.length === 7) { weeks.push(week); week = [] }
  })
  if (week.length) {
    while (week.length < 7) week.push(null)
    weeks.push(week)
  }
  return weeks
}

const cellColor = (hours) => {
  if (hours === 0) return 'rgba(255,255,255,0.04)'
  if (hours < 1)  return 'rgba(0,255,136,0.25)'
  if (hours < 2)  return 'rgba(0,255,136,0.45)'
  if (hours < 3)  return 'rgba(0,255,136,0.65)'
  return 'rgba(0,255,136,0.9)'
}

const cellColorIntensity = (hours) => {
  if (hours === 0) return 'rgba(255,255,255,0.04)'
  if (hours < 1)  return 'rgba(124,58,237,0.35)'
  if (hours < 2)  return 'rgba(0,136,255,0.5)'
  if (hours < 3)  return 'rgba(0,255,136,0.65)'
  return 'rgba(0,255,136,0.95)'
}

export default function Dashboard({ notify, onStreakChange }) {
  const [stats, setStats]         = useState(null)
  const [running, setRunning]     = useState(false)
  const [paused, setPaused]       = useState(false)
  const [elapsed, setElapsed]     = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [pausedAt, setPausedAt]   = useState(0)
  const [note, setNote]           = useState('')
  const [laps, setLaps]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [intensity, setIntensity] = useState('medium')
  const [heatView, setHeatView]   = useState('hours')
  const [hoveredCell, setHoveredCell] = useState(null)
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
    const savedRunning = localStorage.getItem(RUNNING_KEY)
    const savedStart   = localStorage.getItem(TIMER_KEY)
    const savedPaused  = localStorage.getItem(PAUSED_KEY)
    const savedNote    = localStorage.getItem(NOTE_KEY)
    const savedLaps    = localStorage.getItem(LAPS_KEY)
    if (savedNote) setNote(savedNote)
    if (savedLaps) try { setLaps(JSON.parse(savedLaps)) } catch {}
    if (savedRunning === 'paused' && savedPaused) {
      setPaused(true); setRunning(true)
      setPausedAt(parseInt(savedPaused)); setElapsed(parseInt(savedPaused))
    } else if (savedRunning === 'true' && savedStart) {
      const t = parseInt(savedStart)
      const ap = parseInt(savedPaused || '0')
      setStartTime(t); setPausedAt(ap)
      setElapsed(Date.now() - t + ap)
      setRunning(true); setPaused(false)
    }
  }, [])

  useEffect(() => {
    if (running && !paused && startTime) {
      timerRef.current = setInterval(() => setElapsed(Date.now() - startTime + pausedAt), 200)
    } else { clearInterval(timerRef.current) }
    return () => clearInterval(timerRef.current)
  }, [running, paused, startTime, pausedAt])

  useEffect(() => { if (running) localStorage.setItem(NOTE_KEY, note) }, [note, running])

  const clearStorage = () =>
    [TIMER_KEY, RUNNING_KEY, PAUSED_KEY, NOTE_KEY, LAPS_KEY].forEach(k => localStorage.removeItem(k))

  const startSession = () => {
    const t = Date.now()
    setStartTime(t); setElapsed(0); setPausedAt(0)
    setRunning(true); setPaused(false); setLaps([])
    localStorage.setItem(TIMER_KEY, String(t))
    localStorage.setItem(RUNNING_KEY, 'true')
    localStorage.setItem(PAUSED_KEY, '0')
    localStorage.setItem(NOTE_KEY, '')
    localStorage.setItem(LAPS_KEY, '[]')
    notify('بدأت الجلسة! 🚀')
  }

  const pauseSession = () => {
    setPaused(true)
    const ce = Date.now() - startTime + pausedAt
    setPausedAt(ce)
    localStorage.setItem(RUNNING_KEY, 'paused')
    localStorage.setItem(PAUSED_KEY, String(ce))
    notify('الجلسة متوقفة مؤقتاً ⏸')
  }

  const resumeSession = () => {
    const t = Date.now()
    setStartTime(t); setPaused(false)
    localStorage.setItem(TIMER_KEY, String(t))
    localStorage.setItem(RUNNING_KEY, 'true')
    notify('استكملت الجلسة ▶')
  }

  const addLap = () => {
    const prev = laps.length > 0 ? laps[laps.length - 1].total : 0
    const newLap = { n: laps.length + 1, total: elapsed, split: elapsed - prev }
    const updated = [...laps, newLap]
    setLaps(updated)
    localStorage.setItem(LAPS_KEY, JSON.stringify(updated))
  }

  const endSession = async () => {
    if (!running) return
    clearInterval(timerRef.current)
    setRunning(false); setPaused(false)
    const finalElapsed = elapsed
    const hours = parseFloat((finalElapsed / 3600000).toFixed(2))
    const date  = new Date().toISOString().split('T')[0]
    clearStorage()
    try {
      await api.post('/sessions', { date, hours, note,
        startedAt: new Date(startTime).toISOString(),
        endedAt: new Date().toISOString(),
      })
      await loadStats()
      notify(`جلسة محفوظة: ${fmt(finalElapsed)} ✓`)
    } catch (e) { notify('خطأ في حفظ الجلسة') }
    setElapsed(0); setPausedAt(0); setNote(''); setLaps([])
  }

  const cancelSession = () => {
    clearInterval(timerRef.current)
    setRunning(false); setPaused(false)
    setElapsed(0); setPausedAt(0); setNote(''); setLaps([])
    clearStorage()
  }

  const tip = MENTOR_TIPS[new Date().getDay() % MENTOR_TIPS.length]
  const elapsedHours = elapsed / 3600000
  const intensityColor = intensity === 'high' ? 'var(--accent3)' : intensity === 'low' ? 'var(--accent2)' : 'var(--accent)'

  if (loading) return <div className="loading">جاري التحميل...</div>

  const { totalHours, totalAudits, totalVulns, streak, weekly = [], heatmap = [], recentSessions = [], roadmapDone = 0 } = stats || {}
  const maxHrs = Math.max(...(weekly.map(w => w.hours) || [1]), 1)
  const days   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const todayDow = new Date().getDay()

  const heatCells   = buildHeatmapGrid(heatmap)
  const weekColumns = getWeekColumns(heatCells)

  const monthLabels = useMemo(() => {
    const seen = {}; const labels = []
    weekColumns.forEach((week, wi) => {
      week.forEach(cell => {
        if (!cell) return
        const mo = cell.d.getMonth()
        if (!seen[mo]) { seen[mo] = true; labels.push({ wi, label: MONTH_NAMES[mo] }) }
      })
    })
    return labels
  }, [weekColumns.length])

  const last30 = heatCells.slice(-30)
  const activeDays30 = last30.filter(c => c.hours > 0).length
  const avgHours30   = last30.reduce((a, c) => a + c.hours, 0) / 30
  const prodScore    = Math.min(100, Math.round((activeDays30 / 30) * 60 + Math.min(avgHours30 / 3, 1) * 40))
  const thisWeek     = heatCells.slice(-7)
  const bestDay      = thisWeek.reduce((a, b) => b.hours > a.hours ? b : a, thisWeek[0])

  return (
    <div>
      <style>{`
        @keyframes timerPulse { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(400%)} }
        @keyframes lapSlide { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes prodFill { from{width:0%} to{width:var(--pw)} }
        .lap-row { animation: lapSlide .25s cubic-bezier(.2,.8,.3,1); }
        .timer-digit { font-family:var(--font-code); font-size:clamp(48px,7vw,80px); font-weight:800; letter-spacing:2px; transition:color .4s,text-shadow .4s; line-height:1; }
        .timer-colon { font-family:var(--font-code); font-size:clamp(36px,5vw,60px); font-weight:300; opacity:.25; margin:0 4px; animation:timerPulse 1s infinite; line-height:1; }
        .t-btn { display:inline-flex; align-items:center; gap:6px; padding:10px 20px; border-radius:8px; font-family:var(--font-mono); font-size:11px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; cursor:pointer; transition:all .2s; border:1px solid transparent; white-space:nowrap; }
        .t-btn-primary  { background:var(--accent); color:#000; box-shadow:0 0 20px var(--accent)44; }
        .t-btn-primary:hover { filter:brightness(1.15); transform:translateY(-1px); }
        .t-btn-secondary { background:rgba(255,255,255,.06); color:var(--text2); border-color:rgba(255,255,255,.1); }
        .t-btn-secondary:hover { background:rgba(255,255,255,.1); color:var(--text1); }
        .t-btn-danger { background:rgba(255,60,60,.12); color:#ff6b6b; border-color:rgba(255,60,60,.25); }
        .t-btn-danger:hover { background:rgba(255,60,60,.2); }
        .t-btn-ghost { background:transparent; color:var(--text3); border-color:rgba(255,255,255,.06); }
        .t-btn-ghost:hover { color:var(--text2); border-color:rgba(255,255,255,.15); }
        .t-btn:disabled { opacity:.3; cursor:not-allowed; transform:none !important; }
        .int-pill { padding:3px 10px; border-radius:20px; border:1px solid rgba(255,255,255,.08); background:transparent; font-family:var(--font-mono); font-size:9px; cursor:pointer; transition:all .15s; letter-spacing:1px; text-transform:uppercase; color:var(--text3); }
        .int-pill.active { border-color:var(--ip-color); background:color-mix(in srgb,var(--ip-color) 12%,transparent); color:var(--ip-color); }
        .timer-ring-track { fill:none; stroke:rgba(255,255,255,.05); }
        .timer-ring-fill  { fill:none; stroke-linecap:round; transition:stroke-dashoffset .9s cubic-bezier(.4,0,.2,1),stroke .4s; }
        .heat-cell-v2 { width:12px; height:12px; border-radius:2px; cursor:pointer; transition:transform .1s,box-shadow .15s; flex-shrink:0; }
        .heat-cell-v2:hover { transform:scale(1.6); z-index:10; }
        .heat-tooltip { position:fixed; z-index:999; background:rgba(10,12,16,.95); border:1px solid rgba(0,255,136,.25); border-radius:8px; padding:8px 12px; pointer-events:none; animation:fadeUp .12s ease; }
        .view-tab { padding:3px 10px; border-radius:6px; cursor:pointer; font-family:var(--font-mono); font-size:9px; letter-spacing:1px; text-transform:uppercase; border:1px solid transparent; transition:all .15s; color:var(--text3); background:transparent; }
        .view-tab.active { background:rgba(0,255,136,.1); border-color:rgba(0,255,136,.25); color:var(--accent); }
        .chart-bar-v2 { border-radius:4px 4px 0 0; transition:all .3s; cursor:pointer; min-height:2px; position:relative; }
        .chart-bar-v2:hover { filter:brightness(1.4); }
        .prod-bar-fill { height:100%; border-radius:4px; background:linear-gradient(90deg,var(--accent2),var(--accent)); animation:prodFill 1.2s cubic-bezier(.4,0,.2,1) forwards; }
      `}</style>

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

      {/* ══ TIMER ══ */}
      <div className="timer-card" style={{position:'relative', overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,pointerEvents:'none',background:running&&!paused?`radial-gradient(ellipse at 50% 0%,${intensityColor}12 0%,transparent 65%)`:'none',transition:'background .6s'}} />
        {running && !paused && <div style={{position:'absolute',left:0,right:0,height:'2px',pointerEvents:'none',background:`linear-gradient(90deg,transparent,${intensityColor}22,transparent)`,animation:'scanline 3s linear infinite'}} />}

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24,position:'relative'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div className="card-title" style={{margin:0}}>// SESSION TIMER</div>
            {running && (
              <div style={{display:'flex',alignItems:'center',gap:5,padding:'2px 8px',borderRadius:12,background:paused?'rgba(255,200,0,.08)':`${intensityColor}12`,border:`1px solid ${paused?'rgba(255,200,0,.2)':intensityColor+'30'}`}}>
                <div style={{width:5,height:5,borderRadius:'50%',background:paused?'#ffc800':intensityColor,boxShadow:paused?'0 0 6px #ffc800':`0 0 8px ${intensityColor}`,animation:paused?'none':'timerPulse .8s infinite'}} />
                <span style={{fontFamily:'var(--font-mono)',fontSize:9,letterSpacing:1.5,color:paused?'#ffc800':intensityColor,textTransform:'uppercase'}}>{paused?'PAUSED':'LIVE'}</span>
              </div>
            )}
          </div>
          {running && (
            <div style={{display:'flex',gap:4,alignItems:'center'}}>
              {[{lvl:'low',color:'var(--accent2)',label:'LOW'},{lvl:'medium',color:'var(--accent)',label:'MED'},{lvl:'high',color:'var(--accent3)',label:'HIGH'}].map(({lvl,color,label}) => (
                <button key={lvl} className={`int-pill ${intensity===lvl?'active':''}`} style={{'--ip-color':color}} onClick={()=>setIntensity(lvl)}>{label}</button>
              ))}
            </div>
          )}
        </div>

        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:40,padding:'0 0 28px'}}>
          <div style={{position:'relative',flexShrink:0}}>
            {(()=>{
              const R=54,C=2*Math.PI*R
              const progress=running?Math.min((elapsed%3600000)/3600000,1):0
              return (
                <svg width="128" height="128" viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r={R} className="timer-ring-track" strokeWidth="3"/>
                  <circle cx="64" cy="64" r={R} className="timer-ring-fill" strokeWidth="3"
                    stroke={running&&!paused?intensityColor:'rgba(255,255,255,.15)'}
                    strokeDasharray={C} strokeDashoffset={C-progress*C} transform="rotate(-90 64 64)"/>
                  <text x="64" y="58" textAnchor="middle" style={{fontFamily:'var(--font-mono)',fontSize:'10px',fill:'var(--text3)',letterSpacing:1}}>{!running?'READY':paused?'PAUSED':'FOCUS'}</text>
                  <text x="64" y="76" textAnchor="middle" style={{fontFamily:'var(--font-code)',fontSize:'13px',fill:running?intensityColor:'var(--text2)',fontWeight:700}}>{elapsedHours.toFixed(2)}h</text>
                </svg>
              )
            })()}
          </div>
          <div>
            <div style={{display:'flex',alignItems:'center',textShadow:running&&!paused?`0 0 30px ${intensityColor}66`:'none'}}>
              <span className="timer-digit" style={{color:running&&!paused?intensityColor:'var(--text1)'}}>{String(Math.floor(elapsed/3600000)).padStart(2,'0')}</span>
              <span className="timer-colon" style={{animationPlayState:running&&!paused?'running':'paused'}}>:</span>
              <span className="timer-digit" style={{color:running&&!paused?intensityColor:'var(--text1)'}}>{String(Math.floor((elapsed%3600000)/60000)).padStart(2,'0')}</span>
              <span className="timer-colon" style={{animationPlayState:running&&!paused?'running':'paused'}}>:</span>
              <span className="timer-digit" style={{color:running&&!paused?intensityColor:'var(--text1)'}}>{String(Math.floor((elapsed%60000)/1000)).padStart(2,'0')}</span>
            </div>
            {running && (
              <div style={{display:'flex',gap:24,marginTop:10}}>
                <div style={{fontFamily:'var(--font-mono)',fontSize:10}}><span style={{color:'var(--text3)',letterSpacing:1}}>LAPS </span><span style={{color:'var(--text2)',fontWeight:600}}>{laps.length}</span></div>
                <div style={{fontFamily:'var(--font-mono)',fontSize:10}}><span style={{color:'var(--text3)',letterSpacing:1}}>START </span><span style={{color:'var(--text2)',fontWeight:600}}>{startTime?new Date(startTime).toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit'}):'--'}</span></div>
                {laps.length>0&&<div style={{fontFamily:'var(--font-mono)',fontSize:10}}><span style={{color:'var(--text3)',letterSpacing:1}}>LAST </span><span style={{color:intensityColor,fontWeight:600}}>{fmtShort(laps[laps.length-1].split)}</span></div>}
              </div>
            )}
          </div>
        </div>

        {running && <div style={{marginBottom:16}}><input className="form-input" placeholder="📝 بتشتغل على إيه دلوقتي؟ (اختياري)" value={note} onChange={e=>setNote(e.target.value)}/></div>}

        <div style={{display:'flex',gap:8,flexWrap:'wrap',justifyContent:'center'}}>
          {!running
            ? <button className="t-btn t-btn-primary" onClick={startSession} style={{minWidth:180,justifyContent:'center'}}><span>▶</span> ابدأ الجلسة</button>
            : <>
                {paused?<button className="t-btn t-btn-primary" onClick={resumeSession}><span>▶</span> استكمل</button>:<button className="t-btn t-btn-secondary" onClick={pauseSession}><span>⏸</span> توقف مؤقتاً</button>}
                <button className="t-btn t-btn-secondary" onClick={addLap} disabled={paused}><span>◎</span> Lap</button>
                <button className="t-btn t-btn-danger" onClick={endSession}><span>⏹</span> أنهِ وسجل</button>
                <button className="t-btn t-btn-ghost" onClick={cancelSession}>✕</button>
              </>
          }
        </div>

        {laps.length>0&&(
          <div style={{marginTop:24,borderTop:'1px solid rgba(255,255,255,.06)',paddingTop:16}}>
            <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--text3)',letterSpacing:2,marginBottom:12,textTransform:'uppercase'}}>// LAP TIMES</div>
            <div style={{display:'grid',gridTemplateColumns:'36px 1fr 1fr',gap:'8px 20px',fontFamily:'var(--font-mono)',fontSize:11}}>
              <span style={{color:'var(--text3)',fontSize:9,letterSpacing:1}}>#</span>
              <span style={{color:'var(--text3)',fontSize:9,letterSpacing:1}}>SPLIT</span>
              <span style={{color:'var(--text3)',fontSize:9,letterSpacing:1}}>TOTAL</span>
              {[...laps].reverse().map((l,idx)=>(
                <React.Fragment key={l.n}>
                  <span className="lap-row" style={{color:idx===0?intensityColor:'var(--text3)',fontWeight:idx===0?700:400}}>{String(l.n).padStart(2,'0')}</span>
                  <span className="lap-row" style={{color:idx===0?intensityColor:'var(--accent)',fontWeight:idx===0?700:400}}>{fmtShort(l.split)}</span>
                  <span className="lap-row" style={{color:'var(--text2)'}}>{fmtShort(l.total)}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ══ WEEKLY + ROADMAP ══ */}
      <div className="grid-2">
        <div className="card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <div className="card-title" style={{margin:0}}>// WEEKLY HOURS</div>
            <div style={{fontFamily:'var(--font-code)',fontSize:11,color:'var(--accent)'}}>{weekly.reduce((a,w)=>a+w.hours,0).toFixed(1)}h this week</div>
          </div>
          <div style={{display:'flex',alignItems:'flex-end',gap:6,height:80,padding:'0 4px'}}>
            {weekly.map((w,i)=>{
              const isToday=new Date(w.date).getDay()===todayDow
              const h=Math.max((w.hours/maxHrs)*100,3)
              return (
                <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4,height:'100%',justifyContent:'flex-end'}}>
                  <div style={{fontFamily:'var(--font-mono)',fontSize:8,color:w.hours>0?'var(--accent)':'transparent'}}>{w.hours>0?w.hours.toFixed(1):''}</div>
                  <div className="chart-bar-v2" style={{height:`${h}%`,width:'100%',background:isToday?'var(--accent)':`rgba(0,255,136,${0.2+(w.hours/maxHrs)*0.5})`,boxShadow:isToday?'0 0 12px var(--accent)66':'none'}} title={`${days[new Date(w.date).getDay()]}: ${w.hours}h`}/>
                </div>
              )
            })}
          </div>
          <div style={{display:'flex',gap:6,marginTop:6}}>
            {weekly.map((w,i)=>{
              const isToday=new Date(w.date).getDay()===todayDow
              return <div key={i} style={{flex:1,textAlign:'center',fontFamily:'var(--font-mono)',fontSize:9,color:isToday?'var(--accent)':'var(--text3)',fontWeight:isToday?700:400}}>{days[new Date(w.date).getDay()].slice(0,2)}</div>
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-title">// ROADMAP PROGRESS</div>
          <div style={{marginTop:8}}>
            <div className="flex-between mb-8">
              <span style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text2)'}}>Overall</span>
              <span style={{fontFamily:'var(--font-code)',fontSize:13,color:'var(--accent)'}}>{Math.round((roadmapDone/22)*100)}%</span>
            </div>
            <div className="progress-bar"><div className="progress-fill green" style={{width:`${Math.round((roadmapDone/22)*100)}%`}}/></div>
          </div>
          {ROADMAP_PHASES.map((p,i)=>{
            const colors=['green','purple','yellow','blue','red']
            return (
              <div key={p.phase} style={{marginTop:12}}>
                <div className="flex-between mb-8"><span style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--text3)'}}>Phase {p.phase}</span></div>
                <div className="progress-bar"><div className={`progress-fill ${colors[i]}`} style={{width:'0%'}}/></div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ══ PRODUCTIVITY SCORE ══ */}
      <div className="card" style={{marginBottom:16}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:16}}>
          <div>
            <div className="card-title">// PRODUCTIVITY SCORE</div>
            <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--text3)',marginTop:4}}>آخر 30 يوم</div>
          </div>
          <div style={{display:'flex',gap:24,flexWrap:'wrap'}}>
            <div style={{textAlign:'center'}}>
              <div style={{fontFamily:'var(--font-code)',fontSize:22,fontWeight:700,color:prodScore>=70?'var(--accent)':prodScore>=40?'#ffc800':'#ff6b6b'}}>{prodScore}</div>
              <div style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--text3)',letterSpacing:1}}>SCORE</div>
            </div>
            <div style={{textAlign:'center'}}>
              <div style={{fontFamily:'var(--font-code)',fontSize:22,fontWeight:700,color:'var(--accent2)'}}>{activeDays30}</div>
              <div style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--text3)',letterSpacing:1}}>ACTIVE DAYS</div>
            </div>
            <div style={{textAlign:'center'}}>
              <div style={{fontFamily:'var(--font-code)',fontSize:22,fontWeight:700,color:'var(--accent3)'}}>{avgHours30.toFixed(1)}h</div>
              <div style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--text3)',letterSpacing:1}}>AVG / DAY</div>
            </div>
            {bestDay&&bestDay.hours>0&&(
              <div style={{textAlign:'center'}}>
                <div style={{fontFamily:'var(--font-code)',fontSize:22,fontWeight:700,color:'var(--accent)'}}>{bestDay.hours.toFixed(1)}h</div>
                <div style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--text3)',letterSpacing:1}}>BEST THIS WEEK</div>
              </div>
            )}
          </div>
        </div>
        <div style={{marginTop:16}}>
          <div style={{height:6,background:'rgba(255,255,255,.06)',borderRadius:4,overflow:'hidden'}}>
            <div className="prod-bar-fill" style={{'--pw':`${prodScore}%`,width:`${prodScore}%`}}/>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:6}}>
            <span style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--text3)'}}>0</span>
            <span style={{fontFamily:'var(--font-mono)',fontSize:9,color:prodScore>=70?'var(--accent)':prodScore>=40?'#ffc800':'#ff6b6b'}}>
              {prodScore>=70?'🔥 Consistent':prodScore>=40?'⚡ Building':'🌱 Just Starting'}
            </span>
            <span style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--text3)'}}>100</span>
          </div>
        </div>
      </div>

      {/* ══ HEATMAP INTERACTIVE ══ */}
      <div className="card" style={{position:'relative'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,flexWrap:'wrap',gap:8}}>
          <div className="card-title" style={{margin:0}}>// ACTIVITY HEATMAP (90 DAYS)</div>
          <div style={{display:'flex',gap:4}}>
            <button className={`view-tab ${heatView==='hours'?'active':''}`} onClick={()=>setHeatView('hours')}>HOURS</button>
            <button className={`view-tab ${heatView==='intensity'?'active':''}`} onClick={()=>setHeatView('intensity')}>INTENSITY</button>
          </div>
        </div>

        <div style={{display:'flex',gap:0}}>
          {/* Day labels */}
          <div style={{display:'flex',flexDirection:'column',gap:3,marginRight:6,paddingTop:22}}>
            {DAY_LABELS.map((d,i)=>(
              <div key={i} style={{height:12,fontFamily:'var(--font-mono)',fontSize:8,color:i%2===1?'var(--text3)':'transparent',lineHeight:'12px'}}>{d.slice(0,2)}</div>
            ))}
          </div>

          <div style={{flex:1,overflowX:'auto'}}>
            {/* Month labels */}
            <div style={{display:'flex',gap:3,marginBottom:4}}>
              {weekColumns.map((_,wi)=>{
                const ml=monthLabels.find(m=>m.wi===wi)
                return <div key={wi} style={{width:12,fontFamily:'var(--font-mono)',fontSize:8,color:ml?'var(--text3)':'transparent',whiteSpace:'nowrap',flexShrink:0}}>{ml?ml.label:'.'}</div>
              })}
            </div>

            {/* Grid */}
            <div style={{display:'flex',gap:3}}>
              {weekColumns.map((week,wi)=>(
                <div key={wi} style={{display:'flex',flexDirection:'column',gap:3}}>
                  {week.map((cell,di)=>{
                    if(!cell) return <div key={di} style={{width:12,height:12,flexShrink:0}}/>
                    const bg = heatView==='intensity' ? cellColorIntensity(cell.hours) : cellColor(cell.hours)
                    return (
                      <div key={di} className="heat-cell-v2"
                        style={{background:bg, boxShadow:cell.hours>2?`0 0 5px ${bg}`:'none'}}
                        onMouseEnter={e=>setHoveredCell({date:cell.date,hours:cell.hours,x:e.clientX,y:e.clientY})}
                        onMouseLeave={()=>setHoveredCell(null)}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div style={{display:'flex',gap:8,marginTop:12,alignItems:'center',justifyContent:'flex-end'}}>
          <span style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--text3)'}}>Less</span>
          {[0,0.5,1.5,2.5,3.5].map((h,i)=>(
            <div key={i} style={{width:10,height:10,borderRadius:2,background:heatView==='intensity'?cellColorIntensity(h):cellColor(h)}}/>
          ))}
          <span style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--text3)'}}>More</span>
        </div>

        {/* Tooltip */}
        {hoveredCell&&(
          <div className="heat-tooltip" style={{left:hoveredCell.x+12,top:hoveredCell.y-44}}>
            <div style={{fontFamily:'var(--font-code)',fontSize:13,color:'var(--accent)',fontWeight:700}}>
              {hoveredCell.hours>0?`${hoveredCell.hours.toFixed(1)}h`:'No activity'}
            </div>
            <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--text3)',marginTop:2}}>
              {new Date(hoveredCell.date).toLocaleDateString('en',{weekday:'short',month:'short',day:'numeric'})}
            </div>
          </div>
        )}
      </div>

      {/* ══ RECENT SESSIONS ══ */}
      <div className="card" style={{marginTop:16}}>
        <div className="card-title">// RECENT SESSIONS</div>
        {recentSessions.length===0
          ? <div className="empty-state"><div className="empty-icon">⏱</div>لا توجد جلسات بعد — ابدأ الجلسة الأولى!</div>
          : recentSessions.map((s,i)=>(
              <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.04)',alignItems:'center'}}>
                <span style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text2)'}}>{s.note||'جلسة دراسة'}</span>
                <div style={{display:'flex',gap:16,alignItems:'center'}}>
                  <span style={{fontFamily:'var(--font-code)',fontSize:12,color:'var(--accent)'}}>{s.hours}h</span>
                  <span style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--text3)'}}>{s.date}</span>
                </div>
              </div>
            ))
        }
      </div>
    </div>
  )
}
