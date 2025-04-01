export default function Results({ data }) {
  return (
    <div style={{ marginTop: '20px', border: '1px solid #ddd', padding: '15px' }}>
      <h2>Results for: {data.candidate_name}</h2>
      <h3>Skills:</h3>
      <ul>
        {data.skills.map((skill, i) => (
          <li key={i}>{skill}</li>
        ))}
      </ul>
      <h3>Match Score: <span style={{ color: data.cosine_similarity > 0.5 ? 'green' : 'red' }}>
        {(data.cosine_similarity * 100).toFixed(1)}%
      </span></h3>
      <h3>Common Keywords:</h3>
      <p>{data.common_keywords.join(', ')}</p>
    </div>
  );
}