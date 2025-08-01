# 🗳️ Live Polling System

A real-time interactive polling system that enables teachers to create engaging polls and students to participate with instant feedback. Built with React, Express.js, and Socket.IO for seamless real-time communication.

## ✨ Features

### 👨‍🏫 Teacher Features
- **Create Sessions**: Generate unique session codes for student access
- **Live Poll Management**: Create polls with multiple choice options
- **Real-time Results**: View live voting results as they come in
- **Session Control**: Manage active sessions and close polls when needed
- **Participant Tracking**: Monitor connected students in real-time

### 👨‍🎓 Student Features
- **Easy Join**: Join sessions using simple 6-digit codes
- **Interactive Voting**: Submit answers with intuitive interface
- **Live Results**: View poll results immediately after voting
- **Real-time Updates**: Receive new polls and updates instantly
- **Responsive Design**: Works seamlessly on all devices

### 🚀 Technical Features
- **Real-time Communication**: Socket.IO for instant updates
- **Secure Sessions**: Protected polling sessions with unique access codes
- **Responsive UI**: Modern design with Tailwind CSS
- **Smooth Animations**: Enhanced user experience with smooth transitions
- **Cross-device Compatibility**: Works on desktop, tablet, and mobile

## 🛠️ Technology Stack

- **Frontend**: React 18, React Router, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Real-time**: Socket.IO
- **UI Components**: Lucide React Icons
- **Build Tool**: Vite
- **Code Quality**: ESLint

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 16.0 or higher)
- **npm** (usually comes with Node.js)

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd live-polling-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:9000

## 🎯 How to Use

### For Teachers:
1. **Get Started**: Click "Get Started" on the homepage
2. **Login**: Enter your name and select "Teacher"
3. **Create Session**: Click "Create New Session" in the dashboard
4. **Share Code**: Share the 6-digit session code with students
5. **Create Polls**: Use the poll creation form to ask questions
6. **Monitor Results**: Watch live results as students vote

### For Students:
1. **Get Started**: Click "Get Started" on the homepage
2. **Login**: Enter your name and select "Student"
3. **Join Session**: Enter the session code provided by your teacher
4. **Participate**: Answer polls when they appear
5. **View Results**: See results after submitting your vote

## 📁 Project Structure

```
live-polling-system/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── CreatePoll.jsx   # Poll creation form
│   │   ├── Navbar.jsx       # Navigation bar
│   │   ├── PollInterface.jsx # Student voting interface
│   │   └── SessionManager.jsx # Teacher session management
│   ├── contexts/            # React contexts
│   │   ├── AuthContext.jsx  # Authentication state
│   │   └── SocketContext.jsx # Socket.IO connection
│   ├── pages/               # Main application pages
│   │   ├── Home.jsx         # Landing page
│   │   ├── TeacherDashboard.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── PollSession.jsx  # Active poll session
│   │   └── Results.jsx      # Poll results display
│   ├── App.jsx              # Main application component
│   └── main.jsx             # Application entry point
├── server/
│   └── index.js             # Express server with Socket.IO
├── public/                  # Static assets
└── package.json             # Project dependencies
```

## 🔧 Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run client` - Start only the frontend (Vite dev server)
- `npm run server` - Start only the backend (Express server)
- `npm run build` - Build the frontend for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint for code quality checks

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Sessions
- `POST /api/sessions/create` - Create new session
- `POST /api/sessions/join` - Join existing session
- `GET /api/sessions/:sessionId` - Get session details

### Polls
- `POST /api/polls/create` - Create new poll
- `POST /api/polls/:pollId/vote` - Submit vote
- `POST /api/polls/:pollId/close` - Close poll
- `GET /api/polls/:pollId/results` - Get poll results

## 🔄 Socket.IO Events

### Client to Server
- `join-session` - Join a session room
- `poll-created` - Notify about new poll
- `vote-submitted` - Submit a vote
- `poll-closed` - Close a poll

### Server to Client
- `new-poll` - New poll available
- `vote-update` - Real-time vote updates
- `poll-ended` - Poll has ended

## 🎨 Design Features

- **Modern UI**: Clean, intuitive interface following modern design principles
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Enhanced user experience with CSS transitions
- **Accessibility**: ARIA labels and keyboard navigation support
- **Color Scheme**: Professional blue and teal color palette

## 🔒 Security Features

- **Session Isolation**: Each session is isolated with unique codes
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Properly configured cross-origin requests
- **Real-time Verification**: Socket.IO connection verification

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Environment Variables
Create a `.env` file for production configuration:
```
PORT=9000
CLIENT_URL=http://localhost:3000
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Socket.IO for real-time communication
- Tailwind CSS for the utility-first CSS framework
- Lucide React for beautiful icons
- Vite for the lightning-fast build tool


**Built with ❤️ for interactive learning and engagement**
