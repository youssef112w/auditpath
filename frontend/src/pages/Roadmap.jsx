// src/pages/Roadmap.jsx
// ✅ Updated: Deadlines based on 6hrs/day + university schedule
// 🎯 Target: March 2027 | Start: March 23, 2025
// 📅 Calculated at ~6hrs/day, 5-6 days/week (university buffer included)

import { useState, useEffect } from 'react'
import api from '../api'

// ── DAILY SCHEDULE (6hrs) ─────────────────────────────────────────────────────
// الجدول ده مخصوص ليك — مش عام
//
// ساعة 1 — الصبح بعد الكلية أو قبلها:
//   🎧 شاهد الفيديو على Cyfrin بسرعة x1.25 وعندك subtitle إنجليزي
//   استخدم Claude أو ChatGPT: "اشرح لي بالعربي: [الموضوع]"
//   اكتب ملاحظات بالعربي في ملف notes.md
//
// ساعة 2-3 — التطبيق:
//   افتح VSCode واكتب الكود بإيدك — مش تكوبي
//   لو مش فاهم سطر: ChatGPT "اشرح الكود ده بالعربي سطر بسطر"
//
// ساعة 4-5 — الفهم العميق:
//   اقرا الـ resources المكتوبة (أسهل من الفيديو)
//   GitHub + docs — ابحث عن الكلمات مش فاهمها
//
// ساعة 6 — الـ Output:
//   اكتب ملخص اليوم بالعربي في notes.md
//   commit على GitHub حتى لو سطر واحد

const ENGLISH_TIP = `🇬🇧 استراتيجية الإنجليزي — مهمة جداً:
الفيديو على Cyfrin مش لازم تفهم كل كلمة. المهم تفهم الكود.
① شاهد الفيديو مع الـ subtitles — pause على كل جملة مش فاهمها
② افتح Claude أو ChatGPT وقوله: "اشرح لي بالعربي: [الجملة دي]"
③ الكود نفسه أسهل من الكلام — ركز عليه أكتر من الشرح
④ مع الوقت هيتحسن الإنجليزي تلقائي من غير ما تحس`

// ── PHASES DATA ───────────────────────────────────────────────────────────────
// Deadlines محسوبة من 23 مارس 2026:
// Phase 1 باقي: ~8 أيام (6hrs/day) = ينتهي ~1 أبريل 2026
// Phase 2: 21 يوم = ينتهي ~22 أبريل 2026
// Phase 3: 35 يوم = ينتهي ~27 مايو 2026
// Phase 4: 30 يوم = ينتهي ~26 يونيو 2026
// Phase 5+: ongoing حتى مارس 2027

