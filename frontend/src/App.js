import React from 'react';
import Upload from './Upload';
import Results from './Results';
import './App.css';

function App() {
  const [results, setResults] = React.useState(null);

  return (
    <div className="app-container">
      <header>
        <h1>AI Resume Screener</h1>
        <p>Upload a resume to analyze candidate-job fit</p>
      </header>

      <main>
        <Upload onResults={setResults} />
        {results && <Results data={results} />}
      </main>
    </div>
  );
}

export default App;