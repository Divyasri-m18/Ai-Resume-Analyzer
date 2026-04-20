import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ResumeUpload from './components/ResumeUpload';
import AnalysisResults from './components/AnalysisResults';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import InterviewPage from './pages/InterviewPage';
import SkillGapPage from './pages/SkillGapPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (location.state?.analysis) {
      setAnalysis(location.state.analysis);
      window.scrollTo({ top: 500, behavior: 'smooth' });
    }
  }, [location]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleAnalysisComplete = (data) => {
    setAnalysis(data);
    setLoading(false);
  };

  const MainContent = () => (
    <main className="container">
      <Routes>
        <Route path="/" element={
          <>
            <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ fontSize: '3rem', marginBottom: '0.5rem' }}
              >
                AI Resume <span style={{ color: 'var(--accent-color)' }}>Analyzer</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ opacity: 0.8, fontSize: '1.2rem' }}
              >
                Get instant feedback, skills extraction, and matching scores for your resume.
              </motion.p>
            </header>

            <section style={{ maxWidth: '600px', margin: '0 auto' }}>
              <ResumeUpload 
                onAnalysisStart={() => {
                  setAnalysis(null);
                  setLoading(true);
                }}
                onAnalysisComplete={handleAnalysisComplete}
                loading={loading}
              />
            </section>

            <AnimatePresence>
              {analysis && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  style={{ marginTop: '3rem' }}
                >
                  <AnalysisResults data={analysis} />
                </motion.section>
              )}
            </AnimatePresence>
          </>
        } />
        
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/" />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/interview" element={<ProtectedRoute><InterviewPage /></ProtectedRoute>} />
        <Route path="/skill-gap" element={<ProtectedRoute><SkillGapPage /></ProtectedRoute>} />
      </Routes>
    </main>
  );

  return (
    <div className={user ? "app-layout" : "min-h-screen"}>
      {user ? <Sidebar /> : <Navbar theme={theme} toggleTheme={toggleTheme} />}
      
      <div className={user ? "main-content" : ""}>
        {user && <Navbar theme={theme} toggleTheme={toggleTheme} />}
        <MainContent />
        
        <footer style={{ textAlign: 'center', padding: '2rem', opacity: 0.6, fontSize: '0.9rem' }}>
          &copy; {new Date().getFullYear()} AI Resume Analyzer. Support for PDF & DOCX.
        </footer>
      </div>
    </div>
  );
}

export default App;
