// src/pages/Dashboard.jsx
// ─────────────────────────────────────────────────────────────────────────────
// الـ Dashboard دلوقتي مسؤول بس عن:
//   1. جلب الـ stats من الـ API
//   2. عرض الـ stats cards والـ charts
//   3. تمرير callbacks للـ SessionTimer
//
// كل state وlogic الـ timer راحوا في:
//   src/hooks/useTimer.js
//   src/components/SessionTimer.jsx
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback, memo } from 'react'
import api from '../api'
import SessionTimer from '../components/SessionTimer'

// ── Constants ─────────────────────────────────────────────────────────────────
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

const PHASE_COLORS = ['green', 'purple', 'yellow', 'blue', 'red']
const DAYS         = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

// ── Sub-components — memo: بيـ re-render بس لو props بتاعتهم اتغيروا ─────────

const StatCard = memo(function StatCard({ color, value, label }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
})

const WeeklyChart = memo(function WeeklyChart({ weekly }) {
  const maxHrs = Math.max(...weekly.map(w => w.hours), 1)
  return (
    <div className="card">
      <div className="card-title">// WEEKLY HOURS</div>
      <div className="mini-chart">
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

const RoadmapProgress = memo(function RoadmapProgress({ roadmapDone }) {
  const overallPct = Math.round((roadmapDone / 22) * 100)
  return (
    <div className="card">
      <div className="card-title">// ROADMAP PROGRESS</div>
      <div style={{ marginTop:8 }}>
        <div className="flex-between mb-8">
          <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text2)' }}>Overall</span>
          <span style={{ fontFamily:'var(--font-code)', fontSize:13, color:'var(--accent)' }}>{overallPct}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill green" style={{ width:`${overallPct}%` }} />
        </div>
      </div>
      {ROADMAP_PHASES.map((p, i) => (
        <div key={p.phase} style={{ marginTop:12 }}>
          <div className="flex-between mb-8">
            <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text3)' }}>Phase {p.phase}</span>
          </div>
          <div className="progress-bar">
            <div className={`progress-fill ${PHASE_COLORS[i]}`} style={{ width:'0%' }} />
          </div>
        </div>
      ))}
    </div>
  )
})

const ActivityHeatmap = memo(function ActivityHeatmap({ heatmap }) {
  return (
    <div className="card">
      <div className="card-title">// ACTIVITY HEATMAP (90 DAYS)</div>
      <div className="heatmap">
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

const RecentSessions = memo(function RecentSessions({ sessions }) {
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
          <div key={i} style={{
            display:'flex', justifyContent:'space-between',
            padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.04)',
          }}>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text2)' }}>
              {s.note || 'جلسة دراسة'}
            </span>
            <div style={{ display:'flex', gap:16 }}>
              <span style={{ fontFamily:'var(--font-code)', fontSize:12, color:'var(--accent)' }}>{s.hours}h</span>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text3)' }}>{s.date}</span>
            </div>
          </div>
        ))
      )}
    </div>
  )
})

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

  // لما جلسة تتحفظ في SessionTimer، الـ Dashboard يعمل reload للـ stats فقط
  const handleSessionSaved = useCallback(() => {
    loadStats()
  }, [loadStats])

  const tip = MENTOR_TIPS[new Date().getDay() % MENTOR_TIPS.length]

  if (loading) return <div className="loading">جاري التحميل...</div>

  const {
    totalHours     = 0,
    totalAudits    = 0,
    totalVulns     = 0,
    streak         = 0,
    weekly         = [],
    heatmap        = [],
    recentSessions = [],
    roadmapDone    = 0,
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

      {/* Stats — بيـ re-render بس لو stats اتغيرت (بعد حفظ جلسة) */}
      <div className="grid-4">
        <StatCard color="green"  value={`${totalHours.toFixed(1)}h`} label="TOTAL HOURS"       />
        <StatCard color="purple" value={totalAudits}                  label="CONTRACTS AUDITED" />
        <StatCard color="yellow" value={totalVulns}                   label="VULNS LEARNED"     />
        <StatCard color="red"    value={`🔥${streak}`}               label="DAY STREAK"        />
      </div>

      {/* Timer — معزول تماماً، بيـ re-render لوحده كل 200ms */}
      <SessionTimer notify={notify} onSessionSaved={handleSessionSaved} />

      {/* Charts — memo: بيتـ skip إذا weekly/roadmapDone مش اتغيروا */}
      <div className="grid-2">
        <WeeklyChart     weekly={weekly}           />
        <RoadmapProgress roadmapDone={roadmapDone} />
      </div>

      <ActivityHeatmap heatmap={heatmap} />

      <RecentSessions sessions={recentSessions} />

    </div>
  )
}