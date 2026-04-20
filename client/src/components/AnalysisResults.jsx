import { Award, CheckCircle, TrendingUp, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const AnalysisResults = ({ data }) => {
  const { analysis } = data;
  
  // Helper to determine score color
  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}
    >
      {/* Score Card */}
      <motion.div variants={item} className="glass-card" style={{ padding: '2rem', textAlign: 'center', gridColumn: 'span 2' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ opacity: 0.7, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>General Resume Score</h3>
            <div style={{ 
              fontSize: '4.5rem', 
              fontWeight: '800', 
              color: getScoreColor(analysis.score),
              margin: '0.5rem 0'
            }}>
              {analysis.score}<span style={{ fontSize: '1.5rem', opacity: 0.5 }}>/100</span>
            </div>
          </div>

          {analysis.atsMatch && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', delay: 0.5 }}
            >
              <h3 style={{ opacity: 0.7, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Job Match (ATS)</h3>
              <div style={{ 
                fontSize: '4.5rem', 
                fontWeight: '800', 
                color: getScoreColor(analysis.atsMatch),
                margin: '0.5rem 0'
              }}>
                {analysis.atsMatch}<span style={{ fontSize: '1.5rem', opacity: 0.5 }}>%</span>
              </div>
            </motion.div>
          )}
        </div>
        
        <p style={{ fontSize: '1.2rem', fontWeight: '500', maxWidth: '700px', margin: '1rem auto 0' }}>
          {analysis.summary}
        </p>
      </motion.div>

      {/* Skills Card */}
      <motion.div variants={item} className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Award style={{ color: 'var(--accent-color)' }} />
          <h3 style={{ margin: 0 }}>Extracted Skills</h3>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {analysis.skills.map((skill, index) => (
            <span 
              key={index}
              style={{
                padding: '0.4rem 1rem',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                color: 'var(--accent-color)',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '500',
                border: '1px solid rgba(99, 102, 241, 0.2)'
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Improvements Card */}
      <motion.div variants={item} className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <TrendingUp style={{ color: 'var(--success)' }} />
          <h3 style={{ margin: 0 }}>Suggested Improvements</h3>
        </div>
        <ul style={{ listStyle: 'none' }}>
          {analysis.improvements.map((improvement, index) => (
            <li 
              key={index}
              style={{
                display: 'flex',
                gap: '0.75rem',
                marginBottom: '1rem',
                fontSize: '0.95rem',
                lineHeight: '1.4'
              }}
            >
              <CheckCircle size={18} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
              {improvement}
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default AnalysisResults;
