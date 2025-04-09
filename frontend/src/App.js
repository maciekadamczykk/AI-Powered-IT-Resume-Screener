import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import JobDescriptionForm from './components/JobDescriptionForm';
import ResumeUpload from './components/ResumeUpload';
import AnalysisResults from './components/AnalysisResults';
import Navigation from './components/Navigation';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7C3AED',
      light: '#9F67FF',
      dark: '#5B21B6',
    },
    secondary: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    background: {
      default: '#111827',
      paper: '#1F2937',
    },
    text: {
      primary: '#F3F4F6',
      secondary: '#D1D5DB',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)',
          minHeight: '100vh',
        },
      },
    },
  },
});

const AppContainer = styled(Box)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled(Box)`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  position: relative;
`;

function App() {
  const [step, setStep] = useState('job-description');
  const [jobDescription, setJobDescription] = useState('');
  const [results, setResults] = useState(null);

  const handleJobDescriptionSubmit = (description) => {
    setJobDescription(description);
    setStep('resume-upload');
  };

  const handleResultsReceived = (analysisResults) => {
    setResults(analysisResults);
    setStep('results');
  };

  const handleBack = () => {
    if (step === 'resume-upload') {
      setStep('job-description');
    } else if (step === 'results') {
      setStep('resume-upload');
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppContainer>
        <Navigation onBack={step !== 'job-description' ? handleBack : undefined} />
        <MainContent>
          <AnimatePresence mode="wait">
            {step === 'job-description' && (
              <JobDescriptionForm key="job-form" onSubmit={handleJobDescriptionSubmit} />
            )}
            {step === 'resume-upload' && (
              <ResumeUpload 
                key="upload"
                jobDescription={jobDescription}
                onResults={handleResultsReceived}
              />
            )}
            {step === 'results' && results && (
              <AnalysisResults key="results" data={results} />
            )}
          </AnimatePresence>
        </MainContent>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;