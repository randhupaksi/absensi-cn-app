import { apiClient } from "@/services/api/client";
import type {
  StaffHomeroomContext,
  StaffHomeroomDashboard,
  StaffHomeroomStudentDetail,
  StaffStudentSummary,
} from "@/types/staff";
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
      "Terjadi kesalahan saat menghubungkan dashboard staff."
    );
  }

  return error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui.";
}

export async function getTeacherHomeroomDashboard() {
  try {
    const response = await apiClient.get<ApiEnvelope<StaffHomeroomDashboard>>(
      "/teacher/homeroom/dashboard",
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getTeacherHomeroom() {
  try {
    const response = await apiClient.get<ApiEnvelope<StaffHomeroomContext>>(
      "/teacher/homeroom",
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getTeacherHomeroomStudents() {
  try {
    const response = await apiClient.get<ApiEnvelope<StaffStudentSummary[]>>(
      "/teacher/homeroom/students",
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getTeacherHomeroomStudentDetail(studentId: string) {
  try {
    const response = await apiClient.get<ApiEnvelope<StaffHomeroomStudentDetail>>(
      `/teacher/homeroom/students/${studentId}`,
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
