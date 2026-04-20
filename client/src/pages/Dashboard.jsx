import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FileText, Calendar, ChevronRight, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { getAuthorizedConfig, user } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const config = getAuthorizedConfig();
        const { data } = await axios.get('/api/resumes', config);
        setResumes(data);
      } catch (err) {
        setError('Failed to load history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 className="animate-spin" size={40} style={{ color: 'var(--accent-color)' }} />
      </div>
    );
  }

  return (
    <div className="container">
      <header style={{ marginBottom: '3rem' }}>
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ fontSize: '2.5rem' }}
        >
          Welcome back, <span style={{ color: 'var(--accent-color)' }}>{user?.name}</span>
        </motion.h2>
        <p style={{ opacity: 0.7 }}>Manage your resume analyses and track your progress.</p>
      </header>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', marginBottom: '2rem' }}>
          <AlertCircle size={20} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {resumes.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center' }}>
            <FileText size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '1rem' }}>No resumes found</h3>
            <p style={{ opacity: 0.7, marginBottom: '2rem' }}>Upload your first resume to get started!</p>
            <Link to="/">
              <button>Analyze Resume Now</button>
            </Link>
          </div>
        ) : (
          resumes.map((resume, index) => (
            <motion.div 
              key={resume.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card" 
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '8px', 
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-color)'
                  }}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {resume.fileName}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', opacity: 0.6 }}>
                      <Calendar size={12} />
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '800', 
                  color: getScoreColor(resume.analysis.score) 
                }}>
                  {resume.analysis.score}
                </div>
              </div>

              {resume.targetRole && (
                <div style={{ fontSize: '0.9rem', opacity: 0.8, backgroundColor: 'rgba(0,0,0,0.05)', padding: '0.5rem', borderRadius: '4px' }}>
                  <strong>Role:</strong> {resume.targetRole}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {resume.analysis.skills.slice(0, 3).map((skill, i) => (
                  <span key={i} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', backgroundColor: 'var(--border-color)', borderRadius: '4px' }}>
                    {skill}
                  </span>
                ))}
                {resume.analysis.skills.length > 3 && (
                  <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>+{resume.analysis.skills.length - 3} more</span>
                )}
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--success)', fontWeight: '600' }}>
                  <TrendingUp size={16} />
                  Match Score
                </div>
                <Link to="/" state={{ analysis: { data: resume } }} style={{ color: 'var(--accent-color)', display: 'flex', alignItems: 'center', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem' }}>
                  Details <ChevronRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
