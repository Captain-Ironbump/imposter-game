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
} from '../IRooms';

export function createRoom(
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >, 
  socket: Socket, 
  rooms: IRooms
) {
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
    rooms[data.roomId]?.push(socket.id);
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
  const userRoom = Object.keys(rooms).find(room => rooms[room]?.includes(socket.id));
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
    rooms[data.roomId] = rooms[data.roomId]?.filter(id => id !== socket.id) ?? [];
    socket.leave(data.roomId);
    logger.info(`User ${socket.id} left room ${data.roomId}`);
    if (rooms[data.roomId]?.length === 0) {
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
  const userRoom = Object.keys(rooms).find(room => rooms[room]?.includes(socket.id));
  if (userRoom) {
    io.to(userRoom).emit('gameStarted', userRoom);
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
    rooms[room] = rooms[room]?.filter(id => id !== socket.id) ?? [];
    if (rooms[room].length === 0) {
      delete rooms[room];
      logger.info(`Room ${room} deleted as it is empty`);
    } else {
      io.to(room).emit('userLeft', socket.id);
    }
  }
  logger.info(`User disconnected: ${socket.id}`);
}
