import React from 'react';
import ReactDOM from 'react-dom/client';
import { GlobalStyles } from '@mui/material';
import App from './App';

const globalStyles = {
  '*': {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
  },
  body: {
    minHeight: '100vh',
    scrollBehavior: 'smooth',
  },
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#1F2937',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#374151',
    borderRadius: '4px',
    '&:hover': {
      background: '#4B5563',
    },
  },
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GlobalStyles styles={globalStyles} />
    <App />
  </React.StrictMode>
);