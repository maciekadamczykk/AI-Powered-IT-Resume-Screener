import React, { useState } from 'react';
import axios from 'axios';

export default function Upload({ onResults }) {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Uploading file:', file.name);
      const response = await axios.post('/process_resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Upload successful:', response.data);
      onResults(response.data);
    } catch (error) {
      console.error('Upload error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      alert(`Upload failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ margin: '10px 0', display: 'block' }}
      />
      <button
        type="submit"
        disabled={!file || isLoading}
        style={{
          padding: '10px 20px',
          background: isLoading ? '#ccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {isLoading ? 'Processing...' : 'Upload Resume'}
      </button>
    </form>
  );
}