import { useState, useEffect, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket, joinTaskRoom, leaveTaskRoom } from "../sockets/socket";

interface LocationData {
  taskId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

interface TaskEvent {
  taskId: string;
  captainId?: string;
  captainName?: string;
  evidenceImage?: string;
}

export function useSocket() {
  const socket = getSocket();

  const joinRoom = useCallback(
    (taskId: string) => {
      if (socket?.connected) {
        joinTaskRoom(taskId);
      }
    },
    [socket]
  );

  const leaveRoom = useCallback(
    (taskId: string) => {
      if (socket?.connected) {
        leaveTaskRoom(taskId);
      }
    },
    [socket]
  );

  return { socket, joinRoom, leaveRoom, isConnected: socket?.connected ?? false };
}

export function useTaskUpdates(
  taskId: string | undefined,
  callbacks?: {
    onAccepted?: (data: TaskEvent) => void;
    onStarted?: (data: TaskEvent) => void;
    onSubmitted?: (data: TaskEvent) => void;
    onCompleted?: (data: TaskEvent) => void;
  }
) {
  const { joinRoom, leaveRoom, socket } = useSocket();
  const callbacksRef = useRef(callbacks);

  // Sync callbacks ref on every render
  useEffect(() => {
    callbacksRef.current = callbacks;
  });

  useEffect(() => {
    if (!taskId || !socket) return;

    joinRoom(taskId);

    const handleAccepted = (data: TaskEvent) => callbacksRef.current?.onAccepted?.(data);
    const handleStarted = (data: TaskEvent) => callbacksRef.current?.onStarted?.(data);
    const handleSubmitted = (data: TaskEvent) => callbacksRef.current?.onSubmitted?.(data);
    const handleCompleted = (data: TaskEvent) => callbacksRef.current?.onCompleted?.(data);

    socket.on("task:accepted", handleAccepted);
    socket.on("task:started", handleStarted);
    socket.on("task:submitted", handleSubmitted);
    socket.on("task:completed", handleCompleted);

    return () => {
      leaveRoom(taskId);
      socket.off("task:accepted", handleAccepted);
      socket.off("task:started", handleStarted);
      socket.off("task:submitted", handleSubmitted);
      socket.off("task:completed", handleCompleted);
    };
  }, [taskId, socket, joinRoom, leaveRoom]);
}

export function useLiveLocation(taskId: string | undefined) {
  const [location, setLocation] = useState<LocationData | null>(null);
  const { socket } = useSocket();

  useEffect(() => {
    if (!taskId || !socket) return;

    const handleLocationUpdate = (data: LocationData) => {
      if (data.taskId === taskId) {
        setLocation(data);
      }
    };

    socket.on("captain:location:updated", handleLocationUpdate);

    return () => {
      socket.off("captain:location:updated", handleLocationUpdate);
    };
  }, [taskId, socket]);

  return location;
}

export function useGlobalTaskUpdates() {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleTaskUpdated = () => {
      // Invalidate all tasks queries to force a refetch
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    };

    socket.on("task:updated", handleTaskUpdated);

    return () => {
      socket.off("task:updated", handleTaskUpdated);
    };
  }, [socket, queryClient]);
}
