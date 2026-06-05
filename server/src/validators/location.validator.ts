import { z } from "zod";

export const locationUpdateSchema = z.object({
  taskId: z.string().min(1, "Task ID is required"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export type LocationUpdateInput = z.infer<typeof locationUpdateSchema>;
