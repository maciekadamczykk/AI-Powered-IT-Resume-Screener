import React from 'react';
import Upload from './Upload';
import Results from './Results';
import './App.css';

function App() {
  const [results, setResults] = React.useState(null);

  return (
    <div className="app-container">
      <h1>AI Resume Screener</h1>
      <Upload onResults={setResults} />
      {results && (
        <div className="results-container">
          <Results data={results} />
        </div>
      )}
    </div>
  );
}

export default App;