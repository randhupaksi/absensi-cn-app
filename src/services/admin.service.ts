import { apiClient } from "@/services/api/client";
import type {
  AdminDashboardData,
  AdminHomeroomAssignment,
  AdminTeacherDirectory,
  AdminTeacherProfile,
  AdminTeacherSubjectAssignment,
  AdminUser,
  AdminUserPayload,
} from "@/types/admin";
import axios from "axios";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string>;
};

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<ApiEnvelope<never>>(error)) {
    return (
      error.response?.data?.message ??
      "Terjadi kesalahan saat menghubungkan dashboard admin."
    );
  }

  return error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui.";
}

export async function getAdminDashboard() {
  try {
    const response =
      await apiClient.get<ApiEnvelope<AdminDashboardData>>("/admin/dashboard");
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getAdminUsers() {
  try {
    const response = await apiClient.get<ApiEnvelope<AdminUser[]>>("/admin/users");
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getAdminTeachers() {
  try {
    const response = await apiClient.get<ApiEnvelope<AdminTeacherDirectory[]>>("/admin/teachers");
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getAdminTeacherProfiles() {
  try {
    const response = await apiClient.get<ApiEnvelope<AdminTeacherProfile[]>>(
      "/admin/teacher-profiles",
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getAdminTeacherSubjectAssignments() {
  try {
    const response =
      await apiClient.get<ApiEnvelope<AdminTeacherSubjectAssignment[]>>(
        "/admin/teacher-subject-assignments",
      );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getAdminHomeroomAssignments() {
  try {
    const response = await apiClient.get<ApiEnvelope<AdminHomeroomAssignment[]>>(
      "/admin/homeroom-assignments",
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createAdminUser(payload: AdminUserPayload) {
  try {
    const response = await apiClient.post<ApiEnvelope<AdminUser>>(
      "/admin/users",
      payload,
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateAdminUser(id: string, payload: AdminUserPayload) {
  try {
    const response = await apiClient.patch<ApiEnvelope<AdminUser>>(
      `/admin/users/${id}`,
      payload,
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteAdminUser(id: string) {
  try {
    await apiClient.delete(`/admin/users/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
