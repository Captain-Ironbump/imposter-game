import { IRooms } from "./IRooms";
import { IRoomData } from "./IRoomData";

export class Rooms implements IRooms {
    [roomId: string]: IRoomData; 
}
