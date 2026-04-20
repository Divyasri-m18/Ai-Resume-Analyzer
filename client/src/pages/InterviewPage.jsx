import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  HelpCircle, 
  Loader2, 
  ChevronDown, 
  ChevronUp, 
  BrainCircuit,
  MessageCircle,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InterviewPage = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingResumes, setFetchingResumes] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  
  const { getAuthorizedConfig } = useAuth();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const config = getAuthorizedConfig();
        const { data } = await api.get('/api/resumes', config);
        setResumes(data);
        if (data.length > 0) setSelectedResumeId(data[0].id);
      } catch (err) {
        console.error('Failed to fetch resumes:', err);
      } finally {
        setFetchingResumes(false);
      }
    };
    fetchResumes();
  }, []);

  const generateQuestions = async () => {
    const selectedResume = resumes.find(r => r.id === selectedResumeId);
    if (!selectedResume) return;

    setLoading(true);
    setError('');
    setQuestions([]);

    try {
      const config = getAuthorizedConfig();
      const { data } = await api.post('/api/interview', {
        resumeText: selectedResume.extractedText,
        targetDescription: selectedResume.targetDescription
      }, config);
      setQuestions(data.questions);
    } catch (err) {
      setError('Failed to generate interview questions. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (fetchingResumes) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Loader2 className="animate-spin" size={40} style={{ color: 'var(--accent-color)' }} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', color: 'var(--accent-color)' }}>
            <HelpCircle size={28} />
          </div>
          <h2 style={{ fontSize: '2.5rem', margin: 0 }}>AI Interview <span style={{ color: 'var(--accent-color)' }}>Preparer</span></h2>
        </div>
        <p style={{ opacity: 0.7, fontSize: '1.1rem' }}>Get tailored practice questions based on your specific resume and target job role.</p>
      </header>

      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600' }}>Select Analyzed Resume</label>
            <select 
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
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
                <option key={r.id} value={r.id}>{r.fileName} ({new Date(r.createdAt).toLocaleDateString()})</option>
              ))}
            </select>
          </div>
          <button 
            onClick={generateQuestions} 
            disabled={loading || !selectedResumeId}
            style={{ 
              height: '52px', 
              padding: '0 2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            {loading ? <Loader2 className="animate-spin" /> : <BrainCircuit size={20} />}
            {loading ? 'Generating...' : 'Generate Questions'}
          </button>
        </div>
      </div>

      {error && (
        <div className="glass-card" style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {questions.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageCircle size={20} style={{ color: 'var(--accent-color)' }} />
              Interview Practice Set
            </h3>
            {questions.map((q, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card"
                style={{ marginBottom: '1rem', overflow: 'hidden' }}
              >
                <div 
                  onClick={() => toggleExpand(index)}
                  style={{ 
                    padding: '1.5rem', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    backgroundColor: expandedId === index ? 'rgba(99, 102, 241, 0.05)' : 'transparent'
                  }}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <span style={{ 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '6px', 
                      fontSize: '0.7rem', 
                      fontWeight: 'bold', 
                      backgroundColor: q.type === 'Technical' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      color: q.type === 'Technical' ? 'var(--accent-color)' : 'var(--success)',
                      marginTop: '0.2rem'
                    }}>
                      {q.type.toUpperCase()}
                    </span>
                    <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{q.question}</div>
                  </div>
                  {expandedId === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                
                <AnimatePresence>
                  {expandedId === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ borderTop: '1px solid var(--border-color)' }}
                    >
                      <div style={{ padding: '1.5rem', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: '700' }}>
                          <Sparkles size={14} />
                          SUGGESTED ANSWER
                        </div>
                        <p style={{ lineHeight: '1.6', opacity: 0.9 }}>{q.sampleAnswer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {!loading && questions.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
            <HelpCircle size={48} style={{ marginBottom: '1rem' }} />
            <p>Select a resume above and click 'Generate Questions' to start practicing.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewPage;
