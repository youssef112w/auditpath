// src/pages/Roadmap.jsx
// 🎯 Smart Contract Security Auditor Roadmap — Redesigned
// Target: Competitive International Smart Contract Auditor by March 2027

import { useState, useEffect } from 'react'
import api from '../api'

// ─── PHASES DATA ─────────────────────────────────────────────────────────────

const PHASES = [
  {
    id: 1,
    code: 'P1',
    title: 'Foundations',
    subtitle: 'Blockchain · Solidity · Foundry',
    status: 'done',
    startDate: 'Mar 23, 2025',
    endDate: 'Mar 31, 2026',
    color: '#22c55e',
    icon: '✓',
    milestone: 'Solidity + Foundry Fundamentals على Cyfrin',
    tasks: [
      { text: 'Blockchain & Ethereum basics', done: true },
      { text: 'EVM architecture & opcodes', done: true },
      { text: 'Solidity core: syntax, mappings, modifiers, events', done: true },
      { text: 'ERC20 / ERC721 token standards', done: true },
      { text: 'Foundry Fundamentals — forge, cast, anvil, FundMe', done: true },
    ],
  },
  {
    id: 2,
    code: 'P2',
    title: 'Cyfrin Security Course',
    subtitle: 'The most important phase',
    status: 'active',
    startDate: 'Apr 4, 2026',
    endDate: 'Jun 14, 2026',
    color: '#f97316',
    icon: '⚡',
    milestone: 'اكتب أول Audit Report حقيقي من الكورس',
    note: 'ده القلب — كل حاجة تانية بتيجي بعده. Patrick Collins صمم الكورس ده بعد سنين auditing حقيقية.',
    tasks: [
      {
        text: 'Section 1 — Introduction to Smart Contract Auditing',
        days: 4,
        resource: 'https://updraft.cyfrin.io/courses/security',
        tip: 'افهم الـ Auditing Methodology الأول: Recon → Vulnerability ID → Reporting. هتستخدمها كل يوم.',
        deliverable: 'notes/s1-intro.md — methodology + mindset',
        criteria: 'تشرح الفرق بين security review و pen test',
      },
      {
        text: 'Section 2 — Tooling: Slither, Aderyn, Foundry fuzzing',
        days: 5,
        resource: 'https://updraft.cyfrin.io/courses/security',
        tip: 'شغّل Slither على كود حقيقي من أول يوم — متستناش تخلص الـ section.',
        deliverable: 'tool-cheatsheet.md — commands + use cases',
        criteria: 'تفرق بين true/false positive في Slither',
      },
      {
        text: 'Section 3 — First Audit: PasswordStore protocol',
        days: 7,
        resource: 'https://updraft.cyfrin.io/courses/security',
        tip: 'Audit صغير — المهم تكتب report احترافي بيه Severity + PoC + Fix لكل finding.',
        deliverable: 'audit-reports/passwordstore-audit.md',
        criteria: 'Report فيه على الأقل 3 findings بـ format كامل',
      },
      {
        text: 'Section 4 — Deeper Auditing: Puppy Raffle (reentrancy + more)',
        days: 10,
        resource: 'https://updraft.cyfrin.io/courses/security',
        tip: 'Puppy Raffle فيها reentrancy + mishandled ETH + weak randomness. أهم section في الكورس.',
        deliverable: 'audit-reports/puppyraffle-audit.md',
        criteria: 'تلاقي Reentrancy بنفسك قبل ما تشوف الـ solution',
      },
      {
        text: 'Section 5 — TSwap Protocol (DeFi + Price Manipulation)',
        days: 10,
        resource: 'https://updraft.cyfrin.io/courses/security',
        tip: 'أول مرة تتعامل مع AMM وprice oracle manipulation. DeFi bugs = أكبر خسائر في Web3.',
        deliverable: 'audit-reports/tswap-audit.md',
        criteria: 'تشرح x*y=k وكيف ممكن يتاستغل',
      },
      {
        text: 'Section 6 — Thunder Loan (Flash Loans + ERC-4626)',
        days: 10,
        resource: 'https://updraft.cyfrin.io/courses/security',
        tip: 'Flash loans مش هجوم — هي feature. لما تفهم إزاي بيشتغلوا هتشوف الـ attack vectors.',
        deliverable: 'audit-reports/thunderloan-audit.md',
        criteria: 'تكتب PoC لـ flash loan attack يشتغل في forge test',
      },
      {
        text: 'Section 7 — Boss Level: Bridge & Governance Attacks',
        days: 14,
        resource: 'https://updraft.cyfrin.io/courses/security',
        tip: 'Cross-chain bridges خسرت مليارات. هتتعلم ليه.',
        deliverable: 'audit-reports/bridge-audit.md',
        criteria: 'تشرح ليه Bridge protocols أخطر من Simple DeFi',
      },
    ],
  },
  {
    id: 3,
    code: 'P3',
    title: 'CTF + First Flights',
    subtitle: 'Practice → Real Audits',
    status: 'upcoming',
    startDate: 'Jun 15, 2026',
    endDate: 'Aug 31, 2026',
    color: '#3b82f6',
    icon: '🎯',
    milestone: 'أول Valid Finding في CodeHawks First Flight',
    note: 'الفرق بين من يدرس ومن يتدرب. هنا بتتحول من Student لـ Auditor.',
    tasks: [
      {
        text: 'Ethernaut CTF — Level 1 → 20',
        days: 14,
        resource: 'https://ethernaut.openzeppelin.com/',
        tip: 'متبصش على solution إلا بعد ساعة محاولة. الألم ده هو التعلم.',
        deliverable: '20 write-ups في writeups/ folder على GitHub',
        criteria: 'تحل Reentrancy + King + Elevator بدون hints',
      },
      {
        text: 'Damn Vulnerable DeFi — First 8 Challenges',
        days: 12,
        resource: 'https://www.damnvulnerabledefi.xyz/',
        tip: 'أصعب من Ethernaut بكتير. Level 1 (Unstoppable) بيعلمك Flash Loans.',
        deliverable: '8 solutions + write-ups بالعربي',
        criteria: 'تحل Unstoppable + Naive Receiver بدون solution',
      },
      {
        text: 'CodeHawks First Flight #1 — Audit + Report',
        days: 10,
        resource: 'https://www.codehawks.com/first-flights',
        tip: 'اختار First Flight قديم عنده results — قيس نفسك على الـ official findings.',
        deliverable: 'audit-reports/first-flight-1.md + gap-analysis.md',
        criteria: 'Finding واحد صح على الأقل مش false positive',
      },
      {
        text: 'CodeHawks First Flight #2 + Gap Analysis',
        days: 10,
        resource: 'https://www.codehawks.com/first-flights',
        tip: 'لكل finding فاتك: اسأل "ليه فاتني؟" — ده أهم سؤال في المرحلة دي.',
        deliverable: 'audit-reports/first-flight-2.md + patterns.md',
        criteria: 'تحدد 3 أنواع ثغرات ما بتشوفهاش وليه',
      },
      {
        text: 'Deep DeFi: Uniswap V2 + Oracle Manipulation',
        days: 12,
        resource: 'https://www.rareskills.io/uniswap-v2-book',
        tip: 'Beanstalk + Mango Markets + Euler Finance — كل واحدة درس مختلف.',
        deliverable: 'defi-deep-dive.md — AMM mechanics + 3 real attack analyses',
        criteria: 'تشرح كل حادثة في 5 دقايق بدون ورق',
      },
    ],
  },
  {
    id: 4,
    code: 'P4',
    title: 'Compete & Get Hired',
    subtitle: 'Portfolio → Income → Career',
    status: 'upcoming',
    startDate: 'Sep 1, 2026',
    endDate: 'Mar 2027',
    color: '#a855f7',
    icon: '🏆',
    milestone: 'أول Remote Job Offer أو $500 من bug bounty',
    note: 'مش هتكسب من أول contest — ده طبيعي. كل finding valid هو إنجاز وخطوة للهدف.',
    tasks: [
      {
        text: 'Competitive Audit على CodeHawks',
        days: 21,
        resource: 'https://www.codehawks.com/',
        tip: 'اختار contests بـ codebase صغير. افهم Business Logic الأول قبل ما تدور على ثغرات.',
        deliverable: 'Findings submitted في أول contest حقيقي',
        criteria: 'Finding واحد على الأقل submitted',
      },
      {
        text: 'Sherlock + Code4rena Contests',
        days: 30,
        resource: 'https://www.sherlock.xyz/',
        tip: 'Sherlock بيديك escalation feedback على findings — أفضل بكتير للتعلم.',
        deliverable: 'شارك في 3 contests مختلفين',
        criteria: 'تكتب post-mortem لكل contest تحلل فيه أداءك',
      },
      {
        text: 'Immunefi Bug Bounties',
        days: 30,
        resource: 'https://immunefi.com/',
        tip: 'ابدأ بالـ protocols الصغيرة — low/medium scope. حتى low severity مهمة للـ portfolio.',
        deliverable: 'Report واحد مبعوت على Immunefi',
        criteria: 'أي valid submission — مش شرط مقبول',
      },
      {
        text: 'GitHub Audit Portfolio — CV بتاعك في Web3',
        days: 7,
        resource: 'https://github.com/',
        tip: 'الـ portfolio أهم من الـ CV في Web3. لازم يبين تفكيرك مش بس الكود.',
        deliverable: 'audit-portfolio repo واضح: CTF solutions + audit reports + write-ups',
        criteria: 'أي junior auditor يشوف الـ repo يفهم مستواك',
      },
      {
        text: 'Apply: Spearbit + Trail of Bits + Cyfrin + Sherlock',
        days: 14,
        resource: 'https://spearbit.com/',
        tip: 'Remote positions دي. الـ GitHub portfolio هو الـ application — مش الـ CV.',
        deliverable: '5 applications + follow-up على X/Twitter',
        criteria: 'رد إيجابي واحد أو interview',
      },
    ],
  },
]

