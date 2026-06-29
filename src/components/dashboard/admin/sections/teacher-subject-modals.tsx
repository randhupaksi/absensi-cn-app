"use client";

import { FieldGroup, ModalActions } from "@/components/dashboard/admin/sections/section-ui";
import { PremiumModal } from "@/components/modals/premium-modal";
import { FieldError } from "@/components/ui/field-error";
import { RadixSelectField } from "@/components/ui/radix-select";
import { type FieldErrors, hasFieldErrors, validateRequired } from "@/lib/form-validation";
import type {
  AdminClass,
  AdminSchoolYear,
  AdminSubject,
  AdminTeacherProfile,
  AdminTeacherSubjectAssignment,
  AdminTeacherSubjectAssignmentPayload,
} from "@/types/admin";
import { BookOpen } from "lucide-react";
import { useState } from "react";

export function validateTeacherSubjectAssignmentForm(
  form: AdminTeacherSubjectAssignmentPayload,
): FieldErrors<keyof AdminTeacherSubjectAssignmentPayload> {
  const errors: FieldErrors<keyof AdminTeacherSubjectAssignmentPayload> = {};
  validateRequired(errors, "teacher_id", form.teacher_id, "Guru");
  validateRequired(errors, "subject_id", form.subject_id, "Mapel");
  validateRequired(errors, "class_id", form.class_id, "Kelas");
  validateRequired(errors, "school_year_id", form.school_year_id, "Tahun ajaran");
  validateRequired(errors, "is_active", String(form.is_active), "Status assignment");
  return errors;
}

const ACTIVE_OPTIONS = [
  { value: "true", label: "Aktif" },
  { value: "false", label: "Nonaktif" },
];

const EMPTY_FORM: AdminTeacherSubjectAssignmentPayload = {
  teacher_id: "",
  subject_id: "",
  class_id: "",
  school_year_id: "",
  is_active: true,
};

type SharedProps = {
  teacherProfiles: AdminTeacherProfile[];
  subjects: AdminSubject[];
  classes: AdminClass[];
  schoolYears: AdminSchoolYear[];
  isPending: boolean;
  onSubmit: (payload: AdminTeacherSubjectAssignmentPayload) => void;
};

export function TeacherSubjectAssignmentCreateModal({
  open,
  onOpenChange,
  teacherProfiles,
  subjects,
  classes,
  schoolYears,
  isPending,
  onSubmit,
}: { open: boolean; onOpenChange: (open: boolean) => void } & SharedProps) {
  const [form, setForm] = useState<AdminTeacherSubjectAssignmentPayload>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors<keyof AdminTeacherSubjectAssignmentPayload>>({});

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setForm(EMPTY_FORM);
      setErrors({});
    }
  };

  const handleSubmit = () => {
    const nextErrors = validateTeacherSubjectAssignmentForm(form);
    setErrors(nextErrors);
    if (hasFieldErrors(nextErrors)) return;
    onSubmit(form);
  };

  const set = <K extends keyof AdminTeacherSubjectAssignmentPayload>(
    key: K,
    value: AdminTeacherSubjectAssignmentPayload[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <PremiumModal
      open={open}
      onOpenChange={handleOpenChange}
      title="Tambah Assignment Mapel"
      description="Buat relasi guru ke mapel dan kelas untuk tahun ajaran yang relevan."
      icon={BookOpen}
    >
      <div className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup label="Guru">
            <RadixSelectField value={form.teacher_id} onValueChange={(v) => set("teacher_id", v)} placeholder="Pilih guru" options={teacherProfiles.map((t) => ({ value: t.id, label: t.name, description: t.nip || t.username || t.id }))} />
            <FieldError message={errors.teacher_id} />
          </FieldGroup>
          <FieldGroup label="Mapel">
            <RadixSelectField value={form.subject_id} onValueChange={(v) => set("subject_id", v)} placeholder="Pilih mapel" options={subjects.map((s) => ({ value: s.id, label: s.name, description: s.code }))} />
            <FieldError message={errors.subject_id} />
          </FieldGroup>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup label="Kelas">
            <RadixSelectField value={form.class_id} onValueChange={(v) => set("class_id", v)} placeholder="Pilih kelas" options={classes.map((c) => ({ value: c.id, label: c.display_name, description: c.school_year_name }))} />
            <FieldError message={errors.class_id} />
          </FieldGroup>
          <FieldGroup label="Tahun Ajaran">
            <RadixSelectField value={form.school_year_id} onValueChange={(v) => set("school_year_id", v)} placeholder="Pilih tahun ajaran" options={schoolYears.map((y) => ({ value: y.id, label: y.name }))} />
            <FieldError message={errors.school_year_id} />
          </FieldGroup>
        </div>

        <FieldGroup label="Status Assignment">
          <RadixSelectField value={String(form.is_active)} onValueChange={(v) => set("is_active", v === "true")} placeholder="Pilih status" options={ACTIVE_OPTIONS} />
          <FieldError message={errors.is_active} />
        </FieldGroup>

        <ModalActions isPending={isPending} onCancel={() => handleOpenChange(false)} onSubmit={handleSubmit} submitLabel="Simpan Assignment Mapel" />
      </div>
    </PremiumModal>
  );
}

