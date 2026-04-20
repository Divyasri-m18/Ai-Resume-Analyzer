import { NavLink } from 'react-router-dom';
import { 
  PlusCircle, 
  LayoutDashboard, 
  HelpCircle, 
  LineChart, 
  Sparkles,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold', fontSize: '1.25rem' }}>
          <Sparkles style={{ color: 'var(--accent-color)' }} />
          <span>ResumeAI</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <PlusCircle size={20} />
          <span>Analyze Resume</span>
        </NavLink>
        
        <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/interview" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <HelpCircle size={20} />
          <span>Interview Prep</span>
        </NavLink>

        <NavLink to="/skill-gap" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <LineChart size={20} />
          <span>Skill Gap Analysis</span>
        </NavLink>
      </nav>

      <div style={{ marginTop: 'auto', padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '10px', 
            backgroundColor: 'var(--accent-color)', 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>Pro Account</div>
          </div>
        </div>
        
        <button 
          onClick={logout}
          className="nav-link"
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', paddingLeft: '1rem' }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
