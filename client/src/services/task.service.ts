import api from "./api";
import type { ApiResponse, Task, CreateTaskInput } from "../types";

export async function fetchTasks(filter?: string): Promise<Task[]> {
  const params = filter ? { filter } : {};
  const { data } = await api.get<ApiResponse<Task[]>>("/tasks", { params });
  return data.data;
}

export async function fetchTaskById(id: string): Promise<Task> {
  const { data } = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
  return data.data;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const { data } = await api.post<ApiResponse<Task>>("/tasks", input);
  return data.data;
}

export async function acceptTask(id: string): Promise<Task> {
  const { data } = await api.post<ApiResponse<Task>>(`/tasks/${id}/accept`);
  return data.data;
}

export async function startTask(id: string): Promise<Task> {
  const { data } = await api.post<ApiResponse<Task>>(`/tasks/${id}/start`);
  return data.data;
}

export async function submitTask(
  id: string,
  formData: FormData
): Promise<Task> {
  const { data } = await api.post<ApiResponse<Task>>(
    `/tasks/${id}/submit`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return data.data;
}

export async function completeTask(id: string): Promise<Task> {
  const { data } = await api.post<ApiResponse<Task>>(`/tasks/${id}/complete`);
  return data.data;
}
