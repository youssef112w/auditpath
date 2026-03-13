// src/pages/Roadmap.jsx
import { useState, useEffect } from 'react'
import api from '../api'

const PHASES = [
  {
    phase: 1,
    title: 'Phase 1 — Foundations',
    time: 'الأسبوع 1–2',
    deadline: '14 يوم',
    color: 'green',
    mentor: 'أنت خلصت أساسيات Solidity وبتكمل Foundry — يعني Phase 1 شارفت تخلص. ركز على الـ Foundry tools وابدأ تكتب بإيدك فعلاً. مش تتفرج — تكتب.',
    tasks: [
      {
        text: 'أساسيات الـ Blockchain: blocks, transactions, gas, consensus',
        days: 2,
        tip: 'اقرا Ethereum Whitepaper الأول 10 صفحات بس. بعدين شاهد "How does Ethereum work?" على YouTube.',
        resource: 'https://ethereum.org/en/whitepaper/',
        deliverable: 'اكتب ملف notes.md فيه شرح gas بكلامك بالعربي',
        done_criteria: 'تقدر تشرح ليه transaction بتتأخر وليه fees بترتفع',
      },
      {
        text: 'فهم Ethereum architecture والـ EVM',
        days: 2,
        tip: 'افهم إن EVM هي virtual machine بتشغل bytecode — كل Solidity code بيتحول لـ bytecode قبل ما يتنفذ.',
        resource: 'https://www.evm.codes/',
        deliverable: 'افتح evm.codes واقرا الـ opcodes الأساسية: PUSH, CALL, SSTORE, SLOAD',
        done_criteria: 'تفهم إيه الفرق بين storage, memory, stack في الـ EVM',
      },
      {
        text: '✅ أساسيات Solidity: syntax, data types, functions, modifiers, events',
        days: 0,
        tip: 'خلصت بالفعل — بس لو حسيت إن في حاجة مش واضحة ارجعلها دلوقتي مش بعدين.',
        resource: 'https://docs.soliditylang.org/en/latest/',
        deliverable: 'مش محتاج deliverable جديد — اتأكد إنك تقدر تكتب modifier و event من غير ما تبص على مثال',
        done_criteria: 'تكتب عقد فيه modifier و event و mapping من غير ما تراجع',
      },
      {
        text: 'Token Standards: ERC20, ERC721 — اقرا الكود الحقيقي مش الشرح بس',
        days: 3,
        tip: 'متقراش الشرح بس — افتح GitHub بتاع OpenZeppelin وقرا ERC20.sol سطر بسطر. هتلاقي إن كل function فيها سبب.',
        resource: 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol',
        deliverable: 'اكتب MyToken.sol بيستخدم OpenZeppelin ERC20 بدون ما تكوبي — اكتبه بإيدك',
        done_criteria: 'تكتب ERC20 token فيه mint و burn و onlyOwner بنفسك',
      },
      {
        text: '✅ نص Foundry Fundamentals (Cyfrin) — بتكمله دلوقتي',
        days: 3,
        tip: 'الـ Foundry مش مجرد tool — هو طريقة تفكيرك في الـ testing. كل سطر كود بتكتبه لازم يكون معاه test.',
        resource: 'https://updraft.cyfrin.io/courses/foundry',
        deliverable: 'خلص الكورس كامل وعمل deploy لـ FundMe على Sepolia testnet',
        done_criteria: 'تشغل forge test وكل الـ tests تعدي بدون errors',
      },
    ],
  },
  {
    phase: 2,
    title: 'Phase 2 — Write Code & Break It',
    time: 'الأسبوع 3–5',
    deadline: '21 يوم',
    color: 'purple',
    mentor: 'ده أهم phase في رحلتك. مش هتبقى auditor كويس لو ماكتبتش كود كتير بإيدك. كل أسبوع لازم يطلع منه عقد مكتوب كامل مع tests.',
    tasks: [
      {
        text: 'Advanced Solidity: inheritance, interfaces, libraries',
        days: 4,
        tip: 'اكتب نظام فيه BaseContract و ChildContract يرثوا منه. بعدين اكتب Interface وشوف الفرق. الـ abstract contract vs interface — فهم الفرق ده مهم في الـ audit.',
        resource: 'https://solidity-by-example.org/',
        deliverable: 'اكتب نظام ERC20 من الصفر بدون OpenZeppelin — بس interfaces فقط',
        done_criteria: 'تكتب system فيه 3 contracts بيتكلموا مع بعض عن طريق interfaces',
      },
      {
        text: 'كتابة SimpleBank ودمر نفسك فيه',
        days: 3,
        tip: 'اكتب SimpleBank.sol فيه deposit, withdraw, getBalance. بعدين اكتب 10 tests. بعدين ابحث أنت بنفسك عن الثغرات فيه قبل ما تبص على أي solution.',
        resource: 'https://book.getfoundry.sh/forge/tests',
        deliverable: 'SimpleBank.sol + SimpleBank.t.sol فيه على الأقل 10 tests تغطي edge cases',
        done_criteria: 'الـ tests بتغطي: deposit, withdraw, overspend, zero amount, unauthorized access',
      },
      {
        text: 'Gas Optimization — افهم مش تحفظ',
        days: 3,
        tip: 'الـ gas optimization مهمة في الـ audit لأن كتير من الـ bugs بتيجي من محاولة توفير gas بطريقة غلط. افهم: SSTORE vs MSTORE, uint256 vs uint8, storage packing.',
        resource: 'https://www.rareskills.io/post/gas-optimization',
        deliverable: 'خد SimpleBank بتاعك وحسّن الـ gas بتاعه وقيس الفرق بـ forge snapshot',
        done_criteria: 'تشغل forge snapshot وتعرف تقرأ النتيجة وتفهم ليه function X أغلى من Y',
      },
      {
        text: 'Reentrancy Attack — اكتبها واتهجم بيها',
        days: 4,
        tip: 'ده أشهر ثغرة في تاريخ الـ blockchain. الـ DAO hack 2016 خسّر $60 مليون بسببها. لازم تكتبها بإيدك مش تقرأ عنها بس.',
        resource: 'https://swcregistry.io/docs/SWC-107',
        deliverable: 'VulnerableBank.sol + AttackBank.sol + SafeBank.sol + ReentrancyTest.t.sol يثبت الهجوم والحماية',
        done_criteria: 'الـ test يثبت إن الهجوم شغال على Vulnerable ومش شغال على Safe',
      },
      {
        text: 'Access Control + Integer Overflow — اكتب الثغرتين بإيدك',
        days: 3,
        tip: 'Access Control هي أكتر نوع ثغرة موجود في الـ contests. لو function مفيهاش onlyOwner وكان المفروض يكون فيها — ده finding. Integer overflow مهم في الكود القديم pre-0.8.',
        resource: 'https://swcregistry.io/docs/SWC-105',
        deliverable: 'عقد فيه ثغرتين متعمدين + عقد المهاجم + عقد آمن + tests للـ 3 scenarios',
        done_criteria: 'تقدر تشرح بالكلام: ليه الثغرة موجودة، ليه خطيرة، وإيه الـ fix',
      },
      {
        text: 'OpenZeppelin بعمق — قرا الكود مش الدوكيومنتيشن',
        days: 4,
        tip: 'الفرق بين junior و senior auditor: الـ junior بيقرأ الدوكيومنتيشن، الـ senior بيقرأ الكود. افتح ReentrancyGuard.sol وافهم ليه كل سطر فيه موجود.',
        resource: 'https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts',
        deliverable: 'اكتب notes.md فيه تحليل Ownable.sol و ReentrancyGuard.sol و Pausable.sol',
        done_criteria: 'تعرف تشرح ليه nonReentrant modifier بيستخدم uint بدل bool',
      },
    ],
  },
  {
    phase: 3,
    title: 'Phase 3 — Auditing Skills',
    time: 'الأسبوع 6–9',
    deadline: '28 يوم',
    color: 'yellow',
    mentor: 'دلوقتي بتبدأ تفكر زي الـ auditor. كل كود بتبصه — اسأل نفسك: مين ممكن يحكم في الـ function دي غير المفروض؟ إيه اللي ممكن يحصل لو ارقام اتلاعب فيها؟',
    tasks: [
      {
        text: 'Slither — أول static analysis tool',
        days: 3,
        tip: 'Slither بتشغله على كودك وبيطلعلك findings تلقائية. بس الـ auditor الشاطر بيفهم إيه اللي Slither بيقوله ومش بيكتفي بيه — لأن فيه false positives كتير.',
        resource: 'https://github.com/crytic/slither',
        deliverable: 'شغّل Slither على كل العقود اللي كتبتها واكتب slither-report.md فيه كل finding مع رأيك فيه',
        done_criteria: 'تقدر تفرق بين true positive و false positive في نتايج Slither',
      },
      {
        text: 'قرا أول Audit Report حقيقي بالتفصيل',
        days: 4,
        tip: 'مش هتفهم كل حاجة من أول مرة وده طبيعي تماماً. المهم إنك تفهم format التقرير: إيه الـ severity levels، إيه الـ proof of concept، وإزاي الـ fix بيتكتب.',
        resource: 'https://github.com/trailofbits/publications/tree/master/reviews',
        deliverable: 'اختار report لـ protocol صغير واكتب report-analysis.md فيه كل finding مع تحليلك',
        done_criteria: 'تعرف تشرح ليه finding اتصنف Critical مش Medium',
      },
      {
        text: 'Cyfrin Updraft — Security & Auditing Course (ده الأهم)',
        days: 10,
        tip: 'ده أفضل كورس مجاني في الـ smart contract security. Patrick Collins عمله بعد سنين من الـ auditing. متتخطاهوش.',
        resource: 'https://updraft.cyfrin.io/courses/security',
        deliverable: 'خلص الكورس كامل + notes لكل section + كل العقود اللي بيطلب تكتبها',
        done_criteria: 'تخلص الكورس وتكتب audit report للـ protocol اللي في الكورس',
      },
      {
        text: 'Ethernaut CTF — Level 1 لـ 15',
        days: 7,
        tip: 'كل level فيه ثغرة حقيقية. متبصش على الـ solution إلا بعد ما تحاول لمدة ساعة على الأقل. الـ struggle ده هو اللي بيعلمك.',
        resource: 'https://ethernaut.openzeppelin.com/',
        deliverable: 'احل 15 level واكتب للكل: إيه الثغرة، إزاي اكتشفتها، إيه الـ fix',
        done_criteria: 'تحل Level 10 (Reentrancy) وLevel 11 (Elevator) بدون hints',
      },
      {
        text: 'Audit Report Writing — اكتب report محترف',
        days: 4,
        tip: 'الـ audit report مش بس قائمة bugs — ده وثيقة تقنية بتقنع الـ protocol إن المشكلة خطيرة. لازم يكون فيه: Description, Impact, Proof of Concept, Recommendation.',
        resource: 'https://docs.codehawks.com/hawks-auditors/how-to-write-and-submit-a-finding',
        deliverable: 'اكتب template لـ audit report بتاعك وطبقه على ثغرة من Ethernaut',
        done_criteria: 'التقرير فيه كل عناصر الـ finding الاحترافي: severity, description, impact, PoC, fix',
      },
    ],
  },
  {
    phase: 4,
    title: 'Phase 4 — First Real Audit',
    time: 'الأسبوع 10–11',
    deadline: '14 يوم',
    color: 'blue',
    mentor: 'دلوقتي اللحظة الحقيقية. هتعمل أول audit على كود ما اتكتبتش أنت. هتحس إنك مش لاقي حاجة — ده طبيعي. الـ auditor الجيد بيصرف 80% من وقته بيفهم الكود و 20% بيدور على ثغرات.',
    tasks: [
      {
        text: 'CodeHawks First Flights — أول audit على كود حقيقي',
        days: 7,
        tip: 'First Flights هي contests مصممة للمبتدئين. الكود بسيط والـ community بتساعد. اختار flight قديم عنده results معلنة، اشتغل عليه لوحدك أولاً، بعدين قارن.',
        resource: 'https://www.codehawks.com/first-flights',
        deliverable: 'first-audit-report.md كامل على First Flight محدد — فيه كل finding بـ severity و PoC و fix',
        done_criteria: 'التقرير فيه على الأقل finding واحد صح مش false positive',
      },
      {
        text: 'Gap Analysis — قارن report بتاعك بالـ official results',
        days: 3,
        tip: 'الـ findings اللي فاتتك أهم من اللي لقيتها. فهم ليه فاتوا ده اللي هيخليك أحسن في الـ audit الجاي.',
        resource: 'https://www.codehawks.com/first-flights',
        deliverable: 'audit-gap-analysis.md: قائمة بكل finding فاتك + سبب فواته + خطة للتحسين',
        done_criteria: 'تحدد 3 أنواع من الثغرات مش بتلاقيها وتعرف ليه',
      },
      {
        text: 'Damn Vulnerable DeFi — أول 5 challenges',
        days: 4,
        tip: 'أصعب بكتير من Ethernaut وبيركز على DeFi. Level 1 (Unstoppable) بيعلمك flash loans. متستعجلش — ساعة على كل challenge قبل ما تبص على أي hint.',
        resource: 'https://www.damnvulnerabledefi.xyz/',
        deliverable: 'notes لـ 5 challenges: إيه الثغرة، إزاي استغليتها، إيه الـ fix الصح',
        done_criteria: 'تحل Unstoppable و Naive Receiver بدون solution',
      },
      {
        text: 'Deep Dive في DeFi: AMMs و Lending',
        days: 5,
        tip: 'مش لازم تفهم كل DeFi دلوقتي — بس لازم تفهم Uniswap V2 AMM mechanism و Compound lending. دول الـ building blocks اللي كل protocol تاني بيبني عليهم.',
        resource: 'https://www.rareskills.io/uniswap-v2-book',
        deliverable: 'اقرا Uniswap V2 whitepaper واكتب شرح للـ x*y=k formula بكلامك',
        done_criteria: 'تشرح إزاي الـ price slippage بيحصل وليه ممكن يبقى ثغرة',
      },
      {
        text: 'Oracle Manipulation و Flash Loan Attacks',
        days: 3,
        tip: 'Oracle manipulation هي من أشهر attack vectors في DeFi. لو protocol بيقرأ السعر من DEX واحد بس — ده ثغرة. Flash loans بتخلي المهاجم عنده ملايين دولارات لثانية واحدة.',
        resource: 'https://blog.openzeppelin.com/oracle-manipulation-attacks',
        deliverable: 'اكتب ملف defi-attacks.md فيه شرح 3 حوادث حقيقية: Beanstalk, Mango Markets, Euler Finance',
        done_criteria: 'تشرح في كل حادثة: إيه الثغرة، إزاي اتاستغلت، كام خسرت، وإيه الـ fix',
      },
    ],
  },
  {
    phase: 5,
    title: 'Phase 5 — Compete & Get Paid',
    time: 'الأسبوع 12–13',
    deadline: '14 يوم',
    color: 'red',
    mentor: 'دلوقتي بقيت جاهز تنافس. مش هتكسب من أول contest — ده طبيعي. الهدف إنك تشارك وتتعلم من الـ judging. كل finding اتصنف valid هو إنجاز حقيقي.',
    tasks: [
      {
        text: 'اشترك في Competitive Audit حقيقي على CodeHawks',
        days: 7,
        tip: 'اختار contest فيه protocol مش معقد جداً. اقرا الكود أولاً بدون ما تدور على ثغرات — بس افهم. بعدين ابدأ تدور. الـ auditor الشاطر بيفهم الـ business logic الأول.',
        resource: 'https://www.codehawks.com/',
        deliverable: 'submitted findings في contest حقيقي — حتى لو finding واحد بس',
        done_criteria: 'finding واحد على الأقل submitted وبتانتظر النتايج',
      },
      {
        text: 'بناء الـ GitHub Portfolio',
        days: 3,
        tip: 'الـ portfolio بتاعك هو CV بتاعك في الـ web3. كل كود كتبته، كل audit عملته، كل CTF حليته — اتحط على GitHub بـ README واضح.',
        resource: 'https://github.com/',
        deliverable: 'audit-portfolio repo على GitHub فيه: كل العقود، كل الـ reports، كل الـ CTF solutions',
        done_criteria: 'الـ README بيشرح مستواك بوضوح ومن يقراه يفهم إيه اللي تقدر تعمله',
      },
      {
        text: 'Sherlock أو Immunefi — جرب platform تاني',
        days: 4,
        tip: 'كل platform ليه طريقة تفكير مختلفة. Sherlock بيركز على protocols كبيرة. Immunefi فيه bug bounties بتخليك تشتغل على systems حقيقية في production.',
        resource: 'https://app.sherlock.xyz/audits',
        deliverable: 'اقرا rules وـ judging criteria لكل platform واكتب مقارنة بينهم',
        done_criteria: 'تحدد أنهي platform أنسب لمستواك دلوقتي وليه',
      },
      {
        text: 'تواصل مع security researchers على Twitter/X',
        days: 2,
        tip: 'الـ web3 security community صغيرة ومترابطة. follow: @PatrickAlphaC, @bytes032, @pashovkrum, @dacian0. اقرا threads بتاعتهم — هتتعلم أكتر من أي كورس.',
        resource: 'https://twitter.com/PatrickAlphaC',
        deliverable: 'follow 10 security researchers واقرا آخر 5 threads لكل واحد',
        done_criteria: 'تتفاعل مع thread واحد بسؤال حقيقي أو comment مفيد',
      },
    ],
  },
]

