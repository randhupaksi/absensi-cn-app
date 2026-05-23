import { apiClient } from "@/services/api/client";
import type {
  AdminClass,
  AdminAttendanceRule,
  AdminAttendanceRulePayload,
  AdminDashboardData,
  AdminHomeroomAssignment,
  AdminHomeroomAssignmentPayload,
  AdminSchoolYear,
  AdminStudent,
  AdminStudentClassMembership,
  AdminStudentClassMembershipPayload,
  AdminStudentPayload,
  AdminSubject,
  AdminTeacherDirectory,
  AdminTeacherProfile,
  AdminTeacherProfilePayload,
  AdminTeacherSubjectAssignment,
  AdminTeacherSubjectAssignmentPayload,
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

export async function getAdminSubjects() {
  try {
    const response = await apiClient.get<ApiEnvelope<AdminSubject[]>>(
      "/admin/subjects",
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getAdminClasses() {
  try {
    const response = await apiClient.get<ApiEnvelope<AdminClass[]>>(
      "/admin/classes",
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getAdminSchoolYears() {
  try {
    const response = await apiClient.get<ApiEnvelope<AdminSchoolYear[]>>(
      "/admin/school-years",
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getAdminStudents() {
  try {
    const response = await apiClient.get<ApiEnvelope<AdminStudent[]>>(
      "/admin/students",
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getAdminStudentClassMemberships() {
  try {
    const response = await apiClient.get<
      ApiEnvelope<AdminStudentClassMembership[]>
    >("/admin/student-class-memberships");
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getAdminAttendanceRules() {
  try {
    const response = await apiClient.get<ApiEnvelope<AdminAttendanceRule[]>>(
      "/admin/attendance-rules",
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

export async function createAdminTeacherProfile(
  payload: AdminTeacherProfilePayload,
) {
  try {
    const response = await apiClient.post<ApiEnvelope<AdminTeacherProfile>>(
      "/admin/teacher-profiles",
      payload,
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createAdminTeacherSubjectAssignment(
  payload: AdminTeacherSubjectAssignmentPayload,
) {
  try {
    const response = await apiClient.post<
      ApiEnvelope<AdminTeacherSubjectAssignment>
    >("/admin/teacher-subject-assignments", payload);
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createAdminHomeroomAssignment(
  payload: AdminHomeroomAssignmentPayload,
) {
  try {
    const response = await apiClient.post<ApiEnvelope<AdminHomeroomAssignment>>(
      "/admin/homeroom-assignments",
      payload,
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createAdminStudent(payload: AdminStudentPayload) {
  try {
    const response = await apiClient.post<ApiEnvelope<AdminStudent>>(
      "/admin/students",
      payload,
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createAdminStudentClassMembership(
  payload: AdminStudentClassMembershipPayload,
) {
  try {
    const response = await apiClient.post<
      ApiEnvelope<AdminStudentClassMembership>
    >("/admin/student-class-memberships", payload);
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createAdminAttendanceRule(
  payload: AdminAttendanceRulePayload,
) {
  try {
    const response = await apiClient.post<ApiEnvelope<AdminAttendanceRule>>(
      "/admin/attendance-rules",
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
