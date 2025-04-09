import React, { useState } from 'react';
import { Paper, TextField, Button, Typography, Box } from '@mui/material';
import { Work, AutoGraph, Psychology } from '@mui/icons-material';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';

const StyledPaper = styled(Paper)`
  padding: 2rem;
  background: linear-gradient(145deg, rgba(31, 41, 55, 0.6), rgba(31, 41, 55, 0.9));
  border: 1px solid rgba(124, 58, 237, 0.1);
  backdrop-filter: blur(10px);
`;

const FeatureBox = styled(Box)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: ${props => props.theme.shape.borderRadius}px;
  background: rgba(124, 58, 237, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    background: rgba(124, 58, 237, 0.15);
  }
`;

const JobDescriptionForm = ({ onSubmit }) => {
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (description.trim()) {
      onSubmit(description);
    }
  };

  const features = [
    {
      icon: <Work sx={{ color: 'primary.main' }} />,
      title: 'Smart Analysis',
      description: 'AI-powered job requirement analysis'
    },
    {
      icon: <AutoGraph sx={{ color: 'primary.main' }} />,
      title: 'Skill Matching',
      description: 'Advanced skill matching algorithms'
    },
    {
      icon: <Psychology sx={{ color: 'primary.main' }} />,
      title: 'Intelligent Insights',
      description: 'Detailed candidate evaluation'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <StyledPaper elevation={0}>
        <Typography variant="h4" component="h1" gutterBottom>
          Job Requirements
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Enter the job description to start analyzing resumes
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            multiline
            rows={8}
            fullWidth
            variant="outlined"
            placeholder="Paste the job description here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{ flex: 1, minWidth: '250px' }}
              >
                <FeatureBox>
                  {feature.icon}
                  <Box>
                    <Typography variant="subtitle1" fontWeight="500">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </FeatureBox>
              </motion.div>
            ))}
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={!description.trim()}
            sx={{
              background: 'linear-gradient(45deg, #7C3AED, #9F67FF)',
              '&:hover': {
                background: 'linear-gradient(45deg, #6D28D9, #8B5CF6)',
              },
            }}
          >
            Continue to Resume Upload
          </Button>
        </form>
      </StyledPaper>
    </motion.div>
  );
};

export default JobDescriptionForm;
