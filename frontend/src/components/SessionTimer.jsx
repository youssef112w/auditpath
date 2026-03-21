// src/components/SessionTimer.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Component معزول للـ Timer
// بيـ re-render كل 200ms بسبب الـ tick — لكن بدل ما الـ Dashboard كله يتـ re-render
// دلوقتي بس الـ Timer هو اللي بيتأثر
// ─────────────────────────────────────────────────────────────────────────────
import { memo } from 'react'
import { useTimer, fmt, fmtShort } from '../hooks/useTimer'

// ── CSS string — خارج الـ component عشان ميتـ recreate-ش في كل render ──────
const TIMER_CSS = `
  @keyframes timerPulse { 0%,100%{opacity:.5} 50%{opacity:1} }
  @keyframes scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(400%);  }
  }
  @keyframes lapSlide {
    from { opacity:0; transform:translateX(-12px); }
    to   { opacity:1; transform:translateX(0);     }
  }
  .lap-row { animation: lapSlide .25s cubic-bezier(.2,.8,.3,1); }
  .timer-digit {
    font-family: var(--font-code);
    font-size: clamp(48px, 7vw, 80px);
    font-weight: 800;
    letter-spacing: 2px;
    transition: color .4s, text-shadow .4s;
    line-height: 1;
  }
  .timer-colon {
    font-family: var(--font-code);
    font-size: clamp(36px, 5vw, 60px);
    font-weight: 300;
    opacity: .25;
    margin: 0 4px;
    animation: timerPulse 1s infinite;
    line-height: 1;
  }
  .t-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 10px 20px; border-radius: 8px;
    font-family: var(--font-mono); font-size: 11px;
    font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;
    cursor: pointer; transition: all .2s; border: 1px solid transparent;
    white-space: nowrap;
  }
  .t-btn-primary  { background: var(--accent); color: #000; box-shadow: 0 0 20px var(--accent)44; }
  .t-btn-primary:hover { filter: brightness(1.15); transform: translateY(-1px); }
  .t-btn-secondary { background: rgba(255,255,255,.06); color: var(--text2); border-color: rgba(255,255,255,.1); }
  .t-btn-secondary:hover { background: rgba(255,255,255,.1); color: var(--text1); }
  .t-btn-danger { background: rgba(255,60,60,.12); color: #ff6b6b; border-color: rgba(255,60,60,.25); }
  .t-btn-danger:hover { background: rgba(255,60,60,.2); }
  .t-btn-ghost { background: transparent; color: var(--text3); border-color: rgba(255,255,255,.06); }
  .t-btn-ghost:hover { color: var(--text2); border-color: rgba(255,255,255,.15); }
  .t-btn:disabled { opacity: .3; cursor: not-allowed; transform: none !important; }
  .int-pill {
    padding: 3px 10px; border-radius: 20px;
    border: 1px solid rgba(255,255,255,.08);
    background: transparent;
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
  .timer-ring-fill  {
    fill: none; stroke-linecap: round;
    transition: stroke-dashoffset .9s cubic-bezier(.4,0,.2,1), stroke .4s;
  }
`

// ── TimerRing — SVG progress ring ────────────────────────────────────────────
// memo: بيـ re-render بس لو elapsed أو running أو intensityColor اتغيروا
const TimerRing = memo(function TimerRing({ elapsed, running, paused, intensityColor, elapsedHours }) {
  const R        = 54
  const C        = 2 * Math.PI * R
  const progress = running ? Math.min((elapsed % 3600000) / 3600000, 1) : 0

  return (
    <svg width="128" height="128" viewBox="0 0 128 128">
      <circle cx="64" cy="64" r={R} className="timer-ring-track" strokeWidth="3" />
      <circle
        cx="64" cy="64" r={R}
        className="timer-ring-fill"
        strokeWidth="3"
        stroke={running && !paused ? intensityColor : 'rgba(255,255,255,.15)'}
        strokeDasharray={C}
        strokeDashoffset={C - progress * C}
        transform="rotate(-90 64 64)"
      />
      <text x="64" y="58" textAnchor="middle"
        style={{ fontFamily:'var(--font-mono)', fontSize:'10px', fill:'var(--text3)', letterSpacing:1 }}>
        {!running ? 'READY' : paused ? 'PAUSED' : 'FOCUS'}
      </text>
      <text x="64" y="76" textAnchor="middle"
        style={{ fontFamily:'var(--font-code)', fontSize:'13px', fill: running ? intensityColor : 'var(--text2)', fontWeight:700 }}>
        {elapsedHours.toFixed(2)}h
      </text>
    </svg>
  )
})

