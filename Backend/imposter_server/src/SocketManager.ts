import { SocketController } from './controllers/SocketController';
import type { IRooms } from './IRooms.js';
import { logger } from './util/logger.js';
import type { Server, Socket } from "socket.io";

export class SocketManager {
    private io: Server;
    private rooms: IRooms;
    private socketController: SocketController;

    constructor(io: Server) {
        this.io = io;
        this.rooms = {};
        this.socketController = new SocketController(this.io);
    }

    public init(): void {
        this.io.on('connection', (socket: Socket) => {
            logger.info(`User connected: ${socket.id}`);
            this.socketController.handleSocketCommands(socket, this.rooms);
        });
    }
}
