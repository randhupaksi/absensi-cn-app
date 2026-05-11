import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(3, "Identitas akun minimal 3 karakter."),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter."),
  role: z.enum(["siswa", "walas", "bk", "admin"]),
});

export type LoginSchema = z.infer<typeof loginSchema>;
