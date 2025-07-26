import { IRoomObserver } from "./IRoomObserver";

export interface IRoomData {
    userIds: string[]; 
    gameStarted: boolean;
    addUser(userId: string): void;
    removeUser(userId: string): void;
    isEmpty(): boolean;
    startGame(): void;
    reset(): void;
    getUserIds(): string[];
    isGameStarted(): boolean;
    toJSON(): object;
    isUserInRoom(userId: string): boolean;


    addObserver(observer: IRoomObserver): void;
    removeObserver(observer: IRoomObserver): void;
}

