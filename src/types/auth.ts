export type UserRole = "siswa" | "walas" | "bk" | "admin";

export type AuthUser = {
  id: string;
  name: string;
  role: UserRole;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};
