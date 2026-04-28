import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home, LayoutDashboard, HeartHandshake, FileText } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import VolunteerPortal from './pages/VolunteerPortal';
import DataSubmission from './pages/DataSubmission';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <nav className="glass-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <HeartHandshake size={28} color="var(--primary)" />
          <h2 style={{ margin: 0, background: 'linear-gradient(135deg, #60a5fa, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            SmartAlloc
          </h2>
        </div>
        <div className="nav-links">
          <Link to="/"><Home size={18} /> Home</Link>
          <Link to="/dashboard"><LayoutDashboard size={18} /> NGO Dashboard</Link>
          <Link to="/volunteer"><HeartHandshake size={18} /> Volunteer</Link>
          <Link to="/submit"><FileText size={18} /> Submit Data</Link>
        </div>
      </nav>

      <main className="container animate-fade-in">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/volunteer" element={<VolunteerPortal />} />
          <Route path="/submit" element={<DataSubmission />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
