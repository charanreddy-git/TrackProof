import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { verifyToken, logger } from "../utils";
import { registerSocketHandlers } from "./handlers";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from "../types/socket.types";

type TypedIO = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

let io: TypedIO;

export function initializeSocket(httpServer: HttpServer): void {
  io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication required"));
    }
    try {
      const decoded = verifyToken(token);
      socket.data.userId = decoded.userId;
      socket.data.email = decoded.email;
      socket.data.role = decoded.role;
      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    logger.debug(`Socket connected: ${socket.data.email} (${socket.data.role})`);
    registerSocketHandlers(io, socket);
    socket.on("disconnect", () => {
      logger.debug(`Socket disconnected: ${socket.data.email}`);
    });
  });
}

export function getIO(): TypedIO {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }
  return io;
}
