import { io } from "socket.io-client";

console.log("Socket URL:", process.env.NEXT_PUBLIC_SOCKET_URL);
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
    path: "/socket.io",
    transports: ["websocket"]
});

export default socket;