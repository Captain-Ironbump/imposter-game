import { IRoomObserver } from "./IRoomObserver";

export interface IRoomData {
    userIds: string[]; 
    gameStarted: boolean;
    roomLeaderId: string;
    word: string;
    addUser(userId: string): void;
    removeUser(userId: string): void;
    isEmpty(): boolean;
    startGame(): void;
    reset(): void;
    getUserIds(): string[];
    isGameStarted(): boolean;
    toJSON(): object;
    isUserInRoom(userId: string): boolean;
    startRound(): void;


    addObserver(observer: IRoomObserver): void;
    removeObserver(observer: IRoomObserver): void;
}

