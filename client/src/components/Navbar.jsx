import { Sun, Moon, Sparkles, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ theme, toggleTheme }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'var(--card-bg)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
        <Sparkles style={{ color: 'var(--accent-color)' }} />
        <span>ResumeAI</span>
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {user ? (
          <>
            <Link to="/dashboard" style={{ 
              textDecoration: 'none', 
              color: 'inherit', 
              fontSize: '0.9rem', 
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--accent-color)', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <button 
                onClick={handleLogout}
                style={{ 
                  padding: '0.4rem 0.8rem', 
                  fontSize: '0.8rem', 
                  backgroundColor: 'transparent', 
                  color: 'inherit',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/login" style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.9rem', fontWeight: '500' }}>Login</Link>
            <Link to="/signup">
              <button style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Get Started</button>
            </Link>
          </div>
        )}

        <div 
          onClick={toggleTheme}
          style={{
            width: '46px',
            height: '24px',
            borderRadius: '12px',
            backgroundColor: 'var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            padding: '2px',
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.3s ease'
          }}
        >
          <div style={{
            position: 'absolute',
            left: theme === 'light' ? '2px' : 'calc(100% - 22px)',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            {theme === 'light' ? <Sun size={12} color="#f59e0b" /> : <Moon size={12} color="#6366f1" />}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
