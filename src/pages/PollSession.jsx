import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';

const PollSession = () => {
  const { sessionId } = useParams();
  const { socket } = useSocket();
  const [poll, setPoll] = useState(null);

  useEffect(() => {
    socket.emit('join-session', sessionId);
    socket.on('new-poll', setPoll);

    return () => {
      socket.off('new-poll');
    };
  }, [sessionId, socket]);

  return poll ? (
    <div>
      <h2>{poll.question}</h2>
      <ul>
        {poll.options.map(option => (
          <li key={option.id}>{option.text}</li>
        ))}
      </ul>
    </div>
  ) : (
    <p>Waiting for a new poll...</p>
  );
};

export default PollSession;
