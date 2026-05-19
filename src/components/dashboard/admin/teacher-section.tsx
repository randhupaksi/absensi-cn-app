"use client";

import { EmptyState } from "@/components/dashboard/admin/empty-state";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  AdminHomeroomAssignment,
  AdminTeacherProfile,
  AdminTeacherSubjectAssignment,
} from "@/types/admin";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  GraduationCap,
  Search,
  SlidersHorizontal,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

type TeacherSectionProps = {
  teacherProfiles: AdminTeacherProfile[];
  teacherSubjectAssignments: AdminTeacherSubjectAssignment[];
  homeroomAssignments: AdminHomeroomAssignment[];
  isLoading?: boolean;
  errorMessage?: string;
};

const profileStatusOptions = ["Semua", "Aktif", "Nonaktif"];

export function TeacherSection({
  teacherProfiles,
  teacherSubjectAssignments,
  homeroomAssignments,
  isLoading = false,
  errorMessage,
}: TeacherSectionProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  const normalizedQuery = query.trim().toLowerCase();

  const subjectAssignmentsByTeacher = useMemo(() => {
    return teacherSubjectAssignments.reduce<Record<string, number>>(
      (accumulator, assignment) => {
        accumulator[assignment.teacher_id] =
          (accumulator[assignment.teacher_id] ?? 0) + 1;
        return accumulator;
      },
      {},
    );
  }, [teacherSubjectAssignments]);

  const homeroomAssignmentsByTeacher = useMemo(() => {
    return homeroomAssignments.reduce<Record<string, number>>(
      (accumulator, assignment) => {
        accumulator[assignment.teacher_id] =
          (accumulator[assignment.teacher_id] ?? 0) + 1;
        return accumulator;
      },
      {},
    );
  }, [homeroomAssignments]);

  const filteredTeacherProfiles = teacherProfiles.filter((teacher) => {
    const matchesStatus =
      statusFilter === "Semua" ||
      (statusFilter === "Aktif" && teacher.is_active) ||
      (statusFilter === "Nonaktif" && !teacher.is_active);

    const matchesQuery =
      normalizedQuery.length === 0 ||
      teacher.name.toLowerCase().includes(normalizedQuery) ||
      (teacher.username ?? "").toLowerCase().includes(normalizedQuery) ||
      (teacher.nip ?? "").toLowerCase().includes(normalizedQuery) ||
      (teacher.nuptk ?? "").toLowerCase().includes(normalizedQuery) ||
      (teacher.phone ?? "").toLowerCase().includes(normalizedQuery) ||
      (teacher.status_kepegawaian ?? "").toLowerCase().includes(normalizedQuery);

    return matchesStatus && matchesQuery;
  });

  const filteredTeacherSubjectAssignments = teacherSubjectAssignments.filter(
    (assignment) =>
      normalizedQuery.length === 0 ||
      assignment.teacher_name.toLowerCase().includes(normalizedQuery) ||
      assignment.subject_code.toLowerCase().includes(normalizedQuery) ||
      assignment.subject_name.toLowerCase().includes(normalizedQuery) ||
      assignment.class_name.toLowerCase().includes(normalizedQuery) ||
      assignment.school_year_name.toLowerCase().includes(normalizedQuery),
  );

  const filteredHomeroomAssignments = homeroomAssignments.filter(
    (assignment) =>
      normalizedQuery.length === 0 ||
      assignment.teacher_name.toLowerCase().includes(normalizedQuery) ||
      assignment.class_name.toLowerCase().includes(normalizedQuery) ||
      assignment.school_year_name.toLowerCase().includes(normalizedQuery),
  );

  const activeTeacherCount = teacherProfiles.filter(
    (teacher) => teacher.is_active,
  ).length;
  const totalSubjectAssignments = teacherSubjectAssignments.length;
  const totalHomeroomAssignments = homeroomAssignments.length;

  return (
    <section
      id="guru"
      className="rounded-[28px] border border-white/70 bg-white/82 p-4 shadow-[0_24px_60px_rgba(28,77,61,0.08)] backdrop-blur-xl sm:p-5 lg:p-6"
    >
      <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-4 sm:gap-5">
        <div className="space-y-1">
          <h2 className="text-[1.9rem] font-semibold tracking-tight text-slate-950">
            Teacher Management
          </h2>
          <p className="text-base text-slate-600">
            Profil guru, assignment mapel, dan penugasan wali kelas dari API admin.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <StatCard
            label="Total Guru"
            value={teacherProfiles.length}
            description={`${activeTeacherCount} guru aktif`}
          />
          <StatCard
            label="Assignment Mapel"
            value={totalSubjectAssignments}
            description="Total relasi guru ke mapel dan kelas"
          />
          <StatCard
            label="Assignment Walas"
            value={totalHomeroomAssignments}
            description="Total penugasan wali kelas aktif dan nonaktif"
          />
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="hidden lg:block" />

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/90 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              <span className="flex size-7 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
                <SlidersHorizontal className="size-3.5" />
              </span>
              <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <Search className="size-4 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari guru, mapel, kelas, NIP, NUPTK"
                  className="w-full min-w-[180px] bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:min-w-[240px]"
                />
              </div>
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-11 appearance-none rounded-full border border-slate-200 bg-slate-50/92 px-4 pr-10 text-sm text-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] outline-none transition focus:border-emerald-200 focus:bg-white"
              >
                {profileStatusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {errorMessage ? (
        <div className="mt-5">
          <EmptyState
            icon={UsersRound}
            title="Data teacher belum bisa dimuat"
            description={errorMessage}
            compact
          />
        </div>
      ) : null}

      <Tabs defaultValue="profiles" className="mt-5 gap-4">
        <TabsList
          variant="line"
          className="w-full justify-start gap-2 overflow-x-auto rounded-[20px] bg-slate-100/70 p-1.5"
        >
          <TabsTrigger
            value="profiles"
            className="rounded-2xl px-4 py-2 data-active:bg-white data-active:text-slate-950"
          >
            <UsersRound className="size-4" />
            Profil Guru
          </TabsTrigger>
          <TabsTrigger
            value="subjects"
            className="rounded-2xl px-4 py-2 data-active:bg-white data-active:text-slate-950"
          >
            <BookOpen className="size-4" />
            Assignment Mapel
          </TabsTrigger>
          <TabsTrigger
            value="homerooms"
            className="rounded-2xl px-4 py-2 data-active:bg-white data-active:text-slate-950"
          >
            <GraduationCap className="size-4" />
            Assignment Walas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profiles">
          <DataTableCard
            isLoading={isLoading}
            columnCount={8}
            emptyTitle="Belum ada profil guru"
            emptyDescription="Tambahkan akun dengan role TEACHER lalu buat teacher profile agar data muncul di sini."
            icon={UsersRound}
          >
            <table className="min-w-full border-separate border-spacing-0 text-left">
              <thead>
                <tr className="bg-[#eef8ff] text-sm text-slate-700">
                  {[
                    "Guru",
                    "Username",
                    "NIP / NUPTK",
                    "Kontak",
                    "Kepegawaian",
                    "Mapel",
                    "Walas",
                    "Status",
                  ].map((label) => (
                    <th
                      key={label}
                      className="border-b border-sky-100/90 px-4 py-4 font-medium first:rounded-tl-[24px] last:rounded-tr-[24px]"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!isLoading && filteredTeacherProfiles.length === 0 ? (
                  <EmptyRow
                    colSpan={8}
                    icon={UsersRound}
                    title="Profil guru tidak ditemukan"
                    description="Coba ubah pencarian atau filter status guru."
                  />
                ) : (
                  filteredTeacherProfiles.map((teacher) => (
                    <tr
                      key={teacher.id}
                      className="bg-white text-sm text-slate-600 transition hover:bg-emerald-50/30"
                    >
                      <td className="border-t border-slate-100 px-4 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex size-9 items-center justify-center rounded-full bg-[linear-gradient(180deg,#fef7ec_0%,#ecfdf5_100%)] text-xs font-semibold text-emerald-700 shadow-[0_8px_20px_rgba(22,85,58,0.08)]">
                            {getInitials(teacher.name)}
                          </span>
                          <div>
                            <p className="font-medium text-slate-700">
                              {teacher.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {teacher.user_id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="border-t border-slate-100 px-4 py-4">
                        {teacher.username || "-"}
                      </td>
                      <td className="border-t border-slate-100 px-4 py-4">
                        <div className="space-y-1">
                          <p>{teacher.nip || "-"}</p>
                          <p className="text-xs text-slate-400">
                            NUPTK: {teacher.nuptk || "-"}
                          </p>
                        </div>
                      </td>
                      <td className="border-t border-slate-100 px-4 py-4">
                        <div className="space-y-1">
                          <p>{teacher.phone || "-"}</p>
                          <p className="text-xs text-slate-400">
                            {teacher.gender || "-"}
                          </p>
                        </div>
                      </td>
                      <td className="border-t border-slate-100 px-4 py-4">
                        {teacher.status_kepegawaian || "-"}
                      </td>
                      <td className="border-t border-slate-100 px-4 py-4">
                        {subjectAssignmentsByTeacher[teacher.id] ?? 0}
                      </td>
                      <td className="border-t border-slate-100 px-4 py-4">
                        {homeroomAssignmentsByTeacher[teacher.id] ?? 0}
                      </td>
                      <td className="border-t border-slate-100 px-4 py-4">
                        <StatusBadge isActive={teacher.is_active} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </DataTableCard>
        </TabsContent>

        <TabsContent value="subjects">
          <DataTableCard
            isLoading={isLoading}
            columnCount={6}
            emptyTitle="Belum ada assignment mapel"
            emptyDescription="Relasi guru ke mapel dan kelas per tahun ajaran akan tampil di tabel ini."
            icon={BookOpen}
          >
            <table className="min-w-full border-separate border-spacing-0 text-left">
              <thead>
                <tr className="bg-[#eef8ff] text-sm text-slate-700">
                  {[
                    "Guru",
                    "Mapel",
                    "Kelas",
                    "Tahun Ajaran",
                    "Status",
                    "ID Assignment",
                  ].map((label) => (
                    <th
                      key={label}
                      className="border-b border-sky-100/90 px-4 py-4 font-medium first:rounded-tl-[24px] last:rounded-tr-[24px]"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!isLoading && filteredTeacherSubjectAssignments.length === 0 ? (
                  <EmptyRow
                    colSpan={6}
                    icon={BookOpen}
                    title="Assignment mapel tidak ditemukan"
                    description="Belum ada data yang cocok dengan pencarian saat ini."
                  />
                ) : (
                  filteredTeacherSubjectAssignments.map((assignment) => (
                    <tr
                      key={assignment.id}
                      className="bg-white text-sm text-slate-600 transition hover:bg-emerald-50/30"
                    >
                      <td className="border-t border-slate-100 px-4 py-4 font-medium text-slate-700">
                        {assignment.teacher_name}
                      </td>
                      <td className="border-t border-slate-100 px-4 py-4">
                        <div className="space-y-1">
                          <p>{assignment.subject_name}</p>
                          <p className="text-xs text-slate-400">
                            {assignment.subject_code}
                          </p>
                        </div>
                      </td>
                      <td className="border-t border-slate-100 px-4 py-4">
                        {assignment.class_name}
                      </td>
                      <td className="border-t border-slate-100 px-4 py-4">
                        {assignment.school_year_name}
                      </td>
                      <td className="border-t border-slate-100 px-4 py-4">
                        <StatusBadge isActive={assignment.is_active} />
                      </td>
                      <td className="border-t border-slate-100 px-4 py-4 text-xs text-slate-400">
                        {assignment.id}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </DataTableCard>
        </TabsContent>

        <TabsContent value="homerooms">
          <DataTableCard
            isLoading={isLoading}
            columnCount={5}
            emptyTitle="Belum ada assignment walas"
            emptyDescription="Data wali kelas per tahun ajaran akan tampil di sini."
            icon={GraduationCap}
          >
            <table className="min-w-full border-separate border-spacing-0 text-left">
              <thead>
                <tr className="bg-[#eef8ff] text-sm text-slate-700">
                  {[
                    "Guru",
                    "Kelas",
                    "Tahun Ajaran",
                    "Status",
                    "ID Assignment",
                  ].map((label) => (
                    <th
                      key={label}
                      className="border-b border-sky-100/90 px-4 py-4 font-medium first:rounded-tl-[24px] last:rounded-tr-[24px]"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!isLoading && filteredHomeroomAssignments.length === 0 ? (
                  <EmptyRow
                    colSpan={5}
                    icon={GraduationCap}
                    title="Assignment walas tidak ditemukan"
                    description="Belum ada data yang cocok dengan pencarian saat ini."
                  />
                ) : (
                  filteredHomeroomAssignments.map((assignment) => (
                    <tr
                      key={assignment.id}
                      className="bg-white text-sm text-slate-600 transition hover:bg-emerald-50/30"
                    >
                      <td className="border-t border-slate-100 px-4 py-4 font-medium text-slate-700">
                        {assignment.teacher_name}
                      </td>
                      <td className="border-t border-slate-100 px-4 py-4">
                        {assignment.class_name}
                      </td>
                      <td className="border-t border-slate-100 px-4 py-4">
                        {assignment.school_year_name}
                      </td>
                      <td className="border-t border-slate-100 px-4 py-4">
                        <StatusBadge isActive={assignment.is_active} />
                      </td>
                      <td className="border-t border-slate-100 px-4 py-4 text-xs text-slate-400">
                        {assignment.id}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </DataTableCard>
        </TabsContent>
      </Tabs>
    </section>
  );
}

function DataTableCard({
  children,
  icon,
  emptyTitle,
  emptyDescription,
  isLoading,
  columnCount,
}: {
  children: ReactNode;
  icon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
  isLoading: boolean;
  columnCount: number;
}) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-sky-100/80">
      <div className="overflow-x-auto">
        {isLoading ? (
          <LoadingTable columnCount={columnCount} />
        ) : (
          children
        )}
      </div>
      {!isLoading && columnCount === 0 ? (
        <div className="p-5">
          <EmptyState
            icon={icon}
            title={emptyTitle}
            description={emptyDescription}
            compact
          />
        </div>
      ) : null}
    </div>
  );
}

function LoadingTable({ columnCount }: { columnCount: number }) {
  return (
    <div className="space-y-3 px-4 py-4">
      {Array.from({ length: 5 }).map((_, rowIndex) => (
        <div
          key={`teacher-loading-${rowIndex}`}
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(120px, 1fr))` }}
        >
          {Array.from({ length: columnCount }).map((__, cellIndex) => (
            <div
              key={`teacher-loading-cell-${rowIndex}-${cellIndex}`}
              className="h-4 animate-pulse rounded-full bg-slate-100"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function EmptyRow({
  colSpan,
  icon,
  title,
  description,
}: {
  colSpan: number;
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <tr className="bg-white">
      <td colSpan={colSpan} className="p-5">
        <EmptyState
          icon={icon}
          title={title}
          description={description}
          compact
        />
      </td>
    </tr>
  );
}

function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-[24px] border border-emerald-100/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(240,253,250,0.92)_100%)] p-4 shadow-[0_16px_32px_rgba(16,185,129,0.06)]">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge
      variant="outline"
      className={
        isActive
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-slate-100 text-slate-500"
      }
    >
      {isActive ? "Aktif" : "Nonaktif"}
    </Badge>
  );
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return "G";
  }
  if (words.length === 1) {
    return words[0].slice(0, 1).toUpperCase();
  }
  return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
}