const PHASES = [
  {
    phase: 1,
    title: 'Phase 1 — Foundations',
    time: 'الأسبوع 1–2',
    deadline: '1 أبريل 2026',
    deadlineDate: '2026-04-01',
    color: 'green',
    hoursPerDay: 6,
    mentor: 'أنت عندك 60% خلاص — ممتاز. الباقي Token Standards وFoundry Fundamentals. بـ 6 ساعات يومياً هتخلصهم في أسبوع تقريباً. ركز على الكتابة مش المشاهدة.',
    dailySchedule: {
      morning: 'شاهد الدرس على Cyfrin مع subtitles — pause وترجم كل جملة مش فاهمها باستخدام Claude',
      afternoon: 'اكتب الكود من الدرس بإيدك في VSCode — مش تكوبي من الشاشة',
      evening: 'اقرا الـ OpenZeppelin source code على GitHub + اكتب ملاحظات بالعربي',
      night: 'commit على GitHub + اكتب ملخص اليوم: "النهارده اتعلمت إن..."',
    },
    englishStrategy: 'Cyfrin فيه transcript مكتوب تحت كل فيديو — استخدمه وترجمه بـ Claude لو محتاج',
    tasks: [
      {
        text: '✅ أساسيات الـ Blockchain: blocks, transactions, gas, consensus',
        days: 0,
        tip: 'خلصت بالفعل.',
        resource: 'https://ethereum.org/en/whitepaper/',
        deliverable: 'مكتملة',
        done_criteria: 'مكتملة',
        howToStudy: '',
      },
      {
        text: '✅ فهم Ethereum architecture والـ EVM',
        days: 0,
        tip: 'خلصت بالفعل.',
        resource: 'https://www.evm.codes/',
        deliverable: 'مكتملة',
        done_criteria: 'مكتملة',
        howToStudy: '',
      },
      {
        text: '✅ أساسيات Solidity: syntax, data types, functions, modifiers, events',
        days: 0,
        tip: 'خلصت بالفعل — بس لو حسيت إن في حاجة مش واضحة ارجعلها دلوقتي مش بعدين.',
        resource: 'https://docs.soliditylang.org/en/latest/',
        deliverable: 'مكتملة',
        done_criteria: 'تكتب modifier و event و mapping من غير ما تراجع',
        howToStudy: '',
      },
      {
        text: 'Token Standards: ERC20, ERC721 — اقرا الكود الحقيقي',
        days: 3,
        tip: 'متقراش الشرح بس — افتح GitHub بتاع OpenZeppelin وقرا ERC20.sol سطر بسطر. كل function فيها سبب.',
        resource: 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol',
        deliverable: 'اكتب MyToken.sol بيستخدم OpenZeppelin ERC20 بدون ما تكوبي — اكتبه بإيدك',
        done_criteria: 'تكتب ERC20 token فيه mint و burn و onlyOwner بنفسك',
        howToStudy: `① افتح الـ link ده على GitHub: openzeppelin ERC20.sol
② كل function مش فاهمها — copy الاسم وقول لـ Claude: "اشرح لي الـ function دي بالعربي وليه موجودة"
③ بعد ما تفهم كل function — اقفل الـ GitHub واكتب MyToken.sol من دماغك
④ المعدل: ساعة قراءة + ساعتين كتابة + ساعة testing`,
      },
      {
        text: 'Foundry Fundamentals (Cyfrin) — أكمل الكورس',
        days: 5,
        tip: 'الكورس بالإنجليزي — بس Patrick Collins بيشرح ببطء وواضح. استخدم الـ transcript الموجود تحت كل فيديو.',
        resource: 'https://updraft.cyfrin.io/courses/foundry',
        deliverable: 'خلص الكورس كامل وعمل deploy لـ FundMe على Sepolia testnet',
        done_criteria: 'تشغل forge test وكل الـ tests تعدي بدون errors',
        howToStudy: `① افتح الفيديو على Cyfrin — فيه زر "Transcript" تحت الفيديو
② شاهد بـ x1.0 مش أسرع — Patrick بيشرح وهو بيكتب الكود
③ pause بعد كل section وكرر الكود بإيدك في terminal
④ لو كلمة مش فاهمها: Claude "ايه معنى [الكلمة] في Solidity؟"
⑤ الـ errors في terminal — copy الـ error وقول لـ Claude "ليه الـ error ده بيحصل؟"
⑥ مش لازم تفهم كل كلمة إنجليزي — المهم تفهم الكود اللي بيتكتب`,
      },
    ],
  },
  {
    phase: 2,
    title: 'Phase 2 — Write Code & Break It',
    time: '22 أبريل — 12 مايو 2026',
    deadline: '12 مايو 2026',
    deadlineDate: '2026-05-12',
    color: 'purple',
    hoursPerDay: 6,
    mentor: 'ده أهم phase. مش هتبقى auditor كويس لو ماكتبتش كود كتير. كل يوم لازم يطلع منه كود على GitHub.',
    dailySchedule: {
      morning: 'اقرا مثال واحد على solidity-by-example.org — ترجمه بـ Claude لو محتاج',
      afternoon: 'اكتب الكود من الصفر بإيدك في VSCode — كل سطر بتكتبه بتفهمه',
      evening: 'اكتب tests للكود اللي كتبته — forge test لازم يعدي',
      night: 'commit على GitHub + اكتب ملاحظة: "النهارده اكتشفت إن..."',
    },
    englishStrategy: 'solidity-by-example.org — الأمثلة دي كود بس مش كلام كتير. أسهل للفهم من الفيديوهات',
    tasks: [
      {
        text: 'Advanced Solidity: inheritance, interfaces, libraries',
        days: 4,
        tip: 'اكتب نظام فيه BaseContract و ChildContract يرثوا منه. الـ abstract contract vs interface — فهم الفرق ده مهم في الـ audit.',
        resource: 'https://solidity-by-example.org/',
        deliverable: 'اكتب نظام ERC20 من الصفر بدون OpenZeppelin — بس interfaces فقط',
        done_criteria: 'تكتب system فيه 3 contracts بيتكلموا مع بعض عن طريق interfaces',
        howToStudy: `① افتح solidity-by-example.org/interface
② الصفحة فيها كود بس — مش محتاج إنجليزي كتير
③ اكتب الكود بإيدك وغير فيه عشان تفهمه
④ Claude: "اشرح لي الفرق بين interface و abstract contract بالعربي"`,
      },
      {
        text: 'كتابة SimpleBank ودمر نفسك فيه',
        days: 4,
        tip: 'اكتب SimpleBank.sol فيه deposit, withdraw, getBalance. بعدين اكتب 10 tests. بعدين ابحث أنت بنفسك عن الثغرات فيه.',
        resource: 'https://book.getfoundry.sh/forge/tests',
        deliverable: 'SimpleBank.sol + SimpleBank.t.sol فيه على الأقل 10 tests',
        done_criteria: 'الـ tests بتغطي: deposit, withdraw, overspend, zero amount, unauthorized access',
        howToStudy: `① ابدأ من غير ما تشوف أي مثال — اكتب SimpleBank بدماغك
② لو وقفت: Claude "اكتبلي SimpleBank.sol بـ Solidity فيه deposit و withdraw"
③ بعد ما تكتبه — سأل Claude "إيه الثغرات الممكنة في الكود ده؟"
④ اكتب test لكل ثغرة لاقيتها`,
      },
      {
        text: 'Gas Optimization — افهم مش تحفظ',
        days: 3,
        tip: 'SSTORE vs MSTORE, uint256 vs uint8, storage packing. افهم ليه كل optimization شغالة.',
        resource: 'https://www.rareskills.io/post/gas-optimization',
        deliverable: 'خد SimpleBank بتاعك وحسّن الـ gas بتاعه وقيس الفرق بـ forge snapshot',
        done_criteria: 'تشغل forge snapshot وتعرف تقرأ النتيجة',
        howToStudy: `① rareskills.io مكتوب بإنجليزي بسيط — جرب تقراه أول
② لو جملة مش فاهمها: copy وحطها في Claude وقوله "ترجم وشرح"
③ الأهم: طبق كل optimization على SimpleBank بتاعك وقيس الفرق`,
      },
      {
        text: 'Reentrancy Attack — اكتبها واتهجم بيها',
        days: 5,
        tip: 'ده أشهر ثغرة في تاريخ الـ blockchain. الـ DAO hack 2016 خسّر $60 مليون. لازم تكتبها بإيدك.',
        resource: 'https://swcregistry.io/docs/SWC-107',
        deliverable: 'VulnerableBank.sol + AttackBank.sol + SafeBank.sol + ReentrancyTest.t.sol',
        done_criteria: 'الـ test يثبت إن الهجوم شغال على Vulnerable ومش شغال على Safe',
        howToStudy: `① Claude: "اشرح لي ثغرة Reentrancy بالعربي مع مثال كود"
② بعد ما تفهم — اكتب VulnerableBank.sol من غير ما تبص على الشرح
③ اكتب AttackBank.sol تهاجم فيه الـ VulnerableBank
④ شغّل الهجوم في test وتأكد إنه شغال
⑤ اكتب SafeBank.sol بالـ fix الصح`,
      },
      {
        text: 'Access Control + Integer Overflow — اكتب الثغرتين بإيدك',
        days: 3,
        tip: 'Access Control هي أكتر نوع ثغرة في الـ contests. Integer overflow مهم في الكود القديم pre-0.8.',
        resource: 'https://swcregistry.io/docs/SWC-105',
        deliverable: 'عقد فيه ثغرتين متعمدين + عقد المهاجم + عقد آمن + tests للـ 3 scenarios',
        done_criteria: 'تقدر تشرح: ليه الثغرة موجودة، ليه خطيرة، وإيه الـ fix',
        howToStudy: `① Claude: "اشرح لي Access Control vulnerability بالعربي"
② Claude: "اشرح لي Integer Overflow في Solidity قبل 0.8 بالعربي"
③ اكتب الثغرتين بإيدك وتأكد إنهم شغالين
④ اكتب الـ fix واتأكد إن الهجوم بقى مش شغال`,
      },
      {
        text: 'OpenZeppelin بعمق — قرا الكود مش الدوكيومنتيشن',
        days: 4,
        tip: 'الفرق بين junior و senior auditor: الـ junior بيقرأ الدوكيومنتيشن، الـ senior بيقرأ الكود.',
        resource: 'https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts',
        deliverable: 'notes.md فيه تحليل Ownable.sol و ReentrancyGuard.sol و Pausable.sol',
        done_criteria: 'تعرف تشرح ليه nonReentrant modifier بيستخدم uint بدل bool',
        howToStudy: `① افتح ReentrancyGuard.sol على GitHub
② كل سطر مش فاهمه: copy وقول لـ Claude "اشرح السطر ده بالعربي"
③ اكتب ملاحظاتك بالعربي في notes.md
④ الهدف: بعد ما تخلص تقدر تشرح كل الكود بالعربي`,
      },
    ],
  },
  {
    phase: 3,
    title: 'Phase 3 — Auditing Skills',
    time: '13 مايو — 16 يونيو 2026',
    deadline: '16 يونيو 2026',
    deadlineDate: '2026-06-16',
    color: 'yellow',
    hoursPerDay: 6,
    mentor: 'دلوقتي بتبدأ تفكر زي الـ auditor. Cyfrin Security Course هو أهم حاجة في الـ phase دي — خليه أولوية.',
    dailySchedule: {
      morning: 'درس واحد من Cyfrin Security Course — مع transcript + ترجمة بـ Claude',
      afternoon: 'طبق اللي اتعلمته على كود حقيقي — Ethernaut أو الـ exercises في الكورس',
      evening: 'اقرا جزء من Audit Report حقيقي — ترجم الـ findings بـ Claude',
      night: 'اكتب write-up قصير لحاجة اتعلمتها النهارده — بالعربي',
    },
    englishStrategy: 'Audit Reports مكتوبة بإنجليزي تقني — بس الـ pattern متكرر. بعد 5 reports هتبدأ تفهم من غير ترجمة',
    tasks: [
      {
        text: 'Slither — أول static analysis tool',
        days: 3,
        tip: 'Slither بتشغله على كودك وبيطلعلك findings تلقائية. الـ auditor الشاطر بيفهم إيه اللي Slither بيقوله ومش بيكتفي بيه.',
        resource: 'https://github.com/crytic/slither',
        deliverable: 'شغّل Slither على كل العقود اللي كتبتها واكتب slither-report.md',
        done_criteria: 'تقدر تفرق بين true positive و false positive في نتايج Slither',
        howToStudy: `① Claude: "ازاي اثبت Slither على Windows/Mac؟" واتبع الخطوات
② شغّل على SimpleBank بتاعك: slither SimpleBank.sol
③ النتايج بتيجي بالإنجليزي — copy كل warning وقول لـ Claude "ايه المقصود بده؟"
④ قرر: هل ده مشكلة حقيقية (true positive) ولا خطأ في التحليل (false positive)؟`,
      },
      {
        text: 'قرا أول Audit Report حقيقي بالتفصيل',
        days: 4,
        tip: 'مش هتفهم كل حاجة من أول مرة وده طبيعي. المهم تفهم format التقرير.',
        resource: 'https://github.com/trailofbits/publications/tree/master/reviews',
        deliverable: 'اختار report لـ protocol صغير واكتب report-analysis.md فيه كل finding مع تحليلك',
        done_criteria: 'تعرف تشرح ليه finding اتصنف Critical مش Medium',
        howToStudy: `① ابدأ بـ report صغير — ابحث عن "CodeHawks First Flight report" على Google
② كل finding: copy والصقه في Claude وقوله "اشرح لي الـ finding ده بالعربي"
③ بعد ما تفهمه — اكتبه بكلامك بالعربي في report-analysis.md
④ الهدف: تفهم ليه الـ severity اتحدد كده`,
      },
      {
        text: 'Cyfrin Updraft — Security & Auditing Course (ده الأهم)',
        days: 14,
        tip: 'ده أفضل كورس مجاني في الـ smart contract security. Patrick Collins عمله بعد سنين من الـ auditing.',
        resource: 'https://updraft.cyfrin.io/courses/security',
        deliverable: 'خلص الكورس كامل + notes لكل section + كل العقود اللي بيطلب تكتبها',
        done_criteria: 'تخلص الكورس وتكتب audit report للـ protocol اللي في الكورس',
        howToStudy: `① كل درس: شاهد أول 5 دقايق بدون توقف عشان تاخد فكرة
② ارجع للأول وشاهد مع التفاصيل — pause بعد كل concept
③ تحت كل فيديو في Cyfrin فيه "Resources" — دول links مهمة
④ الكورس فيه "Audit exercises" — دول أهم من الفيديوهات نفسها
⑤ Claude هو مساعدك: "اشرح لي [الموضوع] بالعربي مع مثال كود"
⑥ المعدل: درسين يومياً = خلاص في أسبوعين`,
      },
      {
        text: 'Ethernaut CTF — Level 1 لـ 15',
        days: 8,
        tip: 'كل level فيه ثغرة حقيقية. متبصش على الـ solution إلا بعد ما تحاول ساعة على الأقل.',
        resource: 'https://ethernaut.openzeppelin.com/',
        deliverable: 'احل 15 level واكتب للكل: إيه الثغرة، إزاي اكتشفتها، إيه الـ fix',
        done_criteria: 'تحل Level 10 (Reentrancy) وLevel 11 (Elevator) بدون hints',
        howToStudy: `① كل level فيه description بالإنجليزي — Claude: "ترجم وشرح لي المطلوب"
② حاول تحل من غير hints لمدة ساعة
③ لو مش عارف: Claude "إيه hint صغير لـ Ethernaut Level [X]؟" — مش الحل كامل
④ بعد ما تحل: Claude "ايه الـ vulnerability الأساسية في الـ level ده؟"
⑤ اكتب write-up بالعربي لكل level`,
      },
      {
        text: 'Audit Report Writing — اكتب report محترف',
        days: 4,
        tip: 'الـ audit report مش بس قائمة bugs — ده وثيقة تقنية. لازم يكون فيه: Description, Impact, Proof of Concept, Recommendation.',
        resource: 'https://docs.codehawks.com/hawks-auditors/how-to-write-and-submit-a-finding',
        deliverable: 'اكتب template لـ audit report بتاعك وطبقه على ثغرة من Ethernaut',
        done_criteria: 'التقرير فيه كل عناصر الـ finding الاحترافي: severity, description, impact, PoC, fix',
        howToStudy: `① Claude: "إيه الـ template الاحترافي لكتابة audit finding؟"
② خد template واكتب فيه finding من Ethernaut حليته
③ Claude: "راجع الـ finding ده وقولي إيه الناقص"
④ احفظ الـ template ده — هتستخدمه في كل audit جاي`,
      },
    ],
  },
  {
    phase: 4,
    title: 'Phase 4 — First Real Audit',
    time: '17 يونيو — 16 يوليو 2026',
    deadline: '16 يوليو 2026',
    deadlineDate: '2026-07-16',
    color: 'blue',
    hoursPerDay: 6,
    mentor: 'دلوقتي اللحظة الحقيقية. هتعمل أول audit على كود ما اتكتبتش أنت. الـ auditor الجيد بيصرف 80% من وقته بيفهم الكود و 20% بيدور على ثغرات.',
    dailySchedule: {
      morning: 'اقرا الكود الجديد من غير ما تدور على ثغرات — بس افهم الـ business logic',
      afternoon: 'ابدأ تدور على ثغرات — اسأل نفسك: مين ممكن يستغل الـ function دي؟',
      evening: 'اكتب الـ findings اللي لقيتها في report format',
      night: 'قارن findings بتاعتك بالـ official results وافهم ليه فاتتك حاجات',
    },
    englishStrategy: 'الكود الحقيقي مش فيه شرح — بس الـ variable names والـ comments بيساعدوا. Claude: "اشرح لي الـ function دي"',
    tasks: [
      {
        text: 'CodeHawks First Flights — أول audit على كود حقيقي',
        days: 8,
        tip: 'First Flights مصممة للمبتدئين. اختار flight قديم عنده results معلنة.',
        resource: 'https://www.codehawks.com/first-flights',
        deliverable: 'first-audit-report.md كامل على First Flight محدد',
        done_criteria: 'التقرير فيه على الأقل finding واحد صح مش false positive',
        howToStudy: `① اختار First Flight قديم عنده official results معلنة
② افتح الكود على GitHub — Claude: "اشرح لي الـ protocol ده بالعربي"
③ اقرا كل function وسأل نفسك: "فيه فيها ثغرة؟"
④ اكتب كل finding في report format
⑤ بعد ما تخلص — شوف الـ official results وقارن`,
      },
      {
        text: 'Gap Analysis — قارن report بتاعك بالـ official results',
        days: 3,
        tip: 'الـ findings اللي فاتتك أهم من اللي لقيتها.',
        resource: 'https://www.codehawks.com/first-flights',
        deliverable: 'audit-gap-analysis.md: قائمة بكل finding فاتك + سبب فواته + خطة للتحسين',
        done_criteria: 'تحدد 3 أنواع من الثغرات مش بتلاقيها وتعرف ليه',
        howToStudy: `① خد كل finding في الـ official report مش لقيته
② Claude: "اشرح لي الـ finding ده بالعربي — ليه صعب تشوفه؟"
③ اكتب في ملف: "فاتني لأن..." لكل finding
④ ده أهم تمرين في الـ roadmap كلها — اعمله بجدية`,
      },
      {
        text: 'Damn Vulnerable DeFi — أول 5 challenges',
        days: 5,
        tip: 'أصعب بكتير من Ethernaut وبيركز على DeFi. Level 1 (Unstoppable) بيعلمك flash loans.',
        resource: 'https://www.damnvulnerabledefi.xyz/',
        deliverable: 'notes لـ 5 challenges: إيه الثغرة، إزاي استغليتها، إيه الـ fix',
        done_criteria: 'تحل Unstoppable و Naive Receiver بدون solution',
        howToStudy: `① Claude: "اشرح لي Damn Vulnerable DeFi Level 1 بالعربي"
② حاول تحل من غير hints لمدة ساعة ونص
③ لو وقفت: Claude "ديني hint بدون solution كامل"
④ اكتب write-up بالعربي بعد كل challenge`,
      },
      {
        text: 'Deep Dive في DeFi: AMMs و Lending',
        days: 6,
        tip: 'مش لازم تفهم كل DeFi دلوقتي — بس لازم تفهم Uniswap V2 AMM mechanism و Compound lending.',
        resource: 'https://www.rareskills.io/uniswap-v2-book',
        deliverable: 'اقرا Uniswap V2 book واكتب شرح للـ x*y=k formula بكلامك',
        done_criteria: 'تشرح إزاي الـ price slippage بيحصل وليه ممكن يبقى ثغرة',
        howToStudy: `① rareskills.io/uniswap-v2-book — ابدأ من Chapter 1
② كل concept مش فاهمه: Claude "اشرح لي [الـ concept] بمثال بسيط بالعربي"
③ الـ x*y=k formula — Claude "اشرح لي المعادلة دي بمثال أرقام بالعربي"
④ اكتب شرحك بالعربي — لو قدرت تشرحه تبقى فهمته`,
      },
      {
        text: 'Oracle Manipulation و Flash Loan Attacks',
        days: 4,
        tip: 'Oracle manipulation من أشهر attack vectors في DeFi.',
        resource: 'https://blog.openzeppelin.com/oracle-manipulation-attacks',
        deliverable: 'اكتب defi-attacks.md فيه شرح 3 حوادث حقيقية: Beanstalk, Mango Markets, Euler Finance',
        done_criteria: 'تشرح في كل حادثة: إيه الثغرة، إزاي اتاستغلت، كام خسرت، وإيه الـ fix',
        howToStudy: `① Claude: "اشرح لي Beanstalk hack بالعربي — إيه الثغرة وكيف حصلت؟"
② نفس الشيء لـ Mango Markets وEuler Finance
③ اكتب ملف defi-attacks.md بالعربي
④ الهدف: تقدر تشرح كل حادثة لحد تاني في 5 دقايق`,
      },
    ],
  },
  {
    phase: 5,
    title: 'Phase 5 — Compete & Build Reputation',
    time: '17 يوليو — ديسمبر 2026',
    deadline: 'ديسمبر 2026',
    deadlineDate: '2026-12-31',
    color: 'red',
    hoursPerDay: 6,
    mentor: 'دلوقتي بقيت جاهز تنافس. مش هتكسب من أول contest — ده طبيعي. الهدف إنك تشارك وتتعلم. كل finding valid هو إنجاز حقيقي.',
    dailySchedule: {
      morning: 'اقرا الـ codebase بتاع الـ contest الجاري — افهم الـ business logic',
      afternoon: 'دور على ثغرات واكتب findings',
      evening: 'اقرا write-ups لـ auditors تانيين على Twitter/X وتعلم منهم',
      night: 'commit على GitHub Portfolio + تواصل مع community',
    },
    englishStrategy: 'الـ community في Discord وTwitter — بيساعدوا المبتدئين. اكتب سؤالك بالإنجليزي وClaude يساعدك تصيغه صح',
    tasks: [
      {
        text: 'اشترك في Competitive Audit حقيقي على CodeHawks',
        days: 14,
        tip: 'اختار contest فيه protocol مش معقد جداً. افهم الـ business logic الأول.',
        resource: 'https://www.codehawks.com/',
        deliverable: 'submitted findings في contest حقيقي',
        done_criteria: 'finding واحد على الأقل submitted',
        howToStudy: `① اختار contest الـ codebase بتاعه صغير (تحت 500 سطر)
② اقرا الـ README الأول — Claude: "ترجم وشرح لي الـ protocol ده"
③ بعد ما تفهم — ابدأ تدور على ثغرات
④ اكتب كل finding وsubmit حتى لو مش واثق 100%`,
      },
      {
        text: 'بناء الـ GitHub Portfolio',
        days: 5,
        tip: 'الـ portfolio بتاعك هو CV بتاعك في الـ web3.',
        resource: 'https://github.com/',
        deliverable: 'audit-portfolio repo على GitHub فيه: كل العقود، كل الـ reports، كل الـ CTF solutions',
        done_criteria: 'الـ README بيشرح مستواك بوضوح',
        howToStudy: `① Claude: "ساعدني أكتب README لـ GitHub portfolio لـ smart contract auditor مبتدئ"
② حط كل الكود اللي كتبته من Phase 1 لـ 4
③ لكل project: README بالعربي والإنجليزي
④ الـ portfolio ده هو اللي هيفتحلك الباب للعمل`,
      },
      {
        text: 'Immunefi — ابدأ Bug Bounties',
        days: 14,
        tip: 'Immunefi فيه bug bounties حقيقية. ابدأ بالـ protocols الصغيرة.',
        resource: 'https://immunefi.com/',
        deliverable: 'ابحث في 3 protocols وابعت report ولو لـ low severity finding',
        done_criteria: 'report واحد مبعوت على Immunefi',
        howToStudy: `① ابحث عن bounties بـ low/medium scope أول
② اقرا الـ scope بتاع كل bounty — Claude: "ترجم وشرح الـ scope ده"
③ نفس methodology الـ audit — افهم الكود الأول
④ حتى لو مش لاقي حاجة — الخبرة بتتبني`,
      },
      {
        text: 'Twitter/X — ابني presence في الـ community',
        days: 7,
        tip: 'الـ web3 security community صغيرة ومترابطة.',
        resource: 'https://twitter.com/PatrickAlphaC',
        deliverable: 'اكتب 4 threads على Twitter عن حاجات اتعلمتها',
        done_criteria: 'thread واحد وصل لـ 50+ impression',
        howToStudy: `① follow: @PatrickAlphaC, @bytes032, @pashovkrum, @dacian0
② اقرا threads بتاعتهم يومياً — ده تعليم مجاني
③ اكتب thread بالعربي عن vulnerability اتعلمتها
④ Claude: "ساعدني أكتب thread بالإنجليزي عن [الموضوع]"`,
      },
      {
        text: 'تواصل مع شركات Audit للـ internship أو part-time',
        days: 14,
        tip: 'بحلول نهاية 2026 هيكون عندك portfolio قوي كفاية.',
        resource: 'https://www.codehawks.com/',
        deliverable: 'ابعت 5 applications لشركات audit أو firms',
        done_criteria: 'رد واحد إيجابي على الأقل',
        howToStudy: `① دور على شركات: Trail of Bits, Sherlock, Code4rena, Spearbit
② Claude: "ساعدني أكتب cover letter لـ smart contract auditor junior position"
③ الـ GitHub Portfolio بتاعك هو أهم حاجة في الـ application
④ مارس 2027: هتكون عندك دخل كافي للسفر`,
      },
    ],
  },
]

