"use client";

import { FieldGroup, ModalActions } from "@/components/dashboard/admin/sections/section-ui";
import { PremiumModal } from "@/components/modals/premium-modal";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { RadixSelectField } from "@/components/ui/radix-select";
import { Textarea } from "@/components/ui/textarea";
import {
  type FieldErrors,
  hasFieldErrors,
  validateMinLength,
  validatePhone,
  validateRequired,
} from "@/lib/form-validation";
import type { AdminTeacherProfile } from "@/types/admin";
import { FilePenLine } from "lucide-react";
import { useState } from "react";

export type TeacherProfileCreatePayload = {
  name: string;
  username: string;
  password: string;
  nip: string;
  nuptk: string;
  gender: string;
  phone: string;
  address: string;
  is_active: boolean;
};

export function validateTeacherProfileForm(
  form: TeacherProfileCreatePayload,
  isEdit: boolean,
): FieldErrors<keyof TeacherProfileCreatePayload> {
  const errors: FieldErrors<keyof TeacherProfileCreatePayload> = {};
  validateRequired(errors, "name", form.name, "Nama guru");
  validateRequired(errors, "username", form.username, "Username login");
  validateMinLength(errors, "password", form.password, 6, isEdit ? "Password baru" : "Password login", {
    allowEmpty: isEdit,
  });
  if (!isEdit) validateRequired(errors, "nip", form.nip, "NIP");
  if (!isEdit) validateRequired(errors, "nuptk", form.nuptk, "NUPTK");
  validateRequired(errors, "gender", form.gender, "Jenis kelamin");
  validatePhone(errors, "phone", form.phone, "Telepon", { allowEmpty: true });
  return errors;
}

const INPUT_CN =
  "h-14 rounded-[1.25rem] border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f5fbf7_100%)] px-4 text-sm shadow-[0_14px_30px_rgba(15,23,42,0.05),inset_0_1px_0_rgba(255,255,255,0.95)]";

const GENDER_OPTIONS = [
  { value: "MALE", label: "Laki-laki" },
  { value: "FEMALE", label: "Perempuan" },
];
const ACTIVE_OPTIONS = [
  { value: "true", label: "Aktif" },
  { value: "false", label: "Nonaktif" },
];

const EMPTY_FORM: TeacherProfileCreatePayload = {
  name: "",
  username: "",
  password: "",
  nip: "",
  nuptk: "",
  gender: "",
  phone: "",
  address: "",
  is_active: true,
};

export function TeacherProfileCreateModal({
  open,
  onOpenChange,
  isPending,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPending: boolean;
  onSubmit: (payload: TeacherProfileCreatePayload) => void;
}) {
  const [form, setForm] = useState<TeacherProfileCreatePayload>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors<keyof TeacherProfileCreatePayload>>({});

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setForm(EMPTY_FORM);
      setErrors({});
    }
  };

  const handleSubmit = () => {
    const nextErrors = validateTeacherProfileForm(form, false);
    setErrors(nextErrors);
    if (hasFieldErrors(nextErrors)) return;
    onSubmit(form);
  };

  const set = <K extends keyof TeacherProfileCreatePayload>(key: K, value: TeacherProfileCreatePayload[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <PremiumModal
      open={open}
      onOpenChange={handleOpenChange}
      title="Tambah Profil Guru"
      description="Lengkapi data profil guru tanpa berpindah ke halaman lain."
      icon={FilePenLine}
    >
      <div className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup label="Nama Guru">
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Masukkan nama guru" className={INPUT_CN} />
            <FieldError message={errors.name} />
          </FieldGroup>
          <FieldGroup label="Username Login">
            <Input value={form.username} onChange={(e) => set("username", e.target.value)} placeholder="Masukkan username guru" className={INPUT_CN} />
            <FieldError message={errors.username} />
          </FieldGroup>
        </div>

        <FieldGroup label="Password Login">
          <Input value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Minimal 6 karakter" className={INPUT_CN} />
          <FieldError message={errors.password} />
        </FieldGroup>

        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup label="NIP">
            <Input value={form.nip} onChange={(e) => set("nip", e.target.value)} placeholder="Masukkan NIP guru" className={INPUT_CN} />
            <FieldError message={errors.nip} />
          </FieldGroup>
          <FieldGroup label="NUPTK">
            <Input value={form.nuptk} onChange={(e) => set("nuptk", e.target.value)} placeholder="Masukkan NUPTK guru" className={INPUT_CN} />
            <FieldError message={errors.nuptk} />
          </FieldGroup>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup label="Jenis Kelamin">
            <RadixSelectField value={form.gender} onValueChange={(v) => set("gender", v)} placeholder="Pilih jenis kelamin" options={GENDER_OPTIONS} />
            <FieldError message={errors.gender} />
          </FieldGroup>
          <FieldGroup label="Status Aktif">
            <RadixSelectField value={String(form.is_active)} onValueChange={(v) => set("is_active", v === "true")} placeholder="Pilih status aktif" options={ACTIVE_OPTIONS} />
            <FieldError message={errors.is_active} />
          </FieldGroup>
        </div>

        <FieldGroup label="Telepon">
          <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="08xxxxxxxxxx" className={INPUT_CN} />
          <FieldError message={errors.phone} />
        </FieldGroup>

        <FieldGroup label="Alamat" helper="Gunakan alamat singkat yang mudah dibaca admin untuk kebutuhan data master.">
          <Textarea value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Masukkan alamat guru" className="min-h-[140px] rounded-[1.4rem] border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f5fbf7_100%)] px-4 py-3 text-sm shadow-[0_14px_30px_rgba(15,23,42,0.05),inset_0_1px_0_rgba(255,255,255,0.95)]" />
          <FieldError message={errors.address} />
        </FieldGroup>

        <ModalActions isPending={isPending} onCancel={() => handleOpenChange(false)} onSubmit={handleSubmit} submitLabel="Simpan Profil Guru" />
      </div>
    </PremiumModal>
  );
}

