import {
  createRoom,
  joinRoom,
  getRooms,
  getUserInRoom,
  leaveRoom,
  sendMessage,
  startGame,
  handleDisconnect
} from '../services/roomServices.js';

export default function socketController(io, socket, rooms) {
  socket.on('createRoom', () => createRoom(io, socket, rooms));
  socket.on('joinRoom', (data) => joinRoom(io, socket, rooms, data));
  socket.on('getRooms', () => getRooms(socket, rooms));
  socket.on('getUserInRoom', () => getUserInRoom(socket, rooms));
  socket.on('leaveRoom', (roomId) => leaveRoom(io, socket, rooms, roomId));
  socket.on('sendMessage', (data) => sendMessage(io, socket, data));
  socket.on('startGame', () => startGame(io, socket, rooms));
  socket.on('disconnect', () => handleDisconnect(io, socket, rooms));
}