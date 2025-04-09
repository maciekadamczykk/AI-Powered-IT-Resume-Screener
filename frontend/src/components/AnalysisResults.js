import React, { useState } from 'react';
import { Paper, Box, Typography, Tab, Tabs, CircularProgress } from '@mui/material';
import { Assessment, BusinessCenter, Code } from '@mui/icons-material';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const StyledPaper = styled(Paper)`
  padding: 2rem;
  background: linear-gradient(145deg, rgba(31, 41, 55, 0.6), rgba(31, 41, 55, 0.9));
  border: 1px solid rgba(124, 58, 237, 0.1);
  backdrop-filter: blur(10px);
`;

const ScoreCircle = styled(Box)`
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto;
`;

const ScoreText = styled(Typography)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} style={{ padding: '1rem 0' }}>
    {value === index && children}
  </div>
);

const SkillCard = styled(Box)`
  padding: 1rem;
  border-radius: ${props => props.theme.shape.borderRadius}px;
  background: rgba(124, 58, 237, 0.1);
  border: 1px solid rgba(124, 58, 237, 0.2);
  margin-bottom: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    background: rgba(124, 58, 237, 0.15);
  }
`;

const AnalysisResults = ({ data }) => {
  const [activeTab, setActiveTab] = useState(0);
  const matchScore = data.similarity_score * 100;

  const getScoreColor = (score) => {
    if (score >= 85) return '#10B981';
    if (score >= 70) return '#3B82F6';
    if (score >= 55) return '#6366F1';
    if (score >= 40) return '#8B5CF6';
    return '#7C3AED';
  };

  const chartData = {
    labels: ['Matched Skills', 'Missing Skills'],
    datasets: [
      {
        data: [data.common_keywords.length, data.missing_keywords.length],
        backgroundColor: ['#10B981', '#7C3AED'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#F3F4F6',
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <StyledPaper elevation={0}>
        <Typography variant="h4" component="h1" gutterBottom>
          Analysis Results
        </Typography>

        <Box sx={{ mb: 4 }}>
          <ScoreCircle>
            <CircularProgress
              variant="determinate"
              value={matchScore}
              size={200}
              thickness={4}
              sx={{
                color: getScoreColor(matchScore),
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                },
              }}
            />
            <ScoreText variant="h4">
              {matchScore.toFixed(1)}%
              <Typography variant="body2" color="text.secondary">
                Match Score
              </Typography>
            </ScoreText>
          </ScoreCircle>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
            sx={{ mb: 2 }}
          >
            <Tab icon={<Assessment />} label="Overview" />
            <Tab icon={<Code />} label="Skills" />
            <Tab icon={<BusinessCenter />} label="Experience" />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <Box sx={{ display: 'grid', gap: 3 }}>
            <Box sx={{ height: '300px' }}>
              <Doughnut data={chartData} options={chartOptions} />
            </Box>
            <Typography variant="h6" gutterBottom>
              Key Findings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {matchScore >= 85
                ? 'Exceptional match! The candidate\'s profile strongly aligns with the job requirements.'
                : matchScore >= 70
                ? 'Good match! The candidate meets most of the key requirements.'
                : matchScore >= 55
                ? 'Moderate match. The candidate has relevant skills but some gaps exist.'
                : 'Basic match. Consider additional training or junior positions.'}
            </Typography>
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Box sx={{ display: 'grid', gap: 3 }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Matched Skills ({data.common_keywords.length})
              </Typography>
              {data.common_keywords.map((skill) => (
                <SkillCard key={skill}>
                  <Typography>{skill}</Typography>
                </SkillCard>
              ))}
            </Box>
            <Box>
              <Typography variant="h6" gutterBottom>
                Missing Skills ({data.missing_keywords.length})
              </Typography>
              {data.missing_keywords.map((skill) => (
                <SkillCard
                  key={skill}
                  sx={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}
                >
                  <Typography>{skill}</Typography>
                </SkillCard>
              ))}
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Box sx={{ display: 'grid', gap: 3 }}>
            {data.experience?.map((exp, index) => (
              <SkillCard key={index}>
                <Typography variant="h6">{exp.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {exp.company}
                </Typography>
              </SkillCard>
            ))}
          </Box>
        </TabPanel>
      </StyledPaper>
    </motion.div>
  );
};

export default AnalysisResults;