// ── helper ──────────────────────────────────────────────────────────────────
const accentMap = { green: 'var(--accent)', purple: 'var(--accent2)', yellow: 'var(--accent3)', red: 'var(--accent4)', blue: 'var(--accent5)' }
const badgeCls  = (pct) => pct === 100 ? 'complete' : pct > 0 ? 'active' : 'locked'
const badgeTxt  = (pct) => pct === 100 ? 'DONE' : pct > 0 ? `${pct}%` : 'LOCKED'

// ── sub-components ───────────────────────────────────────────────────────────
function TaskRow({ task, isDone, onToggle }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ marginBottom: 6 }}>
      {/* main row */}
      <div className="task-item" style={{ alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
        <div
          className={`task-check ${isDone ? 'done' : ''}`}
          style={{ marginTop: 2, flexShrink: 0, cursor: 'pointer' }}
          onClick={onToggle}
        >
          {isDone ? '✓' : ''}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 12,
              color: isDone ? 'var(--text3)' : 'var(--text2)',
              textDecoration: isDone ? 'line-through' : 'none',
              lineHeight: 1.6, cursor: 'pointer',
            }}
            onClick={onToggle}
          >
            {task.text}
          </div>
          {/* deadline pill */}
          <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, padding: '1px 7px',
              background: 'var(--surface2)', borderRadius: 99,
              color: 'var(--text3)', border: '1px solid var(--border)',
            }}>
              ⏱ {task.days === 0 ? 'مكتملة' : `${task.days} ${task.days === 1 ? 'يوم' : 'أيام'}`}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 9, padding: '1px 7px',
                background: 'transparent', borderRadius: 99,
                color: 'var(--accent)', border: '1px solid var(--accent)',
                cursor: 'pointer', userSelect: 'none',
              }}
              onClick={() => setOpen(o => !o)}
            >
              {open ? '▲ إخفاء' : '▼ التفاصيل'}
            </span>
          </div>
        </div>
      </div>

      {/* expandable details */}
      {open && (
        <div style={{
          marginTop: 6, marginLeft: 28,
          background: 'var(--surface2)', borderRadius: 8,
          padding: '10px 14px', border: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {/* tip */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent3)', marginBottom: 3 }}>💡 نصيحة</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text2)', lineHeight: 1.7 }}>{task.tip}</div>
          </div>

          {/* deliverable */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent2)', marginBottom: 3 }}>📦 الـ Deliverable</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text2)', lineHeight: 1.7 }}>{task.deliverable}</div>
          </div>

          {/* done criteria */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent5)', marginBottom: 3 }}>✅ معيار الإتمام</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text2)', lineHeight: 1.7 }}>{task.done_criteria}</div>
          </div>

          {/* resource */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text3)', marginBottom: 3 }}>🔗 المصدر</div>
            <a
              href={task.resource}
              target="_blank"
              rel="noreferrer"
              style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', wordBreak: 'break-all' }}
            >
              {task.resource}
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

