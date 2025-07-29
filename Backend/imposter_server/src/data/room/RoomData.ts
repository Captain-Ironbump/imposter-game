import { IRoomData } from "./IRoomData";
import { IRoomObserver } from "./IRoomObserver";

export class RoomData implements IRoomData {
    public roomId: string;
    userIds: string[];
    gameStarted: boolean;
    roomLeaderId: string;
    private observers: IRoomObserver[] = [];
    
    constructor(roomId: string, roomLeaderId: string) {
        this.roomId = roomId;
        this.gameStarted = false;
        this.roomLeaderId = roomLeaderId;
        this.userIds = [];
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
        this.notifyGameStarted();
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
}
