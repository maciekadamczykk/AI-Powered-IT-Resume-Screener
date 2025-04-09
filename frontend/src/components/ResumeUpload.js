import React, { useState, useCallback } from 'react';
import { Paper, Typography, Box, Button, LinearProgress } from '@mui/material';
import { CloudUpload, Description, CheckCircle } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import axios from 'axios';

const UploadZone = styled(Box)`
  border: 2px dashed ${props => props.dragover ? props.theme.palette.primary.main : 'rgba(124, 58, 237, 0.3)'};
  border-radius: ${props => props.theme.shape.borderRadius}px;
  padding: 3rem 2rem;
  text-align: center;
  background: ${props => props.dragover ? 'rgba(124, 58, 237, 0.1)' : 'transparent'};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: ${props => props.theme.palette.primary.main};
    background: rgba(124, 58, 237, 0.05);
  }
`;

const StyledPaper = styled(Paper)`
  padding: 2rem;
  background: linear-gradient(145deg, rgba(31, 41, 55, 0.6), rgba(31, 41, 55, 0.9));
  border: 1px solid rgba(124, 58, 237, 0.1);
  backdrop-filter: blur(10px);
`;

const FilePreview = styled(Box)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: ${props => props.theme.shape.borderRadius}px;
  background: rgba(124, 58, 237, 0.1);
  margin-top: 1rem;
`;

const ResumeUpload = ({ jobDescription, onResults }) => {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

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

    setUploading(true);
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
      setUploading(false);
      setUploadProgress(0);
    }
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
          Upload Resume
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Upload a PDF resume to analyze against the job requirements
        </Typography>

        <form onSubmit={handleSubmit}>
          <UploadZone
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            dragover={dragOver}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              id="file-input"
            />
            
            <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Drag & Drop your resume here
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              or
            </Typography>
            <Button
              component="label"
              htmlFor="file-input"
              variant="outlined"
              color="primary"
              sx={{ mt: 1 }}
            >
              Browse Files
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Supported format: PDF
            </Typography>
          </UploadZone>

          <AnimatePresence>
            {file && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <FilePreview>
                  <Description color="primary" />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2">{file.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </Typography>
                  </Box>
                  <CheckCircle sx={{ color: 'success.main' }} />
                </FilePreview>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          {uploading && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{ mb: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                Analyzing... {uploadProgress.toFixed(0)}%
              </Typography>
            </Box>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={!file || uploading}
            sx={{
              mt: 3,
              background: 'linear-gradient(45deg, #7C3AED, #9F67FF)',
              '&:hover': {
                background: 'linear-gradient(45deg, #6D28D9, #8B5CF6)',
              },
            }}
          >
            {uploading ? 'Analyzing...' : 'Analyze Resume'}
          </Button>
        </form>
      </StyledPaper>
    </motion.div>
  );
};

export default ResumeUpload;
