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
} from '../data/room/IRooms';
import { IRoomObserver } from '../data/room/IRoomObserver.js';


export class SocketController {
  private io: Server;
  private observer: IRoomObserver;

  constructor(io: Server, observer: IRoomObserver) {
    this.io = io;
    this.observer = observer
  }

  public handleSocketCommands(socket: Socket, rooms: IRooms): void {
    socket.on('createRoom', () => createRoom(this.io, socket, rooms, this.observer));
    socket.on('joinRoom', (data: { roomId: string}) => joinRoom(this.io, socket, rooms, data));
    socket.on('getRooms', () => getRooms(socket, rooms));
    socket.on('getUserInRoom', () => getUserInRoom(socket, rooms));
    socket.on('leaveRoom', (roomId) => leaveRoom(this.io, socket, rooms, roomId));
    socket.on('startGame', () => startGame(this.io, socket, rooms));
    socket.on('disconnect', () => handleDisconnect(this.io, socket, rooms));
  }
}