const RESOURCES = [
  { label: 'Cyfrin Security Course', url: 'https://updraft.cyfrin.io/courses/security', tag: 'Priority' },
  { label: 'Cyfrin Foundry Course', url: 'https://updraft.cyfrin.io/courses/foundry', tag: 'Done' },
  { label: 'Ethernaut CTF', url: 'https://ethernaut.openzeppelin.com', tag: 'Practice' },
  { label: 'Damn Vulnerable DeFi', url: 'https://www.damnvulnerabledefi.xyz', tag: 'Practice' },
  { label: 'CodeHawks', url: 'https://www.codehawks.com', tag: 'Compete' },
  { label: 'Sherlock', url: 'https://www.sherlock.xyz', tag: 'Compete' },
  { label: 'Code4rena', url: 'https://code4rena.com', tag: 'Compete' },
  { label: 'Immunefi', url: 'https://immunefi.com', tag: 'Compete' },
  { label: 'RareSkills Blog', url: 'https://www.rareskills.io', tag: 'Learn' },
  { label: 'SWC Registry', url: 'https://swcregistry.io', tag: 'Reference' },
  { label: 'OpenZeppelin Contracts', url: 'https://github.com/OpenZeppelin/openzeppelin-contracts', tag: 'Reference' },
  { label: 'Solodit (Past Findings)', url: 'https://solodit.xyz', tag: 'Reference' },
  { label: 'Foundry Book', url: 'https://book.getfoundry.sh', tag: 'Docs' },
]

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function daysUntil(dateStr) {
  const months = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 }
  const parts = dateStr.replace(',','').split(' ')
  if (parts.length < 3) return null
  const [month, day, year] = parts
  const target = new Date(+year, months[month], +day)
  const diff = Math.ceil((target - new Date()) / 86400000)
  if (diff < 0)  return { label: `${Math.abs(diff)}d overdue`, color: '#ef4444' }
  if (diff === 0) return { label: 'Due today!', color: '#f59e0b' }
  if (diff <= 14) return { label: `${diff}d left`, color: '#f59e0b' }
  return { label: `${diff}d left`, color: '#6b7280' }
}

