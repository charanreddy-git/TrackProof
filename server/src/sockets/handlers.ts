import { Server, Socket } from "socket.io";
import { LocationService } from "../services/location.service";
import { prisma } from "../lib/prisma";
import { locationUpdateSchema } from "../validators/location.validator";
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
      // Validate payload via zod schema
      const parsed = locationUpdateSchema.parse({ taskId, latitude, longitude });

      // Fetch task to verify assignee and state
      const task = await prisma.task.findUnique({
        where: { id: parsed.taskId },
      });

      if (!task) {
        console.warn(`[Socket] Task ${parsed.taskId} not found`);
        return;
      }

      if (task.status !== "IN_PROGRESS") {
        console.warn(`[Socket] Task ${parsed.taskId} is not in IN_PROGRESS state`);
        return;
      }

      if (task.acceptedById !== socket.data.userId) {
        console.warn(`[Socket] Unauthorized location update attempt by captain ${socket.data.userId} on task ${parsed.taskId}`);
        return;
      }

      // Save to database
      await LocationService.updateLocation(socket.data.userId, parsed);

      // Broadcast to everyone in the task room
      io.to(`task:${parsed.taskId}`).emit("captain:location:updated", {
        taskId: parsed.taskId,
        latitude: parsed.latitude,
        longitude: parsed.longitude,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[Socket] Location update error:", error);
    }
  });
}
