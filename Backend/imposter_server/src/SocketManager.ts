import { SocketController } from './controllers/SocketController';
import { IRoomObserver } from './data/room/IRoomObserver';
import type { IRooms } from './data/room/IRooms';
import { logger } from './util/logger.js';
import type { Server, Socket } from "socket.io";

export class SocketManager implements IRoomObserver {
    private io: Server;
    private rooms: IRooms;
    private socketController: SocketController;

    constructor(io: Server) {
        this.io = io;
        this.rooms = {};
        this.socketController = new SocketController(this.io, this);
    }

    public init(): void {
        this.io.on('connection', (socket: Socket) => {
            logger.info(`User connected: ${socket.id}`);
            this.socketController.handleSocketCommands(socket, this.rooms);
        });
    }
    
    onGameStarted(roomId: string, leader: string): void {
        logger.info(`Game started in room ${roomId}`);
        this.io.to(roomId).emit('gameStarted', { roomId: roomId, leader: leader });
    }
}
