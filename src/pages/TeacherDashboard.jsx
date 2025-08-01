import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { Plus, Users, BarChart3, Settings, Copy, CheckCircle } from 'lucide-react';
import CreatePoll from '../components/CreatePoll';
import SessionManager from '../components/SessionManager';
import { API_BASE_URL } from '../config/api';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [activeSession, setActiveSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'teacher') {
      navigate('/');
    }
  }, [user, navigate]);

  const createSession = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/sessions/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacherId: user.id,
          teacherName: user.name,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setActiveSession(data.session);
        setSessions(prev => [...prev, data.session]);
        
        // Join the socket room for this session
        if (socket) {
          socket.emit('join-session', data.session.id);
        }
      }
    } catch (error) {
      console.error('Error creating session:', error);
    }
    setLoading(false);
  };

  const copySessionCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(''), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  if (!user || user.role !== 'teacher') {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Routes>
        <Route path="/" element={
          <div>
            {/* Dashboard Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Teacher Dashboard
              </h1>
              <p className="text-gray-600">
                Create engaging polls and manage your live sessions
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="card">
                <div className="flex items-center">
                  <Users className="h-12 w-12 text-primary-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {activeSession ? activeSession.participants.length : 0}
                    </p>
                    <p className="text-gray-600">Active Participants</p>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center">
                  <BarChart3 className="h-12 w-12 text-secondary-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{sessions.length}</p>
                    <p className="text-gray-600">Total Sessions</p>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center">
                  <Settings className="h-12 w-12 text-accent-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {activeSession ? 'Active' : 'Inactive'}
                    </p>
                    <p className="text-gray-600">Session Status</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Session Management */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Session Management
                </h2>
                
                {!activeSession ? (
                  <div className="text-center py-8">
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-6">
                      No active session. Create one to start polling!
                    </p>
                    <button
                      onClick={createSession}
                      disabled={loading}
                      className="btn-primary"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Creating...
                        </div>
                      ) : (
                        <>
                          <Plus className="mr-2 h-5 w-5" />
                          Create New Session
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-4 rounded-lg mb-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Session Code</p>
                          <p className="text-2xl font-bold text-primary-600">
                            {activeSession.code}
                          </p>
                        </div>
                        <button
                          onClick={() => copySessionCode(activeSession.code)}
                          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          {copiedCode === activeSession.code ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <Copy className="h-5 w-5" />
                          )}
                          <span className="text-sm">
                            {copiedCode === activeSession.code ? 'Copied!' : 'Copy'}
                          </span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Participants:</span>
                        <span className="font-semibold">{activeSession.participants.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="font-semibold">
                          {new Date(activeSession.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-semibold text-green-600">Active</span>
                      </div>
                    </div>

                    {activeSession.participants.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Recent Participants:</p>
                        <div className="space-y-1">
                          {activeSession.participants.slice(-3).map((participant, index) => (
                            <div key={index} className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded">
                              {participant.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Create Poll */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Create New Poll
                </h2>
                {activeSession ? (
                  <CreatePoll 
                    sessionId={activeSession.id} 
                    onPollCreated={(poll) => {
                      if (socket) {
                        socket.emit('poll-created', { sessionId: activeSession.id, poll });
                      }
                    }}
                  />
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Create a session first to start creating polls
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Session Manager */}
            {activeSession && (
              <div className="mt-8">
                <SessionManager 
                  session={activeSession} 
                  onSessionUpdate={setActiveSession}
                />
              </div>
            )}
          </div>
        } />
      </Routes>
    </div>
  );
};

export default TeacherDashboard;