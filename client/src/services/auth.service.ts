import api from "./api";
import type { ApiResponse, AuthResponse } from "../types";

export async function loginApi(
  email: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await api.post<ApiResponse<AuthResponse>>("/auth/login", {
    email,
    password,
  });
  return data.data;
}

export async function registerApi(
  name: string,
  email: string,
  password: string,
  role: "USER" | "CAPTAIN"
): Promise<AuthResponse> {
  const { data } = await api.post<ApiResponse<AuthResponse>>(
    "/auth/register",
    { name, email, password, role }
  );
  return data.data;
}
