import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, BarChart3, Zap, Shield, Globe } from 'lucide-react';

const Home = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', role: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.role) return;

    setLoading(true);
    const result = await login(formData.name, formData.role);
    setLoading(false);

    if (result.success) {
      navigate(formData.role === 'teacher' ? '/teacher' : '/student');
    }
  };

  if (user) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="card">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Welcome back, {user.name}!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Ready to {user.role === 'teacher' ? 'create engaging polls' : 'participate in live sessions'}?
          </p>
          <button
            onClick={() => navigate(user.role === 'teacher' ? '/teacher' : '/student')}
            className="btn-primary text-lg px-8 py-4"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
          Live Polling Made Simple
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-slide-up">
          Create interactive polls, engage your audience in real-time, and get instant feedback. 
          Perfect for classrooms, meetings, and events.
        </p>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="card text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <Zap className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-time Results</h3>
            <p className="text-gray-600">See responses update instantly as participants vote</p>
          </div>
          <div className="card text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Shield className="h-12 w-12 text-secondary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure Sessions</h3>
            <p className="text-gray-600">Protected polling sessions with unique access codes</p>
          </div>
          <div className="card text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Globe className="h-12 w-12 text-accent-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Works Everywhere</h3>
            <p className="text-gray-600">Responsive design that works on any device</p>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div id="login-section" className="max-w-md mx-auto">
        <div className="card">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Get Started
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'teacher' })}
                  className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                    formData.role === 'teacher'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <BookOpen className="h-8 w-8 mx-auto mb-2" />
                  <span className="font-semibold">Teacher</span>
                  <p className="text-sm mt-1 opacity-75">Create & manage polls</p>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'student' })}
                  className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                    formData.role === 'student'
                      ? 'border-secondary-500 bg-secondary-50 text-secondary-700'
                      : 'border-gray-200 hover:border-secondary-300'
                  }`}
                >
                  <Users className="h-8 w-8 mx-auto mb-2" />
                  <span className="font-semibold">Student</span>
                  <p className="text-sm mt-1 opacity-75">Join & participate</p>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!formData.name || !formData.role || loading}
              className="w-full btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Getting Started...
                </div>
              ) : (
                <>
                  Continue
                  <BarChart3 className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;