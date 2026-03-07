import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import AuditLab from './pages/AuditLab';
import Encyclopedia from './pages/Encyclopedia';
import Challenges from './pages/Challenges';
import Journal from './pages/Journal';
import Portfolio from './pages/Portfolio';
import MentorGuide from './pages/MentorGuide';
import PublicPortfolio from './pages/PublicPortfolio';
import './styles/global.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="loader" /></div>;
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="loader" /></div>;
  return !user ? children : <Navigate to="/" />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/p/:username" element={<PublicPortfolio />} />

      {/* Protected */}
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index            element={<Dashboard />} />
        <Route path="roadmap"   element={<Roadmap />} />
        <Route path="lab"       element={<AuditLab />} />
        <Route path="encyclopedia" element={<Encyclopedia />} />
        <Route path="challenges"   element={<Challenges />} />
        <Route path="journal"   element={<Journal />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="mentor"    element={<MentorGuide />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
