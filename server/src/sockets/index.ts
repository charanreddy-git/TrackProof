import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { verifyToken } from "../utils/jwt";
import { registerSocketHandlers } from "./handlers";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from "../types/socket.types";

let io: Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export function initializeSocket(httpServer: HttpServer): Server {
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

  // JWT Authentication Middleware
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
    console.log(
      `[Socket] Connected: ${socket.data.email} (${socket.data.role})`
    );

    registerSocketHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log(`[Socket] Disconnected: ${socket.data.email}`);
    });
  });

  return io;
}

export function getIO(): Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
> {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }
  return io;
}
