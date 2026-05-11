import { apiClient } from "@/services/api/client";
import { LoginSchema } from "@/lib/validations/login-schema";
import axios from "axios";

export type AuthLoginResponse = {
  access_token: string;
  user: {
    id: string;
    name: string;
    role: "STUDENT" | "HOMEROOM_TEACHER" | "BK" | "ADMIN";
    portal: "student" | "staff";
    nis?: string;
    username?: string;
  };
};

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string>;
};

export async function login(payload: LoginSchema) {
  try {
    const response = await apiClient.post<ApiEnvelope<AuthLoginResponse>>("/auth/login", payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError<ApiEnvelope<never>>(error)) {
      const message =
        error.response?.data?.message ?? "Tidak dapat terhubung ke server login.";
      throw new Error(message);
    }

    throw error;
  }
}
