import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import { ArrowBack, DarkMode } from '@mui/icons-material';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';

const StyledAppBar = styled(AppBar)`
  background: rgba(31, 41, 55, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
`;

const Logo = styled(Typography)`
  background: linear-gradient(135deg, #7C3AED, #9F67FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
`;

const Navigation = ({ onBack }) => {
  return (
    <StyledAppBar position="sticky" elevation={0}>
      <Toolbar>
        {onBack && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
          >
            <IconButton 
              edge="start" 
              color="inherit" 
              onClick={onBack}
              sx={{ mr: 2 }}
            >
              <ArrowBack />
            </IconButton>
          </motion.div>
        )}
        <Logo variant="h6" component="div" sx={{ flexGrow: 1 }}>
          AI Resume Screener
        </Logo>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton color="inherit">
            <DarkMode />
          </IconButton>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navigation;
