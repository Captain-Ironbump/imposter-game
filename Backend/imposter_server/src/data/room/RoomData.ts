import { logger } from "../../util/logger";
import { IRoomData } from "./IRoomData";
import { IRoomObserver } from "./IRoomObserver";

export class RoomData implements IRoomData {
    public roomId: string;
    userIds: string[];
    gameStarted: boolean;
    roomLeaderId: string;
    word: string;
    private observers: IRoomObserver[] = [];
    
    constructor(roomId: string, roomLeaderId: string) {
        this.roomId = roomId;
        this.gameStarted = false;
        this.roomLeaderId = roomLeaderId;
        this.userIds = [];
        this.word = "";
    }
    
    addUser(userId: string): void {
        if (!this.userIds.includes(userId)) {
            this.userIds.push(userId);
        }
    }

    removeUser(userId: string): void {
        this.userIds = this.userIds.filter(id => id !== userId);
    }

    isEmpty(): boolean {
        return this.userIds.length === 0;
    }

    startGame(): void {
        this.gameStarted = true;
        // initialize word for the current game state 
        this.notifyGameStarted();
    }

    startRound(): void {
        if (!this.gameStarted) {
            logger.error("round cannot be startet, game needs to start first!");
            // TODO: notify of error --> should actually never happen
            return;
        }
        if (this.word == null) {
            logger.error("round cannot be startet, no word specified!");
            // TODO: notify of error 
            return;
        }
        
        this.notifyRoundStarted();
    }

    reset(): void {
        this.userIds = [];
        this.gameStarted = false;
    }

    getUserIds(): string[] {
        return this.userIds;
    }

    isGameStarted(): boolean {
        return this.gameStarted;
    }

    toJSON(): object {
        return {
            userIds: this.userIds,
            gameStarted: this.gameStarted
        };
    }

    isUserInRoom(userId: string): boolean {
        return this.userIds.includes(userId);
    }

    addObserver(observer: IRoomObserver): void {
        this.observers.push(observer);
    }

    removeObserver(observer: IRoomObserver): void {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    private notifyGameStarted(): void {
        for (const observer of this.observers) {
            observer.onGameStarted(this.roomId, this.roomLeaderId);
        }
    }

    private notifyRoundStarted(): void {
        for (const observer of this.observers) {
            observer.onRoundStarted(this.roomId, this.word);
        }
    }
}
