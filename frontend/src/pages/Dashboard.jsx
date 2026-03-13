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
  { phase: 1, tasks: 5 }, { phase: 2, tasks: 6 }, { phase: 3, tasks: 5 },
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

// ── Weekly Comparison Widget ─────────────────────────────────────────────────
function WeeklyComparison({ weekly = [] }) {
  // weekly is an array of {date, hours} for the last 14 days from the API
  // We split into this week (last 7) and last week (prior 7)
  const sorted = [...weekly].sort((a, b) => new Date(a.date) - new Date(b.date))
  const thisWeek = sorted.slice(-7)
  const lastWeek = sorted.slice(-14, -7)

  const sumHours = arr => arr.reduce((a, d) => a + (d.hours || 0), 0)
  const thisTotal = sumHours(thisWeek)
  const lastTotal = sumHours(lastWeek)
  const diff      = thisTotal - lastTotal
  const diffPct   = lastTotal > 0 ? Math.round((diff / lastTotal) * 100) : null
  const improved  = diff >= 0

  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const maxHrs = Math.max(...thisWeek.map(d => d.hours), ...lastWeek.map(d => d.hours), 1)

  // daily goal (2.5h/day based on 90-day plan)
  const DAILY_GOAL = 2.5
  const WEEK_GOAL  = DAILY_GOAL * 7

  const goalPct     = Math.min(Math.round((thisTotal / WEEK_GOAL) * 100), 100)
  const goalColor   = goalPct >= 100 ? 'var(--accent)' : goalPct >= 60 ? 'var(--accent3)' : 'var(--accent4)'

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="card-title">// WEEKLY COMPARISON</div>

      {/* ── top summary row ── */}
      <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
        {/* This week */}
        <div style={{
          flex: 1, minWidth: 120,
          background: 'var(--surface2)', borderRadius: 8,
          padding: '10px 14px', border: '1px solid var(--border)',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text3)', marginBottom: 4, letterSpacing: 1 }}>
            الأسبوع الحالي
          </div>
          <div style={{ fontFamily: 'var(--font-code)', fontSize: 22, color: 'var(--accent)', fontWeight: 700 }}>
            {thisTotal.toFixed(1)}h
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text3)', marginTop: 2 }}>
            هدف: {WEEK_GOAL}h/أسبوع
          </div>
        </div>

        {/* Last week */}
        <div style={{
          flex: 1, minWidth: 120,
          background: 'var(--surface2)', borderRadius: 8,
          padding: '10px 14px', border: '1px solid var(--border)',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text3)', marginBottom: 4, letterSpacing: 1 }}>
            الأسبوع الماضي
          </div>
          <div style={{ fontFamily: 'var(--font-code)', fontSize: 22, color: 'var(--text2)', fontWeight: 700 }}>
            {lastTotal > 0 ? `${lastTotal.toFixed(1)}h` : '—'}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text3)', marginTop: 2 }}>
            {lastTotal > 0 ? `${lastWeek.filter(d => d.hours > 0).length}/7 أيام نشطة` : 'مفيش بيانات'}
          </div>
        </div>

        {/* Delta */}
        <div style={{
          flex: 1, minWidth: 120,
          background: 'var(--surface2)', borderRadius: 8,
          padding: '10px 14px',
          border: `1px solid ${lastTotal > 0 ? (improved ? 'rgba(0,255,136,.2)' : 'rgba(255,60,60,.2)') : 'var(--border)'}`,
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text3)', marginBottom: 4, letterSpacing: 1 }}>
            الفرق
          </div>
          <div style={{
            fontFamily: 'var(--font-code)', fontSize: 22, fontWeight: 700,
            color: lastTotal > 0 ? (improved ? 'var(--accent)' : 'var(--accent4)') : 'var(--text3)',
          }}>
            {lastTotal > 0 ? `${improved ? '+' : ''}${diff.toFixed(1)}h` : '—'}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, marginTop: 2,
            color: lastTotal > 0 ? (improved ? 'var(--accent)' : 'var(--accent4)') : 'var(--text3)',
          }}>
            {lastTotal > 0
              ? diffPct !== null
                ? `${improved ? '▲' : '▼'} ${Math.abs(diffPct)}% مقارنة بالأسبوع الماضي`
                : 'أول أسبوع بيانات'
              : 'سجّل جلستك الأولى'}
          </div>
        </div>

        {/* Weekly goal */}
        <div style={{
          flex: 1, minWidth: 120,
          background: 'var(--surface2)', borderRadius: 8,
          padding: '10px 14px', border: '1px solid var(--border)',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text3)', marginBottom: 4, letterSpacing: 1 }}>
            تحقيق الهدف
          </div>
          <div style={{ fontFamily: 'var(--font-code)', fontSize: 22, color: goalColor, fontWeight: 700 }}>
            {goalPct}%
          </div>
          <div style={{ marginTop: 6 }}>
            <div style={{ height: 3, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${goalPct}%`, background: goalColor, borderRadius: 99, transition: 'width .4s' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── bar chart comparison ── */}
      {(thisWeek.length > 0 || lastWeek.length > 0) && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text3)', letterSpacing: 1, marginBottom: 10 }}>
            // مقارنة يومية — الأخضر: هذا الأسبوع · الرمادي: الأسبوع الماضي · الخط: الهدف اليومي
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 80, position: 'relative' }}>
            {/* daily goal line */}
            <div style={{
              position: 'absolute',
              left: 0, right: 0,
              bottom: `${(DAILY_GOAL / maxHrs) * 100}%`,
              borderTop: '1px dashed rgba(255,200,0,.3)',
              pointerEvents: 'none',
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--accent3)',
                position: 'absolute', right: 0, top: -10,
              }}>{DAILY_GOAL}h goal</span>
            </div>

            {Array.from({ length: 7 }).map((_, i) => {
              const tw  = thisWeek[i]  || { hours: 0 }
              const lw  = lastWeek[i] || { hours: 0 }
              const label = tw.date ? days[new Date(tw.date).getDay()] : days[i]
              const isToday = tw.date === new Date().toISOString().split('T')[0]
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ width: '100%', display: 'flex', gap: 2, alignItems: 'flex-end', height: '100%' }}>
                    {/* last week bar */}
                    <div
                      style={{
                        flex: 1,
                        height: `${(lw.hours / maxHrs) * 100}%`,
                        background: 'rgba(255,255,255,.08)',
                        borderRadius: '3px 3px 0 0',
                        minHeight: lw.hours > 0 ? 3 : 0,
                        transition: 'height .4s',
                      }}
                      title={`الأسبوع الماضي: ${lw.hours}h`}
                    />
                    {/* this week bar */}
                    <div
                      style={{
                        flex: 1,
                        height: `${(tw.hours / maxHrs) * 100}%`,
                        background: isToday ? 'var(--accent3)' : tw.hours >= DAILY_GOAL ? 'var(--accent)' : tw.hours > 0 ? 'rgba(0,255,136,.4)' : 'transparent',
                        borderRadius: '3px 3px 0 0',
                        minHeight: tw.hours > 0 ? 3 : 0,
                        border: isToday ? '1px solid var(--accent3)' : 'none',
                        transition: 'height .4s',
                      }}
                      title={`هذا الأسبوع: ${tw.hours}h`}
                    />
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 8,
                    color: isToday ? 'var(--accent3)' : 'var(--text3)',
                    fontWeight: isToday ? 700 : 400,
                  }}>
                    {label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── daily breakdown of this week ── */}
      {thisWeek.some(d => d.hours > 0) && (
        <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text3)', letterSpacing: 1, marginBottom: 8 }}>
            // تفاصيل الأسبوع الحالي
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {thisWeek.map((d, i) => {
              const isToday = d.date === new Date().toISOString().split('T')[0]
              const hitGoal = d.hours >= DAILY_GOAL
              return (
                <div key={i} style={{
                  padding: '6px 4px', borderRadius: 6, textAlign: 'center',
                  background: isToday ? 'rgba(255,200,0,.08)' : 'var(--surface2)',
                  border: `1px solid ${isToday ? 'rgba(255,200,0,.3)' : hitGoal ? 'rgba(0,255,136,.15)' : 'var(--border)'}`,
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: isToday ? 'var(--accent3)' : 'var(--text3)', marginBottom: 3 }}>
                    {days[new Date(d.date).getDay()]}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-code)', fontSize: 11, fontWeight: 700,
                    color: d.hours === 0 ? 'var(--text3)' : hitGoal ? 'var(--accent)' : 'var(--accent3)',
                  }}>
                    {d.hours > 0 ? `${d.hours.toFixed(1)}h` : '—'}
                  </div>
                  {hitGoal && <div style={{ fontSize: 8, marginTop: 2 }}>✓</div>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── on-track message ── */}
      <div style={{
        marginTop: 12, padding: '8px 12px', borderRadius: 8,
        background: goalPct >= 80
          ? 'rgba(0,255,136,.06)'
          : goalPct >= 50
          ? 'rgba(255,200,0,.06)'
          : 'rgba(255,60,60,.06)',
        border: `1px solid ${goalPct >= 80 ? 'rgba(0,255,136,.15)' : goalPct >= 50 ? 'rgba(255,200,0,.15)' : 'rgba(255,60,60,.15)'}`,
        fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text2)', lineHeight: 1.6,
      }}>
        {goalPct >= 100
          ? '🔥 عالية جداً — خلصت هدف الأسبوع! ابقى منتظم الأسبوع الجاي.'
          : goalPct >= 80
          ? `✅ في المعدل — محتاج ${(WEEK_GOAL - thisTotal).toFixed(1)}h بس لتخلص هدف الأسبوع.`
          : goalPct >= 50
          ? `⚠️ تحت المعدل شوية — محتاج ${(WEEK_GOAL - thisTotal).toFixed(1)}h لحد نهاية الأسبوع.`
          : thisTotal === 0
          ? '📍 لسه ماسجلتش جلسة الأسبوع ده — ابدأ بـ 30 دقيقة دلوقتي.'
          : `🔴 تحت المعدل كتير — محتاج ${(WEEK_GOAL - thisTotal).toFixed(1)}h في باقي الأسبوع. ده ${((WEEK_GOAL - thisTotal) / Math.max(7 - new Date().getDay(), 1)).toFixed(1)}h/يوم.`
        }
      </div>
    </div>
  )
}

// ── main component ────────────────────────────────────────────────────────────
export default function Dashboard({ notify, onStreakChange }) {
  const [stats, setStats]           = useState(null)
  const [running, setRunning]       = useState(false)
  const [paused, setPaused]         = useState(false)
  const [elapsed, setElapsed]       = useState(0)
  const [startTime, setStartTime]   = useState(null)
  const [pausedAt, setPausedAt]     = useState(0)
  const [note, setNote]             = useState('')
  const [laps, setLaps]             = useState([])
  const [loading, setLoading]       = useState(true)
  const [intensity, setIntensity]   = useState('medium')
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
      const alreadyPaused = parseInt(savedPaused || '0')
      setStartTime(t); setPausedAt(alreadyPaused)
      setElapsed(Date.now() - t + alreadyPaused)
      setRunning(true); setPaused(false)
    }
  }, [])

  useEffect(() => {
    if (running && !paused && startTime) {
      timerRef.current = setInterval(() => { setElapsed(Date.now() - startTime + pausedAt) }, 200)
    } else { clearInterval(timerRef.current) }
    return () => clearInterval(timerRef.current)
  }, [running, paused, startTime, pausedAt])

  useEffect(() => { if (running) localStorage.setItem(NOTE_KEY, note) }, [note, running])

  const clearStorage = () => {
    ;[TIMER_KEY, RUNNING_KEY, PAUSED_KEY, NOTE_KEY, LAPS_KEY].forEach(k => localStorage.removeItem(k))
  }

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
    const cur = Date.now() - startTime + pausedAt
    setPausedAt(cur)
    localStorage.setItem(RUNNING_KEY, 'paused')
    localStorage.setItem(PAUSED_KEY, String(cur))
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
    const prev   = laps.length > 0 ? laps[laps.length - 1].total : 0
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
      await api.post('/sessions', {
        date, hours, note,
        startedAt: new Date(startTime).toISOString(),
        endedAt: new Date().toISOString(),
      })
      await loadStats()
      notify(`جلسة محفوظة: ${fmt(finalElapsed)} ✓`)
    } catch { notify('خطأ في حفظ الجلسة') }
    setElapsed(0); setPausedAt(0); setNote(''); setLaps([])
  }

  const cancelSession = () => {
    clearInterval(timerRef.current)
    setRunning(false); setPaused(false)
    setElapsed(0); setPausedAt(0); setNote(''); setLaps([])
    clearStorage()
  }

  const tip          = MENTOR_TIPS[new Date().getDay() % MENTOR_TIPS.length]
  const elapsedHours = elapsed / 3600000
  const intensityColor = intensity === 'high' ? 'var(--accent3)' : intensity === 'low' ? 'var(--accent2)' : 'var(--accent)'

  if (loading) return <div className="loading">جاري التحميل...</div>

  const { totalHours, totalAudits, totalVulns, streak, weekly = [], heatmap = [], recentSessions = [], roadmapDone = 0 } = stats || {}
  const maxHrs = Math.max(...(weekly.map(w => w.hours) || [1]), 1)
  const days   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

  return (
    <div>
      <div className="page-header">
        <div className="page-title">الـ <span>Dashboard</span></div>
        <div className="page-sub">
          // أداتك اليومية — {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="mentor-card">
        <div className="mentor-title">🎓 نصيحة الـ Mentor اليوم</div>
        <div className="mentor-tip" dangerouslySetInnerHTML={{ __html: tip }} />
      </div>

      {/* ── stat cards ── */}
      <div className="grid-4">
        <div className="stat-card green"><div className="stat-value">{(totalHours||0).toFixed(1)}h</div><div className="stat-label">TOTAL HOURS</div></div>
        <div className="stat-card purple"><div className="stat-value">{totalAudits||0}</div><div className="stat-label">CONTRACTS AUDITED</div></div>
        <div className="stat-card yellow"><div className="stat-value">{totalVulns||0}</div><div className="stat-label">VULNS LEARNED</div></div>
        <div className="stat-card red"><div className="stat-value">🔥{streak||0}</div><div className="stat-label">DAY STREAK</div></div>
      </div>

      {/* ── WEEKLY COMPARISON (new) ── */}
      <WeeklyComparison weekly={weekly} />

      {/* ── TIMER ── */}
      <div className="timer-card" style={{ position: 'relative', overflow: 'hidden' }}>
        <style>{`
          @keyframes timerPulse { 0%,100%{opacity:.5} 50%{opacity:1} }
          @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(400%)} }
          @keyframes lapSlide { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
          .lap-row { animation: lapSlide .25s cubic-bezier(.2,.8,.3,1); }
          .timer-digit {
            font-family: var(--font-code);
            font-size: clamp(48px,7vw,80px);
            font-weight: 800; letter-spacing: 2px;
            transition: color .4s, text-shadow .4s; line-height: 1;
          }
          .timer-colon {
            font-family: var(--font-code);
            font-size: clamp(36px,5vw,60px);
            font-weight: 300; opacity: .25; margin: 0 4px;
            animation: timerPulse 1s infinite; line-height: 1;
          }
          .t-btn {
            display: inline-flex; align-items: center; gap: 6px;
            padding: 10px 20px; border-radius: 8px;
            font-family: var(--font-mono); font-size: 11px;
            font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;
            cursor: pointer; transition: all .2s; border: 1px solid transparent;
            white-space: nowrap;
          }
          .t-btn-primary { background: var(--accent); color: #000; box-shadow: 0 0 20px var(--accent)44; }
          .t-btn-primary:hover { filter: brightness(1.15); transform: translateY(-1px); }
          .t-btn-secondary { background: rgba(255,255,255,.06); color: var(--text2); border-color: rgba(255,255,255,.1); }
          .t-btn-secondary:hover { background: rgba(255,255,255,.1); color: var(--text1); }
          .t-btn-danger { background: rgba(255,60,60,.12); color: #ff6b6b; border-color: rgba(255,60,60,.25); }
          .t-btn-danger:hover { background: rgba(255,60,60,.2); }
          .t-btn-ghost { background: transparent; color: var(--text3); border-color: rgba(255,255,255,.06); }
          .t-btn-ghost:hover { color: var(--text2); border-color: rgba(255,255,255,.15); }
          .t-btn:disabled { opacity:.3; cursor:not-allowed; transform:none !important; }
          .int-pill {
            padding: 3px 10px; border-radius: 20px;
            border: 1px solid rgba(255,255,255,.08); background: transparent;
            font-family: var(--font-mono); font-size: 9px;
            cursor: pointer; transition: all .15s; letter-spacing: 1px;
            text-transform: uppercase; color: var(--text3);
          }
          .int-pill.active {
            border-color: var(--ip-color);
            background: color-mix(in srgb, var(--ip-color) 12%, transparent);
            color: var(--ip-color);
          }
          .timer-ring-track { fill: none; stroke: rgba(255,255,255,.05); }
          .timer-ring-fill { fill: none; stroke-linecap: round; transition: stroke-dashoffset .9s cubic-bezier(.4,0,.2,1), stroke .4s; }
        `}</style>

        {/* ambient glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: running && !paused ? `radial-gradient(ellipse at 50% 0%, ${intensityColor}12 0%, transparent 65%)` : 'none',
          transition: 'background .6s',
        }} />
        {running && !paused && (
          <div style={{
            position: 'absolute', left: 0, right: 0, height: '2px', pointerEvents: 'none',
            background: `linear-gradient(90deg, transparent, ${intensityColor}22, transparent)`,
            animation: 'scanline 3s linear infinite',
          }} />
        )}

        {/* header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="card-title" style={{ margin: 0 }}>// SESSION TIMER</div>
            {running && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '2px 8px', borderRadius: 12,
                background: paused ? 'rgba(255,200,0,.08)' : `${intensityColor}12`,
                border: `1px solid ${paused ? 'rgba(255,200,0,.2)' : intensityColor + '30'}`,
              }}>
                <div style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: paused ? '#ffc800' : intensityColor,
                  boxShadow: paused ? '0 0 6px #ffc800' : `0 0 8px ${intensityColor}`,
                  animation: paused ? 'none' : 'timerPulse .8s infinite',
                }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 1.5, color: paused ? '#ffc800' : intensityColor, textTransform: 'uppercase' }}>
                  {paused ? 'PAUSED' : 'LIVE'}
                </span>
              </div>
            )}
          </div>
          {running && (
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {[
                { lvl: 'low',    color: 'var(--accent2)', label: 'LOW' },
                { lvl: 'medium', color: 'var(--accent)',  label: 'MED' },
                { lvl: 'high',   color: 'var(--accent3)', label: 'HIGH' },
              ].map(({ lvl, color, label }) => (
                <button key={lvl} className={`int-pill ${intensity === lvl ? 'active' : ''}`}
                  style={{ '--ip-color': color }} onClick={() => setIntensity(lvl)}>
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* main timer area */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, padding: '0 0 28px' }}>
          {/* SVG ring */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {(() => {
              const R = 54, C = 2 * Math.PI * R
              const progress = running ? Math.min((elapsed % 3600000) / 3600000, 1) : 0
              return (
                <svg width="128" height="128" viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r={R} className="timer-ring-track" strokeWidth="3" />
                  <circle cx="64" cy="64" r={R} className="timer-ring-fill"
                    strokeWidth="3"
                    stroke={running && !paused ? intensityColor : 'rgba(255,255,255,.15)'}
                    strokeDasharray={C} strokeDashoffset={C - progress * C}
                    transform="rotate(-90 64 64)" />
                  <text x="64" y="58" textAnchor="middle"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fill: 'var(--text3)', letterSpacing: 1 }}>
                    {!running ? 'READY' : paused ? 'PAUSED' : 'FOCUS'}
                  </text>
                  <text x="64" y="76" textAnchor="middle"
                    style={{ fontFamily: 'var(--font-code)', fontSize: '13px', fill: running ? intensityColor : 'var(--text2)', fontWeight: 700 }}>
                    {elapsedHours.toFixed(2)}h
                  </text>
                </svg>
              )
            })()}
          </div>

          {/* digits */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', textShadow: running && !paused ? `0 0 30px ${intensityColor}66` : 'none' }}>
              <span className="timer-digit" style={{ color: running && !paused ? intensityColor : 'var(--text1)' }}>
                {String(Math.floor(elapsed / 3600000)).padStart(2, '0')}
              </span>
              <span className="timer-colon" style={{ animationPlayState: running && !paused ? 'running' : 'paused' }}>:</span>
              <span className="timer-digit" style={{ color: running && !paused ? intensityColor : 'var(--text1)' }}>
                {String(Math.floor((elapsed % 3600000) / 60000)).padStart(2, '0')}
              </span>
              <span className="timer-colon" style={{ animationPlayState: running && !paused ? 'running' : 'paused' }}>:</span>
              <span className="timer-digit" style={{ color: running && !paused ? intensityColor : 'var(--text1)' }}>
                {String(Math.floor((elapsed % 60000) / 1000)).padStart(2, '0')}
              </span>
            </div>
            {running && (
              <div style={{ display: 'flex', gap: 24, marginTop: 10 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>
                  <span style={{ color: 'var(--text3)', letterSpacing: 1 }}>LAPS </span>
                  <span style={{ color: 'var(--text2)', fontWeight: 600 }}>{laps.length}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>
                  <span style={{ color: 'var(--text3)', letterSpacing: 1 }}>START </span>
                  <span style={{ color: 'var(--text2)', fontWeight: 600 }}>
                    {startTime ? new Date(startTime).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }) : '--'}
                  </span>
                </div>
                {laps.length > 0 && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>
                    <span style={{ color: 'var(--text3)', letterSpacing: 1 }}>LAST </span>
                    <span style={{ color: intensityColor, fontWeight: 600 }}>{fmtShort(laps[laps.length - 1].split)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {running && (
          <div style={{ marginBottom: 16 }}>
            <input className="form-input" placeholder="📝 بتشتغل على إيه دلوقتي؟ (اختياري)"
              value={note} onChange={e => setNote(e.target.value)} />
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {!running ? (
            <button className="t-btn t-btn-primary" onClick={startSession} style={{ minWidth: 180, justifyContent: 'center' }}>
              <span>▶</span> ابدأ الجلسة
            </button>
          ) : (
            <>
              {paused
                ? <button className="t-btn t-btn-primary" onClick={resumeSession}><span>▶</span> استكمل</button>
                : <button className="t-btn t-btn-secondary" onClick={pauseSession}><span>⏸</span> توقف مؤقتاً</button>
              }
              <button className="t-btn t-btn-secondary" onClick={addLap} disabled={paused}><span>◎</span> Lap</button>
              <button className="t-btn t-btn-danger" onClick={endSession}><span>⏹</span> أنهِ وسجل</button>
              <button className="t-btn t-btn-ghost" onClick={cancelSession}>✕</button>
            </>
          )}
        </div>

        {laps.length > 0 && (
          <div style={{ marginTop: 24, borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: 16 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)', letterSpacing: 2, marginBottom: 12, textTransform: 'uppercase' }}>
              // LAP TIMES
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 1fr', gap: '8px 20px', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
              <span style={{ color: 'var(--text3)', fontSize: 9, letterSpacing: 1 }}>#</span>
              <span style={{ color: 'var(--text3)', fontSize: 9, letterSpacing: 1 }}>SPLIT</span>
              <span style={{ color: 'var(--text3)', fontSize: 9, letterSpacing: 1 }}>TOTAL</span>
              {[...laps].reverse().map((l, idx) => (
                <>
                  <span key={`n${l.n}`} className="lap-row" style={{ color: idx === 0 ? intensityColor : 'var(--text3)', fontWeight: idx === 0 ? 700 : 400 }}>
                    {String(l.n).padStart(2, '0')}
                  </span>
                  <span key={`s${l.n}`} className="lap-row" style={{ color: idx === 0 ? intensityColor : 'var(--accent)', fontWeight: idx === 0 ? 700 : 400 }}>
                    {fmtShort(l.split)}
                  </span>
                  <span key={`t${l.n}`} className="lap-row" style={{ color: 'var(--text2)' }}>
                    {fmtShort(l.total)}
                  </span>
                </>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── weekly hours chart + roadmap ── */}
      <div className="grid-2">
        <div className="card">
          <div className="card-title">// WEEKLY HOURS</div>
          <div className="mini-chart">
            {weekly.map((w, i) => (
              <div key={i} className="chart-bar" style={{ height: `${(w.hours / maxHrs) * 100}%` }}
                title={`${days[new Date(w.date).getDay()]}: ${w.hours}h`} />
            ))}
          </div>
          <div className="chart-labels">
            {weekly.map((w, i) => <div key={i} className="chart-label">{days[new Date(w.date).getDay()]}</div>)}
          </div>
        </div>

        <div className="card">
          <div className="card-title">// ROADMAP PROGRESS</div>
          <div style={{ marginTop: 8 }}>
            <div className="flex-between mb-8">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text2)' }}>Overall</span>
              <span style={{ fontFamily: 'var(--font-code)', fontSize: 13, color: 'var(--accent)' }}>{Math.round((roadmapDone / 25) * 100)}%</span>
            </div>
            <div className="progress-bar"><div className="progress-fill green" style={{ width: `${Math.round((roadmapDone / 25) * 100)}%` }} /></div>
          </div>
          {ROADMAP_PHASES.map((p, i) => {
            const colors = ['green', 'purple', 'yellow', 'blue', 'red']
            return (
              <div key={p.phase} style={{ marginTop: 12 }}>
                <div className="flex-between mb-8">
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)' }}>Phase {p.phase}</span>
                </div>
                <div className="progress-bar"><div className={`progress-fill ${colors[i]}`} style={{ width: '0%' }} /></div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── heatmap ── */}
      <div className="card">
        <div className="card-title">// ACTIVITY HEATMAP (90 DAYS)</div>
        <div className="heatmap">
          {heatmap.map((h, i) => {
            const lvl = h.hours === 0 ? '' : h.hours < 1 ? 'l1' : h.hours < 2 ? 'l2' : h.hours < 3 ? 'l3' : 'l4'
            return <div key={i} className={`heat-cell ${lvl}`} title={`${h.date}: ${h.hours}h`} />
          })}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text3)' }}>Less</span>
          {['', 'l1', 'l2', 'l3', 'l4'].map(l => <div key={l} className={`heat-cell ${l}`} style={{ width: 10, height: 10 }} />)}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text3)' }}>More</span>
        </div>
      </div>

      {/* ── recent sessions ── */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-title">// RECENT SESSIONS</div>
        {recentSessions.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">⏱</div>لا توجد جلسات بعد — ابدأ الجلسة الأولى!</div>
        ) : (
          recentSessions.map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text2)' }}>{s.note || 'جلسة دراسة'}</span>
              <div style={{ display: 'flex', gap: 16 }}>
                <span style={{ fontFamily: 'var(--font-code)', fontSize: 12, color: 'var(--accent)' }}>{s.hours}h</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)' }}>{s.date}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
