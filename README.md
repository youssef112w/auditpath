# 🛡️ AuditPath — Smart Contract Auditor Tracker
> أداة يومية لتتبع رحلة تعلم Smart Contract Auditing → Security Researcher

---

## 📁 هيكل المشروع

```
auditpath/
├── frontend/          ← React + Vite (الواجهة)
│   ├── src/
│   │   ├── pages/     ← كل صفحة في ملف منفصل
│   │   ├── components/ ← مكونات مشتركة
│   │   ├── App.jsx    ← الـ Router الرئيسي
│   │   ├── AuthContext.jsx ← إدارة المستخدم
│   │   ├── api.js     ← Axios instance
│   │   └── styles.css ← كل الـ CSS
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/           ← Node.js + Express + Prisma
│   ├── src/
│   │   ├── routes/    ← كل route في ملف منفصل
│   │   │   ├── auth.js
│   │   │   ├── sessions.js
│   │   │   ├── roadmap.js
│   │   │   ├── audits.js
│   │   │   ├── vulns.js
│   │   │   ├── challenges.js
│   │   │   ├── journal.js
│   │   │   ├── portfolio.js
│   │   │   └── stats.js
│   │   ├── middleware/
│   │   │   └── auth.js  ← JWT middleware
│   │   └── index.js   ← Express server
│   ├── prisma/
│   │   └── schema.prisma ← Database schema
│   ├── .env.example
│   └── package.json
│
└── README.md (الملف ده)
```

---

## 🚀 خطوات التشغيل من الصفر

### الخطوة 1 — تثبيت المتطلبات

لازم يكون عندك:
- **Node.js v18+** → https://nodejs.org
- **PostgreSQL** → https://postgresql.org/download

تأكد إنهم موجودين:
```bash
node --version    # should show v18+
npm --version     # should show v9+
psql --version    # should show PostgreSQL 14+
```

---

### الخطوة 2 — إنشاء قاعدة البيانات

افتح terminal واكتب:
```bash
# دخول على PostgreSQL
psql -U postgres

# إنشاء قاعدة البيانات
CREATE DATABASE auditpath;

# خروج
\q
```

---

### الخطوة 3 — إعداد الـ Backend

```bash
# انتقل لمجلد الـ backend
cd backend

# تثبيت الـ packages
npm install

# انسخ ملف الـ environment
cp .env.example .env
```

افتح ملف `.env` وعدل السطر ده:
```env
DATABASE_URL="postgresql://postgres:كلمة_المرور_بتاعتك@localhost:5432/auditpath"
JWT_SECRET="اكتب_هنا_كلمة_سر_طويلة_عشوائية"
```

ثم:
```bash
# إنشاء جداول قاعدة البيانات
npx prisma db push

# (اختياري) عشان تشوف الـ database بـ UI حلو
npx prisma studio
```

تشغيل الـ backend:
```bash
npm run dev
```

هتشوف:
```
🚀 AuditPath API running on http://localhost:3001
```

---

### الخطوة 4 — إعداد الـ Frontend

افتح terminal تاني وقول:
```bash
# انتقل لمجلد الـ frontend
cd frontend

# تثبيت الـ packages
npm install

# تشغيل
npm run dev
```

هتشوف:
```
  VITE v5.0.x  ready in 300 ms

  ➜  Local:   http://localhost:5173/
```

---

### الخطوة 5 — افتح المتصفح

اذهب إلى: **http://localhost:5173**

1. اضغط "إنشاء حساب"
2. اكتب username, email, password
3. ابدأ رحلتك! 🚀

---

## 📖 كيفية الاستخدام الصحيح (نصائح الـ Mentor)

### ✅ روتين كل يوم (مهم جدًا):

```
1. افتح http://localhost:5173
2. Dashboard → اضغط "ابدأ الجلسة" ← أول حاجة قبل أي كود
3. ذاكر / اشتغل
4. Dashboard → "أنهِ وسجل" ← بعد ما تخلص
5. سجل أي حاجة عملتها في قسمها الصح
```

### 📌 أي قسم يستخدم امتى:

