import express from "express";
import http from "http";
import { Server } from "socket.io";
import { logger } from "./util/logger.js";
import setupSocket from "./socket.js";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData
} from './IServer';
//require('dotenv').config();

export function startServer() {
  const app = express();
  app.set("trust proxy", true);
  const server = http.createServer(app);

  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    path: "/socket.io",
  });

  setupSocket(io);

  const PORT = Number(process.env.PORT) || 3000;

  server.listen(PORT, "0.0.0.0", () => {
    logger.info(`Server is running on port ${PORT}`);
  });

  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      logger.error(
        `Port ${PORT} is already in use. Try a different port instead...`
      );
      const newPort = PORT + 1;
      logger.info(`Attempting to start server on port ${newPort}...`);
      server.listen(newPort, "0.0.0.0", () => {
        logger.info(`Server is now running on port ${newPort}`);
      });
    } else {
      logger.error("Server error:", err);
    }
  });
}