// ── ENGLISH STRATEGY COMPONENT ────────────────────────────────────────────────
function EnglishStrategyCard() {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      background: 'var(--surface2)', borderRadius: 10, padding: '14px 18px',
      border: '1px solid var(--accent3)', marginBottom: 16,
    }}>
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        onClick={() => setOpen(o => !o)}
      >
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700 }}>
          🇬🇧 استراتيجية التعامل مع الإنجليزي
        </div>
        <span style={{ color: 'var(--text3)', fontSize: 12 }}>{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { icon: '🎧', title: 'لما تشاهد فيديو على Cyfrin', tip: 'شاهد بـ x1.0 — مش أسرع. تحت كل فيديو فيه "Transcript" — افتحه. لو جملة مش فاهمها: copy وحطها في Claude وقوله "ترجم وشرح بالعربي"' },
            { icon: '📖', title: 'لما تقرا documentation أو articles', tip: 'مش لازم تفهم كل كلمة. افهم الـ concept الأساسي. Claude هو قاموسك التقني — "ايه معنى [الكلمة] في سياق Solidity؟"' },
            { icon: '💻', title: 'لما تشتغل على كود', tip: 'الكود أسهل من الكلام. variable names وcomments بتساعدك. Claude: "اشرح لي الـ function دي سطر بسطر بالعربي"' },
            { icon: '🐛', title: 'لما تلاقي error', tip: 'copy الـ error كامل وحطه في Claude وقوله "ليه الـ error ده بيحصل وإزاي أصلحه؟" — مش محتاج تفهم الإنجليزي عشان تحل الـ error' },
            { icon: '📝', title: 'لما تكتب audit report', tip: 'اكتبه بالعربي الأول وبعدين Claude: "ترجم الـ finding ده للإنجليزي بأسلوب احترافي" — الـ reports المترجمة مقبولة تماماً' },
            { icon: '⏳', title: 'مع الوقت', tip: 'بعد 3-4 أشهر هتلاقي إنك بدأت تفهم كتير من غير ما تترجم. الإنجليزي التقني بيتعلم تلقائي لما بتقرا كود كتير' },
          ].map((item, i) => (
            <div key={i} style={{
              background: 'var(--surface)', borderRadius: 8, padding: '10px 14px',
              border: '1px solid var(--border)',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--accent3)', marginBottom: 4 }}>
                {item.icon} {item.title}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text2)', lineHeight: 1.7 }}>
                {item.tip}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── DAILY SCHEDULE COMPONENT ───────────────────────────────────────────────────
function DailyScheduleCard({ schedule, phase }) {
  const [open, setOpen] = useState(false)
  if (!schedule) return null
  return (
    <div style={{
      background: 'var(--surface2)', borderRadius: 8, padding: '10px 14px',
      border: '1px solid var(--border)', marginBottom: 10,
    }}>
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        onClick={() => setOpen(o => !o)}
      >
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent2)' }}>
          📅 الجدول اليومي — Phase {phase}
        </div>
        <span style={{ color: 'var(--text3)', fontSize: 11 }}>{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { time: '⏰ ساعة 1', label: 'الصبح', content: schedule.morning },
            { time: '⏰ ساعة 2-3', label: 'الضهر', content: schedule.afternoon },
            { time: '⏰ ساعة 4-5', label: 'العصر', content: schedule.evening },
            { time: '⏰ ساعة 6', label: 'الليل', content: schedule.night },
          ].map((slot, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent)',
                minWidth: 80, paddingTop: 2,
              }}>
                {slot.time}<br />{slot.label}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text2)', lineHeight: 1.6, flex: 1 }}>
                {slot.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── helper ────────────────────────────────────────────────────────────────────
const accentMap = {
  green: 'var(--accent)',
  purple: 'var(--accent2)',
  yellow: 'var(--accent3)',
  red: 'var(--accent4)',
  blue: 'var(--accent5)',
}
const badgeCls = (pct) => pct === 100 ? 'complete' : pct > 0 ? 'active' : 'locked'
const badgeTxt = (pct) => pct === 100 ? 'DONE' : pct > 0 ? `${pct}%` : 'LOCKED'

// days until deadline
function daysUntil(dateStr) {
  const target = new Date(dateStr)
  const now = new Date()
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24))
  if (diff < 0) return `تأخرت ${Math.abs(diff)} يوم`
  if (diff === 0) return 'اليوم آخر يوم!'
  return `${diff} يوم متبقي`
}

