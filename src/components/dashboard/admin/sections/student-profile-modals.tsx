"use client";

import { FieldGroup, ModalActions } from "@/components/dashboard/admin/sections/section-ui";
import { PremiumModal } from "@/components/modals/premium-modal";
import { Calendar } from "@/components/ui/calendar";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadixSelectField } from "@/components/ui/radix-select";
import { Textarea } from "@/components/ui/textarea";
import {
  type FieldErrors,
  hasFieldErrors,
  validateDate,
  validateExactDigits,
  validateMinLength,
  validatePhone,
  validateRequired,
  validateYear,
} from "@/lib/form-validation";
import type { AdminStudent, AdminStudentPayload } from "@/types/admin";
import { id as localeID } from "date-fns/locale";
import { CalendarClock, FilePenLine, UsersRound } from "lucide-react";
import { useState } from "react";

const INPUT_CN =
  "h-14 rounded-[1.25rem] border-slate-300/80 bg-[linear-gradient(180deg,#ffffff_0%,#f5fbf7_100%)] px-4 text-sm shadow-[0_14px_30px_rgba(15,23,42,0.05),inset_0_1px_0_rgba(255,255,255,0.95)] hover:border-emerald-400 hover:shadow-[0_0_0_3px_rgba(16,185,129,0.16),0_14px_30px_rgba(15,23,42,0.05)] focus-visible:border-emerald-500 focus-visible:ring-4 focus-visible:ring-emerald-200/80";

const TEXTAREA_CN =
  "min-h-[140px] rounded-[1.4rem] border-slate-300/80 bg-[linear-gradient(180deg,#ffffff_0%,#f5fbf7_100%)] px-4 py-3 text-sm shadow-[0_14px_30px_rgba(15,23,42,0.05),inset_0_1px_0_rgba(255,255,255,0.95)] hover:border-emerald-400 hover:shadow-[0_0_0_3px_rgba(16,185,129,0.16),0_14px_30px_rgba(15,23,42,0.05)] focus-visible:border-emerald-500 focus-visible:ring-4 focus-visible:ring-emerald-200/80";

const GENDER_OPTIONS = [
  { value: "MALE", label: "Laki-laki" },
  { value: "FEMALE", label: "Perempuan" },
];
const ACTIVE_OPTIONS = [
  { value: "true", label: "Aktif" },
  { value: "false", label: "Nonaktif" },
];

const EMPTY_FORM: AdminStudentPayload = {
  name: "",
  nis: "",
  nisn: "",
  password: "",
  gender: "",
  birth_place: "",
  birth_date: "",
  address: "",
  phone: "",
  parent_name: "",
  parent_phone: "",
  entry_year: new Date().getFullYear(),
  is_active: true,
};

export function validateStudentProfileForm(
  form: AdminStudentPayload,
  isEdit: boolean,
): FieldErrors<keyof AdminStudentPayload> {
  const errors: FieldErrors<keyof AdminStudentPayload> = {};
  validateRequired(errors, "name", form.name, "Nama siswa");
  validateRequired(errors, "nis", form.nis, "NIS");
  validateExactDigits(errors, "nis", form.nis, 10, "NIS");
  validateExactDigits(errors, "nisn", form.nisn, 10, "NISN", { allowEmpty: true });
  validateMinLength(errors, "password", form.password, 6, isEdit ? "Password baru" : "Password login", {
    allowEmpty: isEdit,
  });
  validateRequired(errors, "gender", form.gender, "Jenis kelamin");
  validateYear(errors, "entry_year", form.entry_year, "Angkatan");
  validatePhone(errors, "phone", form.phone, "Telepon siswa", { allowEmpty: true });
  validateRequired(errors, "parent_name", form.parent_name, "Nama orang tua");
  validatePhone(errors, "parent_phone", form.parent_phone, "Telepon orang tua", { allowEmpty: true });
  validateRequired(errors, "birth_place", form.birth_place, "Tempat lahir");
  validateRequired(errors, "birth_date", form.birth_date, "Tanggal lahir");
  validateDate(errors, "birth_date", form.birth_date, "Tanggal lahir");
  return errors;
}

