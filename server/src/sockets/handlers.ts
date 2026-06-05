import { Server, Socket } from "socket.io";
import { LocationService } from "../services/location.service";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from "../types/socket.types";

type TypedServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
type TypedSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export function registerSocketHandlers(
  io: TypedServer,
  socket: TypedSocket
): void {
  // Join a task room (for receiving updates)
  socket.on("task:join", ({ taskId }) => {
    socket.join(`task:${taskId}`);
    console.log(
      `[Socket] ${socket.data.email} joined room task:${taskId}`
    );
  });

  // Leave a task room
  socket.on("task:leave", ({ taskId }) => {
    socket.leave(`task:${taskId}`);
    console.log(
      `[Socket] ${socket.data.email} left room task:${taskId}`
    );
  });

  // Captain sends live location
  socket.on("captain:location:update", async ({ taskId, latitude, longitude }) => {
    if (socket.data.role !== "CAPTAIN") {
      return;
    }

    try {
      // Save to database
      await LocationService.updateLocation(socket.data.userId, {
        taskId,
        latitude,
        longitude,
      });

      // Broadcast to everyone in the task room
      io.to(`task:${taskId}`).emit("captain:location:updated", {
        taskId,
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[Socket] Location update error:", error);
    }
  });
}