// ── TaskRow ───────────────────────────────────────────────────────────────────
function TaskRow({ task, isDone, onToggle }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ marginBottom: 6 }}>
      <div className="task-item" style={{ alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
        <div
          className={`task-check ${isDone ? 'done' : ''}`}
          style={{ marginTop: 2, flexShrink: 0, cursor: 'pointer' }}
          onClick={onToggle}
        />
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

      {open && (
        <div style={{
          marginTop: 6, marginLeft: 28,
          background: 'var(--surface2)', borderRadius: 8,
          padding: '10px 14px', border: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          {/* tip */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent3)', marginBottom: 3 }}>💡 نصيحة</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text2)', lineHeight: 1.7 }}>{task.tip}</div>
          </div>

          {/* how to study */}
          {task.howToStudy && (
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent2)', marginBottom: 3 }}>📚 إزاي تذاكر — خطوة بخطوة</div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text2)',
                lineHeight: 1.9, whiteSpace: 'pre-line',
              }}>{task.howToStudy}</div>
            </div>
          )}

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

// ── main component ─────────────────────────────────────────────────────────────
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

  return (
    <div>
      {/* ── header ── */}
      <div className="page-header">
        <div className="page-title">الـ <span>Roadmap</span></div>
        <div className="page-sub">// هدف السفر: مارس 2027 · 6 ساعات يومياً · ابدأ النهارده</div>
      </div>

      {/* ── overall progress ── */}
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
          {totalDone} مهمة مكتملة · {totalAll - totalDone} مهمة متبقية · 🎯 مارس 2027
        </div>
      </div>

      {/* ── english strategy ── */}
      <EnglishStrategyCard />

      {/* ── weekly rule ── */}
      <div className="mentor-card" style={{ marginBottom: 16 }}>
        <div className="mentor-title">📏 قانون الأسبوع</div>
        <div className="mentor-tip">
          كل يوم جمعة اسأل نفسك:{' '}
          <strong>"الـ deliverable بتاع الأسبوع ده موجود ومكتوب ولا لأ؟"</strong>
          <br /><br />
          ✅ آه = أنت في المعدل.{' '}
          ❌ لأ = اتأخرت أسبوع — مش نهاية الدنيا، بس اعترف وعدّل.
          <br /><br />
          <strong>لو ضعيف في الإنجليزي:</strong> استخدم Claude في كل خطوة.
          الكود مش بيتكلم إنجليزي — بيتكلم logic.
        </div>
      </div>

      {/* ── phases ── */}
      {PHASES.map(p => {
        const done     = p.tasks.filter((_, i) => roadmap[`${p.phase}_${i}`]).length
        const pct      = Math.round((done / p.tasks.length) * 100)
        const isExp    = expanded[p.phase]
        const phaseDays = p.tasks.reduce((a, t) => a + t.days, 0)
        const remaining = daysUntil(p.deadlineDate)

        return (
          <div
            key={p.phase}
            className="phase-card"
            style={{ borderTop: `2px solid ${accentMap[p.color]}`, marginBottom: 12 }}
          >
            {/* header */}
            <div
              className="phase-header"
              onClick={() => setExpanded(e => ({ ...e, [p.phase]: !e[p.phase] }))}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 }}>
                  {p.title}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>
                  {p.time} · {done}/{p.tasks.length} مكتمل · 📅 {p.deadline} · ⏳ {remaining}
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

            {isExp && (
              <>
                {/* mentor */}
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  color: 'var(--text3)', lineHeight: 1.7,
                  padding: '8px 4px 12px', borderBottom: '1px solid var(--border)',
                  marginBottom: 10,
                }}>
                  💬 {p.mentor}
                </div>

                {/* daily schedule */}
                <DailyScheduleCard schedule={p.dailySchedule} phase={p.phase} />

                {/* english strategy per phase */}
                {p.englishStrategy && (
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10,
                    color: 'var(--accent3)', padding: '6px 10px',
                    background: 'var(--surface2)', borderRadius: 6,
                    border: '1px solid var(--border)', marginBottom: 10,
                  }}>
                    🇬🇧 {p.englishStrategy}
                  </div>
                )}

                {/* tasks */}
                {p.tasks.map((task, i) => (
                  <TaskRow
                    key={i}
                    task={task}
                    isDone={!!roadmap[`${p.phase}_${i}`]}
                    onToggle={() => toggle(p.phase, i)}
                  />
                ))}

                {/* footer */}
                <div style={{
                  marginTop: 12, padding: '8px 4px 0',
                  borderTop: '1px solid var(--border)',
                  fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text3)',
                }}>
                  ⏱ إجمالي وقت الـ phase: ~{phaseDays} يوم بمعدل 6 ساعات يومياً
                </div>
              </>
            )}
          </div>
        )
      })}

      {/* ── resources ── */}
      <div style={{
        marginTop: 24, background: 'var(--surface2)',
        borderRadius: 10, padding: '16px 18px',
        border: '1px solid var(--border)',
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
          🔗 المصادر الأساسية
        </div>
        {[
          { label: 'Cyfrin Updraft — كل الكورسات (مع transcript)', url: 'https://updraft.cyfrin.io' },
          { label: 'Foundry Book — الدوكيومنتيشن الرسمي', url: 'https://book.getfoundry.sh' },
          { label: 'OpenZeppelin Contracts — اقرا الكود', url: 'https://github.com/OpenZeppelin/openzeppelin-contracts' },
          { label: 'SWC Registry — كل الـ vulnerabilities', url: 'https://swcregistry.io' },
          { label: 'Ethernaut CTF — ابدأ من هنا', url: 'https://ethernaut.openzeppelin.com' },
          { label: 'Damn Vulnerable DeFi — المرحلة التالية', url: 'https://www.damnvulnerabledefi.xyz' },
          { label: 'CodeHawks — First Flights & Contests', url: 'https://www.codehawks.com' },
          { label: 'Solidity by Example — كود بدون كلام كتير', url: 'https://solidity-by-example.org' },
          { label: 'RareSkills — Gas + DeFi deep dives', url: 'https://www.rareskills.io' },
          { label: 'Trail of Bits — Audit Reports حقيقية', url: 'https://github.com/trailofbits/publications' },
          { label: 'Claude AI — مساعدك في الترجمة والشرح', url: 'https://claude.ai' },
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
