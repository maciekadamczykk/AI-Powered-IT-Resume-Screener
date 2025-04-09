import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Results({ data }) {
  const [activeTab, setActiveTab] = useState('overview');
  const missingKeywords = data.missing_keywords || [];

  const matchScore = data.similarity_score * 100;
  const getScoreData = (score) => {
    if (score >= 85) return {
      color: '#1b5e20',
      gradient: 'linear-gradient(135deg, #4caf50, #1b5e20)',
      message: 'Exceptional Match! Highly qualified for the position.',
      details: 'The candidate\'s skills and experience align extremely well with the job requirements.'
    };
    if (score >= 75) return {
      color: '#2e7d32',
      gradient: 'linear-gradient(135deg, #66bb6a, #2e7d32)',
      message: 'Excellent Match! Strong qualifications and experience.',
      details: 'The candidate demonstrates strong alignment with key job requirements.'
    };
    if (score >= 65) return {
      color: '#388e3c',
      gradient: 'linear-gradient(135deg, #81c784, #388e3c)',
      message: 'Strong Match! Well-suited for the role.',
      details: 'The candidate possesses many of the required skills and qualifications.'
    };
    if (score >= 55) return {
      color: '#f57c00',
      gradient: 'linear-gradient(135deg, #ffa726, #f57c00)',
      message: 'Good Match with room for growth.',
      details: 'The candidate meets core requirements and shows potential for development.'
    };
    if (score >= 45) return {
      color: '#ef6c00',
      gradient: 'linear-gradient(135deg, #ff9800, #ef6c00)',
      message: 'Moderate Match - meets basic qualifications.',
      details: 'The candidate has some relevant skills but may need additional training.'
    };
    return {
      color: '#e65100',
      gradient: 'linear-gradient(135deg, #fb8c00, #e65100)',
      message: 'Basic Match - consider for junior positions.',
      details: 'The candidate may be better suited for entry-level or junior positions.'
    };
  };

  const scoreData = getScoreData(matchScore);
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="results-container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.nav 
        className="results-nav"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {['overview', 'experience', 'skills'].map((tab, index) => (
          <motion.button 
            key={tab}
            className={`nav-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <i className={`fas fa-${tab === 'overview' ? 'chart-pie' : 
                                  tab === 'experience' ? 'briefcase' : 'tools'}`}></i>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </motion.button>
        ))}
      </motion.nav>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div 
            key="overview"
            className="overview-tab"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="score-card"
              style={{
                background: scoreData.gradient,
                color: '#fff',
                padding: '2rem',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
              }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3>Match Score Analysis</h3>
              <div className="circular-progress-container">
                <motion.div 
                  className="circular-progress"
                  initial={{ background: `conic-gradient(${scoreData.color} 0%, transparent 0%)` }}
                  animate={{ background: `conic-gradient(${scoreData.color} ${matchScore}%, transparent ${matchScore}%)` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  style={{ '--progress': `${matchScore}%`, '--color': scoreData.color }}
                >
                  <motion.div 
                    className="inner"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                  >
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      {matchScore.toFixed(1)}%
                    </motion.span>
                  </motion.div>
                </motion.div>
                <motion.div 
                  className="score-details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h4>Assessment</h4>
                  <p className="score-message">{scoreData.message}</p>
                  <p className="score-details">{scoreData.details}</p>
                  <div className="score-breakdown">
                    <div className="breakdown-item">
                      <span>Skills Match:</span>
                      <div className="progress-bar">
                        <motion.div 
                          className="progress-fill"
                          style={{ background: scoreData.color }}
                          initial={{ width: '0%' }}
                          animate={{ width: `${(data.common_keywords.length / (data.common_keywords.length + data.missing_keywords.length)) * 100}%` }}
                          transition={{ duration: 1, delay: 0.8 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="quick-stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {[
                { title: 'Matched Skills', value: data.common_keywords.length },
                { title: 'Missing Skills', value: missingKeywords.length },
                { title: 'Total Skills', value: data.skills.length }
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  className="stat-item"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <h4>{stat.title}</h4>
                  <motion.span 
                    className="stat-number"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + index * 0.1 }}
                  >
                    {stat.value}
                  </motion.span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'skills' && (
          <motion.div 
            key="skills"
            className="skills-tab"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="skills-categories">
              {[
                {
                  title: 'Matched Skills',
                  skills: data.common_keywords,
                  type: 'matched',
                  icon: 'check-circle'
                },
                {
                  title: 'Additional Skills',
                  skills: data.skills.filter(skill => !data.common_keywords.includes(skill)),
                  type: 'additional',
                  icon: 'plus-circle'
                },
                {
                  title: 'Suggested Skills',
                  skills: missingKeywords,
                  type: 'suggested',
                  icon: 'lightbulb'
                }
              ].map((category, categoryIndex) => (
                category.skills.length > 0 && (
                  <motion.div 
                    key={category.title}
                    className="skills-category"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: categoryIndex * 0.2 }}
                  >
                    <h3>
                      <i className={`fas fa-${category.icon}`}></i>
                      {category.title}
                    </h3>
                    <motion.div className="skills-grid">
                      <AnimatePresence>
                        {category.skills.map((skill, index) => (
                          <motion.div 
                            key={skill}
                            className={`skill-card ${category.type}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ 
                              scale: 1.05,
                              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
                            }}
                          >
                            <i className={`fas fa-${category.icon}`}></i>
                            <span className="skill-name">{skill}</span>
                            {category.type === 'suggested' && (
                              <div className="skill-tip">
                                Consider highlighting experience with {skill}
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                )
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'experience' && (
          <motion.div 
            key="experience"
            className="experience-tab"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div 
              className="experience-timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <AnimatePresence>
                {data.experience?.map((exp, i) => (
                  <motion.div 
                    key={i}
                    className="experience-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div className="experience-content">
                      <motion.h4
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.1 + 0.2 }}
                      >
                        {exp.title}
                      </motion.h4>
                      <motion.div 
                        className="company-name"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.1 + 0.3 }}
                      >
                        <i className="fas fa-building"></i>
                        {exp.company}
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}