import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faRobot, faBolt, faChartLine, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import Upload from './Upload';
import Results from './Results';
import './App.css';

function App() {
  const [results, setResults] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [showJobForm, setShowJobForm] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setShowJobForm(false);
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <motion.header 
        className={`app-header ${darkMode ? 'dark-mode' : ''}`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            AI Resume Screener
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Intelligent resume analysis powered by advanced AI
          </motion.p>
          <motion.div 
            className="header-badges"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.span 
              className="badge"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <FontAwesomeIcon icon={faRobot} />
              AI-Powered
            </motion.span>
            <motion.span 
              className="badge"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <FontAwesomeIcon icon={faBolt} />
              Instant Analysis
            </motion.span>
            <motion.span 
              className="badge"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <FontAwesomeIcon icon={faChartLine} />
              Detailed Insights
            </motion.span>
          </motion.div>
          <motion.button 
            onClick={toggleDarkMode} 
            className="glass-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </motion.button>
        </div>
      </motion.header>

      <AnimatePresence mode="wait">
        <motion.main className="main-content">
          {showJobForm ? (
            <motion.form 
              key="job-form"
              onSubmit={handleJobSubmit} 
              className="job-form glass-morphism"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="form-header">
                <motion.div 
                  className="form-icon"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <FontAwesomeIcon icon={faFileUpload} />
                </motion.div>
                <div className="form-title">
                  <h2>Job Requirements</h2>
                  <p>Start by providing the job description</p>
                </div>
              </div>
              
              <div className="form-content">
                <div className="form-group">
                  <label htmlFor="jobDescription">
                    Enter job description or requirements:
                  </label>
                  <textarea
                    id="jobDescription"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    rows="8"
                    className="styled-textarea"
                    required
                  />
                </div>
                
                <motion.div 
                  className="form-features"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div 
                    className="feature"
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <FontAwesomeIcon icon={faRobot} />
                    <span>AI Analysis</span>
                  </motion.div>
                  <motion.div 
                    className="feature"
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <FontAwesomeIcon icon={faBolt} />
                    <span>Instant Results</span>
                  </motion.div>
                  <motion.div 
                    className="feature"
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <FontAwesomeIcon icon={faChartLine} />
                    <span>Smart Matching</span>
                  </motion.div>
                </motion.div>

                <motion.button 
                  type="submit" 
                  className="submit-btn pulse"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!jobDescription.trim()}
                >
                  Continue to Resume Upload
                  <FontAwesomeIcon icon={faFileUpload} />
                </motion.button>
              </div>
            </motion.form>
          ) : (
            <motion.div 
              key="analysis-section"
              className="analysis-section glass-morphism"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="section-header">
                <motion.button
                  className="back-btn glass-btn"
                  onClick={() => setShowJobForm(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FontAwesomeIcon icon={faBolt} />
                  Edit Job Description
                </motion.button>
              </div>
              
              <Upload onResults={setResults} jobDescription={jobDescription} />
              {results && <Results data={results} />}
            </motion.div>
          )}
        </motion.main>
      </AnimatePresence>

      <motion.footer 
        className="app-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="footer-content">
          <p>
            <FontAwesomeIcon icon={faRobot} />
            AI-Powered Analysis
          </p>
          <p>
            <FontAwesomeIcon icon={faBolt} />
            Real-time Results
          </p>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;