// src/pages/Roadmap.jsx
// 🎯 Smart Contract Security Auditor Roadmap
// ✅ Done: Solidity + Foundry Fundamentals (Cyfrin)
// 📍 Now: Phase 2 — Security Course (skip Advanced Foundry for now)
// 🗓 Target: March 2027

import { useState, useEffect } from 'react'
import api from '../api'

// ─── DATA ────────────────────────────────────────────────────────────────────

const PHASES = [
  {
    id: 1,
    title: 'Foundations',
    status: 'done',
    startDate: 'Mar 23, 2025',
    endDate:   'Mar 31, 2026',
    durationWeeks: null,
    color: '#22c55e',
    note: 'أنت خلصت الـ phase ده كامل. Solidity + Foundry Fundamentals على Cyfrin — أساس ممتاز.',
    tasks: [
      { text: 'Blockchain & Ethereum basics', done: true, days: 0 },
      { text: 'EVM architecture & opcodes', done: true, days: 0 },
      { text: 'Solidity: syntax, mappings, modifiers, events', done: true, days: 0 },
      { text: 'ERC20 / ERC721 token standards', done: true, days: 0 },
      { text: 'Foundry Fundamentals (Cyfrin) — forge, cast, anvil, FundMe deploy', done: true, days: 0 },
    ],
  },
  {
    id: 2,
    title: 'Write Code & Break It',
    status: 'active',
    startDate: 'Apr 4, 2026',
    endDate:   'May 12, 2026',
    durationWeeks: 5.5,
    color: '#f97316',
    decisionNote: `❓ سؤالك: Advanced Foundry كورس ولا Security Course على طول؟

✅ الإجابة: Security Course على طول — والسبب بسيط:
  • Advanced Foundry (fuzz/invariant) مش هيفيدك من غير context الـ security
  • Cyfrin Security Course نفسه جواه Foundry advanced testing بشكل طبيعي
  • Security بيديك الهدف — Foundry Advanced بيديك الأدوات اللي مش عارف هتستخدمها فين لو جيت قبله`,
    note: 'كل يوم لازم يطلع منه كود على GitHub. مش هتبقى auditor كويس لو ماكتبتش كود كتير.',
    tasks: [
      {
        text: 'Advanced Solidity: inheritance, interfaces, libraries',
        days: 4,
        resource: 'https://solidity-by-example.org/',
        tip: 'اكتب نظام فيه BaseContract و ChildContract. abstract contract vs interface — فهم الفرق مهم في الـ audit.',
        howToStudy: `① solidity-by-example.org/interface — كود بس، مش محتاج إنجليزي كتير
② اكتب الكود بإيدك وغير فيه عشان تفهمه
③ Claude: "اشرح الفرق بين interface و abstract contract بالعربي"`,
        deliverable: 'System فيه 3 contracts بيتكلموا مع بعض عن طريق interfaces',
        criteria: 'تكتب ERC20 من الصفر بس interfaces — بدون OpenZeppelin',
      },
      {
        text: 'SimpleBank — اكتبه، ادمره، اصلحه',
        days: 4,
        resource: 'https://book.getfoundry.sh/forge/tests',
        tip: 'اكتب SimpleBank.sol فيه deposit, withdraw, getBalance. بعدين 10 tests. بعدين دور أنت على الثغرات فيه.',
        howToStudy: `① اكتب SimpleBank بدماغك من غير ما تشوف أي مثال
② لو وقفت: Claude "اكتبلي SimpleBank.sol فيه deposit و withdraw"
③ بعد ما تكتبه: Claude "إيه الثغرات الممكنة في الكود ده؟"
④ اكتب test لكل ثغرة لاقيتها`,
        deliverable: 'SimpleBank.sol + SimpleBank.t.sol — على الأقل 10 tests',
        criteria: 'Tests بتغطي: deposit, withdraw, overspend, zero amount, unauthorized access',
      },
      {
        text: 'Reentrancy Attack — اكتبها واتهجم بيها',
        days: 5,
        resource: 'https://swcregistry.io/docs/SWC-107',
        tip: 'الـ DAO hack 2016 خسّر $60M بسببها. لازم تكتبها بإيدك مش تقرأ عنها بس.',
        howToStudy: `① Claude: "اشرح ثغرة Reentrancy بالعربي مع مثال كود"
② بعد ما تفهم — اكتب VulnerableBank.sol من غير ما تبص على الشرح
③ اكتب AttackBank.sol يهاجمه
④ forge test يثبت إن الهجوم شغال
⑤ اكتب SafeBank.sol بالـ fix + test إن الهجوم بطل`,
        deliverable: 'VulnerableBank.sol + AttackBank.sol + SafeBank.sol + Test.t.sol',
        criteria: 'الـ test يثبت الفرق بين Vulnerable و Safe بشكل واضح',
      },
      {
        text: 'Access Control + Integer Overflow',
        days: 3,
        resource: 'https://swcregistry.io/docs/SWC-105',
        tip: 'Access Control هي أكتر نوع ثغرة في الـ contests. Integer overflow مهم في كود pre-0.8.',
        howToStudy: `① Claude: "اشرح Access Control vulnerability بالعربي"
② Claude: "اشرح Integer Overflow في Solidity قبل 0.8 بالعربي"
③ اكتب الثغرتين + الـ fix + tests`,
        deliverable: 'عقد فيه 2 ثغرات متعمدين + عقد المهاجم + عقد آمن + tests',
        criteria: 'تشرح: ليه الثغرة موجودة، ليه خطيرة، إيه الـ fix',
      },
      {
        text: 'OpenZeppelin source code — اقرا، ماتقراش الدوكيومنتيشن',
        days: 4,
        resource: 'https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts',
        tip: 'الفرق بين junior و senior auditor: الـ junior بيقرا الدوكيومنتيشن، الـ senior بيقرا الكود.',
        howToStudy: `① افتح ReentrancyGuard.sol على GitHub
② كل سطر مش فاهمه: Claude "اشرح السطر ده بالعربي"
③ اكتب ملاحظاتك في notes.md بالعربي`,
        deliverable: 'notes.md — تحليل Ownable.sol + ReentrancyGuard.sol + Pausable.sol',
        criteria: 'تعرف تشرح ليه nonReentrant modifier بيستخدم uint بدل bool',
      },
      {
        text: 'Gas Optimization — افهم مش تحفظ',
        days: 3,
        resource: 'https://www.rareskills.io/post/gas-optimization',
        tip: 'SSTORE vs MSTORE, storage packing. افهم ليه كل optimization شغالة.',
        howToStudy: `① rareskills.io — إنجليزي بسيط، جرب تقراه أول
② لو جملة مش فاهمها: Claude "ترجم وشرح"
③ طبق كل optimization على SimpleBank بتاعك وقيس الفرق`,
        deliverable: 'SimpleBank محسّن + forge snapshot قبل وبعد',
        criteria: 'تشغل forge snapshot وتعرف تقرا النتيجة',
      },
    ],
  },
  {
    id: 3,
    title: 'Auditing Skills',
    status: 'upcoming',
    startDate: 'May 13, 2026',
    endDate:   'Jun 16, 2026',
    durationWeeks: 5,
    color: '#eab308',
    note: 'دلوقتي بتبدأ تفكر زي الـ auditor. Cyfrin Security Course هو أهم حاجة في الـ phase دي — خليه أولوية.',
    tasks: [
      {
        text: 'Cyfrin Security & Auditing Course — الأهم في الـ roadmap',
        days: 14,
        resource: 'https://updraft.cyfrin.io/courses/security',
        tip: 'Patrick Collins عمل الكورس ده بعد سنين من الـ auditing. أفضل مصدر مجاني في الـ security.',
        howToStudy: `① كل درس: شاهد 5 دقايق بدون توقف عشان تاخد فكرة
② ارجع للأول وشاهد بالتفصيل — pause بعد كل concept
③ Claude: "اشرح [الموضوع] بالعربي مع مثال كود"
④ المعدل: درسين يومياً = خلاص في أسبوعين`,
        deliverable: 'الكورس كامل + notes لكل section + audit report للـ protocol في الكورس',
        criteria: 'تكتب audit report كامل للـ protocol اللي في الكورس',
      },
      {
        text: 'Slither static analysis',
        days: 3,
        resource: 'https://github.com/crytic/slither',
        tip: 'الـ auditor الشاطر بيفهم نتايج Slither ومش بيكتفي بيها.',
        howToStudy: `① Claude: "ازاي أثبت Slither على [نظامك]؟"
② شغّل على كل العقود اللي كتبتها
③ كل warning: Claude "إيه المقصود بده؟"
④ قرر: true positive ولا false positive؟`,
        deliverable: 'slither-report.md على كل عقد كتبته',
        criteria: 'تفرق بين true positive و false positive',
      },
      {
        text: 'Ethernaut CTF — Level 1 → 15',
        days: 8,
        resource: 'https://ethernaut.openzeppelin.com/',
        tip: 'متبصش على الـ solution إلا بعد ما تحاول ساعة على الأقل. الألم ده هو التعلم.',
        howToStudy: `① كل level: Claude "ترجم وشرح المطلوب في Level [X]"
② حاول من غير hints لمدة ساعة
③ لو وقفت: Claude "ديني hint بدون solution كامل"
④ اكتب write-up بالعربي لكل level`,
        deliverable: '15 write-up: الثغرة + الاستغلال + الـ fix',
        criteria: 'تحل Level 10 (Reentrancy) و Level 11 (Elevator) بدون hints',
      },
      {
        text: 'Audit Report Writing — اكتب report محترف',
        days: 4,
        resource: 'https://docs.codehawks.com/hawks-auditors/how-to-write-and-submit-a-finding',
        tip: 'الـ audit report مش قائمة bugs — ده وثيقة تقنية. لازم فيه: Description, Impact, PoC, Recommendation.',
        howToStudy: `① Claude: "إيه الـ template الاحترافي لكتابة audit finding؟"
② اكتب template واطبقه على finding من Ethernaut
③ Claude: "راجع الـ finding ده وقولي إيه الناقص"`,
        deliverable: 'Template جاهز لكل finding + طبّقه على 3 vulnerabilities',
        criteria: 'كل finding فيه: severity, description, impact, PoC, fix',
      },
      {
        text: 'قرا أول Audit Report حقيقي',
        days: 4,
        resource: 'https://github.com/trailofbits/publications/tree/master/reviews',
        tip: 'مش هتفهم كل حاجة من أول مرة وده طبيعي. المهم تفهم format التقرير.',
        howToStudy: `① ابدأ بـ CodeHawks First Flight report — أسهل من Trail of Bits
② كل finding: Claude "اشرح الـ finding ده بالعربي"
③ اكتبه بكلامك في report-analysis.md`,
        deliverable: 'report-analysis.md — كل finding مع تحليلك',
        criteria: 'تشرح ليه finding اتصنف Critical مش Medium',
      },
    ],
  },
  {
    id: 4,
    title: 'First Real Audit',
    status: 'upcoming',
    startDate: 'Jun 17, 2026',
    endDate:   'Jul 16, 2026',
    durationWeeks: 4.5,
    color: '#3b82f6',
    note: 'أول audit على كود مش كتبته أنت. الـ auditor الجيد بيصرف 80% من وقته يفهم الكود و20% بيدور على ثغرات.',
    tasks: [
      {
        text: 'CodeHawks First Flights — أول 2 audits',
        days: 10,
        resource: 'https://www.codehawks.com/first-flights',
        tip: 'اختار First Flight قديم عنده results معلنة — عشان تقدر تقيس نفسك.',
        howToStudy: `① اختار Flight صغير — تحت 500 سطر كود
② Claude: "اشرح الـ protocol ده بالعربي"
③ اقرا كل function وسأل نفسك: مين ممكن يستغلها؟
④ اكتب findings في report format ثم قارن بـ official results`,
        deliverable: 'audit-report-1.md + gap-analysis.md',
        criteria: 'Finding واحد صح على الأقل مش false positive',
      },
      {
        text: 'Gap Analysis — الـ findings اللي فاتتك أهم',
        days: 3,
        resource: 'https://www.codehawks.com/first-flights',
        tip: 'كل finding فاتك: اسأل نفسك "ليه؟" مش بس "إيه؟"',
        howToStudy: `① خد كل finding في الـ official report مش لقيته
② Claude: "اشرح الـ finding ده بالعربي — ليه صعب تشوفه؟"
③ اكتب: "فاتني لأن..." لكل finding`,
        deliverable: 'gap-analysis.md: كل finding فاتك + سبب فواته',
        criteria: 'تحدد 3 أنواع ثغرات مش بتلاقيها وتعرف ليه',
      },
      {
        text: 'Damn Vulnerable DeFi — أول 5 challenges',
        days: 5,
        resource: 'https://www.damnvulnerabledefi.xyz/',
        tip: 'أصعب بكتير من Ethernaut. Level 1 (Unstoppable) بيعلمك flash loans.',
        howToStudy: `① Claude: "اشرح Damn Vulnerable DeFi Level 1 بالعربي"
② ساعة ونص محاولة بدون hints
③ لو وقفت: Claude "hint بدون solution كامل"
④ write-up بالعربي بعد كل challenge`,
        deliverable: '5 solutions + write-ups',
        criteria: 'تحل Unstoppable + Naive Receiver بدون solution',
      },
      {
        text: 'DeFi Deep Dive: Uniswap V2 AMM mechanics',
        days: 5,
        resource: 'https://www.rareskills.io/uniswap-v2-book',
        tip: 'لما تفهم x*y=k هتبدأ تشوف attack vectors في كل AMM.',
        howToStudy: `① rareskills.io/uniswap-v2-book — Chapter 1 → 4
② Claude: "اشرح x*y=k بمثال أرقام بالعربي"
③ اكتب شرحك بالعربي — لو قدرت تشرحه تبقى فهمته`,
        deliverable: 'defi-notes.md — AMM mechanics + أشهر attack vectors',
        criteria: 'تشرح price slippage وكيف ممكن يتاستغل',
      },
      {
        text: 'Oracle Manipulation + Flash Loan Attacks — 3 حوادث',
        days: 4,
        resource: 'https://blog.openzeppelin.com/oracle-manipulation-attacks',
        tip: 'Beanstalk, Mango Markets, Euler Finance — كل واحدة فيها درس مختلف.',
        howToStudy: `① Claude: "اشرح Beanstalk hack بالعربي"
② نفس الشيء لـ Mango Markets و Euler Finance
③ اكتب: الثغرة + الاستغلال + الخسارة + الـ fix`,
        deliverable: 'defi-attacks.md — تحليل 3 حوادث حقيقية',
        criteria: 'تشرح كل حادثة في 5 دقايق لحد تاني',
      },
    ],
  },
  {
    id: 5,
    title: 'Compete & Build Reputation',
    status: 'upcoming',
    startDate: 'Jul 17, 2026',
    endDate:   'Mar 2027',
    durationWeeks: null,
    color: '#a855f7',
    note: 'مش هتكسب من أول contest — ده طبيعي. الهدف إنك تشارك وتتعلم. كل finding valid هو إنجاز حقيقي.',
    tasks: [
      {
        text: 'Competitive Audit على CodeHawks',
        days: 14,
        resource: 'https://www.codehawks.com/',
        tip: 'اختار contest الـ codebase بتاعه صغير — تحت 500 سطر. افهم الـ business logic الأول.',
        howToStudy: `① اقرا الـ README الأول
② شغّل Slither — افهم النتايج
③ بعدين دور على logic bugs مش syntax issues`,
        deliverable: 'Findings submitted في contest حقيقي',
        criteria: 'Finding واحد على الأقل submitted',
      },
      {
        text: 'GitHub Portfolio — CV بتاعك في الـ web3',
        days: 5,
        resource: 'https://github.com/',
        tip: 'الـ portfolio هو أهم حاجة في أي application. لازم يبين تفكيرك مش بس الكود.',
        howToStudy: `① audit-portfolio repo — كل العقود + الـ reports + الـ CTF solutions
② كل project: README بيشرح الـ vulnerability والـ fix
③ Claude: "ساعدني أكتب README لـ smart contract auditor مبتدئ"`,
        deliverable: 'audit-portfolio repo واضح ومنظم على GitHub',
        criteria: 'الـ README بيشرح مستواك بوضوح',
      },
      {
        text: 'Immunefi Bug Bounties',
        days: 20,
        resource: 'https://immunefi.com/',
        tip: 'ابدأ بالـ protocols الصغيرة. حتى الـ low severity مهمة للـ portfolio.',
        howToStudy: `① ابحث عن bounties بـ low/medium scope
② Claude: "ترجم وشرح الـ scope ده"
③ نفس methodology الـ audit — افهم الكود الأول`,
        deliverable: 'Report واحد مبعوت على Immunefi',
        criteria: 'أي report مبعوت — مش شرط مقبول',
      },
      {
        text: 'Apply للـ Junior Auditor positions',
        days: 14,
        resource: 'https://www.codehawks.com/',
        tip: 'Trail of Bits, Sherlock, Spearbit, Code4rena كلهم بيقبلوا remotes. بحلول مارس 2027 عندك portfolio قوي.',
        howToStudy: `① Claude: "ساعدني أكتب cover letter لـ smart contract auditor junior position"
② الـ GitHub Portfolio هو أهم حاجة في الـ application
③ Twitter/X presence بيفتح أبواب كتير`,
        deliverable: '5 applications مبعوتة',
        criteria: 'رد إيجابي واحد على الأقل',
      },
    ],
  },
]