| القسم | امتى تفتحه |
|-------|-----------|
| **Dashboard** | كل يوم — أول وآخر حاجة |
| **Roadmap** | كل ما تخلص task جديدة |
| **Audit Lab** | بعد كل عقد بتحلله — فورًا |
| **Encyclopedia** | كل ما تتعلم ثغرة جديدة |
| **Challenges** | بعد كل CTF أو security lab |
| **Research Journal** | أي فكرة أو سؤال يجيلك |
| **Portfolio** | شوف تقدمك وشارك الـ link |
| **Mentor Guide** | لما تحتاج توجيه أو motivation |

---

## 🛠️ API Endpoints

### Auth
```
POST /api/auth/register   ← إنشاء حساب
POST /api/auth/login      ← تسجيل دخول
GET  /api/auth/me         ← بياناتك
```

### Sessions (ساعات المذاكرة)
```
GET    /api/sessions      ← كل الجلسات
POST   /api/sessions      ← جلسة جديدة
DELETE /api/sessions/:id  ← حذف جلسة
```

### Roadmap
```
GET  /api/roadmap          ← تقدمك
POST /api/roadmap/toggle   ← تحديد/إلغاء task
```

### Audits
```
GET    /api/audits      ← كل العقود
POST   /api/audits      ← عقد جديد
PUT    /api/audits/:id  ← تعديل
DELETE /api/audits/:id  ← حذف
```

### Vulnerabilities
```
GET    /api/vulns      ← الثغرات
POST   /api/vulns      ← ثغرة جديدة
DELETE /api/vulns/:id  ← حذف
```

### Challenges
```
GET    /api/challenges      ← التحديات
POST   /api/challenges      ← تحدي جديد
PUT    /api/challenges/:id  ← تحديث (solved)
DELETE /api/challenges/:id  ← حذف
```

### Journal
```
GET    /api/journal      ← المقالات
POST   /api/journal      ← مقالة جديدة
DELETE /api/journal/:id  ← حذف
```

### Portfolio (عام)
```
GET /api/portfolio/public/:username ← الـ portfolio العام
```

### Stats (Dashboard)
```
GET /api/stats ← كل الإحصاءات للـ dashboard
```

---

## 🌐 النشر على الإنترنت (Deployment)

### Backend → Railway
```bash
# سجل في railway.app
# New Project → Deploy from GitHub
# Add PostgreSQL database
# Set environment variables:
#   DATABASE_URL = الـ URL من Railway
#   JWT_SECRET   = كلمة سر قوية
#   FRONTEND_URL = رابط الـ frontend
```

### Frontend → Vercel
```bash
# سجل في vercel.com
# New Project → Import from GitHub
# Add environment variable:
#   VITE_API_URL = رابط الـ backend على Railway
```

---

## 🔧 أوامر مفيدة

```bash
# مشاهدة الـ database بـ UI
cd backend && npx prisma studio

# Reset الـ database (احذر!)
cd backend && npx prisma db push --force-reset

# Build الـ frontend للـ production
cd frontend && npm run build
```

---

## 💡 ملاحظات مهمة

1. **الـ .env ملف سري** — لا ترفعه على GitHub أبدًا
2. **البيانات محفوظة في PostgreSQL** — مش هتتمسح
3. **الـ JWT token** بينتهي بعد 30 يوم — هتحتاج تسجل دخول تاني
4. **الـ streak** بيتحسب يوميًا بناءً على الجلسات المسجلة

---

## 📞 مشاكل شائعة وحلولها

**مشكلة: `Cannot connect to database`**
```bash
# تأكد إن PostgreSQL شغال
sudo service postgresql start  # Linux
# أو من pgAdmin على Windows
```

**مشكلة: `Port 3001 already in use`**
```bash
# غير الـ PORT في .env
PORT=3002
```

**مشكلة: CORS error في المتصفح**
```bash
# تأكد إن FRONTEND_URL في .env صح
FRONTEND_URL="http://localhost:5173"
```

---

*Built for the journey from Smart Contract Auditor → Security Researcher* 🛡️
