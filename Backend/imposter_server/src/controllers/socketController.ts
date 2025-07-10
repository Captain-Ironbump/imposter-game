import {
  createRoom,
  joinRoom,
  getRooms,
  getUserInRoom,
  leaveRoom,
  startGame,
  handleDisconnect
} from '../services/roomServices.js';
import type { Server, Socket } from 'socket.io';
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData
} from '../IServer';
import type {
  IRooms
} from '../IRooms';

export default function socketController(io: Server, socket: Socket, rooms: IRooms) {
  socket.on('createRoom', () => createRoom(io, socket, rooms));
  socket.on('joinRoom', (data: { roomId: string}) => joinRoom(io, socket, rooms, data));
  socket.on('getRooms', () => getRooms(socket, rooms));
  socket.on('getUserInRoom', () => getUserInRoom(socket, rooms));
  socket.on('leaveRoom', (roomId) => leaveRoom(io, socket, rooms, roomId));
  socket.on('startGame', () => startGame(io, socket, rooms));
  socket.on('disconnect', () => handleDisconnect(io, socket, rooms));
}