import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

export default function Upload({ onResults, jobDescription }) {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'application/pdf') {
      setFile(droppedFile);
      setError(null);
    } else {
      setError('Please upload a PDF file');
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please upload a PDF file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await axios.post('/process_resume', formData, {
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress(progress);
        },
      });
      onResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="upload-form glass-morphism"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="upload-header"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div 
          className="upload-icon"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <FontAwesomeIcon icon="cloud-upload-alt" />
        </motion.div>
        <div className="upload-title">
          <h3>Upload Resume</h3>
          <p>Drag & drop your resume or browse to upload</p>
        </div>
      </motion.div>

      <motion.div
        className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="drop-zone-content">
          <motion.div 
            className="upload-illustration"
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <FontAwesomeIcon icon="file-upload" />
            <div className="upload-dots">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              />
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          </motion.div>
          
          <div className="drop-zone-text">
            <p>Drop your PDF resume here or</p>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              id="file-input"
            />
            <motion.button
              type="button"
              className="browse-btn glass-btn"
              onClick={() => document.getElementById('file-input').click()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FontAwesomeIcon icon="folder-open" />
              Browse Files
            </motion.button>
          </div>

          <div className="file-requirements">
            <p>Supported format: PDF</p>
          </div>
        </div>

        <AnimatePresence>
          {file && (
            <motion.div 
              className="file-info glass-morphism"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="file-preview">
                <FontAwesomeIcon icon="file-pdf" className="file-icon" />
                <div className="file-details">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              </div>
              <motion.button
                type="button"
                className="remove-file"
                onClick={() => setFile(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FontAwesomeIcon icon="times" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ErrorMessage message={error} />
        </motion.div>
      )}

      <motion.div 
        className="upload-actions"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          type="submit"
          disabled={!file || isLoading}
          className={`submit-btn pulse ${isLoading ? 'loading' : ''}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              <span>Analyzing... {uploadProgress.toFixed(0)}%</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon="robot" />
              <span>Analyze with AI</span>
              <FontAwesomeIcon icon="arrow-right" />
            </>
          )}
        </motion.button>
        
        <AnimatePresence>
          {file && !isLoading && (
            <motion.div 
              className="upload-status"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <FontAwesomeIcon icon="check-circle" />
              Ready to analyze
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.form>
  );
}