import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ["https://live-polling-system-brown.vercel.app", "https://*.vercel.app"]
      : "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// In-memory storage (in production, use a proper database)
let sessions = {};
let polls = {};
let users = {};

// Generate unique session code
function generateSessionCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.post('/api/auth/login', (req, res) => {
  const { name, role } = req.body;
  const userId = uuidv4();
  
  users[userId] = { id: userId, name, role, createdAt: new Date() };
  
  res.json({
    success: true,
    user: users[userId]
  });
});

app.post('/api/sessions/create', (req, res) => {
  const { teacherId, teacherName } = req.body;
  const sessionCode = generateSessionCode();
  const sessionId = uuidv4();
  
  sessions[sessionId] = {
    id: sessionId,
    code: sessionCode,
    teacherId,
    teacherName,
    createdAt: new Date(),
    isActive: true,
    participants: [],
    currentPoll: null
  };
  
  res.json({
    success: true,
    session: sessions[sessionId]
  });
});

app.post('/api/sessions/join', (req, res) => {
  const { code, studentId, studentName } = req.body;
  
  const session = Object.values(sessions).find(s => s.code === code && s.isActive);
  
  if (!session) {
    return res.json({
      success: false,
      message: 'Session not found or inactive'
    });
  }
  
  if (!session.participants.find(p => p.id === studentId)) {
    session.participants.push({
      id: studentId,
      name: studentName,
      joinedAt: new Date()
    });
  }
  
  res.json({
    success: true,
    session
  });
});

app.get('/api/sessions/:sessionId', (req, res) => {
  const session = sessions[req.params.sessionId];
  if (!session) {
    return res.status(404).json({ success: false, message: 'Session not found' });
  }
  res.json({ success: true, session });
});

app.post('/api/polls/create', (req, res) => {
  const { sessionId, question, options, duration } = req.body;
  const pollId = uuidv4();
  
  polls[pollId] = {
    id: pollId,
    sessionId,
    question,
    options: options.map((option, index) => ({
      id: index,
      text: option,
      votes: []
    })),
    duration,
    createdAt: new Date(),
    isActive: true,
    responses: {}
  };
  
  if (sessions[sessionId]) {
    sessions[sessionId].currentPoll = pollId;
  }
  
  res.json({
    success: true,
    poll: polls[pollId]
  });
});

app.post('/api/polls/:pollId/vote', (req, res) => {
  const { pollId } = req.params;
  const { studentId, optionId } = req.body;
  
  const poll = polls[pollId];
  if (!poll || !poll.isActive) {
    return res.json({
      success: false,
      message: 'Poll not found or inactive'
    });
  }
  
  // Remove previous vote if exists
  poll.options.forEach(option => {
    option.votes = option.votes.filter(vote => vote.studentId !== studentId);
  });
  
  // Add new vote
  if (poll.options[optionId]) {
    poll.options[optionId].votes.push({
      studentId,
      timestamp: new Date()
    });
    poll.responses[studentId] = optionId;
  }
  
  res.json({
    success: true,
    poll
  });
});

app.post('/api/polls/:pollId/close', (req, res) => {
  const poll = polls[req.params.pollId];
  if (poll) {
    poll.isActive = false;
    poll.closedAt = new Date();
  }
  
  res.json({
    success: true,
    poll
  });
});

app.get('/api/polls/:pollId/results', (req, res) => {
  const poll = polls[req.params.pollId];
  if (!poll) {
    return res.status(404).json({ success: false, message: 'Poll not found' });
  }
  
  const results = poll.options.map(option => ({
    ...option,
    count: option.votes.length
  }));
  
  res.json({
    success: true,
    results,
    totalVotes: Object.keys(poll.responses).length
  });
});

// Socket.IO handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-session', (sessionId) => {
    socket.join(sessionId);
    console.log(`Socket ${socket.id} joined session ${sessionId}`);
  });
  
  socket.on('poll-created', (data) => {
    socket.to(data.sessionId).emit('new-poll', data.poll);
  });
  
  socket.on('vote-submitted', (data) => {
    socket.to(data.sessionId).emit('vote-update', {
      pollId: data.pollId,
      results: data.results
    });
  });
  
  socket.on('poll-closed', (data) => {
    socket.to(data.sessionId).emit('poll-ended', {
      pollId: data.pollId,
      results: data.results
    });
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 9000;

// For Vercel deployment
if (process.env.NODE_ENV === 'production') {
  // Serve static files from dist directory
  app.use(express.static('dist'));
  
  // Handle React Router
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    }
  });
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for Vercel
export default app;
