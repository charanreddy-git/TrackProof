import api from "./api";
import type {
  ApiResponse,
  AuthResponse,
  OtpRequestResponse,
  Role,
} from "../types";

export async function requestOtpApi(
  phone: string
): Promise<OtpRequestResponse> {
  const { data } = await api.post<ApiResponse<OtpRequestResponse>>(
    "/auth/otp/request",
    { phone }
  );
  return data.data;
}

export async function verifyOtpApi(input: {
  phone: string;
  code: string;
  name?: string;
  role?: Role;
}): Promise<AuthResponse> {
  const { data } = await api.post<ApiResponse<AuthResponse>>(
    "/auth/otp/verify",
    input
  );
  return data.data;
}
