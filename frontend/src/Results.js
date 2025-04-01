import React from 'react';

export default function Results({ data }) {
  return (
    <div className="results-container">
      <h2>Analysis Results</h2>

      <div className="results-grid">
        <div className="candidate-info">
          <h3>Candidate</h3>
          <p className="candidate-name">{data.candidate_name}</p>

          <h3>Match Score</h3>
          <div className="score-bar">
            <div
              className="score-fill"
              style={{ width: `${data.cosine_similarity * 100}%` }}
            ></div>
            <span className="score-text">
              {(data.cosine_similarity * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="skills-section">
          <h3>Skills</h3>
          <div className="skills-list">
            {data.skills.map((skill, i) => (
              <span key={i} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {data.common_keywords?.length > 0 && (
        <div className="keywords-section">
          <h3>Matching Keywords</h3>
          <div className="keywords-list">
            {data.common_keywords.map((keyword, i) => (
              <span key={i} className="keyword-tag">
                ✓ {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}