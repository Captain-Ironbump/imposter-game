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

    private shuffle<T>(array: T[]): T[] {
        const copy = array.slice();
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    onRoundStarted(roomId: string, word: string): void {
        logger.info(`Round started in room ${roomId}`);
        const clients = Array.from(this.io.sockets.adapter.rooms.get(roomId) || []);
        
        if (clients.length <= 2) {
            logger.error("At least 3 players needed");
            return;
        };

        const imposterClients = this.shuffle(clients)
            .slice(0, 2);

        const restClients = clients.filter(id => !imposterClients.includes(id));

        imposterClients.forEach(id => {
            this.io.to(id).emit("roundStarted", { word: "Imposter" });
        });

        restClients.forEach(id => {
            this.io.to(id).emit("roundStarted", { word: word });
        });
    }
}