export function TeacherProfileEditModal({
  teacher,
  open,
  onOpenChange,
  isPending,
  onSubmit,
}: {
  teacher: AdminTeacherProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPending: boolean;
  onSubmit: (payload: TeacherProfileCreatePayload) => void;
}) {
  const [form, setForm] = useState<TeacherProfileCreatePayload>(() =>
    teacher
      ? {
          name: teacher.name,
          username: teacher.username ?? "",
          password: "",
          nip: teacher.nip ?? "",
          nuptk: teacher.nuptk ?? "",
          gender: teacher.gender ?? "",
          phone: teacher.phone ?? "",
          address: teacher.address ?? "",
          is_active: teacher.is_active,
        }
      : EMPTY_FORM,
  );
  const [errors, setErrors] = useState<FieldErrors<keyof TeacherProfileCreatePayload>>({});

  const handleSubmit = () => {
    const nextErrors = validateTeacherProfileForm(form, true);
    setErrors(nextErrors);
    if (hasFieldErrors(nextErrors)) return;
    onSubmit(form);
  };

  const set = <K extends keyof TeacherProfileCreatePayload>(key: K, value: TeacherProfileCreatePayload[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  if (!teacher) return null;

  return (
    <PremiumModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Profil Guru"
      description="Perbarui akun dan profil guru tanpa membuka halaman lain."
      icon={FilePenLine}
    >
      <div className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup label="Nama Guru">
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Masukkan nama guru" className={INPUT_CN} />
            <FieldError message={errors.name} />
          </FieldGroup>
          <FieldGroup label="Username Login">
            <Input value={form.username} onChange={(e) => set("username", e.target.value)} placeholder="Masukkan username guru" className={INPUT_CN} />
            <FieldError message={errors.username} />
          </FieldGroup>
        </div>

        <FieldGroup label="Password Baru">
          <Input value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Kosongkan jika tidak diubah" className={INPUT_CN} />
          <FieldError message={errors.password} />
        </FieldGroup>

        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup label="NIP">
            <Input value={form.nip} onChange={(e) => set("nip", e.target.value)} placeholder="Masukkan NIP guru" className={INPUT_CN} />
            <FieldError message={errors.nip} />
          </FieldGroup>
          <FieldGroup label="NUPTK">
            <Input value={form.nuptk} onChange={(e) => set("nuptk", e.target.value)} placeholder="Masukkan NUPTK guru" className={INPUT_CN} />
            <FieldError message={errors.nuptk} />
          </FieldGroup>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup label="Jenis Kelamin">
            <RadixSelectField value={form.gender} onValueChange={(v) => set("gender", v)} placeholder="Pilih jenis kelamin" options={GENDER_OPTIONS} />
            <FieldError message={errors.gender} />
          </FieldGroup>
          <FieldGroup label="Status Aktif">
            <RadixSelectField value={String(form.is_active)} onValueChange={(v) => set("is_active", v === "true")} placeholder="Pilih status aktif" options={ACTIVE_OPTIONS} />
            <FieldError message={errors.is_active} />
          </FieldGroup>
        </div>

        <FieldGroup label="Telepon">
          <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="08xxxxxxxxxx" className={INPUT_CN} />
          <FieldError message={errors.phone} />
        </FieldGroup>

        <FieldGroup label="Alamat" helper="Gunakan alamat singkat yang mudah dibaca admin untuk kebutuhan data master.">
          <Textarea value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Masukkan alamat guru" className="min-h-[140px] rounded-[1.4rem] border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f5fbf7_100%)] px-4 py-3 text-sm shadow-[0_14px_30px_rgba(15,23,42,0.05),inset_0_1px_0_rgba(255,255,255,0.95)]" />
          <FieldError message={errors.address} />
        </FieldGroup>

        <ModalActions isPending={isPending} onCancel={() => onOpenChange(false)} onSubmit={handleSubmit} submitLabel="Update Profil Guru" />
      </div>
    </PremiumModal>
  );
}