const STATUS_CFG = {
  done:     { label: 'Done',     bg: '#14532d22', border: '#22c55e40', color: '#22c55e' },
  active:   { label: 'Active',   bg: '#7c2d1222', border: '#f9731640', color: '#f97316' },
  upcoming: { label: 'Upcoming', bg: 'var(--color-background-secondary)', border: 'var(--color-border-tertiary)', color: 'var(--color-text-tertiary)' },
}

const TAG_COLOR = {
  Priority:  { bg: '#7c2d1222', border: '#f9731640', text: '#f97316' },
  Done:      { bg: '#14532d22', border: '#22c55e40', text: '#22c55e' },
  Practice:  { bg: '#1e1b4b22', border: '#818cf840', text: '#818cf8' },
  Compete:   { bg: '#4c1d9522', border: '#a855f740', text: '#a855f7' },
  Reference: { bg: 'var(--color-background-secondary)', border: 'var(--color-border-tertiary)', text: 'var(--color-text-secondary)' },
  Learn:     { bg: '#0c2a2a', border: '#2dd4bf40', text: '#2dd4bf' },
  Docs:      { bg: 'var(--color-background-secondary)', border: 'var(--color-border-tertiary)', text: 'var(--color-text-tertiary)' },
}

// ─── TASK ROW ─────────────────────────────────────────────────────────────────

