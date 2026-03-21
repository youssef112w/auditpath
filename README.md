# 🛡️ AuditPath — Smart Contract Auditor Tracker

> أداة يومية لتتبع رحلة تعلم Smart Contract Auditing → Security Researcher

[![Built with Claude AI](https://img.shields.io/badge/Built%20with-Claude%20AI-6C3BF5?style=flat-square&logo=anthropic)](https://anthropic.com)
[![Frontend](https://img.shields.io/badge/Frontend-React%20+%20Vite-61DAFB?style=flat-square&logo=react)](https://vitejs.dev)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20+%20Prisma-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%2F%20Neon-4169E1?style=flat-square&logo=postgresql)](https://neon.tech)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel%20+%20Railway-000000?style=flat-square&logo=vercel)](https://vercel.com)

---

## 🤖 Built with AI — بصراحة وبفخر

المشروع ده اتبنى بمساعدة **Claude (Anthropic)** من الأول للآخر.

مش بس كتابة كود — ده شمل:
- تصميم الـ architecture والـ database schema
- اختيار الـ tech stack المناسب للهدف
- كتابة وـ refactoring الكود
- debugging المشاكل وإيجاد الحلول
- تحسين الأداء وتنظيم الملفات

**الـ AI أداة، مش بديل عن الفهم.**
كل سطر كود في المشروع ده مفهوم ومدروس — الـ AI سرّع التنفيذ، بس القرارات والاتجاه كانوا دايمًا للإنسان.

> *"The best tool is the one you actually use."*

---

## 🎯 إيه المشروع ده؟

AuditPath هو tracker يومي مصمم خصيصًا لـ Smart Contract Security Researchers.

بيساعدك على:
- **تتبع ساعات المذاكرة** بدقة مع timer احترافي
- **توثيق كل عقد** بتحلله في Audit Lab
- **بناء encyclopedia شخصية** للثغرات اللي بتتعلمها
- **تسجيل التحديات والـ CTFs** اللي بتحلها
- **كتابة research journal** لأفكارك وملاحظاتك
- **بناء portfolio عام** يتكلم عنك عند التقديم للشركات
- **الحفاظ على streak يومي** يحافظ على زخم التعلم

---

## 📁 هيكل المشروع

```
auditpath/
├── frontend/                    ← React + Vite
│   ├── src/
│   │   ├── pages/               ← صفحة لكل قسم
│   │   │   ├── Dashboard.jsx    ← الصفحة الرئيسية
│   │   │   ├── AuditLab.jsx     ← توثيق العقود
│   │   │   ├── Encyclopedia.jsx ← موسوعة الثغرات
│   │   │   ├── Challenges.jsx   ← التحديات والـ CTFs
│   │   │   ├── Journal.jsx      ← يومية البحث
│   │   │   ├── Roadmap.jsx      ← خريطة الطريق
│   │   │   ├── Portfolio.jsx    ← الملف الشخصي
│   │   │   └── MentorPage.jsx   ← دليل المرشد
│   │   ├── components/
│   │   │   └── SessionTimer.jsx ← Timer معزول للأداء
│   │   ├── hooks/
│   │   │   └── useTimer.js      ← Custom hook للـ Timer
│   │   ├── App.jsx              ← Router الرئيسي
│   │   ├── AuthContext.jsx      ← إدارة المستخدم
│   │   ├── api.js               ← Axios instance
│   │   └── styles.css           ← كل الـ CSS
│   └── package.json
│
├── backend/                     ← Node.js + Express + Prisma
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js          ← تسجيل الدخول والحساب
│   │   │   ├── sessions.js      ← جلسات المذاكرة
│   │   │   ├── stats.js         ← إحصاءات الـ Dashboard
│   │   │   ├── roadmap.js       ← تقدم الـ Roadmap
│   │   │   ├── audits.js        ← Audit Lab
│   │   │   ├── vulns.js         ← Encyclopedia
│   │   │   ├── challenges.js    ← Challenges
│   │   │   ├── journal.js       ← Research Journal
│   │   │   └── portfolio.js     ← Portfolio
│   │   ├── middleware/
│   │   │   └── auth.js          ← JWT middleware
│   │   └── index.js             ← Express server
│   ├── prisma/
│   │   └── schema.prisma        ← Database schema
│   └── package.json
│
└── README.md
```

---

## 🚀 تشغيل المشروع من الصفر

### المتطلبات
- **Node.js v18+** → https://nodejs.org
- **PostgreSQL** → https://postgresql.org أو **Neon** → https://neon.tech (cloud مجاني)

### الخطوة 1 — Clone المشروع
```bash
git clone https://github.com/youssef112w/auditpath.git
cd auditpath
```

### الخطوة 2 — إعداد الـ Backend
```bash
cd backend
npm install
cp .env.example .env
```

عدّل `.env`:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/auditpath"
JWT_SECRET="any-long-random-string-here"
FRONTEND_URL="http://localhost:5173"
PORT=3001
```

```bash
npx prisma db push    # إنشاء الجداول
npm run dev           # تشغيل الـ backend
```

### الخطوة 3 — إعداد الـ Frontend
```bash
cd frontend
npm install
```

إنشاء ملف `.env.local`:
```env
VITE_API_URL=http://localhost:3001/api
```

```bash
npm run dev
```

### الخطوة 4 — افتح المتصفح
```
http://localhost:5173
```

---

## 📖 دليل الاستخدام الكامل

### ⏱ الـ Dashboard — قلب كل حاجة

**الـ Session Timer:**
- اضغط **"ابدأ الجلسة"** قبل أي مذاكرة — مش بعدها
- استخدم **Pause** لو اتشتت أو خرجت — متوقفش التايمر خالص
- استخدم **Lap** لتسجيل نقاط وسطية في الجلسة
- اضغط **"أنهِ وسجل"** بعد ما تخلص فعلاً
- اضغط **✕** لو الجلسة مش محسوبة (راحة، تليفون، إلخ)

**الـ Intensity:**
- 🟢 **LOW** — مذاكرة نظرية، قراءة، مشاهدة
- 🟡 **MED** — تطبيق عادي، حل مسائل
- 🔴 **HIGH** — audit حقيقي، CTF، debugging صعب

**إزاي تحافظ على الـ Streak:**
- سجّل جلسة **كل يوم** — حتى لو 30 دقيقة
- الـ streak بيتحسب على أساس التاريخ — سجّل قبل النوم
- الجلسات بـ 0h بتظهر باللون الأحمر — احذفها من زرار ✕

---

### 🔬 الـ Audit Lab

**امتى تفتحه:** بعد كل عقد بتحلله — **فورًا**

**إزاي توثق:**
1. اسم العقد + رابطه
2. نوعه (DeFi, NFT, DAO, إلخ)
3. الثغرات اللي لقيتها — حتى لو 0
4. الوقت اللي استغرقته
5. ملاحظاتك الشخصية

> الفرق بين المحترف والهاوي: المحترف بيسجل حتى لما ملقاش ثغرات.

---

### 📖 الـ Encyclopedia

**امتى تفتحه:** كل ما تتعلم ثغرة جديدة

**إزاي تسجل ثغرة:**
- اسمها + الـ category (Reentrancy, Integer Overflow, إلخ)
- كود يوضح المشكلة
- كيفية الاستغلال
- كيفية الإصلاح
- مثال حقيقي من audit أو CTF

> بعد 3 شهور، هيبقى عندك encyclopedia شخصية بـ 30-50 ثغرة. ده مش موجود في أي كتاب.

---

### 🏆 الـ Challenges

**امتى تفتحه:** بعد كل CTF أو security lab

سجّل:
- اسم التحدي + المنصة (Ethernaut, Damn Vulnerable DeFi, إلخ)
- هل حللته؟ ✅ / ❌
- الوقت اللي استغرقته
- الـ approach اللي استخدمته

---

### 📝 الـ Research Journal

**امتى تفتحه:** أي وقت — أفكار، أسئلة، ملاحظات

> سؤال بدون إجابة هو بداية أي بحث حقيقي. اكتب حتى لو مش عارف.

---

### 🗺️ الـ Roadmap

**المسار الكامل:**

| Phase | المحتوى | المدة المقترحة |
|-------|---------|----------------|
| Phase 1 | Solidity Fundamentals + EVM Basics | 3-4 أسابيع |
| Phase 2 | Smart Contract Security Patterns | 3-4 أسابيع |
| Phase 3 | Ethernaut كامل + Audit Tools | 4-6 أسابيع |
| Phase 4 | Damn Vulnerable DeFi + DeFi Deep Dive | 4-6 أسابيع |
| Phase 5 | Code4rena Contests + Real Audits | مستمر |

**إزاي تستخدمه:** بعد ما تخلص task، اضغط عليها عشان تتحسب في الـ progress.

---

### 🌐 الـ Portfolio

الـ Portfolio بتاعك متاح للعموم على:
```
https://auditpath-nine.vercel.app/portfolio/public/USERNAME
```

شاركه في:
- الـ CV بتاعك
- Code4rena و Sherlock profiles
- LinkedIn و Twitter/X
- أي تقديم لـ audit firm

---

## 📅 الروتين اليومي المثالي

```
🌅 الصبح:
   → افتح Dashboard
   → اضغط "ابدأ الجلسة"
   → ذاكر / اشتغل

🌆 بعد الجلسة:
   → اضغط "أنهِ وسجل"
   → سجّل في القسم المناسب (Audit Lab / Encyclopedia / Challenges)
   → اكتب ولو جملة في الـ Journal

🌙 قبل النوم:
   → تأكد إن الـ streak محسوب
   → شوف الـ Roadmap — هل في task خلصت النهارده؟
```

---

## 🛠️ API Endpoints

### Auth
```
POST /api/auth/register   ← إنشاء حساب
POST /api/auth/login      ← تسجيل دخول
GET  /api/auth/me         ← بياناتك
```

### Sessions
```
GET    /api/sessions      ← كل الجلسات
POST   /api/sessions      ← جلسة جديدة
DELETE /api/sessions/:id  ← حذف جلسة
```

### Stats
```
GET /api/stats            ← كل إحصاءات الـ Dashboard
```

### Roadmap
```
GET  /api/roadmap         ← تقدمك
POST /api/roadmap/toggle  ← تحديد / إلغاء task
```

### Audits
```
GET    /api/audits        ← كل العقود
POST   /api/audits        ← عقد جديد
PUT    /api/audits/:id    ← تعديل
DELETE /api/audits/:id    ← حذف
```

### Vulnerabilities
```
GET    /api/vulns         ← الثغرات
POST   /api/vulns         ← ثغرة جديدة
DELETE /api/vulns/:id     ← حذف
```

### Challenges
```
GET    /api/challenges        ← التحديات
POST   /api/challenges        ← تحدي جديد
PUT    /api/challenges/:id    ← تحديث
DELETE /api/challenges/:id    ← حذف
```

### Journal
```
GET    /api/journal       ← المقالات
POST   /api/journal       ← مقالة جديدة
DELETE /api/journal/:id   ← حذف
```

### Portfolio
```
GET /api/portfolio/public/:username  ← الـ portfolio العام
```

---

## 🌐 النشر على الإنترنت

### Backend → Railway
```
1. سجّل في railway.app
2. New Project → Deploy from GitHub
3. اختار مجلد backend
4. Add PostgreSQL database (أو استخدم Neon)
5. Environment Variables:
   DATABASE_URL = connection string
   JWT_SECRET   = random secret
   FRONTEND_URL = رابط Vercel
```

### Frontend → Vercel
```
1. سجّل في vercel.com
2. New Project → Import from GitHub
3. Root Directory: frontend
4. Environment Variables:
   VITE_API_URL = رابط Railway + /api
```

---

## 🔧 أوامر مفيدة

```bash
# مشاهدة الـ database
cd backend && npx prisma studio

# Reset الـ database (احذر — بيمسح كل البيانات!)
cd backend && npx prisma db push --force-reset

# Build للـ production
cd frontend && npm run build

# فحص الـ git history
git log --oneline

# رجوع لـ commit معين
git checkout COMMIT_HASH -- path/to/file
```

---

## 💡 نصايح مهمة

1. **الـ .env ملف سري** — لا ترفعه على GitHub أبدًا
2. **سجّل كل حاجة فورًا** — الذاكرة بتخون
3. **الـ streak أهم من الساعات** — انتظام > كمية
4. **الـ JWT token** بينتهي بعد 30 يوم
5. **احذف الجلسات الفاضية** (بـ 0h) من زرار ✕ في الـ Dashboard
6. **الـ Portfolio** عام — تأكد إن الكلام فيه محترف

---

## 📞 مشاكل شائعة

**الـ backend مش بيشتغل:**
```bash
cd backend && npm run dev
# شوف الـ error في الـ terminal
```

**الـ streak بيتكسر:**
```
تأكد إنك بتسجل جلسة كل يوم قبل النوم
الجلسة لازم تتسجل في نفس التاريخ
```

**CORS error:**
```env
FRONTEND_URL="http://localhost:5173"  ← في backend .env
```

**Port already in use:**
```env
PORT=3002  ← في backend .env
```

---

## 🗺️ Resources المهمة

| Resource | الوصف | المرحلة |
|----------|-------|---------|
| [Ethernaut](https://ethernaut.openzeppelin.com) | أفضل بداية للـ security | Phase 3 |
| [Damn Vulnerable DeFi](https://www.damnvulnerabledefi.xyz) | DeFi attacks | Phase 4 |
| [Trail of Bits Blog](https://blog.trailofbits.com) | أعمق مصدر للـ research | كل المراحل |
| [Secureum](https://secureum.xyz) | EVM internals | Phase 2-3 |
| [RareSkills](https://rareskills.io) | Advanced Solidity | Phase 3-4 |
| [Code4rena](https://code4rena.com) | Real audit contests | Phase 5 |
| [Sherlock](https://sherlock.xyz) | Audit contests + مكافآت | Phase 5 |
| [Immunefi](https://immunefi.com) | Bug bounties | Phase 4-5 |

---

*Built for the journey: Smart Contract Auditor → Security Researcher* 🛡️

*Powered by curiosity, consistency, and Claude AI* 🤖
