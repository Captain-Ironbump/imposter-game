export interface IRoomObserver {
    onGameStarted(roomId: string, leader: string): void;
    onRoundStarted(roomId: string, word: string): void;
}
