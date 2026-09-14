import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Connect single socket instance
const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";
const socket = io(SERVER_URL);


function App() {
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [room, setRoom] = useState('general');
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    if (!isJoined) return;

    // Join requested room on server
    socket.emit('join_room', room);

    // Event listener: Load full history on room switch
    const handleLoadHistory = (history) => {
      setMessageList(history);
    };

    // Event listener: Append new live message
    const handleReceiveMessage = (data) => {
      setMessageList((prev) => [...prev, data]);
    };

    socket.on('load_history', handleLoadHistory);
    socket.on('receive_message', handleReceiveMessage);

    // Clean up event listeners whenever room changes
    return () => {
      socket.off('load_history', handleLoadHistory);
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [room, isJoined]);

  const handleJoin = () => {
    if (username.trim() !== '') {
      setIsJoined(true);
    }
  };

  const joinRoom = (newRoom) => {
    if (newRoom !== room) {
      setRoom(newRoom);
    }
  };

  const sendMessage = async () => {
    if (message.trim() !== '') {
      const messageData = {
        room: room,
        author: username,
        message: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      await socket.emit('send_message', messageData);
      setMessage('');
    }
  };

  if (!isJoined) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2>Enter Discord Clone</h2>
        <input
          type="text"
          placeholder="Enter your username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
          style={{ padding: '10px', fontSize: '16px', marginRight: '10px' }}
        />
        <button onClick={handleJoin} style={{ padding: '10px 20px', fontSize: '16px' }}>
          Join Chat
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      {/* Sidebar Channels */}
      <div style={{ width: '200px', backgroundColor: '#2f3136', color: 'white', padding: '20px' }}>
        <h3>Channels</h3>
        <button 
          onClick={() => joinRoom('general')} 
          style={{ display: 'block', margin: '10px 0', width: '100%', padding: '8px' }}>
          # general
        </button>
        <button 
          onClick={() => joinRoom('lounge')} 
          style={{ display: 'block', margin: '10px 0', width: '100%', padding: '8px' }}>
          # lounge
        </button>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px' }}>
        <h2>Current Room: #{room} (Signed in as: {username})</h2>
        <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px', overflowY: 'scroll' }}>
          {messageList.map((msg, idx) => (
            <div key={idx} style={{ margin: '8px 0' }}>
              <strong>{msg.author}</strong> <small>({msg.time})</small>: {msg.message}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <input
            type="text"
            value={message}
            placeholder="Type a message..."
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            style={{ flex: 1, padding: '10px' }}
          />
          <button onClick={sendMessage} style={{ padding: '10px 20px' }}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;