export function formatGender(gender?: string) {
  switch ((gender ?? "").toUpperCase()) {
    case "MALE":
    case "L":
      return "Laki-laki";
    case "FEMALE":
    case "P":
      return "Perempuan";
    default:
      return "-";
  }
}

export function formatBirthPlaceDate(place?: string, date?: string, fallback?: string) {
  if (fallback?.trim()) return fallback;
  const formattedDate = formatBirthDate(date);
  const trimmedPlace = place?.trim() ?? "";
  if (!trimmedPlace && !formattedDate) return "-";
  if (!trimmedPlace) return formattedDate;
  if (!formattedDate) return trimmedPlace;
  return `${trimmedPlace}, ${formattedDate}`;
}

function formatBirthDate(value?: string) {
  if (!value) return "";
  const parsed = parseDateValue(value);
  if (!parsed) return value;
  return parsed.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function parseDateValue(value?: string) {
  if (!value) return undefined;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function toDateInputValue(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function BirthDatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const selectedDate = parseDateValue(value);
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={<button type="button" />}
        className={`${INPUT_CN} flex w-full items-center justify-start gap-2 text-left font-normal ${value ? "text-slate-700" : "text-slate-400"}`}
      >
        <CalendarClock className="size-4 text-emerald-600" />
        {value ? formatBirthDate(value) : "Pilih tanggal lahir"}
      </PopoverTrigger>
      <PopoverContent sideOffset={10} className="w-auto rounded-[24px] border border-emerald-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f4fbf7_100%)] p-4 shadow-[0_24px_54px_rgba(15,23,42,0.12)]">
        <PopoverHeader className="px-2 pt-1 pb-2">
          <PopoverTitle className="text-sm font-semibold text-slate-900">
            Pilih tanggal kelahiran
          </PopoverTitle>
        </PopoverHeader>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            onChange(date ? toDateInputValue(date) : "");
            setOpen(false);
          }}
          locale={localeID}
          buttonVariant="ghost"
          captionLayout="dropdown"
          startMonth={new Date(1990, 0)}
          endMonth={new Date(new Date().getFullYear(), 11)}
        />
      </PopoverContent>
    </Popover>
  );
}

