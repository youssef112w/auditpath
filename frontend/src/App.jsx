// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './AuthContext'

// Pages
import Login      from './pages/Login'
import Register   from './pages/Register'
import Dashboard  from './pages/Dashboard'
import Roadmap    from './pages/Roadmap'
import AuditLab   from './pages/AuditLab'
import Encyclopedia from './pages/Encyclopedia'
import Challenges from './pages/Challenges'
import Journal    from './pages/Journal'
import Portfolio  from './pages/Portfolio'
import MentorPage from './pages/MentorPage'
import PublicPortfolio from './pages/PublicPortfolio'
import Notif      from './components/Notif'

const NAV = [
  { to: '/',            label: 'Dashboard',        icon: '⬡' },
  { to: '/roadmap',     label: 'Roadmap',           icon: '◈' },
  { to: '/lab',         label: 'Audit Lab',         icon: '⊕' },
  { to: '/encyclopedia',label: 'Encyclopedia',      icon: '◎' },
  { to: '/challenges',  label: 'Challenges',        icon: '◆' },
  { to: '/journal',     label: 'Research Journal',  icon: '◐' },
  { to: '/portfolio',   label: 'Portfolio',         icon: '◉' },
  { to: '/mentor',      label: 'Mentor Guide',      icon: '✦' },
]

function Sidebar({ streak }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="sidebar">
      <div className="logo">
        <div className="logo-text">AuditPath</div>
        <div className="logo-sub">Smart Contract Auditor</div>
      </div>
      <div className="streak-badge">
        <div className="streak-num">🔥{streak}</div>
        <div className="streak-label">Day Streak</div>
      </div>
      {NAV.map(n => (
        <NavLink key={n.to} to={n.to} end={n.to==='/'} className={({isActive}) => `nav-item ${isActive?'active':''}`}>
          <span className="nav-icon">{n.icon}</span>
          <span>{n.label}</span>
        </NavLink>
      ))}
      <div style={{marginTop:'auto', padding:'16px 20px', borderTop:'1px solid var(--border)'}}>
        <div style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text3)',marginBottom:8}}>{user?.username}</div>
        <button className="btn btn-secondary btn-sm w-full" onClick={handleLogout} style={{width:'100%',justifyContent:'center'}}>تسجيل خروج</button>
      </div>
    </div>
  )
}

function AppLayout() {
  const { isAuth } = useAuth()
  const [streak, setStreak] = useState(0)
  const [notif, setNotif]   = useState(null)

  const notify = msg => setNotif(msg)

  if (!isAuth) return (
    <Routes>
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/p/:username" element={<PublicPortfolio />} />
      <Route path="*"         element={<Navigate to="/login" />} />
    </Routes>
  )

  return (
    <div className="layout">
      <Sidebar streak={streak} />
      <div className="main">
        <Routes>
          <Route path="/"             element={<Dashboard  notify={notify} onStreakChange={setStreak} />} />
          <Route path="/roadmap"      element={<Roadmap    notify={notify} />} />
          <Route path="/lab"          element={<AuditLab   notify={notify} />} />
          <Route path="/encyclopedia" element={<Encyclopedia notify={notify} />} />
          <Route path="/challenges"   element={<Challenges notify={notify} />} />
          <Route path="/journal"      element={<Journal    notify={notify} />} />
          <Route path="/portfolio"    element={<Portfolio  notify={notify} />} />
          <Route path="/mentor"       element={<MentorPage />} />
          <Route path="*"             element={<Navigate to="/" />} />
        </Routes>
      </div>
      {notif && <Notif msg={notif} onClose={() => setNotif(null)} />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  )
}
