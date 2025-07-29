export interface IRoomObserver {
    onGameStarted(roomId: string, leader: string): void;
}
