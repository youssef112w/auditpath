import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStats } from '../hooks/useData';

const NAV = [
  { to: '/',            icon: '⬡', label: 'Dashboard' },
  { to: '/roadmap',     icon: '◈', label: 'Roadmap' },
  { to: '/lab',         icon: '⊕', label: 'Audit Lab' },
  { to: '/encyclopedia',icon: '◎', label: 'Encyclopedia' },
  { to: '/challenges',  icon: '◆', label: 'Challenges' },
  { to: '/journal',     icon: '◐', label: 'Research Journal' },
  { to: '/portfolio',   icon: '◉', label: 'Portfolio' },
  { to: '/mentor',      icon: '✦', label: 'Mentor Guide' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { stats } = useStats();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-name">AuditPath</div>
          <div className="logo-sub">Smart Contract Auditor</div>
        </div>

        <div className="streak-pill">
          <div className="streak-number">🔥{stats?.streak?.current || 0}</div>
          <div className="streak-label">Day Streak</div>
        </div>

        <nav>
          {NAV.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: '16px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)', marginBottom: 8 }}>
            @{user?.username}
          </div>
          <button className="btn btn-secondary btn-sm" style={{ width: '100%' }} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
