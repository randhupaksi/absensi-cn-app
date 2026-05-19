export type AdminDashboardData = {
  attendance_percentage: number;
  counts: {
    total_users: number;
    total_students: number;
    total_teachers: number;
    total_bk: number;
    total_admins: number;
  };
  today_status: {
    present: number;
    late: number;
    permission: number;
    sick: number;
    alpha: number;
  };
  semester_trend: Array<{
    label: string;
    present: number;
    late: number;
    alpha: number;
  }>;
  class_performance: Array<{
    class_name: string;
    percentage: number;
    present_text: string;
  }>;
  announcements: Array<{
    id: string;
    title: string;
    description: string;
    tone: "warning" | "success" | "info" | string;
  }>;
};

export type AdminUser = {
  id: string;
  name: string;
  role: "STUDENT" | "TEACHER" | "BK" | "ADMIN";
  nis?: string;
  username?: string;
};

export type AdminUserPayload = {
  name: string;
  role: AdminUser["role"];
  username: string;
  nis: string;
  password: string;
};

export type AdminTeacherDirectory = {
  no: string;
  id: string;
  name: string;
  role: string;
  class: string;
  nuptk: string;
  contact: string;
  avatar_label: string;
};

export type AdminTeacherProfile = {
  id: string;
  user_id: string;
  name: string;
  username?: string;
  nip?: string;
  nuptk?: string;
  gender?: string;
  phone?: string;
  address?: string;
  status_kepegawaian?: string;
  is_active: boolean;
};

export type AdminTeacherSubjectAssignment = {
  id: string;
  teacher_id: string;
  teacher_name: string;
  subject_id: string;
  subject_code: string;
  subject_name: string;
  class_id: string;
  class_name: string;
  school_year_id: string;
  school_year_name: string;
  is_active: boolean;
};

export type AdminHomeroomAssignment = {
  id: string;
  teacher_id: string;
  teacher_name: string;
  class_id: string;
  class_name: string;
  school_year_id: string;
  school_year_name: string;
  is_active: boolean;
};
