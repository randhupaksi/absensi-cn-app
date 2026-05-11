import { apiClient } from "@/services/api/client";
import { LoginSchema } from "@/lib/validations/login-schema";

export async function login(payload: LoginSchema) {
  const response = await apiClient.post("/auth/login", payload);
  return response.data;
}
