import socketController from './controllers/socketController.js';
import type { IRooms } from './IRooms.js';
import { logger } from './util/logger.js';
import type { Server, Socket } from "socket.io";

export default function setupSocket(io: Server) {
    const rooms: IRooms = {};

    io.on('connection', (socket: Socket) => {
        logger.info(`User connected: ${socket.id}`);
        socketController(io, socket, rooms);
    })
}