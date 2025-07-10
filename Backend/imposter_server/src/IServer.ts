export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  roomCreated: (roomId: string) => void;
  roomsList: (roomNames: string[]) => void;
  userInRoom: (roomId: string) => void;
  roomExists: (roomId: string) => void;
  userJoined: (socketId: string) => void;
  userLeft: (socketId: string) => void;
  gameStarted: (roomdId: string) => void;
  joinRoom: (data: { roomId: string}) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}