// ── LapsTable ────────────────────────────────────────────────────────────────
const LapsTable = memo(function LapsTable({ laps, intensityColor }) {
  if (laps.length === 0) return null
  return (
    <div style={{ marginTop:24, borderTop:'1px solid rgba(255,255,255,.06)', paddingTop:16 }}>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text3)',
        letterSpacing:2, marginBottom:12, textTransform:'uppercase' }}>
        // LAP TIMES
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'36px 1fr 1fr', gap:'8px 20px',
        fontFamily:'var(--font-mono)', fontSize:11 }}>
        <span style={{ color:'var(--text3)', fontSize:9, letterSpacing:1 }}>#</span>
        <span style={{ color:'var(--text3)', fontSize:9, letterSpacing:1 }}>SPLIT</span>
        <span style={{ color:'var(--text3)', fontSize:9, letterSpacing:1 }}>TOTAL</span>
        {[...laps].reverse().map((l, idx) => (
          <>
            <span key={`n${l.n}`} className="lap-row"
              style={{ color: idx===0 ? intensityColor : 'var(--text3)', fontWeight: idx===0 ? 700 : 400 }}>
              {String(l.n).padStart(2,'0')}
            </span>
            <span key={`s${l.n}`} className="lap-row"
              style={{ color: idx===0 ? intensityColor : 'var(--accent)', fontWeight: idx===0 ? 700 : 400 }}>
              {fmtShort(l.split)}
            </span>
            <span key={`t${l.n}`} className="lap-row" style={{ color:'var(--text2)' }}>
              {fmtShort(l.total)}
            </span>
          </>
        ))}
      </div>
    </div>
  )
})

