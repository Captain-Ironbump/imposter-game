const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.set('trust proxy', true);
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:8081', 'https://impostergame.loca.lt'],
    methods: ['GET', 'POST']
  }
});

const rooms = {};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('createRoom', () => {
    // const room = JSON.stringify(roomId);
    const roomId = `Room-${Math.floor(Math.random() * 1000)}`;
    console.log(`Creating room: ${roomId} by user ${socket.id}`);
    if (!rooms[roomId]) {
      rooms[roomId] = [socket.id];
      socket.join(roomId);
      socket.emit('roomCreated', roomId);
      io.emit('roomsList', Object.keys(rooms));
      socket.emit('userInRoom', roomId);
      console.log(`Room created: ${roomId} by user ${socket.id}`);
    } else {
      socket.emit('roomExists', roomId);
      console.log(`Room ${roomId} already exists`);
    }
  });

  socket.on('joinRoom', ({ roomId }) => {
    //const room = JSON.stringify(roomId);
    console.log(roomId);
    if (rooms[roomId]) {
      rooms[roomId].push(socket.id);
      socket.join(roomId);
      socket.emit('userInRoom', roomId);
      io.to(roomId).emit('userJoined', socket.id);
      console.log(`${socket.id} joined room ${roomId}`);
    } else {
      socket.emit('error', 'Room does not exist');
    } 
  });

  socket.on('getRooms', () => {
    console.log(`Rooms requested by user ${socket.id}`);
    socket.emit('roomsList', Object.keys(rooms));
  });

  socket.on('getUserInRoom', () => {
    const userRoom = Object.keys(rooms).find(roomId => rooms[roomId].includes(socket.id));
    socket.emit('userInRoom', userRoom);
  });

  socket.on('leaveRoom', (roomId) => {
    if (rooms[roomId]) {
      rooms[roomId] = rooms[roomId].filter(id => id !== socket.id);
      socket.leave(roomId);
      console.log(`User ${socket.id} left room: ${roomId}`);
    }
  });

  socket.on('sendMessage', ({ roomId, message }) => {
    io.to(roomId).emit('newMessage', { from: socket.id, message });
  });

  socket.on('startGame', () => {
    const userRoom = Object.keys(rooms).find(roomId => rooms[roomId].includes(socket.id));
    if (userRoom) {
      io.to(userRoom).emit('gameStarted', `Game started in room ${userRoom}`);
      console.log(`Game started in room: ${userRoom} by user ${socket.id}`);
    } else {
      socket.emit('error', 'You are not in a room');
    } 
  });
    
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    for (const room in rooms) {
      rooms[room] = rooms[room].filter(id => id !== socket.id);
    }
    for (const room in rooms) {
      if (rooms[room].length === 0) {
        delete rooms[room];
        console.log(`Room ${room} deleted as it is empty`);
      } else {
        io.to(room).emit('userLeft', socket.id);
      }
    }
  });
})

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

httpServer.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Try a different port instead...`);
    const newPort = PORT + 1;
    console.log(`Attempting to start server on port ${newPort}...`);
    httpServer.listen(newPort, '0.0.0.0', () => {
      console.log(`Server is now running on port ${newPort}`);
    });
  } else {
    console.error('Server error:', err);
  }
});