function TaskRow({ task, isDone, onToggle, accent, locked }) {
  const [open, setOpen] = useState(false)
  const hasDetails = task.tip || task.deliverable || task.criteria || task.resource

  return (
    <div style={{ marginBottom: 6 }}>
      {/* main row */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: '9px 10px', borderRadius: 8,
        background: open ? 'var(--color-background-secondary)' : 'transparent',
        border: `0.5px solid ${open ? accent + '30' : 'transparent'}`,
        transition: 'all .15s',
      }}>
        {/* checkbox */}
        <button
          disabled={locked}
          onClick={locked ? undefined : onToggle}
          style={{
            width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
            border: isDone ? 'none' : `1.5px solid ${locked ? 'var(--color-border-secondary)' : accent + '80'}`,
            background: isDone ? accent : 'transparent',
            cursor: locked ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 0,
          }}
        >
          {isDone && <span style={{ color: '#000', fontSize: 11, fontWeight: 700 }}>✓</span>}
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13, lineHeight: 1.4,
            color: isDone ? 'var(--color-text-tertiary)' : locked ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
            textDecoration: isDone ? 'line-through' : 'none',
          }}>
            {task.text}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap', alignItems: 'center' }}>
            {task.days > 0 && (
              <span style={{
                fontSize: 10, padding: '1px 6px', borderRadius: 99,
                background: 'var(--color-background-secondary)',
                border: '0.5px solid var(--color-border-tertiary)',
                color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)',
              }}>~{task.days}d</span>
            )}
            {hasDetails && !locked && (
              <button
                onClick={() => setOpen(o => !o)}
                style={{
                  fontSize: 10, padding: '1px 7px', borderRadius: 99,
                  border: `0.5px solid ${accent}55`, background: 'transparent',
                  color: accent, cursor: 'pointer', outline: 'none',
                }}
              >
                {open ? 'close ▲' : 'guide ▼'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* expandable details */}
      {open && !locked && (
        <div style={{
          margin: '2px 0 4px 28px',
          background: 'var(--color-background-secondary)',
          border: `0.5px solid ${accent}25`,
          borderLeft: `2px solid ${accent}`,
          borderRadius: '0 8px 8px 0',
          padding: '12px 14px',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          {task.tip && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#f59e0b', letterSpacing: '.04em', marginBottom: 3 }}>TIP</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{task.tip}</div>
            </div>
          )}
          {task.deliverable && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: accent, letterSpacing: '.04em', marginBottom: 3 }}>DELIVERABLE</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.7, fontFamily: 'var(--font-mono)' }}>{task.deliverable}</div>
            </div>
          )}
          {task.criteria && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#22c55e', letterSpacing: '.04em', marginBottom: 3 }}>DONE WHEN</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{task.criteria}</div>
            </div>
          )}
          {task.resource && (
            <a href={task.resource} target="_blank" rel="noreferrer"
              style={{ fontSize: 11, color: accent, textDecoration: 'none', fontFamily: 'var(--font-mono)' }}>
              → {task.resource}
            </a>
          )}
        </div>
      )}
    </div>
  )
}

// ─── PHASE CARD ───────────────────────────────────────────────────────────────

