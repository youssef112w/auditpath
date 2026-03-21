// src/pages/Dashboard.jsx
import { useState, useEffect, useCallback, memo } from 'react'
import api from '../api'
import SessionTimer from '../components/SessionTimer'

const MENTOR_TIPS = [
  'ابدأ كل يوم بفتح الـ Dashboard وتسجيل بداية الجلسة. الـ <strong>Timer</strong> هو أول حاجة بتعملها قبل أي كود.',
  'بعد كل عقد بتحلله، <strong>سجله في الـ Audit Lab فورًا</strong>. حتى لو لقيت 0 ثغرات، التوثيق هو السلاح الأقوى.',
  'الـ <strong>Vulnerability Encyclopedia</strong> دي كنزك الشخصي. كل ثغرة بتتعلمها حطها بكودها وطريقة استغلالها.',
  'الـ <strong>Streak</strong> مش بس رقم. كل يوم بتكسره بيكلفك 3 أيام للرجوع لنفس الزخم.',
  'اكتب في الـ <strong>Research Journal</strong> حتى لو مش عارف. سؤال بدون إجابة هو بداية أي بحث حقيقي.',
]

// الـ phases مع عدد tasks كل phase — لازم يتطابق مع الـ backend
const ROADMAP_PHASES = [
  { phase: 1, label: 'Phase 1', tasks: 5,  color: 'green'  },
  { phase: 2, label: 'Phase 2', tasks: 5,  color: 'purple' },
  { phase: 3, label: 'Phase 3', tasks: 5,  color: 'yellow' },
  { phase: 4, label: 'Phase 4', tasks: 5,  color: 'blue'   },
  { phase: 5, label: 'Phase 5', tasks: 4,  color: 'red'    },
]
const TOTAL_TASKS = ROADMAP_PHASES.reduce((s, p) => s + p.tasks, 0) // 24

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

// ── Helpers ───────────────────────────────────────────────────────────────────
// بيحسب كل phase عملت فيها كام task — بيستخدم roadmapByPhase من الـ API
// لو الـ API مش بيبعت roadmapByPhase، بيوزع roadmapDone على الـ phases بالترتيب
function calcPhases(roadmapDone, roadmapByPhase) {
  if (roadmapByPhase && Object.keys(roadmapByPhase).length > 0) {
    return ROADMAP_PHASES.map(p => ({
      ...p,
      done: roadmapByPhase[p.phase] || 0,
      pct:  Math.round(((roadmapByPhase[p.phase] || 0) / p.tasks) * 100),
    }))
  }
  // fallback: وزّع الـ done على الـ phases بالترتيب
  let remaining = roadmapDone
  return ROADMAP_PHASES.map(p => {
    const done = Math.min(remaining, p.tasks)
    remaining -= done
    return { ...p, done, pct: Math.round((done / p.tasks) * 100) }
  })
}

// ── Sub-components ────────────────────────────────────────────────────────────

const StatCard = memo(function StatCard({ color, value, label, sub }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div style={{ fontSize:9, color:'var(--text3)', marginTop:4, fontFamily:'var(--font-mono)' }}>{sub}</div>}
    </div>
  )
})

const WeeklyChart = memo(function WeeklyChart({ weekly }) {
  const maxHrs = Math.max(...weekly.map(w => w.hours), 1)
  const total  = weekly.reduce((s, w) => s + w.hours, 0)
  return (
    <div className="card">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div className="card-title" style={{ margin:0 }}>// WEEKLY HOURS</div>
        <span style={{ fontFamily:'var(--font-code)', fontSize:12, color:'var(--accent)' }}>
          {total.toFixed(1)}h
        </span>
      </div>
      <div className="mini-chart" style={{ marginTop:16 }}>
        {weekly.map((w, i) => (
          <div
            key={i}
            className="chart-bar"
            style={{ height:`${(w.hours / maxHrs) * 100}%` }}
            title={`${DAYS[new Date(w.date).getDay()]}: ${w.hours}h`}
          />
        ))}
      </div>
      <div className="chart-labels">
        {weekly.map((w, i) => (
          <div key={i} className="chart-label">{DAYS[new Date(w.date).getDay()]}</div>
        ))}
      </div>
    </div>
  )
})