const RESOURCES = [
  { label: 'Cyfrin Security Course',  url: 'https://updraft.cyfrin.io/courses/security',                                       tag: 'Priority' },
  { label: 'Cyfrin Foundry Course',   url: 'https://updraft.cyfrin.io/courses/foundry',                                        tag: 'Done'     },
  { label: 'Ethernaut CTF',           url: 'https://ethernaut.openzeppelin.com',                                               tag: 'Practice' },
  { label: 'Damn Vulnerable DeFi',    url: 'https://www.damnvulnerabledefi.xyz',                                               tag: 'Practice' },
  { label: 'CodeHawks',               url: 'https://www.codehawks.com',                                                        tag: 'Compete'  },
  { label: 'Immunefi',                url: 'https://immunefi.com',                                                             tag: 'Compete'  },
  { label: 'SWC Registry',            url: 'https://swcregistry.io',                                                           tag: 'Reference'},
  { label: 'OpenZeppelin Contracts',  url: 'https://github.com/OpenZeppelin/openzeppelin-contracts',                           tag: 'Reference'},
  { label: 'Solidity by Example',     url: 'https://solidity-by-example.org',                                                  tag: 'Learn'    },
  { label: 'RareSkills Blog',         url: 'https://www.rareskills.io',                                                        tag: 'Learn'    },
  { label: 'Foundry Book',            url: 'https://book.getfoundry.sh',                                                       tag: 'Docs'     },
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
  if (diff === 0) return { label: 'Due today!',                 color: '#f59e0b' }
  if (diff <= 7)  return { label: `${diff}d left`,              color: '#f59e0b' }
  return              { label: `${diff}d left`,              color: '#6b7280'  }
}

