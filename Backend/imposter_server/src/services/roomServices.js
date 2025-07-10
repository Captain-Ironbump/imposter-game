import {logger} from '../util/logger.js';

export function createRoom(io, socket, rooms) {
  const roomId = `Room-${Math.floor(Math.random() * 1000)}`;
  if (!rooms[roomId]) {
    rooms[roomId] = [socket.id];
    socket.join(roomId);
    socket.emit('roomCreated', roomId);
    io.emit('roomsList', Object.keys(rooms));
    socket.emit('userInRoom', roomId);
    logger.info(`Room created: ${roomId} by ${socket.id}`);
  } else {
    socket.emit('roomExists', roomId);
  }
}

export function joinRoom(io, socket, rooms, { roomId }) {
  if (rooms[roomId]) {
    rooms[roomId].push(socket.id);
    socket.join(roomId);
    socket.emit('userInRoom', roomId);
    io.to(roomId).emit('userJoined', socket.id);
  } else {
    socket.emit('error', 'Room does not exist');
  }
}

export function getRooms(socket, rooms) {
  socket.emit('roomsList', Object.keys(rooms));
}

export function getUserInRoom(socket, rooms) {
  const userRoom = Object.keys(rooms).find(room => rooms[room].includes(socket.id));
  socket.emit('userInRoom', userRoom);
}

export function leaveRoom(io, socket, rooms, roomId) {
  if (rooms[roomId]) {
    rooms[roomId] = rooms[roomId].filter(id => id !== socket.id);
    socket.leave(roomId);
    logger.info(`User ${socket.id} left room ${roomId}`);
    if (rooms[roomId].length === 0) {
      delete rooms[roomId];
    } else {
      io.to(roomId).emit('userLeft', socket.id);
    }
  }
}

export function sendMessage(io, socket, { roomId, message }) {
  io.to(roomId).emit('newMessage', { from: socket.id, message });
}

export function startGame(io, socket, rooms) {
  const userRoom = Object.keys(rooms).find(room => rooms[room].includes(socket.id));
  if (userRoom) {
    io.to(userRoom).emit('gameStarted', `Game started in room ${userRoom}`);
  } else {
    socket.emit('error', 'You are not in a room');
  }
}

export function handleDisconnect(io, socket, rooms) {
  for (const room in rooms) {
    rooms[room] = rooms[room].filter(id => id !== socket.id);
    if (rooms[room].length === 0) {
      delete rooms[room];
      logger.info(`Room ${room} deleted as it is empty`);
    } else {
      io.to(room).emit('userLeft', socket.id);
    }
  }
  logger.info(`User disconnected: ${socket.id}`);
}
