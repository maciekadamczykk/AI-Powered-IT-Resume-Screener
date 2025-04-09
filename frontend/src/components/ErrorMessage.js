import React from 'react';

const ErrorMessage = ({ message }) => (
  <div className="error-message">
    <i className="fas fa-exclamation-circle"></i>
    <span>{message}</span>
  </div>
);

export default ErrorMessage;