function PhaseCard({ phase, roadmap, onToggle }) {
  const [open, setOpen] = useState(phase.status === 'active')
  const st = STATUS_CFG[phase.status]
  const locked = phase.status === 'upcoming'

  const doneTasks = phase.tasks.filter((_, i) =>
    phase.status === 'done' || roadmap[`${phase.id}_${i}`]
  ).length
  const pct = Math.round((doneTasks / phase.tasks.length) * 100)
  const deadline = phase.endDate && phase.status !== 'done' ? daysUntil(phase.endDate) : null

  return (
    <div style={{
      background: 'var(--color-background-primary)',
      border: `0.5px solid ${phase.status === 'active' ? phase.color + '60' : 'var(--color-border-tertiary)'}`,
      borderRadius: 12, overflow: 'hidden', marginBottom: 10,
      opacity: locked ? 0.75 : 1,
      transition: 'opacity .2s',
    }}>
      {/* accent bar */}
      <div style={{ height: 3, background: phase.color, opacity: locked ? 0.3 : 1 }} />

      {/* header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
      >
        {/* phase icon */}
        <div style={{
          width: 38, height: 38, borderRadius: 9, flexShrink: 0,
          background: locked ? 'var(--color-background-secondary)' : phase.color + '15',
          border: `1px solid ${locked ? 'var(--color-border-tertiary)' : phase.color + '40'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: phase.status === 'done' ? 16 : 12,
          color: locked ? 'var(--color-text-tertiary)' : phase.color,
          fontWeight: 600,
        }}>
          {phase.status === 'done' ? '✓' : phase.id}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: locked ? 'var(--color-text-secondary)' : 'var(--color-text-primary)' }}>
              {phase.title}
            </span>
            <span style={{
              fontSize: 10, padding: '1px 8px', borderRadius: 99,
              background: st.bg, border: `0.5px solid ${st.border}`, color: st.color,
              fontWeight: 500, letterSpacing: '.03em',
            }}>
              {st.label}
            </span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
            {phase.subtitle}
            {deadline && (
              <span style={{ marginLeft: 10, color: deadline.color }}>{deadline.label}</span>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0, marginRight: 6 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: pct === 100 ? '#22c55e' : phase.color, fontFamily: 'var(--font-mono)' }}>
            {pct}%
          </div>
          <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
            {doneTasks}/{phase.tasks.length}
          </div>
        </div>
        <div style={{ color: 'var(--color-text-tertiary)', fontSize: 10 }}>{open ? '▲' : '▼'}</div>
      </div>

      {/* progress bar */}
      <div style={{ height: 2, background: 'var(--color-background-secondary)', margin: '0 18px' }}>
        <div style={{
          height: '100%', width: `${pct}%`, background: phase.color,
          borderRadius: 99, transition: 'width .5s ease',
        }} />
      </div>

      {/* body */}
      {open && (
        <div style={{ padding: '16px 18px' }}>

          {/* milestone */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            background: phase.color + '10',
            border: `0.5px solid ${phase.color}30`,
            borderRadius: 8, padding: '10px 12px', marginBottom: 14,
          }}>
            <div style={{ fontSize: 11, color: phase.color, flexShrink: 0, marginTop: 1 }}>🏁</div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: phase.color, letterSpacing: '.04em', marginBottom: 2 }}>MILESTONE</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{phase.milestone}</div>
            </div>
          </div>

          {/* note */}
          {phase.note && (
            <div style={{
              fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.7,
              marginBottom: 12, paddingRight: 12,
              borderRight: `2px solid ${phase.color}50`,
            }}>
              {phase.note}
            </div>
          )}

          {/* tasks */}
          {phase.tasks.map((task, i) => (
            <TaskRow
              key={i}
              task={task}
              isDone={phase.status === 'done' || !!roadmap[`${phase.id}_${i}`]}
              onToggle={() => onToggle(phase.id, i)}
              accent={phase.color}
              locked={locked}
            />
          ))}

          {/* footer */}
          <div style={{
            marginTop: 14, paddingTop: 10,
            borderTop: '0.5px solid var(--color-border-tertiary)',
            fontSize: 10, color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)',
          }}>
            {phase.startDate} → {phase.endDate}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function Roadmap({ notify }) {
  const [roadmap, setRoadmap] = useState({})
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('roadmap')

  useEffect(() => {
    api.get('/roadmap')
      .then(r => { setRoadmap(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const toggle = async (phaseId, idx) => {
    const key = `${phaseId}_${idx}`
    try {
      await api.post('/roadmap/toggle', { key })
      const next = !roadmap[key]
      setRoadmap(prev => ({ ...prev, [key]: next }))
      notify?.(next ? '✓ Done!' : 'Unmarked')
    } catch { notify?.('Save error') }
  }

  const totalAll = PHASES.reduce((a, p) => a + p.tasks.length, 0)
  const totalDone = PHASES.reduce((a, p) => {
    if (p.status === 'done') return a + p.tasks.length
    return a + p.tasks.filter((_, i) => roadmap[`${p.id}_${i}`]).length
  }, 0)
  const overallPct = Math.round((totalDone / totalAll) * 100)

  // find active phase for "current focus"
  const activePhase = PHASES.find(p => p.status === 'active')
  const activeNextTask = activePhase?.tasks.find((t, i) =>
    activePhase.status !== 'done' && !roadmap[`${activePhase.id}_${i}`]
  )

  if (loading) return (
    <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: 13 }}>
      Loading roadmap...
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title">Security Auditor <span>Roadmap</span></div>
        <div className="page-sub">// Apr 2026 → Mar 2027 · Solidity ✓ · Foundry ✓ · Next: Cyfrin Security</div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 2, marginBottom: 20, padding: 3,
        background: 'var(--color-background-secondary)',
        border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: 10,
      }}>
        {[{ id: 'roadmap', label: 'Roadmap' }, { id: 'resources', label: 'Resources' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: '7px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: tab === t.id ? 'var(--color-background-primary)' : 'transparent',
            color: tab === t.id ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
            fontSize: 13, fontWeight: tab === t.id ? 500 : 400,
            transition: 'all .15s',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'roadmap' && (
        <>
          {/* Overall progress card */}
          <div style={{
            background: 'var(--color-background-secondary)',
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: 12, padding: '14px 18px', marginBottom: 10,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'flex-end' }}>
              <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Overall Progress</span>
              <span style={{ fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                {overallPct}%
              </span>
            </div>
            <div style={{ background: 'var(--color-border-tertiary)', borderRadius: 99, height: 6, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${overallPct}%`,
                background: 'linear-gradient(90deg, #22c55e 0%, #f97316 50%, #a855f7 100%)',
                borderRadius: 99, transition: 'width .6s ease',
              }} />
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
              {PHASES.map(p => {
                const done = p.status === 'done'
                  ? p.tasks.length
                  : p.tasks.filter((_, i) => roadmap[`${p.id}_${i}`]).length
                const pct = Math.round((done / p.tasks.length) * 100)
                return (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: pct === 100 ? '#22c55e' : pct > 0 ? p.color : 'var(--color-border-secondary)',
                    }} />
                    <span style={{ fontSize: 10, color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                      {p.code} {pct}%
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Current focus callout */}
          {activePhase && activeNextTask && (
            <div style={{
              background: activePhase.color + '08',
              border: `0.5px solid ${activePhase.color}40`,
              borderRadius: 10, padding: '12px 16px', marginBottom: 14,
              display: 'flex', gap: 10, alignItems: 'flex-start',
            }}>
              <div style={{ fontSize: 14, flexShrink: 0 }}>⚡</div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: activePhase.color, letterSpacing: '.04em', marginBottom: 3 }}>NEXT UP</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-primary)', fontWeight: 500 }}>{activeNextTask.text}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 2 }}>{activePhase.title} · {activePhase.code}</div>
              </div>
            </div>
          )}

          {PHASES.map(p => (
            <PhaseCard key={p.id} phase={p} roadmap={roadmap} onToggle={toggle} />
          ))}
        </>
      )}

      {tab === 'resources' && (
        <div style={{
          background: 'var(--color-background-primary)',
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: 12, overflow: 'hidden',
        }}>
          {RESOURCES.map((r, i) => {
            const tc = TAG_COLOR[r.tag] || TAG_COLOR.Docs
            return (
              <a key={r.url} href={r.url} target="_blank" rel="noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 18px', textDecoration: 'none',
                  borderBottom: i < RESOURCES.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none',
                  transition: 'background .12s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-background-secondary)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: 13, color: 'var(--color-text-primary)' }}>{r.label}</span>
                <span style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 99,
                  background: tc.bg, border: `0.5px solid ${tc.border}`, color: tc.text,
                  fontWeight: 500,
                }}>
                  {r.tag}
                </span>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
