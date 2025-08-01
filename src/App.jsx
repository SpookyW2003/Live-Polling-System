import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import Home from './pages/Home';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import PollSession from './pages/PollSession';
import Results from './pages/Results';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/teacher/*" element={<TeacherDashboard />} />
                <Route path="/student/*" element={<StudentDashboard />} />
                <Route path="/session/:sessionId" element={<PollSession />} />
                <Route path="/results/:pollId" element={<Results />} />
              </Routes>
            </main>
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;