import { io } from "socket.io-client";

const socket = io(process.env.SERVER_BASE_URL, {
    transports: ["websockets"]
});

export default socket;