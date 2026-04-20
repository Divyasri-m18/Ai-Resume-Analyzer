import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus, AlertCircle } from 'lucide-react';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await signup(name, email, password);
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card" 
        style={{ padding: '3rem', width: '100%', maxWidth: '450px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create Account</h2>
          <p style={{ opacity: 0.7 }}>Start tracking your resume performance</p>
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
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
              <input 
                type="text" 
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                minLength={6}
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
            {loading ? 'Creating account...' : (
              <>
                <UserPlus size={20} />
                Create Account
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.95rem' }}>
          <span style={{ opacity: 0.7 }}>Already have an account? </span>
          <Link to="/login" style={{ color: 'var(--accent-color)', fontWeight: '600', textDecoration: 'none' }}>Sign In</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
