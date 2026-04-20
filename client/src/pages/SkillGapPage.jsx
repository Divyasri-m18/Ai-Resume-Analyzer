import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  LineChart, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Target,
  ArrowUpRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { motion } from 'framer-motion';

const SkillGapPage = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [fetchingResumes, setFetchingResumes] = useState(true);
  const [activeResume, setActiveResume] = useState(null);
  
  const { getAuthorizedConfig } = useAuth();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const config = getAuthorizedConfig();
        const { data } = await axios.get('/api/resumes', config);
        // Filter only those that have targetDescription (and thus skillGaps)
        const tailoredResumes = data.filter(r => r.targetDescription && r.analysis.skillGaps);
        setResumes(tailoredResumes);
        if (tailoredResumes.length > 0) {
          setSelectedResumeId(tailoredResumes[0].id);
          setActiveResume(tailoredResumes[0]);
        }
      } catch (err) {
        console.error('Failed to fetch resumes:', err);
      } finally {
        setFetchingResumes(false);
      }
    };
    fetchResumes();
  }, []);

  const handleSelect = (id) => {
    setSelectedResumeId(id);
    setActiveResume(resumes.find(r => r.id === id));
  };

  if (fetchingResumes) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Loader2 className="animate-spin" size={40} style={{ color: 'var(--accent-color)' }} />
      </div>
    );
  }

  const chartData = activeResume?.analysis?.skillGaps?.categories?.map(cat => ({
    subject: cat.name,
    A: cat.match,
    fullMark: 100,
  })) || [];

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', color: 'var(--accent-color)' }}>
            <LineChart size={28} />
          </div>
          <h2 style={{ fontSize: '2.5rem', margin: 0 }}>Skill Gap <span style={{ color: 'var(--accent-color)' }}>Analysis</span></h2>
        </div>
        <p style={{ opacity: 0.7, fontSize: '1.1rem' }}>Identify exactly what skills are missing for your target role and how to bridge the gap.</p>
      </header>

      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600' }}>Select Tailored Analysis</label>
            <select 
              value={selectedResumeId}
              onChange={(e) => handleSelect(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'rgba(0,0,0,0.03)',
                color: 'inherit',
                fontSize: '1rem'
              }}
            >
              {resumes.map(r => (
                <option key={r.id} value={r.id}>{r.fileName} - {r.targetRole} ({new Date(r.createdAt).toLocaleDateString()})</option>
              ))}
            </select>
          </div>
        </div>
        {resumes.length === 0 && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'rgba(99, 102, 241, 0.05)', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            Tip: Upload a resume with a "Job Description" on the home page to see skill gap results here.
          </div>
        )}
      </div>

      {activeResume && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          {/* Radar Chart Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card" 
            style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <h3 style={{ alignSelf: 'flex-start', marginBottom: '2rem' }}>Competency Match</h3>
            <div style={{ width: '100%', height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                  <PolarGrid stroke="var(--border-color)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-color)', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Skills Match"
                    dataKey="A"
                    stroke="var(--accent-color)"
                    fill="var(--accent-color)"
                    fillOpacity={0.6}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-color)' }}>
                {activeResume.analysis.atsMatch}%
              </div>
              <div style={{ opacity: 0.6, fontSize: '0.9rem' }}>Overall Keyword Match Score</div>
            </div>
          </motion.div>

          {/* Details Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card" 
              style={{ padding: '2rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <CheckCircle2 style={{ color: 'var(--success)' }} />
                <h3 style={{ margin: 0 }}>Matching Skills</h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {activeResume.analysis.skillGaps?.matching?.map((skill, i) => (
                  <span key={i} style={{ padding: '0.3rem 0.8rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '15px', fontSize: '0.85rem', fontWeight: '600' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card" 
              style={{ padding: '2rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <XCircle style={{ color: '#ef4444' }} />
                <h3 style={{ margin: 0 }}>Missing Skills</h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {activeResume.analysis.skillGaps?.missing?.map((skill, i) => (
                  <span key={i} style={{ padding: '0.3rem 0.8rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '15px', fontSize: '0.85rem', fontWeight: '600' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card" 
              style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Target style={{ color: 'var(--accent-color)' }} />
                <h3 style={{ margin: 0 }}>Growth Plan</h3>
              </div>
              <p style={{ fontSize: '0.95rem', opacity: 0.8, marginBottom: '1rem' }}>We recommend focusing on these areas to reach a 90%+ match:</p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {activeResume.analysis.improvements.slice(0, 3).map((imp, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <ArrowUpRight size={16} sx={{ color: 'var(--accent-color)' }} />
                    {imp}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      )}

      {!activeResume && !fetchingResumes && (
        <div style={{ textAlign: 'center', padding: '6rem', opacity: 0.5 }}>
          <TrendingUp size={64} style={{ marginBottom: '1.5rem' }} />
          <h2>No Tailored Analyses Yet</h2>
          <p>Go to 'Analyze Resume', upload your file and <strong>include a Job Description</strong> to see your skill gaps here.</p>
        </div>
      )}
    </div>
  );
};

export default SkillGapPage;
