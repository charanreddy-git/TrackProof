import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTasks,
  fetchTaskById,
  createTask,
  acceptTask,
  startTask,
  submitTask,
  completeTask,
} from "../services/task.service";
import type { CreateTaskInput } from "../types";

export function useTaskList(filter?: string) {
  return useQuery({
    queryKey: ["tasks", filter],
    queryFn: () => fetchTasks(filter),
    refetchInterval: 30000, // Refetch every 30s as fallback
  });
}

export function useTaskDetail(id: string) {
  return useQuery({
    queryKey: ["task", id],
    queryFn: () => fetchTaskById(id),
    enabled: !!id,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTaskInput) => createTask(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useAcceptTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => acceptTask(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", id] });
    },
  });
}

export function useStartTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => startTask(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", id] });
    },
  });
}

export function useSubmitTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      submitTask(id, formData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", id] });
    },
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => completeTask(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", id] });
    },
  });
}
