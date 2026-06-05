import { io, Socket } from "socket.io-client";

const WS_URL = import.meta.env.VITE_WS_URL || "";

let socket: Socket | null = null;

export function getSocket(): Socket | null {
  return socket;
}

export function connectSocket(token: string): Socket {
  if (socket?.connected) {
    return socket;
  }

  socket = io(WS_URL, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log("[Socket] Connected:", socket?.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("[Socket] Disconnected:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("[Socket] Connection error:", error.message);
  });

  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function joinTaskRoom(taskId: string): void {
  socket?.emit("task:join", { taskId });
}

export function leaveTaskRoom(taskId: string): void {
  socket?.emit("task:leave", { taskId });
}

export function emitLocationUpdate(
  taskId: string,
  latitude: number,
  longitude: number
): void {
  socket?.emit("captain:location:update", { taskId, latitude, longitude });
}