// ── main component ────────────────────────────────────────────────────────────
export default function Roadmap({ notify }) {
  const [roadmap, setRoadmap]   = useState({})
  const [expanded, setExpanded] = useState({ 1: true })
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    api.get('/roadmap')
      .then(r => { setRoadmap(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const toggle = async (phase, idx) => {
    const key = `${phase}_${idx}`
    try {
      await api.post('/roadmap/toggle', { key })
      setRoadmap(prev => ({ ...prev, [key]: !prev[key] }))
      notify(roadmap[key] ? 'تم إلغاء التحديد' : '✓ مكتمل!')
    } catch { notify('خطأ في الحفظ') }
  }

  if (loading) return <div className="loading">جاري التحميل...</div>

  const totalDone = PHASES.reduce((a, p) => a + p.tasks.filter((_, i) => roadmap[`${p.phase}_${i}`]).length, 0)
  const totalAll  = PHASES.reduce((a, p) => a + p.tasks.length, 0)
  const totalDays = PHASES.reduce((a, p) => a + p.tasks.reduce((b, t) => b + t.days, 0), 0)

  // weeks on track indicator
  const daysElapsedEstimate = totalDone * (totalDays / totalAll)
  const onTrack = daysElapsedEstimate >= 0

  return (
    <div>
      {/* ── header ── */}
      <div className="page-header">
        <div className="page-title">الـ <span>Roadmap</span></div>
        <div className="page-sub">// {totalDone}/{totalAll} مهمة · 90 يوم · ابدأ دلوقتي</div>
      </div>

      {/* ── overall progress bar ── */}
      <div style={{
        background: 'var(--surface2)', borderRadius: 10, padding: '14px 18px',
        border: '1px solid var(--border)', marginBottom: 16,
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text2)' }}>
            إجمالي التقدم
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)' }}>
            {Math.round((totalDone / totalAll) * 100)}%
          </span>
        </div>
        <div className="progress-bar" style={{ height: 6 }}>
          <div
            className="progress-fill green"
            style={{ width: `${Math.round((totalDone / totalAll) * 100)}%`, transition: 'width .4s ease' }}
          />
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text3)' }}>
          {totalDone} مهمة مكتملة · {totalAll - totalDone} مهمة متبقية · المجموع المتوقع {totalDays} يوم (~13 أسبوع)
        </div>
      </div>

      {/* ── weekly rule card ── */}
      <div className="mentor-card" style={{ marginBottom: 16 }}>
        <div className="mentor-title">📏 قانون الأسبوع</div>
        <div className="mentor-tip">
          كل يوم جمعة اسأل نفسك سؤال واحد بس:{' '}
          <strong>"الـ deliverable بتاع الأسبوع ده موجود ومكتوب ولا لأ؟"</strong>
          <br /><br />
          ✅ آه = أنت في المعدل.{' '}
          ❌ لأ = اتأخرت أسبوع. مش نهاية الدنيا، بس اعترف بيه واعدّل. لو اتأخرت أسبوعين متتاليين — راجع الـ daily hours بتاعتك.
          <br /><br />
          <strong>المعدل الطبيعي:</strong> ساعتين ونص يومياً = تخلص في 90 يوم. أقل من كده = هتتأخر. أكتر = هتخلص أبكر.
        </div>
      </div>

      {/* ── mentor card ── */}
      <div className="mentor-card" style={{ marginBottom: 20 }}>
        <div className="mentor-title">🎓 نصيحة الـ Mentor</div>
        <div className="mentor-tip">
          مش محتاج تخلص Phase كاملة قبل ما تبدأ التالية —{' '}
          <strong>Phase 1 و 2 بيتداخلوا طبيعي.</strong>
          {' '}حدد task لما تعمل الـ deliverable بتاعها فعلاً، مش لما تسمع عنها بس. الفرق بين اللي بيوصل واللي بيوقف:
          {' '}<strong>الكتابة.</strong> كل أسبوع لازم يطلع منه كود مكتوب بإيدك.
        </div>
      </div>

      {/* ── phases ── */}
      {PHASES.map(p => {
        const done  = p.tasks.filter((_, i) => roadmap[`${p.phase}_${i}`]).length
        const pct   = Math.round((done / p.tasks.length) * 100)
        const isExp = expanded[p.phase]
        const phaseDays = p.tasks.reduce((a, t) => a + t.days, 0)

        return (
          <div
            key={p.phase}
            className="phase-card"
            style={{ borderTop: `2px solid ${accentMap[p.color]}`, marginBottom: 12 }}
          >
            {/* phase header */}
            <div
              className="phase-header"
              onClick={() => setExpanded(e => ({ ...e, [p.phase]: !e[p.phase] }))}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 }}>
                  {p.title}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>
                  {p.time} · {done}/{p.tasks.length} مكتمل · الـ deadline: {p.deadline}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className={`phase-badge ${badgeCls(pct)}`}>{badgeTxt(pct)}</span>
                <span style={{ color: 'var(--text3)', fontSize: 12 }}>{isExp ? '▲' : '▼'}</span>
              </div>
            </div>

            {/* progress bar */}
            <div className="progress-bar mb-8">
              <div className={`progress-fill ${p.color}`} style={{ width: `${pct}%` }} />
            </div>

            {/* mentor tip for phase */}
            {isExp && (
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 11,
                color: 'var(--text3)', lineHeight: 1.7,
                padding: '8px 4px 12px', borderBottom: '1px solid var(--border)',
                marginBottom: 10,
              }}>
                💬 {p.mentor}
              </div>
            )}

            {/* tasks */}
            {isExp && p.tasks.map((task, i) => {
              const isDone = !!roadmap[`${p.phase}_${i}`]
              return (
                <TaskRow
                  key={i}
                  task={task}
                  isDone={isDone}
                  onToggle={() => toggle(p.phase, i)}
                />
              )
            })}

            {/* phase footer */}
            {isExp && (
              <div style={{
                marginTop: 12, padding: '8px 4px 0',
                borderTop: '1px solid var(--border)',
                fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text3)',
              }}>
                ⏱ إجمالي وقت الـ phase: ~{phaseDays} يوم بمعدل ساعتين ونص يومياً
              </div>
            )}
          </div>
        )
      })}

      {/* ── footer resources ── */}
      <div style={{
        marginTop: 24, background: 'var(--surface2)',
        borderRadius: 10, padding: '16px 18px',
        border: '1px solid var(--border)',
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
          🔗 المصادر الأساسية — bookmark دول كلهم
        </div>
        {[
          { label: 'Cyfrin Updraft — كل الكورسات', url: 'https://updraft.cyfrin.io' },
          { label: 'Foundry Book — الدوكيومنتيشن الرسمي', url: 'https://book.getfoundry.sh' },
          { label: 'OpenZeppelin Contracts — اقرا الكود', url: 'https://github.com/OpenZeppelin/openzeppelin-contracts' },
          { label: 'SWC Registry — كل الـ vulnerabilities', url: 'https://swcregistry.io' },
          { label: 'Ethernaut CTF — OpenZeppelin', url: 'https://ethernaut.openzeppelin.com' },
          { label: 'Damn Vulnerable DeFi — DeFi attacks', url: 'https://www.damnvulnerabledefi.xyz' },
          { label: 'CodeHawks — First Flights & Contests', url: 'https://www.codehawks.com' },
          { label: 'Solidity by Example — أمثلة عملية', url: 'https://solidity-by-example.org' },
          { label: 'RareSkills — Gas + DeFi deep dives', url: 'https://www.rareskills.io' },
          { label: 'Trail of Bits — Audit Reports', url: 'https://github.com/trailofbits/publications' },
        ].map(r => (
          <div key={r.url} style={{ marginBottom: 6 }}>
            <a
              href={r.url}
              target="_blank"
              rel="noreferrer"
              style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', textDecoration: 'none' }}
            >
              → {r.label}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
