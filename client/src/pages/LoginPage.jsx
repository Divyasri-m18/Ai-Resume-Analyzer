import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: 'calc(100vh - 100px)',
      padding: '2rem'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card" 
        style={{ padding: '3rem', width: '100%', maxWidth: '450px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
          <p style={{ opacity: 0.7 }}>Sign in to access your resume history</p>
        </div>

        {error && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '1rem', 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            color: '#ef4444', 
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem'
          }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
              <input 
                type="email" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.75rem 1rem 0.75rem 3rem', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  color: 'inherit',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.75rem 1rem 0.75rem 3rem', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  color: 'inherit',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '1rem' 
            }}
          >
            {loading ? 'Signing in...' : (
              <>
                <LogIn size={20} />
                Sign In
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.95rem' }}>
          <span style={{ opacity: 0.7 }}>Don't have an account? </span>
          <Link to="/signup" style={{ color: 'var(--accent-color)', fontWeight: '600', textDecoration: 'none' }}>Sign Up</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