export function TeacherSubjectAssignmentEditModal({
  assignment,
  open,
  onOpenChange,
  teacherProfiles,
  subjects,
  classes,
  schoolYears,
  isPending,
  onSubmit,
}: { assignment: AdminTeacherSubjectAssignment | null; open: boolean; onOpenChange: (open: boolean) => void } & SharedProps) {
  const [form, setForm] = useState<AdminTeacherSubjectAssignmentPayload>(() =>
    assignment
      ? {
          teacher_id: assignment.teacher_id,
          subject_id: assignment.subject_id,
          class_id: assignment.class_id,
          school_year_id: assignment.school_year_id,
          is_active: assignment.is_active,
        }
      : EMPTY_FORM,
  );
  const [errors, setErrors] = useState<FieldErrors<keyof AdminTeacherSubjectAssignmentPayload>>({});

  const handleSubmit = () => {
    const nextErrors = validateTeacherSubjectAssignmentForm(form);
    setErrors(nextErrors);
    if (hasFieldErrors(nextErrors)) return;
    onSubmit(form);
  };

  const set = <K extends keyof AdminTeacherSubjectAssignmentPayload>(
    key: K,
    value: AdminTeacherSubjectAssignmentPayload[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  if (!assignment) return null;

  return (
    <PremiumModal open={open} onOpenChange={onOpenChange} title="Edit Assignment Mapel" description="Perbarui relasi guru, mapel, kelas, dan tahun ajaran sesuai kebutuhan." icon={BookOpen}>
      <div className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup label="Guru">
            <RadixSelectField value={form.teacher_id} onValueChange={(v) => set("teacher_id", v)} placeholder="Pilih guru" options={teacherProfiles.map((t) => ({ value: t.id, label: t.name, description: t.nip || t.username || t.id }))} />
            <FieldError message={errors.teacher_id} />
          </FieldGroup>
          <FieldGroup label="Mapel">
            <RadixSelectField value={form.subject_id} onValueChange={(v) => set("subject_id", v)} placeholder="Pilih mapel" options={subjects.map((s) => ({ value: s.id, label: s.name, description: s.code }))} />
            <FieldError message={errors.subject_id} />
          </FieldGroup>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup label="Kelas">
            <RadixSelectField value={form.class_id} onValueChange={(v) => set("class_id", v)} placeholder="Pilih kelas" options={classes.map((c) => ({ value: c.id, label: c.display_name, description: c.school_year_name }))} />
            <FieldError message={errors.class_id} />
          </FieldGroup>
          <FieldGroup label="Tahun Ajaran">
            <RadixSelectField value={form.school_year_id} onValueChange={(v) => set("school_year_id", v)} placeholder="Pilih tahun ajaran" options={schoolYears.map((y) => ({ value: y.id, label: y.name }))} />
            <FieldError message={errors.school_year_id} />
          </FieldGroup>
        </div>

        <FieldGroup label="Status Assignment">
          <RadixSelectField value={String(form.is_active)} onValueChange={(v) => set("is_active", v === "true")} placeholder="Pilih status" options={ACTIVE_OPTIONS} />
          <FieldError message={errors.is_active} />
        </FieldGroup>

        <ModalActions isPending={isPending} onCancel={() => onOpenChange(false)} onSubmit={handleSubmit} submitLabel="Update Assignment Mapel" />
      </div>
    </PremiumModal>
  );
}