const STATUS_STYLE = {
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
  Learn:     { bg: '#0c2a2a',   border: '#2dd4bf40', text: '#2dd4bf' },
  Docs:      { bg: 'var(--color-background-secondary)', border: 'var(--color-border-tertiary)', text: 'var(--color-text-tertiary)' },
}

// ─── TASK ROW ─────────────────────────────────────────────────────────────────

function TaskRow({ task, isDone, onToggle, accent, locked }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ marginBottom: 3 }}>
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: '9px 10px', borderRadius: 8,
        background: open ? 'var(--color-background-secondary)' : 'transparent',
        transition: 'background .12s',
      }}>
        {/* checkbox */}
        <button
          onClick={locked ? undefined : onToggle}
          style={{
            width: 16, height: 16, borderRadius: 4, flexShrink: 0, marginTop: 1,
            border: `1.5px solid ${isDone ? accent : 'var(--color-border-secondary)'}`,
            background: isDone ? accent : 'transparent',
            cursor: locked ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 0, outline: 'none',
          }}
        >
          {isDone && (
            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
              <path d="M1 3.5L3.5 6L8 1" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            onClick={locked ? undefined : () => task.resource && setOpen(o => !o)}
            style={{
              fontSize: 13, lineHeight: 1.5,
              cursor: locked || !task.resource ? 'default' : 'pointer',
              color: isDone ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
              textDecoration: isDone ? 'line-through' : 'none',
            }}
          >
            {task.text}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap', alignItems: 'center' }}>
            {task.days > 0 && (
              <span style={{
                fontSize: 11, padding: '1px 7px', borderRadius: 99,
                background: 'var(--color-background-secondary)',
                border: '0.5px solid var(--color-border-tertiary)',
                color: 'var(--color-text-tertiary)',
                fontFamily: 'var(--font-mono)',
              }}>
                {task.days}d
              </span>
            )}
            {task.resource && !locked && (
              <button
                onClick={() => setOpen(o => !o)}
                style={{
                  fontSize: 11, padding: '1px 7px', borderRadius: 99,
                  border: `0.5px solid ${accent}55`, background: 'transparent',
                  color: accent, cursor: 'pointer', outline: 'none',
                }}
              >
                {open ? 'hide ▲' : 'details ▼'}
              </button>
            )}
          </div>
        </div>
      </div>

      {open && !locked && (
        <div style={{
          margin: '2px 0 8px 26px',
          background: 'var(--color-background-secondary)',
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: 10, padding: '12px 14px',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          {task.tip && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, color: '#f59e0b', marginBottom: 3 }}>Tip</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{task.tip}</div>
            </div>
          )}
          {task.howToStudy && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, color: accent, marginBottom: 3 }}>How to study</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.9, whiteSpace: 'pre-line' }}>{task.howToStudy}</div>
            </div>
          )}
          {task.deliverable && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 3 }}>Deliverable</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{task.deliverable}</div>
            </div>
          )}
          {task.criteria && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, color: '#22c55e', marginBottom: 3 }}>Done when</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{task.criteria}</div>
            </div>
          )}
          {task.resource && (
            <a href={task.resource} target="_blank" rel="noreferrer"
              style={{ fontSize: 12, color: accent, textDecoration: 'none' }}>
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
  const st = STATUS_STYLE[phase.status]
  const locked = phase.status === 'upcoming'
  const doneTasks = phase.tasks.filter((_, i) =>
    phase.status === 'done' || roadmap[`${phase.id}_${i}`]
  ).length
  const pct = Math.round((doneTasks / phase.tasks.length) * 100)
  const deadline = phase.endDate && phase.status !== 'done' ? daysUntil(phase.endDate) : null

  return (
    <div style={{
      background: 'var(--color-background-primary)',
      border: `0.5px solid ${phase.status === 'active' ? phase.color + '55' : 'var(--color-border-tertiary)'}`,
      borderRadius: 12, overflow: 'hidden', marginBottom: 10,
    }}>
      {/* top accent bar */}
      <div style={{ height: 3, background: phase.color, opacity: locked ? 0.2 : 1 }} />

      {/* header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
      >
        <div style={{
          width: 34, height: 34, borderRadius: 8, flexShrink: 0,
          background: locked ? 'var(--color-background-secondary)' : phase.color + '18',
          border: `1px solid ${locked ? 'var(--color-border-tertiary)' : phase.color + '40'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 500,
          color: locked ? 'var(--color-text-tertiary)' : phase.color,
        }}>
          {phase.id}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 15, fontWeight: 500,
              color: locked ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
            }}>
              {phase.title}
            </span>
            <span style={{
              fontSize: 11, padding: '1px 8px', borderRadius: 99,
              background: st.bg, border: `0.5px solid ${st.border}`, color: st.color,
            }}>
              {st.label}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 3, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
              {phase.startDate} → {phase.endDate}
            </span>
            {deadline && (
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: deadline.color }}>
                {deadline.label}
              </span>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: pct === 100 ? '#22c55e' : phase.color }}>
            {pct}%
          </div>
          <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
            {doneTasks}/{phase.tasks.length}
          </div>
        </div>
        <div style={{ color: 'var(--color-text-tertiary)', fontSize: 11 }}>{open ? '▲' : '▼'}</div>
      </div>

      {/* progress bar */}
      <div style={{ height: 2, background: 'var(--color-background-secondary)', margin: '0 18px' }}>
        <div style={{
          height: '100%', width: `${pct}%`, background: phase.color,
          borderRadius: 99, transition: 'width .4s ease',
        }} />
      </div>

      {/* body */}
      {open && (
        <div style={{ padding: '14px 18px' }}>

          {/* decision callout — Phase 2 only */}
          {phase.decisionNote && (
            <div style={{
              background: 'var(--color-background-secondary)',
              border: `0.5px solid ${phase.color}40`,
              borderRadius: 10, padding: '12px 14px', marginBottom: 14,
              fontSize: 12, color: 'var(--color-text-secondary)',
              lineHeight: 1.8, whiteSpace: 'pre-line',
              fontFamily: 'var(--font-mono)',
            }}>
              {phase.decisionNote}
            </div>
          )}

          {/* note */}
          <div style={{
            fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.7,
            marginBottom: 14, paddingRight: 12,
            borderRight: `2px solid ${phase.color}`,
          }}>
            {phase.note}
          </div>

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
          {phase.durationWeeks && (
            <div style={{
              marginTop: 14, paddingTop: 10,
              borderTop: '0.5px solid var(--color-border-tertiary)',
              fontSize: 11, color: 'var(--color-text-tertiary)',
              fontFamily: 'var(--font-mono)',
            }}>
              ~{phase.durationWeeks} weeks at 6h/day · {phase.startDate} → {phase.endDate}
            </div>
          )}
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
        <div className="page-sub">// 6h/day · Apr 2026 → Mar 2027 · Solidity ✓ · Foundry Fundamentals ✓</div>
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
          {/* Overall progress */}
          <div style={{
            background: 'var(--color-background-secondary)',
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: 12, padding: '14px 18px', marginBottom: 16,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Overall progress</span>
              <span style={{ fontSize: 12, fontWeight: 500, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                {totalDone}/{totalAll} · {overallPct}%
              </span>
            </div>
            <div style={{ background: 'var(--color-border-tertiary)', borderRadius: 99, height: 6, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${overallPct}%`,
                background: 'linear-gradient(90deg, #22c55e 0%, #3b82f6 100%)',
                borderRadius: 99, transition: 'width .5s ease',
              }} />
            </div>
            <div style={{ display: 'flex', gap: 14, marginTop: 10, flexWrap: 'wrap' }}>
              {PHASES.map(p => {
                const done = p.status === 'done'
                  ? p.tasks.length
                  : p.tasks.filter((_, i) => roadmap[`${p.id}_${i}`]).length
                const pct = Math.round((done / p.tasks.length) * 100)
                return (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: pct === 100 ? '#22c55e' : pct > 0 ? p.color : 'var(--color-border-secondary)',
                    }} />
                    <span style={{ fontSize: 10, color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                      P{p.id} {pct}%
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

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
