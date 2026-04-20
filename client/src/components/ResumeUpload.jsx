import { useState, useRef } from 'react';
import api from '../api/axios';
import { Upload, File, X, Loader2, Briefcase, FileSearch, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const ResumeUpload = ({ onAnalysisStart, onAnalysisComplete, loading }) => {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [targetDescription, setTargetDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const { user } = useAuth();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const validateFile = (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload only PDF or DOCX files.');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size must be less than 5MB.');
      return false;
    }
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        setError('');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        setError('');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    onAnalysisStart();
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('targetRole', targetRole);
    formData.append('targetDescription', targetDescription);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      };

      // Add auth token if user is logged in
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }

      // Use relative path since we have proxy or absolute if needed
      const response = await api.post('/api/analyze', formData, config);
      onAnalysisComplete(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.');
      onAnalysisComplete(null);
    } finally {
      setUploadProgress(0);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => !file && fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? 'var(--accent-color)' : 'var(--border-color)'}`,
            borderRadius: '12px',
            padding: '3rem 2rem',
            textAlign: 'center',
            cursor: file ? 'default' : 'pointer',
            transition: 'all 0.2s ease',
            backgroundColor: isDragging ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx"
            style={{ display: 'none' }}
          />

          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  backgroundColor: 'rgba(99, 102, 241, 0.1)', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  color: 'var(--accent-color)'
                }}>
                  <Upload size={32} />
                </div>
                <h3>{isDragging ? 'Drop it here!' : 'Upload Resume'}</h3>
                <p style={{ opacity: 0.6, marginTop: '0.5rem' }}>Drag & drop your file or click to browse</p>
                <p style={{ fontSize: '0.8rem', opacity: 0.4, marginTop: '1rem' }}>Supports PDF and DOCX (Max 5MB)</p>
              </motion.div>
            ) : (
              <motion.div
                key="file"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  color: 'var(--success)'
                }}>
                  <FileText size={32} />
                </div>
                <h3 style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {file.name}
                </h3>
                <div 
                  onClick={(e) => { e.stopPropagation(); removeFile(); }}
                  style={{ 
                    marginTop: '1rem', 
                    color: '#ef4444', 
                    fontSize: '0.9rem', 
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} /> Remove
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {loading && uploadProgress > 0 && (
            <motion.div 
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '4px',
                backgroundColor: 'var(--accent-color)',
                width: `${uploadProgress}%`
              }}
            />
          )}
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              marginTop: '1.5rem', 
              color: '#ef4444', 
              fontSize: '0.9rem', 
              textAlign: 'center',
              padding: '0.75rem',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '8px'
            }}
          >
            {error}
          </motion.div>
        )}
      </div>

      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Briefcase size={20} style={{ color: 'var(--accent-color)' }} />
          <h3 style={{ margin: 0 }}>Tailor Your Analysis (Optional)</h3>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.95rem' }}>
            Target Job Role
          </label>
          <input 
            type="text" 
            placeholder="e.g. Senior Frontend Engineer"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.75rem 1rem', 
              borderRadius: '8px', 
              border: '1px solid var(--border-color)',
              backgroundColor: 'rgba(0,0,0,0.02)',
              color: 'inherit',
              fontSize: '0.95rem'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.95rem' }}>
            Job Description / Requirements
          </label>
          <textarea 
            placeholder="Paste the job description here for a tailored match score..."
            value={targetDescription}
            onChange={(e) => setTargetDescription(e.target.value)}
            rows={5}
            style={{ 
              width: '100%', 
              padding: '0.75rem 1rem', 
              borderRadius: '8px', 
              border: '1px solid var(--border-color)',
              backgroundColor: 'rgba(0,0,0,0.02)',
              color: 'inherit',
              fontSize: '0.95rem',
              resize: 'vertical'
            }}
          />
        </div>

        <button 
          onClick={handleUpload}
          disabled={!file || loading}
          style={{ 
            width: '100%', 
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            fontSize: '1.1rem'
          }}
        >
          {loading ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              Analyzing Resume...
            </>
          ) : (
            <>
              <FileSearch size={24} />
              Analyze Now
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ResumeUpload;