// ── Main SessionTimer component ───────────────────────────────────────────────
export default function SessionTimer({ notify, onSessionSaved }) {
  const {
    running, paused, elapsed, startTime, note, laps, intensity,
    elapsedHours, intensityColor,
    setNote, setIntensity,
    startSession, pauseSession, resumeSession, addLap, endSession, cancelSession,
  } = useTimer({ notify, onSessionSaved })

  return (
    <div className="timer-card" style={{ position:'relative', overflow:'hidden' }}>

      {/* CSS injected once — string is constant, لمش بيتغير مع كل render */}
      <style>{TIMER_CSS}</style>

      {/* Ambient glow */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        background: running && !paused
          ? `radial-gradient(ellipse at 50% 0%, ${intensityColor}12 0%, transparent 65%)`
          : 'none',
        transition: 'background .6s',
      }} />

      {/* Scanline */}
      {running && !paused && (
        <div style={{
          position:'absolute', left:0, right:0, height:'2px', pointerEvents:'none',
          background: `linear-gradient(90deg, transparent, ${intensityColor}22, transparent)`,
          animation: 'scanline 3s linear infinite',
        }} />
      )}

      {/* ── Header ── */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, position:'relative' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div className="card-title" style={{ margin:0 }}>// SESSION TIMER</div>

          {/* Live / Paused badge */}
          {running && (
            <div style={{
              display:'flex', alignItems:'center', gap:5,
              padding:'2px 8px', borderRadius:12,
              background: paused ? 'rgba(255,200,0,.08)' : `${intensityColor}12`,
              border: `1px solid ${paused ? 'rgba(255,200,0,.2)' : intensityColor + '30'}`,
            }}>
              <div style={{
                width:5, height:5, borderRadius:'50%',
                background: paused ? '#ffc800' : intensityColor,
                boxShadow: paused ? '0 0 6px #ffc800' : `0 0 8px ${intensityColor}`,
                animation: paused ? 'none' : 'timerPulse .8s infinite',
              }} />
              <span style={{
                fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:1.5,
                color: paused ? '#ffc800' : intensityColor, textTransform:'uppercase',
              }}>
                {paused ? 'PAUSED' : 'LIVE'}
              </span>
            </div>
          )}
        </div>

        {/* Intensity pills */}
        {running && (
          <div style={{ display:'flex', gap:4, alignItems:'center' }}>
            {[
              { lvl:'low',    color:'var(--accent2)', label:'LOW'  },
              { lvl:'medium', color:'var(--accent)',  label:'MED'  },
              { lvl:'high',   color:'var(--accent3)', label:'HIGH' },
            ].map(({ lvl, color, label }) => (
              <button
                key={lvl}
                className={`int-pill ${intensity === lvl ? 'active' : ''}`}
                style={{ '--ip-color': color }}
                onClick={() => setIntensity(lvl)}
              >{label}</button>
            ))}
          </div>
        )}
      </div>

      {/* ── Timer body ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:40, padding:'0 0 28px' }}>

        <div style={{ position:'relative', flexShrink:0 }}>
          <TimerRing
            elapsed={elapsed}
            running={running}
            paused={paused}
            intensityColor={intensityColor}
            elapsedHours={elapsedHours}
          />
        </div>

        {/* Digits */}
        <div>
          <div style={{
            display:'flex', alignItems:'center',
            textShadow: running && !paused ? `0 0 30px ${intensityColor}66` : 'none',
          }}>
            {[
              Math.floor(elapsed / 3600000),
              Math.floor((elapsed % 3600000) / 60000),
              Math.floor((elapsed % 60000) / 1000),
            ].map((val, i) => (
              <>
                {i > 0 && (
                  <span key={`colon-${i}`} className="timer-colon"
                    style={{ animationPlayState: running && !paused ? 'running' : 'paused' }}>
                    :
                  </span>
                )}
                <span key={`digit-${i}`} className="timer-digit"
                  style={{ color: running && !paused ? intensityColor : 'var(--text1)' }}>
                  {String(val).padStart(2,'0')}
                </span>
              </>
            ))}
          </div>

          {/* Mini stats row */}
          {running && (
            <div style={{ display:'flex', gap:24, marginTop:10 }}>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:10 }}>
                <span style={{ color:'var(--text3)', letterSpacing:1 }}>LAPS </span>
                <span style={{ color:'var(--text2)', fontWeight:600 }}>{laps.length}</span>
              </div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:10 }}>
                <span style={{ color:'var(--text3)', letterSpacing:1 }}>START </span>
                <span style={{ color:'var(--text2)', fontWeight:600 }}>
                  {startTime
                    ? new Date(startTime).toLocaleTimeString('en', { hour:'2-digit', minute:'2-digit' })
                    : '--'}
                </span>
              </div>
              {laps.length > 0 && (
                <div style={{ fontFamily:'var(--font-mono)', fontSize:10 }}>
                  <span style={{ color:'var(--text3)', letterSpacing:1 }}>LAST </span>
                  <span style={{ color: intensityColor, fontWeight:600 }}>
                    {fmtShort(laps[laps.length - 1].split)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Note input ── */}
      {running && (
        <div style={{ marginBottom:16 }}>
          <input
            className="form-input"
            placeholder="📝 بتشتغل على إيه دلوقتي؟ (اختياري)"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div>
      )}

      {/* ── Action buttons ── */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center' }}>
        {!running ? (
          <button className="t-btn t-btn-primary" onClick={startSession}
            style={{ minWidth:180, justifyContent:'center' }}>
            <span>▶</span> ابدأ الجلسة
          </button>
        ) : (
          <>
            {paused ? (
              <button className="t-btn t-btn-primary" onClick={resumeSession}>
                <span>▶</span> استكمل
              </button>
            ) : (
              <button className="t-btn t-btn-secondary" onClick={pauseSession}>
                <span>⏸</span> توقف مؤقتاً
              </button>
            )}
            <button className="t-btn t-btn-secondary" onClick={addLap} disabled={paused}>
              <span>◎</span> Lap
            </button>
            <button className="t-btn t-btn-danger" onClick={endSession}>
              <span>⏹</span> أنهِ وسجل
            </button>
            <button className="t-btn t-btn-ghost" onClick={cancelSession}>✕</button>
          </>
        )}
      </div>

      {/* ── Laps table ── */}
      <LapsTable laps={laps} intensityColor={intensityColor} />

    </div>
  )
}