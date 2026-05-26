import { apiClient } from "@/services/api/client";
import type {
  StaffAttendanceReviewPayload,
  StaffHomeroomAttendanceOverview,
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

export async function getTeacherHomeroomAttendanceOverview(params: {
  date?: string;
  status?: string;
  query?: string;
}) {
  try {
    const response = await apiClient.get<ApiEnvelope<StaffHomeroomAttendanceOverview>>(
      "/teacher/homeroom/attendance-overview",
      {
        params,
      },
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function reviewTeacherHomeroomAttendance(
  attendanceId: string,
  payload: StaffAttendanceReviewPayload,
) {
  try {
    const response = await apiClient.patch<ApiEnvelope<unknown>>(
      `/teacher/homeroom/attendance/${attendanceId}/review`,
      payload,
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
