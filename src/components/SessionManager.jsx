import { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { Users, BarChart3, Clock, X } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const SessionManager = ({ session, onSessionUpdate }) => {
  const { socket } = useSocket();
  const [currentPoll, setCurrentPoll] = useState(null);
  const [pollResults, setPollResults] = useState(null);
  const [participants, setParticipants] = useState(session.participants || []);

  useEffect(() => {
    if (socket) {
      socket.on('vote-update', (data) => {
        setPollResults(data.results);
      });

      return () => {
        socket.off('vote-update');
      };
    }
  }, [socket]);

  useEffect(() => {
    // Fetch current poll if exists
    if (session.currentPoll) {
      fetchPoll(session.currentPoll);
    }
  }, [session.currentPoll]);

  const fetchPoll = async (pollId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/polls/${pollId}/results`);
      const data = await response.json();
      if (data.success) {
        // Also fetch the poll details
        const pollResponse = await fetch(`${API_BASE_URL}/api/sessions/${session.id}`);
        const sessionData = await pollResponse.json();
        if (sessionData.success) {
          // Here we would need to get the poll details - for now, we'll simulate
          setCurrentPoll({
            id: pollId,
            question: "Active Poll",
            isActive: true
          });
          setPollResults(data);
        }
      }
    } catch (error) {
      console.error('Error fetching poll:', error);
    }
  };

  const closePoll = async () => {
    if (!currentPoll) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/polls/${currentPoll.id}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setCurrentPoll(null);
        
        // Emit poll closed event
        if (socket) {
          socket.emit('poll-closed', {
            sessionId: session.id,
            pollId: currentPoll.id,
            results: pollResults
          });
        }
      }
    } catch (error) {
      console.error('Error closing poll:', error);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Session Overview
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Participants */}
        <div>
          <div className="flex items-center mb-4">
            <Users className="h-5 w-5 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Participants ({participants.length})
            </h3>
          </div>
          
          <div className="max-h-60 overflow-y-auto space-y-2">
            {participants.length > 0 ? (
              participants.map((participant, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                  <span className="font-medium text-gray-900">{participant.name}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(participant.joinedAt).toLocaleTimeString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No participants yet
              </p>
            )}
          </div>
        </div>

        {/* Current Poll Status */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 text-secondary-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Current Poll</h3>
            </div>
            {currentPoll && (
              <button
                onClick={closePoll}
                className="flex items-center text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
              >
                <X className="h-4 w-4 mr-1" />
                Close Poll
              </button>
            )}
          </div>

          {currentPoll ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">Poll is active</span>
                </div>
              </div>

              {pollResults && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Live Results ({pollResults.totalVotes} votes):
                  </p>
                  {pollResults.results.map((result, index) => (
                    <div key={index} className="bg-gray-50 px-3 py-2 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">
                          Option {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {result.count} votes
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No active poll</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionManager;