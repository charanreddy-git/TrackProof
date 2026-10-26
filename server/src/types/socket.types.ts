export interface ServerToClientEvents {
  "captain:location:updated": (data: {
    taskId: string;
    latitude: number;
    longitude: number;
    timestamp: string;
  }) => void;
  "task:accepted": (data: {
    taskId: string;
    captainId: string;
    captainName: string;
  }) => void;
  "task:started": (data: { taskId: string }) => void;
  "task:submitted": (data: {
    taskId: string;
    evidenceImage: string;
  }) => void;
  "task:completed": (data: { taskId: string }) => void;
  "task:updated": () => void;
}

export interface ClientToServerEvents {
  "captain:location:update": (data: {
    taskId: string;
    latitude: number;
    longitude: number;
  }) => void;
  "task:join": (data: { taskId: string }) => void;
  "task:leave": (data: { taskId: string }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
  phone: string;
  role: string;
}
