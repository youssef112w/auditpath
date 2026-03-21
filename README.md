# 🛡️ AuditPath

**Smart Contract Security Researcher Tracker**

A daily tracking tool built for the journey from Smart Contract Auditor → Security Researcher.

[![Live Demo](https://img.shields.io/badge/Live-auditpath--nine.vercel.app-00ff88?style=flat-square)](https://auditpath-nine.vercel.app)
[![Built with Claude AI](https://img.shields.io/badge/Built%20with-Claude%20AI-6C3BF5?style=flat-square)](https://anthropic.com)

---

## What is AuditPath?

AuditPath helps smart contract security researchers track their daily progress across every dimension of the journey:

- **Session Timer** — track study hours with a professional timer, laps, and intensity levels
- **Audit Lab** — document every contract you analyze, findings, and time spent
- **Vulnerability Encyclopedia** — build your personal knowledge base of vulnerabilities
- **Challenges** — log CTFs, Ethernaut levels, and security labs
- **Research Journal** — capture ideas, questions, and insights
- **Roadmap** — structured 5-phase learning path from Solidity basics to Code4rena contests
- **Portfolio** — a public profile that speaks for you when applying to audit firms
- **Streak System** — daily consistency tracking to maintain momentum

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| ORM | Prisma |
| Database | PostgreSQL (Neon) |
| Auth | JWT |
| Deploy | Vercel + Railway |

---

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL (local or [Neon](https://neon.tech) for free cloud hosting)

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in your DATABASE_URL and JWT_SECRET in .env
npx prisma db push
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# Create .env.local with VITE_API_URL=http://localhost:3001/api
npm run dev
```

Open `http://localhost:5173`

---

## Roadmap

| Phase | Focus | Duration |
|-------|-------|----------|
| 1 | Solidity Fundamentals + EVM Basics | 3-4 weeks |
| 2 | Smart Contract Security Patterns | 3-4 weeks |
| 3 | Ethernaut + Audit Tools | 4-6 weeks |
| 4 | Damn Vulnerable DeFi + DeFi Deep Dive | 4-6 weeks |
| 5 | Code4rena Contests + Real Audits | ongoing |


---

*Built for the journey: Smart Contract Auditor → Security Researcher* 🛡️