export function StudentProfileCreateModal({
  open,
  onOpenChange,
  isPending,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPending: boolean;
  onSubmit: (payload: AdminStudentPayload) => void;
}) {
  const [form, setForm] = useState<AdminStudentPayload>({ ...EMPTY_FORM, entry_year: new Date().getFullYear() });
  const [errors, setErrors] = useState<FieldErrors<keyof AdminStudentPayload>>({});

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setForm({ ...EMPTY_FORM, entry_year: new Date().getFullYear() });
      setErrors({});
    }
  };

  const handleSubmit = () => {
    const nextErrors = validateStudentProfileForm(form, false);
    setErrors(nextErrors);
    if (hasFieldErrors(nextErrors)) return;
    onSubmit(form);
  };

  const set = <K extends keyof AdminStudentPayload>(key: K, value: AdminStudentPayload[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <PremiumModal open={open} onOpenChange={handleOpenChange} title="Tambah Profil Siswa" description="Lengkapi data profil siswa dan akun login dasar dalam satu modal." icon={UsersRound}>
      <div className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup label="Nama Siswa">
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Masukkan nama siswa" className={INPUT_CN} />
            <FieldError message={errors.name} />
          </FieldGroup>
          <FieldGroup label="Password Login">
            <Input value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Minimal 6 karakter" className={INPUT_CN} />
            <FieldError message={errors.password} />
          </FieldGroup>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup label="NIS">
            <Input value={form.nis} onChange={(e) => set("nis", e.target.value)} placeholder="10 digit NIS" className={INPUT_CN} />
            <FieldError message={errors.nis} />
          </FieldGroup>
          <FieldGroup label="NISN">
            <Input value={form.nisn} onChange={(e) => set("nisn", e.target.value)} placeholder="Masukkan NISN" className={INPUT_CN} />
            <FieldError message={errors.nisn} />
          </FieldGroup>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <FieldGroup label="Jenis Kelamin">
            <RadixSelectField value={form.gender} onValueChange={(v) => set("gender", v)} placeholder="Pilih gender" options={GENDER_OPTIONS} />
            <FieldError message={errors.gender} />
          </FieldGroup>
          <FieldGroup label="Angkatan">
            <Input value={String(form.entry_year)} onChange={(e) => set("entry_year", Number(e.target.value || 0))} placeholder="2026" className={INPUT_CN} />
            <FieldError message={errors.entry_year} />
          </FieldGroup>
          <FieldGroup label="Status Aktif">
            <RadixSelectField value={String(form.is_active)} onValueChange={(v) => set("is_active", v === "true")} placeholder="Pilih status" options={ACTIVE_OPTIONS} />
            <FieldError message={errors.is_active} />
          </FieldGroup>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup label="Telepon Siswa">
            <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="08xxxxxxxxxx" className={INPUT_CN} />
            <FieldError message={errors.phone} />
          </FieldGroup>
          <FieldGroup label="Nama Orang Tua">
            <Input value={form.parent_name} onChange={(e) => set("parent_name", e.target.value)} placeholder="Masukkan nama orang tua" className={INPUT_CN} />
            <FieldError message={errors.parent_name} />
          </FieldGroup>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <FieldGroup label="Telepon Orang Tua">
            <Input value={form.parent_phone} onChange={(e) => set("parent_phone", e.target.value)} placeholder="08xxxxxxxxxx" className={INPUT_CN} />
            <FieldError message={errors.parent_phone} />
          </FieldGroup>
          <FieldGroup label="Tempat Lahir">
            <Input value={form.birth_place} onChange={(e) => set("birth_place", e.target.value)} placeholder="Contoh: Cianjur" className={INPUT_CN} />
            <FieldError message={errors.birth_place} />
          </FieldGroup>
          <FieldGroup label="Tanggal Lahir">
            <BirthDatePicker value={form.birth_date} onChange={(v) => set("birth_date", v)} />
            <FieldError message={errors.birth_date} />
          </FieldGroup>
        </div>

        <FieldGroup label="Alamat">
          <Textarea value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Masukkan alamat siswa" className={TEXTAREA_CN} />
          <FieldError message={errors.address} />
        </FieldGroup>

        <ModalActions isPending={isPending} onCancel={() => handleOpenChange(false)} onSubmit={handleSubmit} submitLabel="Simpan Profil Siswa" />
      </div>
    </PremiumModal>
  );
}

