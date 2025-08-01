import { useState, useEffect } from 'react';
import { CheckCircle, Clock, Users } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const PollInterface = ({ poll, sessionId, studentId }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(poll.duration);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user already voted
    if (poll.responses && poll.responses[studentId] !== undefined) {
      setHasVoted(true);
      setSelectedOption(poll.responses[studentId]);
      fetchResults();
    }
  }, [poll, studentId]);

  useEffect(() => {
    // Countdown timer
    if (timeLeft > 0 && !hasVoted && poll.isActive) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, hasVoted, poll.isActive]);

  const fetchResults = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/polls/${poll.id}/results`);
      const data = await response.json();
      if (data.success) {
        setResults(data);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const submitVote = async () => {
    if (selectedOption === null || hasVoted) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/polls/${poll.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId,
          optionId: selectedOption,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setHasVoted(true);
        fetchResults();
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
    }
    
    setLoading(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getResultPercentage = (optionIndex) => {
    if (!results || results.totalVotes === 0) return 0;
    const option = results.results.find(r => r.id === optionIndex);
    return Math.round((option ? option.count : 0) / results.totalVotes * 100);
  };

  return (
    <div className="card">
      {/* Poll Header */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold text-gray-900">
            Live Poll
          </h2>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            {poll.isActive && !hasVoted ? formatTime(timeLeft) : 'Ended'}
          </div>
        </div>
        <p className="text-gray-700 text-lg">{poll.question}</p>
      </div>

      {/* Voting Interface */}
      {!hasVoted && poll.isActive && timeLeft > 0 ? (
        <div className="space-y-4">
          <p className="text-sm font-medium text-gray-700 mb-4">
            Select your answer:
          </p>
          
          {poll.options.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedOption(index)}
              className={`poll-option ${selectedOption === index ? 'selected' : ''}`}
            >
              <div className="flex items-center">
                <span className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 mr-3">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-left">{option.text}</span>
              </div>
            </button>
          ))}

          <button
            onClick={submitVote}
            disabled={selectedOption === null || loading}
            className="w-full btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed mt-6"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Submitting...
              </div>
            ) : (
              <>
                <CheckCircle className="mr-2 h-5 w-5" />
                Submit Vote
              </>
            )}
          </button>
        </div>
      ) : (
        /* Results Display */
        <div className="space-y-4">
          {hasVoted && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">Vote submitted successfully!</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Results</h3>
            {results && (
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-1" />
                {results.totalVotes} votes
              </div>
            )}
          </div>

          {results ? (
            <div className="space-y-3">
              {poll.options.map((option, index) => {
                const percentage = getResultPercentage(index);
                const isSelected = selectedOption === index;
                
                return (
                  <div key={index} className="relative">
                    <div className={`poll-option voted ${isSelected ? 'ring-2 ring-primary-500' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 mr-3">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="text-left">{option.text}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-semibold text-gray-900">{percentage}%</span>
                          <p className="text-xs text-gray-500">
                            {results.results.find(r => r.id === index)?.count || 0} votes
                          </p>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden">
                        <div 
                          className="h-full bg-primary-500 transition-all duration-500 ease-out"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading results...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PollInterface;