// src/pages/MentorPage.jsx
const TIPS = [
  { icon:'⏱', title:'الروتين اليومي المثالي', content:'افتح الـ Dashboard أول حاجة. اضغط "ابدأ الجلسة". مفيش مذاكرة بدون timer يشتغل. الـ timer مش بس للإحصاء — هو تذكير إنك في "mode التعلم".', tag:'DAILY' },
  { icon:'📊', title:'8 ساعات يوميًا = 720 ساعة', content:'مع 8 ساعات يوميًا لمدة 3 شهور تبقى عندك 720 ساعة. ده رقم جبار. لكن التوزيع مهم: 4 ساعات نظرية + 4 ساعات تطبيق. النظرية بدون كود = وهم.', tag:'TIME' },
  { icon:'🔬', title:'الـ Audit Lab هو قلب التعلم', content:'كل عقد بتحلله، سجله في الـ Lab فورًا. مش بعد ساعة. فورًا. الذاكرة بتنسى التفاصيل الدقيقة. التوثيق الفوري هو فرق المحترف عن الهاوي.', tag:'AUDIT' },
  { icon:'📖', title:'الـ Encyclopedia = سلاحك السري', content:'بعد 3 شهور، هيبقى عندك encyclopedia شخصية بـ 30-50 ثغرة. ده مش موجود في أي كتاب — ده ناتج خبرتك الشخصية. الـ audit firms بتدور على الناس دي.', tag:'VULN' },
  { icon:'🔥', title:'الـ Streak مش رفاهية', content:'حتى 30 دقيقة يوميًا أفضل من إنك تكسر الـ streak. لما بتكسره، الزخم بيتكسر معاه. قرر من الأول: مفيش يوم بدون ولو record واحد في الموقع.', tag:'STREAK' },
  { icon:'🌐', title:'الـ Portfolio = إثبات الإنتاج', content:'كل writeup بتكتبه وكل audit report بتنشره هو استثمار. بعد 6 شهور، لما تتقدم لـ Code4rena أو Sherlock، الـ portfolio هو اللي بيتكلم عنك لا الـ CV.', tag:'PORTFOLIO' },
  { icon:'🎯', title:'المسار الصحيح خطوة بخطوة', content:'Phase 1-2: Solidity + Basics (شهرين) → Phase 3: Ethernaut كامل + Audit Tools (شهرين) → Phase 4: Damn Vulnerable DeFi + DeFi Deep Dive (شهرين) → Phase 5: Code4rena contests.', tag:'ROADMAP' },
  { icon:'📚', title:'Resources الأساسية اللازم تعرفها', content:'Ethernaut (OpenZeppelin) ابدأ هنا. Damn Vulnerable DeFi المرحلة التالية. Trail of Bits Blog اقرأ كل حاجة. Secureum للـ EVM internals. RareSkills للـ advanced topics.', tag:'RESOURCES' },
  { icon:'🤝', title:'المجتمع مش اختياري', content:'انضم لـ Discord الخاص بـ Code4rena وـ Sherlock من اليوم الأول. متابعة الـ security researchers على Twitter/X بيفتحلك باب مختلف خالص. المجتمع ده هو شبكة علاقاتك المستقبلية.', tag:'COMMUNITY' },
  { icon:'💰', title:'كيف تكسب مال من المجال', content:'بعد Phase 3: ابدأ بـ Immunefi Bug Bounties. Phase 4: Code4rena contests (حتى لو كسبت $0 في الأول). Phase 5: Sherlock والـ private audits. الناس بتكسب $1,000 - $100,000 للـ audit الواحد.', tag:'INCOME' },
]

export default function MentorPage() {
  return (
    <div>
      <div className="page-header">
        <div className="page-title">الـ <span>Mentor Guide</span></div>
        <div className="page-sub">// دليلك الكامل للرحلة</div>
      </div>
      <div style={{background:'linear-gradient(135deg,rgba(124,58,237,0.12),rgba(0,255,136,0.06))',border:'1px solid rgba(124,58,237,0.3)',borderRadius:16,padding:24,marginBottom:24}}>
        <div style={{fontFamily:'var(--font-code)',fontSize:16,fontWeight:700,color:'var(--accent2)',marginBottom:8}}>🎓 رسالة الـ Mentor</div>
        <div style={{fontFamily:'var(--font-mono)',fontSize:12,color:'var(--text2)',lineHeight:1.9}}>
          أنت هتفضي 8 ساعات يوميًا لمدة 3 شهور. ده <strong style={{color:'var(--accent)'}}>720 ساعة</strong> من التعلم المكثف.<br/>
          معظم الناس بتحتاج سنة كاملة بجهد عادي. أنت عندك فرصة تعمل ده في نص الوقت.<br/><br/>
          لكن الوقت وحده مش كفاية. <strong style={{color:'var(--accent)'}}>الموقع ده هو سلاحك</strong> — استخدمه كل يوم، سجل كل حاجة، ولا تسيب يوم من غير ما تفتحه.<br/><br/>
          الهدف النهائي: تبقى <strong style={{color:'var(--accent3)'}}>Smart Contract Security Researcher</strong> بـ portfolio حقيقي يتكلم عنك.
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        {TIPS.map((t,i) => (
          <div key={i} className="card" style={{borderTop:'2px solid rgba(0,255,136,0.3)'}}>
            <div className="flex-between" style={{marginBottom:10}}>
              <div style={{fontSize:24}}>{t.icon}</div>
              <span className="tag">{t.tag}</span>
            </div>
            <div style={{fontFamily:'var(--font-display)',fontSize:14,fontWeight:700,marginBottom:8}}>{t.title}</div>
            <div style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text3)',lineHeight:1.8}}>{t.content}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
