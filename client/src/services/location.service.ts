import api from "./api";
import type { ApiResponse, LocationLog } from "../types";

export async function fetchLocationHistory(
  taskId: string
): Promise<LocationLog[]> {
  const { data } = await api.get<ApiResponse<LocationLog[]>>(
    `/location/${taskId}`
  );
  return data.data;
}

export async function updateLocation(
  taskId: string,
  latitude: number,
  longitude: number
): Promise<LocationLog> {
  const { data } = await api.post<ApiResponse<LocationLog>>(
    "/location/update",
    { taskId, latitude, longitude }
  );
  return data.data;
}
