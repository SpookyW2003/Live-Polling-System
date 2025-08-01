import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { useNavigate } from 'react-router-dom';
import { Users, Hash, ArrowRight, Wifi, WifiOff } from 'lucide-react';
import PollInterface from '../components/PollInterface';
import { API_BASE_URL } from '../config/api';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { socket, connected } = useSocket();
  const navigate = useNavigate();
  const [sessionCode, setSessionCode] = useState('');
  const [currentSession, setCurrentSession] = useState(null);
  const [currentPoll, setCurrentPoll] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (socket && currentSession) {
      socket.emit('join-session', currentSession.id);

      socket.on('new-poll', (poll) => {
        setCurrentPoll(poll);
        setError('');
      });

      socket.on('poll-ended', (data) => {
        setCurrentPoll(null);
      });

      return () => {
        socket.off('new-poll');
        socket.off('poll-ended');
      };
    }
  }, [socket, currentSession]);

  const joinSession = async (e) => {
    e.preventDefault();
    if (!sessionCode.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/sessions/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: sessionCode.toUpperCase(),
          studentId: user.id,
          studentName: user.name,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setCurrentSession(data.session);
        setSessionCode('');
        
        // Join the socket room
        if (socket) {
          socket.emit('join-session', data.session.id);
        }
      } else {
        setError(data.message || 'Failed to join session');
      }
    } catch (error) {
      console.error('Error joining session:', error);
      setError('Network error. Please try again.');
    }
    
    setLoading(false);
  };

  const leaveSession = () => {
    setCurrentSession(null);
    setCurrentPoll(null);
    setError('');
  };

  if (!user || user.role !== 'student') {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Student Dashboard
        </h1>
        <p className="text-gray-600">
          Join live polling sessions and participate in real-time
        </p>
        
        {/* Connection Status */}
        <div className="flex items-center mt-4">
          {connected ? (
            <div className="flex items-center text-green-600">
              <Wifi className="h-4 w-4 mr-2" />
              <span className="text-sm">Connected</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600">
              <WifiOff className="h-4 w-4 mr-2" />
              <span className="text-sm">Disconnected</span>
            </div>
          )}
        </div>
      </div>

      {!currentSession ? (
        /* Join Session Form */
        <div className="max-w-lg mx-auto">
          <div className="card">
            <div className="text-center mb-6">
              <Hash className="h-16 w-16 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Join a Session
              </h2>
              <p className="text-gray-600">
                Enter the session code provided by your teacher
              </p>
            </div>

            <form onSubmit={joinSession} className="space-y-6">
              <div>
                <label htmlFor="sessionCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Session Code
                </label>
                <input
                  type="text"
                  id="sessionCode"
                  value={sessionCode}
                  onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                  className="input-field text-center text-lg font-mono tracking-widest"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !sessionCode.trim()}
                className="w-full btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Joining...
                  </div>
                ) : (
                  <>
                    Join Session
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Active Session */
        <div>
          {/* Session Info */}
          <div className="card mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Connected to Session
                </h2>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Code:</span> {currentSession.code}</p>
                  <p><span className="font-medium">Teacher:</span> {currentSession.teacherName}</p>
                  <p><span className="font-medium">Participants:</span> {currentSession.participants.length}</p>
                </div>
              </div>
              <button
                onClick={leaveSession}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Leave Session
              </button>
            </div>
          </div>

          {/* Poll Interface */}
          {currentPoll ? (
            <PollInterface 
              poll={currentPoll}
              sessionId={currentSession.id}
              studentId={user.id}
            />
          ) : (
            <div className="card text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Waiting for Poll
              </h3>
              <p className="text-gray-600 mb-4">
                Your teacher will start a poll soon. Stay tuned!
              </p>
              <div className="animate-pulse-gentle">
                <div className="w-12 h-12 bg-primary-200 rounded-full mx-auto"></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;