// src/pages/MentorPage.jsx
const TIPS = [
  {
    icon: '⏱',
    title: 'الروتين اليومي المثالي',
    content: 'افتح الـ Dashboard أول حاجة. اضغط "ابدأ الجلسة". مفيش مذاكرة بدون timer يشتغل. الـ timer مش بس للإحصاء — هو تذكير إنك في "mode التعلم". حتى لو يوم تقيل، سجّل ولو 30 دقيقة.',
    tag: 'DAILY',
    color: 'var(--accent)',
  },
  {
    icon: '📊',
    title: '8 ساعات يوميًا = 720 ساعة',
    content: 'مع 8 ساعات يوميًا لمدة 3 شهور تبقى عندك 720 ساعة. ده رقم جبار. لكن التوزيع مهم: 4 ساعات نظرية + 4 ساعات تطبيق. النظرية بدون كود = وهم. الكود بدون فهم = وقت ضايع.',
    tag: 'TIME',
    color: 'var(--accent2)',
  },
  {
    icon: '🔬',
    title: 'الـ Audit Lab هو قلب التعلم',
    content: 'كل عقد بتحلله، سجله في الـ Lab فورًا. مش بعد ساعة. فورًا. الذاكرة بتنسى التفاصيل الدقيقة في خلال ساعات. التوثيق الفوري هو فرق المحترف عن الهاوي — حتى لو لقيت 0 ثغرات.',
    tag: 'AUDIT',
    color: 'var(--accent)',
  },
  {
    icon: '📖',
    title: 'الـ Encyclopedia = سلاحك السري',
    content: 'بعد 3 شهور، هيبقى عندك encyclopedia شخصية بـ 30-50 ثغرة موثقة بأسلوبك. ده مش موجود في أي كتاب — ده ناتج خبرتك الشخصية. الـ audit firms بتدور على الناس اللي عندهم patterns واضحة.',
    tag: 'VULN',
    color: 'var(--accent3)',
  },
  {
    icon: '🔥',
    title: 'الـ Streak مش رفاهية',
    content: 'حتى 30 دقيقة يوميًا أفضل من إنك تكسر الـ streak. لما بتكسره، الزخم بيتكسر معاه وبياخد 3 أيام ترجع. قرر من الأول: مفيش يوم بدون ولو جلسة واحدة مسجلة في الموقع.',
    tag: 'STREAK',
    color: '#ff6b6b',
  },
  {
    icon: '🌐',
    title: 'الـ Portfolio = إثبات الإنتاج',
    content: 'كل writeup بتكتبه وكل audit report بتنشره هو استثمار طويل المدى. بعد 6 شهور، لما تتقدم لـ Code4rena أو Sherlock، الـ portfolio هو اللي بيتكلم عنك لا الـ CV. ابدأ من اليوم الأول.',
    tag: 'PORTFOLIO',
    color: 'var(--accent2)',
  },
  {
    icon: '🎯',
    title: 'المسار الصحيح خطوة بخطوة',
    content: 'Phase 1-2: Solidity + Security Basics (شهرين) → Phase 3: Ethernaut كامل + Audit Tools (شهرين) → Phase 4: Damn Vulnerable DeFi + DeFi Deep Dive (شهرين) → Phase 5: Code4rena contests الحقيقية.',
    tag: 'ROADMAP',
    color: 'var(--accent)',
  },
  {
    icon: '📚',
    title: 'Resources الأساسية اللازم تعرفها',
    content: 'Ethernaut (OpenZeppelin) — ابدأ هنا. Damn Vulnerable DeFi — المرحلة التالية. Trail of Bits Blog — اقرأ كل حاجة. Secureum — للـ EVM internals. RareSkills — للـ advanced topics. كلهم مجانيين.',
    tag: 'RESOURCES',
    color: 'var(--accent3)',
  },
  {
    icon: '🤝',
    title: 'المجتمع مش اختياري',
    content: 'انضم لـ Discord الخاص بـ Code4rena وـ Sherlock من اليوم الأول. تابع الـ security researchers على Twitter/X — بيشاركوا findings وثغرات كل يوم. المجتمع ده هو شبكة علاقاتك المستقبلية ومصدر فرصك.',
    tag: 'COMMUNITY',
    color: 'var(--accent2)',
  },
  {
    icon: '💰',
    title: 'كيف تكسب مال من المجال',
    content: 'Phase 3: ابدأ بـ Immunefi Bug Bounties الصغيرة. Phase 4: Code4rena contests — حتى لو كسبت $0 في الأول، الخبرة تتراكم. Phase 5: Sherlock والـ private audits. الناس بتكسب $1,000 - $100,000 للـ audit الواحد.',
    tag: 'INCOME',
    color: '#ffc800',
  },
  {
    icon: '🧠',
    title: 'عقلية الـ Researcher مش الـ Developer',
    content: 'الـ Developer بيسأل "إزاي أعمل الحاجة دي؟" — الـ Security Researcher بيسأل "إزاي أكسر الحاجة دي؟". غيّر طريقة تفكيرك من اليوم الأول. كل كود تشوفه، فكر: إيه اللي ممكن يتغلط هنا؟',
    tag: 'MINDSET',
    color: 'var(--accent)',
  },
  {
    icon: '⚡',
    title: 'الـ AI أداة مش غش',
    content: 'استخدم الـ AI (Claude, ChatGPT) لفهم الكود وشرح المفاهيم — مش لحل التحديات عنك. الـ CTF اللي تحله بنفسك بيعلمك أكتر من 10 حلول جاهزة. الـ AI سلاح في إيدك لو استخدمته صح.',
    tag: 'AI',
    color: '#6C3BF5',
  },
]

const TAG_COLORS = {
  DAILY:     { bg: 'rgba(0,255,136,.08)',   color: 'var(--accent)'  },
  TIME:      { bg: 'rgba(124,58,237,.08)',  color: 'var(--accent2)' },
  AUDIT:     { bg: 'rgba(0,255,136,.08)',   color: 'var(--accent)'  },
  VULN:      { bg: 'rgba(255,107,107,.08)', color: 'var(--accent3)' },
  STREAK:    { bg: 'rgba(255,107,107,.08)', color: '#ff6b6b'        },
  PORTFOLIO: { bg: 'rgba(124,58,237,.08)',  color: 'var(--accent2)' },
  ROADMAP:   { bg: 'rgba(0,255,136,.08)',   color: 'var(--accent)'  },
  RESOURCES: { bg: 'rgba(255,107,107,.08)', color: 'var(--accent3)' },
  COMMUNITY: { bg: 'rgba(124,58,237,.08)',  color: 'var(--accent2)' },
  INCOME:    { bg: 'rgba(255,200,0,.08)',   color: '#ffc800'        },
  MINDSET:   { bg: 'rgba(0,255,136,.08)',   color: 'var(--accent)'  },
  AI:        { bg: 'rgba(108,59,245,.08)',  color: '#6C3BF5'        },
}

export default function MentorPage() {
  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title">الـ <span>Mentor Guide</span></div>
        <div className="page-sub">// دليلك الكامل للرحلة من Auditor → Security Researcher</div>
      </div>

      {/* رسالة الـ Mentor */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(0,255,136,0.06))',
        border: '1px solid rgba(124,58,237,0.3)',
        borderRadius: 16,
        padding: 28,
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 160, height: 160, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.15), transparent)',
          pointerEvents: 'none',
        }} />

        <div style={{ fontFamily:'var(--font-code)', fontSize:16, fontWeight:700, color:'var(--accent2)', marginBottom:12 }}>
          🎓 رسالة الـ Mentor
        </div>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--text2)', lineHeight:2 }}>
          أنت هتفضي 8 ساعات يوميًا لمدة 3 شهور.
          ده <strong style={{ color:'var(--accent)' }}>720 ساعة</strong> من التعلم المكثف.<br />
          معظم الناس بتحتاج سنة كاملة بجهد عادي. أنت عندك فرصة تعمل ده في نص الوقت.<br /><br />
          لكن الوقت وحده مش كفاية.{' '}
          <strong style={{ color:'var(--accent)' }}>الموقع ده هو سلاحك</strong>{' '}
          — استخدمه كل يوم، سجّل كل حاجة، ولا تسيب يوم من غير ما تفتحه.<br /><br />
          الهدف النهائي: تبقى{' '}
          <strong style={{ color:'var(--accent3)' }}>Smart Contract Security Researcher</strong>{' '}
          بـ portfolio حقيقي يتكلم عنك — مش CV فاضي.
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex', gap: 24, marginTop: 20,
          paddingTop: 20, borderTop: '1px solid rgba(255,255,255,.06)',
          flexWrap: 'wrap',
        }}>
          {[
            { label: 'ساعات هدفك', value: '720h', color: 'var(--accent)'  },
            { label: 'شهور كافية', value: '3-6',  color: 'var(--accent2)' },
            { label: 'المكسب المحتمل', value: '$100K+', color: '#ffc800' },
            { label: 'contests تبدأ بيها', value: 'Code4rena', color: 'var(--accent3)' },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontFamily:'var(--font-code)', fontSize:18, fontWeight:800, color:s.color }}>{s.value}</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text3)', letterSpacing:1, marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* الـ Tips Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:16 }}>
        {TIPS.map((t, i) => {
          const tagStyle = TAG_COLORS[t.tag] || { bg:'rgba(255,255,255,.05)', color:'var(--text3)' }
          return (
            <div key={i} className="card" style={{ borderTop:`2px solid ${t.color}22`, position:'relative' }}>

              {/* Header */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                <div style={{ fontSize:28, lineHeight:1 }}>{t.icon}</div>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 8,
                  padding: '3px 8px', borderRadius: 20,
                  background: tagStyle.bg, color: tagStyle.color,
                  letterSpacing: 1, fontWeight: 600,
                }}>
                  {t.tag}
                </span>
              </div>

              {/* Title */}
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 13,
                fontWeight: 700, color: 'var(--text1)', marginBottom: 10,
                lineHeight: 1.4,
              }}>
                {t.title}
              </div>

              {/* Content */}
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 11,
                color: 'var(--text3)', lineHeight: 1.9,
              }}>
                {t.content}
              </div>

              {/* Bottom accent line */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
                background: `linear-gradient(90deg, ${t.color}33, transparent)`,
              }} />
            </div>
          )
        })}
      </div>

      {/* AI Note */}
      <div style={{
        marginTop: 24,
        padding: '16px 20px',
        borderRadius: 12,
        background: 'rgba(108,59,245,.06)',
        border: '1px solid rgba(108,59,245,.2)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{ fontSize: 20 }}>🤖</span>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text3)', lineHeight:1.7 }}>
          <strong style={{ color:'#6C3BF5' }}>Built with Claude AI</strong>{' '}
          — المشروع ده اتبنى بمساعدة الـ AI من الأول للآخر.
          الـ AI أداة بتسرع التنفيذ — الفهم والقرارات دايمًا ليك إنت.
          استخدم الـ AI في رحلتك بنفس الطريقة: لفهم الكود، مش لحله عنك.
        </div>
      </div>
    </div>
  )
}
