import { Server, Socket } from "socket.io";
import { LocationService } from "../services/location.service";
import { locationUpdateSchema } from "../validators/location.validator";
import { logger } from "../utils/logger";
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

        await LocationService.validateAndLogLocation(socket.data.userId, parsed);

        io.to(`task:${parsed.taskId}`).emit("captain:location:updated", {
          taskId: parsed.taskId,
          latitude: parsed.latitude,
          longitude: parsed.longitude,
          timestamp: new Date().toISOString(),
        });
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