const RoadmapProgress = memo(function RoadmapProgress({ roadmapDone, roadmapByPhase }) {
  const phases     = calcPhases(roadmapDone, roadmapByPhase)
  const overallPct = Math.round((roadmapDone / TOTAL_TASKS) * 100)

  return (
    <div className="card">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div className="card-title" style={{ margin:0 }}>// ROADMAP PROGRESS</div>
        <span style={{ fontFamily:'var(--font-code)', fontSize:12, color:'var(--accent)' }}>
          {roadmapDone}/{TOTAL_TASKS}
        </span>
      </div>

      {/* Overall */}
      <div style={{ marginTop:16 }}>
        <div className="flex-between mb-8">
          <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text2)' }}>Overall</span>
          <span style={{ fontFamily:'var(--font-code)', fontSize:12, color:'var(--accent)' }}>{overallPct}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill green" style={{ width:`${overallPct}%` }} />
        </div>
      </div>

      {/* Per phase */}
      {phases.map(p => (
        <div key={p.phase} style={{ marginTop:10 }}>
          <div className="flex-between mb-8">
            <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text3)' }}>
              {p.label}
            </span>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text3)' }}>
              {p.done}/{p.tasks}
            </span>
          </div>
          <div className="progress-bar">
            <div className={`progress-fill ${p.color}`} style={{ width:`${p.pct}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
})

const ActivityHeatmap = memo(function ActivityHeatmap({ heatmap }) {
  const totalDays   = heatmap.filter(h => h.hours > 0).length
  const totalHrsHm  = heatmap.reduce((s, h) => s + h.hours, 0)
  return (
    <div className="card">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div className="card-title" style={{ margin:0 }}>// ACTIVITY HEATMAP (90 DAYS)</div>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text3)' }}>
          {totalDays} days · {totalHrsHm.toFixed(0)}h
        </span>
      </div>
      <div className="heatmap" style={{ marginTop:12 }}>
        {heatmap.map((h, i) => {
          const lvl = h.hours === 0 ? '' : h.hours < 1 ? 'l1' : h.hours < 2 ? 'l2' : h.hours < 3 ? 'l3' : 'l4'
          return <div key={i} className={`heat-cell ${lvl}`} title={`${h.date}: ${h.hours}h`} />
        })}
      </div>
      <div style={{ display:'flex', gap:8, marginTop:8, alignItems:'center' }}>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text3)' }}>Less</span>
        {['','l1','l2','l3','l4'].map(l => (
          <div key={l} className={`heat-cell ${l}`} style={{ width:10, height:10 }} />
        ))}
        <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text3)' }}>More</span>
      </div>
    </div>
  )
})

// ── RecentSessions — مع زرار حذف ─────────────────────────────────────────────
function RecentSessions({ sessions, onDelete }) {
  const [deletingId, setDeletingId] = useState(null)

  const handleDelete = async (id) => {
    if (!id) return
    setDeletingId(id)
    try {
      await api.delete(`/sessions/${id}`)
      onDelete()
    } catch (e) {
      console.error('Delete failed:', e)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="card" style={{ marginTop:16 }}>
      <div className="card-title">// RECENT SESSIONS</div>
      {sessions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⏱</div>
          لا توجد جلسات بعد — ابدأ الجلسة الأولى!
        </div>
      ) : (
        sessions.map((s, i) => (
          <div key={s.id || i} style={{
            display:'flex', justifyContent:'space-between', alignItems:'center',
            padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.04)',
          }}>
            {/* Note */}
            <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text2)', flex:1, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {s.note || 'جلسة دراسة'}
            </span>

            {/* Info + delete */}
            <div style={{ display:'flex', gap:12, alignItems:'center', flexShrink:0, marginLeft:12 }}>
              <span style={{ fontFamily:'var(--font-code)', fontSize:12, color: s.hours < 0.1 ? '#ff6b6b' : 'var(--accent)' }}>
                {s.hours}h
              </span>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text3)' }}>
                {s.date}
              </span>
              {/* زرار الحذف — بيظهر بس لو في id */}
              {s.id && (
                <button
                  onClick={() => handleDelete(s.id)}
                  disabled={deletingId === s.id}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,60,60,.2)',
                    borderRadius: 6,
                    color: '#ff6b6b',
                    cursor: 'pointer',
                    fontSize: 10,
                    padding: '2px 8px',
                    fontFamily: 'var(--font-mono)',
                    opacity: deletingId === s.id ? 0.4 : 0.6,
                    transition: 'opacity .2s',
                  }}
                  onMouseEnter={e => e.target.style.opacity = '1'}
                  onMouseLeave={e => e.target.style.opacity = deletingId === s.id ? '0.4' : '0.6'}
                >
                  {deletingId === s.id ? '...' : '✕'}
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard({ notify, onStreakChange }) {
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  const loadStats = useCallback(async () => {
    try {
      const res = await api.get('/stats')
      setStats(res.data)
      onStreakChange(res.data.streak)
    } catch (e) {
      console.error('Failed to load stats:', e)
    } finally {
      setLoading(false)
    }
  }, [onStreakChange])

  useEffect(() => { loadStats() }, [loadStats])

  const handleSessionSaved = useCallback(() => loadStats(), [loadStats])
  const handleSessionDeleted = useCallback(() => loadStats(), [loadStats])

  const tip = MENTOR_TIPS[new Date().getDay() % MENTOR_TIPS.length]

  if (loading) return <div className="loading">جاري التحميل...</div>

  const {
    totalHours      = 0,
    totalAudits     = 0,
    totalVulns      = 0,
    streak          = 0,
    longest         = 0,
    weekly          = [],
    heatmap         = [],
    recentSessions  = [],
    roadmapDone     = 0,
    roadmapByPhase  = {},
  } = stats || {}

  return (
    <div>

      {/* Header */}
      <div className="page-header">
        <div className="page-title">الـ <span>Dashboard</span></div>
        <div className="page-sub">
          // أداتك اليومية — {new Date().toLocaleDateString('ar-EG', {
            weekday:'long', year:'numeric', month:'long', day:'numeric',
          })}
        </div>
      </div>

      {/* Mentor tip */}
      <div className="mentor-card">
        <div className="mentor-title">🎓 نصيحة الـ Mentor اليوم</div>
        <div className="mentor-tip" dangerouslySetInnerHTML={{ __html: tip }} />
      </div>

      {/* Stats */}
      <div className="grid-4">
        <StatCard color="green"  value={`${totalHours.toFixed(1)}h`} label="TOTAL HOURS"       />
        <StatCard color="purple" value={totalAudits}                  label="CONTRACTS AUDITED" />
        <StatCard color="yellow" value={totalVulns}                   label="VULNS LEARNED"     />
        <StatCard color="red"    value={`🔥${streak}`}               label="DAY STREAK"        sub={longest > streak ? `longest: ${longest}` : null} />
      </div>

      {/* Timer */}
      <SessionTimer notify={notify} onSessionSaved={handleSessionSaved} />

      {/* Charts */}
      <div className="grid-2">
        <WeeklyChart     weekly={weekly} />
        <RoadmapProgress roadmapDone={roadmapDone} roadmapByPhase={roadmapByPhase} />
      </div>

      <ActivityHeatmap heatmap={heatmap} />

      {/* Recent sessions مع حذف */}
      <RecentSessions sessions={recentSessions} onDelete={handleSessionDeleted} />

    </div>
  )
}