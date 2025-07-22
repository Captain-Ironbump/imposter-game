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
  IRooms
} from '../IRooms';


export class SocketController {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  public handleSocketCommands(socket: Socket, rooms: IRooms): void {
    socket.on('createRoom', () => createRoom(this.io, socket, rooms));
    socket.on('joinRoom', (data: { roomId: string}) => joinRoom(this.io, socket, rooms, data));
    socket.on('getRooms', () => getRooms(socket, rooms));
    socket.on('getUserInRoom', () => getUserInRoom(socket, rooms));
    socket.on('leaveRoom', (roomId) => leaveRoom(this.io, socket, rooms, roomId));
    socket.on('startGame', () => startGame(this.io, socket, rooms));
    socket.on('disconnect', () => handleDisconnect(this.io, socket, rooms));
  }
}
