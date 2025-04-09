import React from 'react';
import ReactDOM from 'react-dom/client';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faCloudUploadAlt, 
  faFileUpload, 
  faFolderOpen, 
  faFilePdf, 
  faTimes, 
  faRobot, 
  faArrowRight, 
  faCheckCircle 
} from '@fortawesome/free-solid-svg-icons';
import App from './App';
import './App.css';

// Add icons to the library
library.add(
  faCloudUploadAlt,
  faFileUpload,
  faFolderOpen,
  faFilePdf,
  faTimes,
  faRobot,
  faArrowRight,
  faCheckCircle
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);