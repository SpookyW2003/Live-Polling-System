import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Results = () => {
  const { pollId } = useParams();
  const [results, setResults] = useState({});

  useEffect(() => {
    async function fetchResults() {
      const response = await fetch(`http://localhost:9000/api/polls/${pollId}/results`);
      const data = await response.json();
      setResults(data);
    }
    fetchResults();
  }, [pollId]);

  return (
    <div>
      <h2>Poll Results</h2>
      <ul>
        {results.results && results.results.map(option => (
          <li key={option.id}>{option.text}: {option.count} votes</li>
        ))}
      </ul>
    </div>
  );
};

export default Results;
