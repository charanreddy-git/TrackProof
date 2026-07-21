import { Server, Socket } from "socket.io";
import { LocationService } from "../services";
import { locationUpdateSchema } from "../validators";
import { logger } from "../utils";
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

// In-memory store to throttle database writes for location updates
const lastLocationLog = new Map<string, number>();

export function registerSocketHandlers(
  io: TypedServer,
  socket: TypedSocket
): void {
  // Join personal user room to receive global task updates for dashboard
  if (socket.data.userId) {
    socket.join(`user:${socket.data.userId}`);
  }
  socket.on("task:join", ({ taskId }) => {
    socket.join(`task:${taskId}`);
    logger.debug(`${socket.data.email} joined room task:${taskId}`);
  });

  socket.on("task:leave", ({ taskId }) => {
    socket.leave(`task:${taskId}`);
    logger.debug(`${socket.data.email} left room task:${taskId}`);
  });

  socket.on(
    "captain:location:update",
    async ({ taskId, latitude, longitude }) => {
      if (socket.data.role !== "CAPTAIN") return;

      try {
        const parsed = locationUpdateSchema.parse({ taskId, latitude, longitude });

        // Broadcast location instantly to the task room for real-time tracking
        io.to(`task:${parsed.taskId}`).emit("captain:location:updated", {
          taskId: parsed.taskId,
          latitude: parsed.latitude,
          longitude: parsed.longitude,
          timestamp: new Date().toISOString(),
        });

        const now = Date.now();
        const throttleKey = `${socket.data.userId}:${taskId}`;
        const lastLogTime = lastLocationLog.get(throttleKey) || 0;

        // Throttle database writes to once every 60 seconds
        if (now - lastLogTime > 60000) {
          await LocationService.validateAndLogLocation(socket.data.userId, parsed);
          lastLocationLog.set(throttleKey, now);
        }
      } catch (error) {
        logger.warn("Location update rejected", {
          captainId: socket.data.userId,
          taskId,
          reason: error instanceof Error ? error.message : String(error),
        });
      }
    }
  );
}
