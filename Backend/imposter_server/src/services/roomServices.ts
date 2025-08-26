import {logger} from '../util/logger.js';
import type { Server, Socket } from 'socket.io';
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData
} from '../IServer';
import type {
  IRooms
} from '../data/room/IRooms.ts';
import { IRoomData } from '../data/room/IRoomData.js';
import { RoomData } from '../data/room/RoomData.js';
import { IRoomObserver } from '../data/room/IRoomObserver.js';

export function createRoom(
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >, 
  socket: Socket, 
  rooms: IRooms,
  observer: IRoomObserver
) {
  const roomId = `Room-${Math.floor(Math.random() * 1000)}`;
  if (!rooms[roomId]) {
    let roomData: IRoomData = new RoomData(roomId, socket.id);
    roomData.addUser(socket.id); 
    roomData.addObserver(observer);
    rooms[roomId] = roomData;
    socket.join(roomId);
    socket.emit('roomCreated', roomId);
    io.emit('roomsList', Object.keys(rooms));
    socket.emit('userInRoom', roomId);
    logger.info(`Room created: ${roomId} by ${socket.id}`);
  } else {
    socket.emit('roomExists', roomId);
  }
}

export function joinRoom(
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >, 
  socket: Socket,
  rooms: IRooms,
  data: { roomId: string }
) {
  if (rooms[data.roomId] != null) {
    rooms[data.roomId]?.addUser(socket.id);
    socket.join(data.roomId);
    logger.info(`User ${socket.id} joined room: ${data.roomId}`)
    socket.emit('userInRoom', data.roomId);
    io.to(data.roomId).emit('userJoined', socket.id);
  } else {
    socket.emit('error', 'Room does not exist');
  }
}

export function getRooms(socket: Socket, rooms: IRooms) {
  socket.emit('roomsList', Object.keys(rooms));
}

export function getUserInRoom(socket: Socket, rooms: IRooms) {
  const userRoom = Object.keys(rooms).find(room => rooms[room]?.isUserInRoom(socket.id));
  socket.emit('userInRoom', userRoom);
}

export function leaveRoom(
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >, 
  socket: Socket,
  rooms: IRooms,
  data: { roomId: string }
) {
  if (rooms[data.roomId] != null) {
    rooms[data.roomId]?.removeUser(socket.id);
    socket.leave(data.roomId);
    logger.info(`User ${socket.id} left room ${data.roomId}`);
    if (rooms[data.roomId]?.isEmpty()) {
      delete rooms[data.roomId];
    } else {
      io.to(data.roomId).emit('userLeft', socket.id);
    }
  }
}


export function startGame(
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
  socket: Socket,
  rooms: IRooms
) {
  const roomId = Object.keys(rooms).find(room => rooms[room]?.isUserInRoom(socket.id));
  if (roomId) {
    logger.info(`Starting game in room: ${roomId} by user ${socket.id}`);
    io.to(roomId).emit('gameStarted', roomId);
    rooms[roomId].startGame();
  } else {
    socket.emit('error', 'You are not in a room');
  }
}

export function handleDisconnect(
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
  socket: Socket,
  rooms: IRooms
) {
  for (const room in rooms) {
    rooms[room]?.removeUser(socket.id);
    if (rooms[room].isEmpty()) {
      delete rooms[room];
      logger.info(`Room ${room} deleted as it is empty`);
    } else {
      io.to(room).emit('userLeft', socket.id);
    }
  }
  logger.info(`User disconnected: ${socket.id}`);
}

export function handleGetRoomCreator(
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
  socket: Socket,
  rooms: IRooms,
  data: { roomId: string }
) {
  const room = rooms[data.roomId];
  if (room) {
    socket.emit('roomCreator', room.roomLeaderId);
  } else {
    socket.emit('error', 'Room does not exist');
  }
}

export function handleStartRound(
  data: { 
    roomId: string, 
    leader: string, 
    inputValue: string 
  },
  rooms: IRooms
) {
  logger.debug(data);
  const room = rooms[data.roomId];
  if (room && room.roomLeaderId === data.leader) {
    rooms[data.roomId].word = data.inputValue;
    room.startRound();
  }
}