export function StudentProfileEditModal({
  student,
  open,
  onOpenChange,
  isPending,
  onSubmit,
}: {
  student: AdminStudent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPending: boolean;
  onSubmit: (payload: AdminStudentPayload) => void;
}) {
  const [form, setForm] = useState<AdminStudentPayload>(() =>
    student
      ? {
          name: student.name,
          nis: student.nis,
          nisn: student.nisn ?? "",
          password: "",
          gender: student.gender ?? "",
          birth_place: student.birth_place ?? "",
          birth_date: student.birth_date ?? "",
          address: student.address ?? "",
          phone: student.phone ?? "",
          parent_name: student.parent_name ?? "",
          parent_phone: student.parent_phone ?? "",
          entry_year: student.entry_year,
          is_active: student.is_active,
        }
      : { ...EMPTY_FORM, entry_year: new Date().getFullYear() },
  );
  const [errors, setErrors] = useState<FieldErrors<keyof AdminStudentPayload>>({});

  const handleSubmit = () => {
    const nextErrors = validateStudentProfileForm(form, true);
    setErrors(nextErrors);
    if (hasFieldErrors(nextErrors)) return;
    onSubmit(form);
  };

  const set = <K extends keyof AdminStudentPayload>(key: K, value: AdminStudentPayload[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  if (!student) return null;

  return (
    <PremiumModal open={open} onOpenChange={onOpenChange} title="Edit Profil Siswa" description="Perbarui data siswa dan isi password hanya jika memang ingin diganti." icon={FilePenLine}>
      <div className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup label="Nama Siswa">
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Masukkan nama siswa" className={INPUT_CN} />
            <FieldError message={errors.name} />
          </FieldGroup>
          <FieldGroup label="Password Baru">
            <Input value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Kosongkan jika tidak diubah" className={INPUT_CN} />
            <FieldError message={errors.password} />
          </FieldGroup>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup label="NIS">
            <Input value={form.nis} onChange={(e) => set("nis", e.target.value)} placeholder="10 digit NIS" className={INPUT_CN} />
            <FieldError message={errors.nis} />
          </FieldGroup>
          <FieldGroup label="NISN">
            <Input value={form.nisn} onChange={(e) => set("nisn", e.target.value)} placeholder="Masukkan NISN" className={INPUT_CN} />
            <FieldError message={errors.nisn} />
          </FieldGroup>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <FieldGroup label="Jenis Kelamin">
            <RadixSelectField value={form.gender} onValueChange={(v) => set("gender", v)} placeholder="Pilih gender" options={GENDER_OPTIONS} />
            <FieldError message={errors.gender} />
          </FieldGroup>
          <FieldGroup label="Angkatan">
            <Input value={String(form.entry_year)} onChange={(e) => set("entry_year", Number(e.target.value || 0))} placeholder="2026" className={INPUT_CN} />
            <FieldError message={errors.entry_year} />
          </FieldGroup>
          <FieldGroup label="Status Aktif">
            <RadixSelectField value={String(form.is_active)} onValueChange={(v) => set("is_active", v === "true")} placeholder="Pilih status" options={ACTIVE_OPTIONS} />
            <FieldError message={errors.is_active} />
          </FieldGroup>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup label="Telepon Siswa">
            <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="08xxxxxxxxxx" className={INPUT_CN} />
            <FieldError message={errors.phone} />
          </FieldGroup>
          <FieldGroup label="Nama Orang Tua">
            <Input value={form.parent_name} onChange={(e) => set("parent_name", e.target.value)} placeholder="Masukkan nama orang tua" className={INPUT_CN} />
            <FieldError message={errors.parent_name} />
          </FieldGroup>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <FieldGroup label="Telepon Orang Tua">
            <Input value={form.parent_phone} onChange={(e) => set("parent_phone", e.target.value)} placeholder="08xxxxxxxxxx" className={INPUT_CN} />
            <FieldError message={errors.parent_phone} />
          </FieldGroup>
          <FieldGroup label="Tempat Lahir">
            <Input value={form.birth_place} onChange={(e) => set("birth_place", e.target.value)} placeholder="Contoh: Cianjur" className={INPUT_CN} />
            <FieldError message={errors.birth_place} />
          </FieldGroup>
          <FieldGroup label="Tanggal Lahir">
            <BirthDatePicker value={form.birth_date} onChange={(v) => set("birth_date", v)} />
            <FieldError message={errors.birth_date} />
          </FieldGroup>
        </div>

        <FieldGroup label="Alamat">
          <Textarea value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Masukkan alamat siswa" className={TEXTAREA_CN} />
          <FieldError message={errors.address} />
        </FieldGroup>

        <ModalActions isPending={isPending} onCancel={() => onOpenChange(false)} onSubmit={handleSubmit} submitLabel="Update Profil Siswa" />
      </div>
    </PremiumModal>
  );
}
