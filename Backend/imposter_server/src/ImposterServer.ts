const express = require("express");
const http = require("http");
import { Express } from "express";
import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { logger } from "./util/logger.js";
import { SocketManager } from "./SocketManager";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData
} from './IServer';
//require('dotenv').config();

export class ImposterServer {
  private app: Express;
  private server: HTTPServer;
  private io: SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
  private port: number; 
  private socketManager: SocketManager;

  constructor(port: number = Number(process.env.PORT) || 3000) {
    this.app = express();
    this.app.set("trust proxy", true);

    this.port = port;
    this.server = http.createServer(this.app);

    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
      path: "/socket.io",
    });
    this.socketManager = new SocketManager(this.io);
  }

  public start(): void {
    this.server.listen(this.port, "0.0.0.0", () => {
      logger.info(`Imposter server is running on port ${this.port}`);
      this.socketManager.init();
    });

    this.server.on("error", (err: NodeJS.ErrnoException) => {
      this.handleServerError(err);
    });
  }

  private handleServerError(err: NodeJS.ErrnoException): void {
    if (err.code === "EADDRINUSE") {
      logger.error(`Port ${this.port} is already in use.`);
      const newPort = this.port + 1;
      logger.info(`Attempting to start server on port ${newPort}...`);
      this.server.listen(newPort, "0.0.0.0", () => {
        logger.info(`Server is now running on port ${newPort}`);
      });
    } else {
      logger.error("Server error:", err);
    }
  }

}
