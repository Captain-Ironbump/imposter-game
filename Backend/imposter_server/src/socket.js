import socketController from './controllers/socketController.js';
import { logger } from './util/logger.js';

export default function setupSocket(io) {
    const rooms = {};

    io.on('connection', (socket) => {
        logger.info(`User connected: ${socket.id}`);
        socketController(io, socket, rooms);
    })
}