export type Role = "USER" | "CAPTAIN";

export type TaskStatus =
  | "OPEN"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "COMPLETED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  targetLat: number;
  targetLng: number;
  status: TaskStatus;
  evidenceImage: string | null;
  createdById: string;
  acceptedById: string | null;
  createdBy: Pick<User, "id" | "name" | "email" | "role">;
  acceptedBy: Pick<User, "id" | "name" | "email" | "role"> | null;
  locationLogs?: LocationLog[];
  createdAt: string;
  updatedAt: string;
}

export interface LocationLog {
  id: string;
  latitude: number;
  longitude: number;
  taskId: string;
  captainId: string;
  timestamp: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  latitude: number;
  longitude: number;
}
