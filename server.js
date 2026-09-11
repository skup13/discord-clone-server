const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Server-side memory for history
const chatHistory = {
  general: [],
  lounge: []
};

io.on('connection', (socket) => {
  socket.on('join_room', (roomName) => {
    // Leave all existing room subscriptions except personal socket ID
    for (const r of socket.rooms) {
      if (r !== socket.id) {
        socket.leave(r);
      }
    }

    // Join new room
    socket.join(roomName);

    // Send history of this room back ONLY to the user who joined
    const history = chatHistory[roomName] || [];
    socket.emit('load_history', history);
  });

  socket.on('send_message', (data) => {
    // Store message in server memory
    if (!chatHistory[data.room]) {
      chatHistory[data.room] = [];
    }
    chatHistory[data.room].push(data);

    // Broadcast ONLY to clients currently inside this room
    io.to(data.room).emit('receive_message', data);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});