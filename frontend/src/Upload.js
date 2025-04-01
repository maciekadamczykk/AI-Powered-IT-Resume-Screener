import React, { useState } from 'react';
import axios from 'axios';

export default function Upload({ onResults }) {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/process_resume', formData);
      onResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <div className="form-group">
        <label>
          Upload Resume (PDF)
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={!file || isLoading}
        className={`submit-btn ${isLoading ? 'loading' : ''}`}
      >
        {isLoading ? 'Processing...' : 'Analyze Resume'}
      </button>

      {error && <div className="error-message">{error}</div>}
    </form>
  );
}