"use client";

import { EmptyState } from "@/components/dashboard/admin/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PremiumModal } from "@/components/ui/premium-modal";
import { RadixSelectField } from "@/components/ui/radix-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  createAdminAttendanceRule,
  createAdminStudent,
  createAdminStudentClassMembership,
} from "@/services/admin.service";
import type {
  AdminAttendanceRule,
  AdminAttendanceRulePayload,
  AdminClass,
  AdminSchoolYear,
  AdminStudent,
  AdminStudentClassMembership,
  AdminStudentClassMembershipPayload,
  AdminStudentPayload,
} from "@/types/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  CalendarClock,
  FilePenLine,
  GraduationCap,
  LayoutPanelTop,
  LineChart,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TimerReset,
  UserPlus,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type StudentSectionProps = {
  students: AdminStudent[];
  memberships: AdminStudentClassMembership[];
  attendanceRules: AdminAttendanceRule[];
  classes: AdminClass[];
  schoolYears: AdminSchoolYear[];
  isLoading?: boolean;
  errorMessage?: string;
};

type StudentTab = "profiles" | "memberships" | "rules";

const statusOptions = [
  { value: "Semua", label: "Semua" },
  { value: "Aktif", label: "Aktif" },
  { value: "Nonaktif", label: "Nonaktif" },
];

export function StudentSection({
  students,
  memberships,
  attendanceRules,
  classes,
  schoolYears,
  isLoading = false,
  errorMessage,
}: StudentSectionProps) {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [activeTab, setActiveTab] = useState<StudentTab>("profiles");
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [membershipModalOpen, setMembershipModalOpen] = useState(false);
  const [ruleModalOpen, setRuleModalOpen] = useState(false);

  const normalizedQuery = query.trim().toLowerCase();

  const createStudentMutation = useMutation({
    mutationFn: createAdminStudent,
    onSuccess: () => {
      toast.success("Profil siswa berhasil ditambahkan.");
      void queryClient.invalidateQueries({ queryKey: ["admin-students"] });
      setProfileModalOpen(false);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const createMembershipMutation = useMutation({
    mutationFn: createAdminStudentClassMembership,
    onSuccess: () => {
      toast.success("Penempatan kelas siswa berhasil dibuat.");
      void queryClient.invalidateQueries({
        queryKey: ["admin-student-class-memberships"],
      });
      setMembershipModalOpen(false);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const createRuleMutation = useMutation({
    mutationFn: createAdminAttendanceRule,
    onSuccess: () => {
      toast.success("Aturan absensi berhasil ditambahkan.");
      void queryClient.invalidateQueries({ queryKey: ["admin-attendance-rules"] });
      setRuleModalOpen(false);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const filteredStudents = students.filter((student) => {
    const matchesStatus =
      statusFilter === "Semua" ||
      (statusFilter === "Aktif" && student.is_active) ||
      (statusFilter === "Nonaktif" && !student.is_active);

    const matchesQuery =
      normalizedQuery.length === 0 ||
      student.name.toLowerCase().includes(normalizedQuery) ||
      student.nis.toLowerCase().includes(normalizedQuery) ||
      (student.nisn ?? "").toLowerCase().includes(normalizedQuery) ||
      (student.phone ?? "").toLowerCase().includes(normalizedQuery) ||
      (student.parent_name ?? "").toLowerCase().includes(normalizedQuery);

    return matchesStatus && matchesQuery;
  });

  const filteredMemberships = memberships.filter((membership) => {
    const matchesStatus =
      statusFilter === "Semua" ||
      (statusFilter === "Aktif" && membership.is_active) ||
      (statusFilter === "Nonaktif" && !membership.is_active);

    const matchesQuery =
      normalizedQuery.length === 0 ||
      membership.student_name.toLowerCase().includes(normalizedQuery) ||
      membership.nis.toLowerCase().includes(normalizedQuery) ||
      membership.class_name.toLowerCase().includes(normalizedQuery) ||
      membership.school_year_name.toLowerCase().includes(normalizedQuery) ||
      membership.status.toLowerCase().includes(normalizedQuery);

    return matchesStatus && matchesQuery;
  });

  const filteredRules = attendanceRules.filter((rule) => {
    const matchesStatus =
      statusFilter === "Semua" ||
      (statusFilter === "Aktif" && rule.is_active) ||
      (statusFilter === "Nonaktif" && !rule.is_active);

    const matchesQuery =
      normalizedQuery.length === 0 ||
      rule.school_year.toLowerCase().includes(normalizedQuery) ||
      rule.check_in_start.toLowerCase().includes(normalizedQuery) ||
      rule.on_time_until.toLowerCase().includes(normalizedQuery) ||
      rule.late_until.toLowerCase().includes(normalizedQuery);

    return matchesStatus && matchesQuery;
  });

  const activeStudentCount = students.filter((student) => student.is_active).length;
  const activeMembershipCount = memberships.filter((membership) => membership.is_active).length;
  const activeRuleCount = attendanceRules.filter((rule) => rule.is_active).length;

  const kpiCards = useMemo(() => {
    if (activeTab === "memberships") {
      return [
        {
          label: "Total Penempatan",
          value: memberships.length,
          icon: GraduationCap,
          accentClass: "from-emerald-500 via-teal-500 to-cyan-500",
        },
        {
          label: "Penempatan Aktif",
          value: activeMembershipCount,
          icon: BadgeCheck,
          accentClass: "from-teal-500 via-emerald-500 to-green-500",
        },
        {
          label: "Kelas Terisi",
          value: new Set(memberships.map((membership) => membership.class_id)).size,
          icon: BookOpen,
          accentClass: "from-sky-500 via-cyan-500 to-emerald-500",
        },
        {
          label: "Tahun Ajaran",
          value: new Set(memberships.map((membership) => membership.school_year_id)).size,
          icon: CalendarClock,
          accentClass: "from-amber-400 via-orange-400 to-emerald-500",
        },
      ];
    }

    if (activeTab === "rules") {
      return [
        {
          label: "Total Rule",
          value: attendanceRules.length,
          icon: TimerReset,
          accentClass: "from-emerald-500 via-teal-500 to-cyan-500",
        },
        {
          label: "Rule Aktif",
          value: activeRuleCount,
          icon: ShieldCheck,
          accentClass: "from-teal-500 via-emerald-500 to-green-500",
        },
        {
          label: "Tahun Ajaran",
          value: new Set(attendanceRules.map((rule) => rule.school_year_id)).size,
          icon: CalendarClock,
          accentClass: "from-sky-500 via-cyan-500 to-emerald-500",
        },
        {
          label: "Window Unik",
          value: new Set(
            attendanceRules.map(
              (rule) => `${rule.check_in_start}|${rule.on_time_until}|${rule.late_until}`,
            ),
          ).size,
          icon: BadgeCheck,
          accentClass: "from-amber-400 via-orange-400 to-emerald-500",
        },
      ];
    }

    return [
      {
        label: "Total Siswa",
        value: students.length,
        icon: UsersRound,
        accentClass: "from-emerald-500 via-teal-500 to-cyan-500",
      },
      {
        label: "Siswa Aktif",
        value: activeStudentCount,
        icon: BadgeCheck,
        accentClass: "from-teal-500 via-emerald-500 to-green-500",
      },
      {
        label: "Punya NISN",
        value: students.filter((student) => Boolean(student.nisn?.trim())).length,
        icon: FilePenLine,
        accentClass: "from-sky-500 via-cyan-500 to-emerald-500",
      },
      {
        label: "Kontak Ortu",
        value: students.filter((student) => Boolean(student.parent_phone?.trim())).length,
        icon: UserPlus,
        accentClass: "from-amber-400 via-orange-400 to-emerald-500",
      },
    ];
  }, [activeMembershipCount, activeRuleCount, activeStudentCount, activeTab, attendanceRules, memberships, students]);

  const addActionConfig = {
    profiles: {
      label: "Tambah Profil Siswa",
      icon: UsersRound,
      onClick: () => setProfileModalOpen(true),
    },
    memberships: {
      label: "Tambah Penempatan Kelas",
      icon: GraduationCap,
      onClick: () => setMembershipModalOpen(true),
    },
    rules: {
      label: "Tambah Aturan Absensi",
      icon: TimerReset,
      onClick: () => setRuleModalOpen(true),
    },
  } satisfies Record<StudentTab, { label: string; icon: LucideIcon; onClick: () => void }>;

  const activeAction = addActionConfig[activeTab];
  const ActiveActionIcon = activeAction.icon;

  return (
    <>
      <section className="relative overflow-hidden rounded-[30px] border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(250,253,252,0.94)_52%,rgba(245,252,249,0.96)_100%)] p-4 shadow-[0_28px_80px_rgba(28,77,61,0.1)] backdrop-blur-xl sm:p-5 lg:p-6">
        <div className="pointer-events-none absolute right-[-80px] top-[-110px] h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-90px] left-[12%] h-52 w-52 rounded-full bg-emerald-100/30 blur-3xl" />

        <div className="relative flex flex-col gap-5 border-b border-slate-200/80 pb-5 sm:gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white/82 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-800 shadow-[0_10px_24px_rgba(16,185,129,0.08)]">
                <LayoutPanelTop className="size-3.5" />
                Student Workspace
              </div>

              <div className="space-y-2">
                <h2 className="text-[2rem] font-semibold tracking-[-0.04em] text-slate-950 sm:text-[2.35rem]">
                  Student Management
                </h2>
                <p className="max-w-2xl text-[15px] leading-7 text-slate-600 sm:text-base">
                  Kelola profil siswa, penempatan kelas per tahun ajaran, dan aturan absensi
                  harian dari API admin dengan struktur yang konsisten.
                </p>
              </div>
            </div>

            <div className="lg:w-[390px]">
              <div className="flex items-center gap-3 rounded-[22px] border border-slate-200/75 bg-white/76 px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#effcf6_0%,#e0f7ee_100%)] text-emerald-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                  <LineChart className="size-4.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">Ringkasan operasional siswa</p>
                  <p className="text-xs leading-5 text-slate-500">
                    Cari cepat siswa, rombel, dan aturan absensi tanpa pindah ke halaman lain.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
            {kpiCards.map((card) => (
              <StudentStatCard
                key={card.label}
                label={card.label}
                value={card.value}
                icon={card.icon}
                accentClass={card.accentClass}
              />
            ))}
          </div>

          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="text-xs font-medium text-slate-400">
              {activeStudentCount} siswa aktif tercatat
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
              <div className="flex items-center gap-2 rounded-[24px] border border-slate-200/80 bg-white/84 px-3 py-2 shadow-[0_14px_28px_rgba(15,23,42,0.05),inset_0_1px_0_rgba(255,255,255,0.92)]">
                <span className="flex size-9 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#ffffff_0%,#f4faf7_100%)] text-slate-400 shadow-[0_8px_18px_rgba(15,23,42,0.06)]">
                  <SlidersHorizontal className="size-4" />
                </span>
                <div className="flex items-center gap-2 rounded-full bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]">
                  <Search className="size-4 text-slate-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Cari siswa, kelas, NIS, orang tua"
                    className="w-full min-w-[180px] bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:min-w-[240px]"
                  />
                </div>
              </div>

              <div className="w-full sm:w-[190px]">
                <RadixSelectField
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                  placeholder="Pilih status"
                  options={statusOptions}
                  triggerClassName="h-14 rounded-[22px] pl-4"
                />
              </div>

              <Button
                variant="outline"
                className="h-14 rounded-[22px] border-emerald-200/80 bg-[linear-gradient(135deg,#123f36_0%,#115649_100%)] px-5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(17,86,73,0.22)] hover:border-emerald-200 hover:bg-[linear-gradient(135deg,#14483d_0%,#146756_100%)] hover:text-white"
                onClick={activeAction.onClick}
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-white/12">
                  <ActiveActionIcon className="size-4" />
                </span>
                {activeAction.label}
              </Button>
            </div>
          </div>
        </div>

        {errorMessage ? (
          <div className="mt-5">
            <EmptyState
              icon={UsersRound}
              title="Data student belum bisa dimuat"
              description={errorMessage}
              compact
            />
          </div>
        ) : null}

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as StudentTab)} className="mt-5 gap-4">
          <TabsList className="grid w-full grid-cols-1 gap-2 rounded-[24px] border border-emerald-100/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(242,250,246,0.92)_100%)] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_16px_30px_rgba(15,23,42,0.04)] sm:grid-cols-3">
            <TabsTrigger value="profiles" className="w-full rounded-[18px] border border-transparent px-5 py-3 text-slate-500 transition-colors hover:border-emerald-100 hover:bg-white/80 hover:text-emerald-800 data-active:border-emerald-200 data-active:bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(236,253,245,0.98)_100%)] data-active:text-emerald-900 data-active:shadow-[0_14px_26px_rgba(16,185,129,0.12)]">
              <UsersRound className="size-4" />
              Profil Siswa
            </TabsTrigger>
            <TabsTrigger value="memberships" className="w-full rounded-[18px] border border-transparent px-5 py-3 text-slate-500 transition-colors hover:border-emerald-100 hover:bg-white/80 hover:text-emerald-800 data-active:border-emerald-200 data-active:bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(236,253,245,0.98)_100%)] data-active:text-emerald-900 data-active:shadow-[0_14px_26px_rgba(16,185,129,0.12)]">
              <GraduationCap className="size-4" />
              Penempatan Kelas
            </TabsTrigger>
            <TabsTrigger value="rules" className="w-full rounded-[18px] border border-transparent px-5 py-3 text-slate-500 transition-colors hover:border-emerald-100 hover:bg-white/80 hover:text-emerald-800 data-active:border-emerald-200 data-active:bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(236,253,245,0.98)_100%)] data-active:text-emerald-900 data-active:shadow-[0_14px_26px_rgba(16,185,129,0.12)]">
              <TimerReset className="size-4" />
              Aturan Absensi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profiles">
            <StudentDataTableCard isLoading={isLoading} columnCount={7} emptyTitle="Belum ada siswa" emptyDescription="Tambahkan siswa baru agar data muncul pada daftar ini." icon={UsersRound}>
              <table className="min-w-full border-separate border-spacing-0 text-left">
                <thead>
                  <tr className="bg-[#f3fbf6] text-sm text-slate-700">
                    {["Siswa", "NIS / NISN", "Kontak", "Orang Tua", "Angkatan", "Gender", "Status"].map((label) => (
                      <th key={label} className="border-b border-emerald-100/90 px-4 py-4 font-medium first:rounded-tl-[24px] last:rounded-tr-[24px]">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {!isLoading && filteredStudents.length === 0 ? (
                    <StudentEmptyRow colSpan={7} icon={UsersRound} title="Profil siswa tidak ditemukan" description="Coba ubah pencarian atau filter status siswa." />
                  ) : (
                    filteredStudents.map((student) => (
                      <tr key={student.id} className="bg-white text-sm text-slate-600 transition hover:bg-emerald-50/30">
                        <td className="border-t border-slate-100 px-4 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex size-9 items-center justify-center rounded-full bg-[linear-gradient(180deg,#effcf6_0%,#dcfce7_100%)] text-xs font-semibold text-emerald-700">
                              {getInitials(student.name)}
                            </span>
                            <div>
                              <p className="font-medium text-slate-700">{student.name}</p>
                              <p className="text-xs text-slate-400">{student.user_id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="border-t border-slate-100 px-4 py-4">
                          <div className="space-y-1">
                            <p>{student.nis}</p>
                            <p className="text-xs text-slate-400">NISN: {student.nisn || "-"}</p>
                          </div>
                        </td>
                        <td className="border-t border-slate-100 px-4 py-4">
                          <div className="space-y-1">
                            <p>{student.phone || "-"}</p>
                            <p className="text-xs text-slate-400">{student.address || "Alamat belum diisi"}</p>
                          </div>
                        </td>
                        <td className="border-t border-slate-100 px-4 py-4">
                          <div className="space-y-1">
                            <p>{student.parent_name || "-"}</p>
                            <p className="text-xs text-slate-400">{student.parent_phone || "-"}</p>
                          </div>
                        </td>
                        <td className="border-t border-slate-100 px-4 py-4">{student.entry_year}</td>
                        <td className="border-t border-slate-100 px-4 py-4">{formatGender(student.gender)}</td>
                        <td className="border-t border-slate-100 px-4 py-4">
                          <StudentStatusBadge isActive={student.is_active} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </StudentDataTableCard>
          </TabsContent>

          <TabsContent value="memberships">
            <StudentDataTableCard isLoading={isLoading} columnCount={6} emptyTitle="Belum ada penempatan kelas" emptyDescription="Riwayat kelas siswa per tahun ajaran akan tampil di sini." icon={GraduationCap}>
              <table className="min-w-full border-separate border-spacing-0 text-left">
                <thead>
                  <tr className="bg-[#f3fbf6] text-sm text-slate-700">
                    {["Siswa", "Kelas", "Tahun Ajaran", "Status Member", "Aktif", "Waktu"].map((label) => (
                      <th key={label} className="border-b border-emerald-100/90 px-4 py-4 font-medium first:rounded-tl-[24px] last:rounded-tr-[24px]">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {!isLoading && filteredMemberships.length === 0 ? (
                    <StudentEmptyRow colSpan={6} icon={GraduationCap} title="Penempatan kelas tidak ditemukan" description="Belum ada data penempatan yang cocok dengan filter saat ini." />
                  ) : (
                    filteredMemberships.map((membership) => (
                      <tr key={membership.id} className="bg-white text-sm text-slate-600 transition hover:bg-emerald-50/30">
                        <td className="border-t border-slate-100 px-4 py-4">
                          <div className="space-y-1">
                            <p className="font-medium text-slate-700">{membership.student_name}</p>
                            <p className="text-xs text-slate-400">{membership.nis}</p>
                          </div>
                        </td>
                        <td className="border-t border-slate-100 px-4 py-4">{membership.class_name}</td>
                        <td className="border-t border-slate-100 px-4 py-4">{membership.school_year_name}</td>
                        <td className="border-t border-slate-100 px-4 py-4">
                          <Badge variant="outline" className="border-emerald-100 bg-emerald-50 text-emerald-700">
                            {membership.status}
                          </Badge>
                        </td>
                        <td className="border-t border-slate-100 px-4 py-4">
                          <StudentStatusBadge isActive={membership.is_active} />
                        </td>
                        <td className="border-t border-slate-100 px-4 py-4">
                          <div className="space-y-1 text-xs text-slate-500">
                            <p>Masuk: {formatDateTime(membership.joined_at)}</p>
                            <p>Keluar: {formatDateTime(membership.left_at)}</p>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </StudentDataTableCard>
          </TabsContent>

          <TabsContent value="rules">
            <StudentDataTableCard isLoading={isLoading} columnCount={5} emptyTitle="Belum ada aturan absensi" emptyDescription="Rule jam hadir, telat, dan cutoff alfa akan muncul di tabel ini." icon={TimerReset}>
              <table className="min-w-full border-separate border-spacing-0 text-left">
                <thead>
                  <tr className="bg-[#f3fbf6] text-sm text-slate-700">
                    {["Tahun Ajaran", "Mulai Absen", "Tepat Waktu", "Batas Telat", "Status"].map((label) => (
                      <th key={label} className="border-b border-emerald-100/90 px-4 py-4 font-medium first:rounded-tl-[24px] last:rounded-tr-[24px]">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {!isLoading && filteredRules.length === 0 ? (
                    <StudentEmptyRow colSpan={5} icon={TimerReset} title="Aturan absensi tidak ditemukan" description="Tambahkan aturan absensi baru agar school year punya window check-in." />
                  ) : (
                    filteredRules.map((rule) => (
                      <tr key={rule.id} className="bg-white text-sm text-slate-600 transition hover:bg-emerald-50/30">
                        <td className="border-t border-slate-100 px-4 py-4">{rule.school_year}</td>
                        <td className="border-t border-slate-100 px-4 py-4">{rule.check_in_start}</td>
                        <td className="border-t border-slate-100 px-4 py-4">{rule.on_time_until}</td>
                        <td className="border-t border-slate-100 px-4 py-4">{rule.late_until}</td>
                        <td className="border-t border-slate-100 px-4 py-4">
                          <StudentStatusBadge isActive={rule.is_active} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </StudentDataTableCard>
          </TabsContent>
        </Tabs>
      </section>

      <StudentProfileCreateModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        isPending={createStudentMutation.isPending}
        onSubmit={(payload) => createStudentMutation.mutate(payload)}
      />
      <StudentMembershipCreateModal
        open={membershipModalOpen}
        onOpenChange={setMembershipModalOpen}
        students={students}
        classes={classes}
        schoolYears={schoolYears}
        isPending={createMembershipMutation.isPending}
        onSubmit={(payload) => createMembershipMutation.mutate(payload)}
      />
      <AttendanceRuleCreateModal
        open={ruleModalOpen}
        onOpenChange={setRuleModalOpen}
        schoolYears={schoolYears}
        isPending={createRuleMutation.isPending}
        onSubmit={(payload) => createRuleMutation.mutate(payload)}
      />
    </>
  );
}

function StudentProfileCreateModal({
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
  const [form, setForm] = useState<AdminStudentPayload>({
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
  });

  const reset = () =>
    setForm({
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
    });

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) reset();
  };

  return (
    <PremiumModal open={open} onOpenChange={handleOpenChange} title="Tambah Profil Siswa" description="Lengkapi data profil siswa dan akun login dasar dalam satu modal." icon={UsersRound}>
      <div className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup label="Nama Siswa">
            <Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Masukkan nama siswa" className={inputClassName} />
          </FieldGroup>
          <FieldGroup label="Password Login">
            <Input value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} placeholder="Minimal 6 karakter" className={inputClassName} />
          </FieldGroup>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup label="NIS">
            <Input value={form.nis} onChange={(event) => setForm((current) => ({ ...current, nis: event.target.value }))} placeholder="10 digit NIS" className={inputClassName} />
          </FieldGroup>
          <FieldGroup label="NISN">
            <Input value={form.nisn} onChange={(event) => setForm((current) => ({ ...current, nisn: event.target.value }))} placeholder="Masukkan NISN" className={inputClassName} />
          </FieldGroup>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <FieldGroup label="Jenis Kelamin">
            <RadixSelectField
              value={form.gender}
              onValueChange={(value) => setForm((current) => ({ ...current, gender: value }))}
              placeholder="Pilih gender"
              options={[
                { value: "MALE", label: "Laki-laki" },
                { value: "FEMALE", label: "Perempuan" },
              ]}
            />
          </FieldGroup>
          <FieldGroup label="Angkatan">
            <Input value={String(form.entry_year)} onChange={(event) => setForm((current) => ({ ...current, entry_year: Number(event.target.value || 0) }))} placeholder="2026" className={inputClassName} />
          </FieldGroup>
          <FieldGroup label="Status Aktif">
            <RadixSelectField
              value={String(form.is_active)}
              onValueChange={(value) => setForm((current) => ({ ...current, is_active: value === "true" }))}
              placeholder="Pilih status"
              options={[
                { value: "true", label: "Aktif" },
                { value: "false", label: "Nonaktif" },
              ]}
            />
          </FieldGroup>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup label="Telepon Siswa">
            <Input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} placeholder="08xxxxxxxxxx" className={inputClassName} />
          </FieldGroup>
          <FieldGroup label="Nama Orang Tua">
            <Input value={form.parent_name} onChange={(event) => setForm((current) => ({ ...current, parent_name: event.target.value }))} placeholder="Masukkan nama orang tua" className={inputClassName} />
          </FieldGroup>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup label="Telepon Orang Tua">
            <Input value={form.parent_phone} onChange={(event) => setForm((current) => ({ ...current, parent_phone: event.target.value }))} placeholder="08xxxxxxxxxx" className={inputClassName} />
          </FieldGroup>
          <FieldGroup label="Tempat Lahir">
            <Input value={form.birth_place} onChange={(event) => setForm((current) => ({ ...current, birth_place: event.target.value }))} placeholder="Contoh: Cianjur" className={inputClassName} />
          </FieldGroup>
        </div>

        <FieldGroup label="Alamat">
          <Textarea value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} placeholder="Masukkan alamat siswa" className={textareaClassName} />
        </FieldGroup>

        <ModalActions isPending={isPending} onCancel={() => handleOpenChange(false)} onSubmit={() => onSubmit(form)} submitLabel="Simpan Profil Siswa" />
      </div>
    </PremiumModal>
  );
}

function StudentMembershipCreateModal({
  open,
  onOpenChange,
  students,
  classes,
  schoolYears,
  isPending,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  students: AdminStudent[];
  classes: AdminClass[];
  schoolYears: AdminSchoolYear[];
  isPending: boolean;
  onSubmit: (payload: AdminStudentClassMembershipPayload) => void;
}) {
  const [form, setForm] = useState<AdminStudentClassMembershipPayload>({
    student_id: "",
    class_id: "",
    school_year_id: "",
    status: "ACTIVE",
    joined_at: "",
    left_at: "",
    is_active: true,
  });

  const reset = () =>
    setForm({
      student_id: "",
      class_id: "",
      school_year_id: "",
      status: "ACTIVE",
      joined_at: "",
      left_at: "",
      is_active: true,
    });

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) reset();
  };

  return (
    <PremiumModal open={open} onOpenChange={handleOpenChange} title="Tambah Penempatan Kelas" description="Hubungkan siswa ke kelas aktif per tahun ajaran tanpa menghilangkan riwayat akademik." icon={GraduationCap}>
      <div className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup label="Siswa">
            <RadixSelectField value={form.student_id} onValueChange={(value) => setForm((current) => ({ ...current, student_id: value }))} placeholder="Pilih siswa" options={students.map((student) => ({ value: student.id, label: student.name, description: student.nis }))} />
          </FieldGroup>
          <FieldGroup label="Kelas">
            <RadixSelectField value={form.class_id} onValueChange={(value) => setForm((current) => ({ ...current, class_id: value }))} placeholder="Pilih kelas" options={classes.map((item) => ({ value: item.id, label: item.display_name, description: item.school_year_name }))} />
          </FieldGroup>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <FieldGroup label="Tahun Ajaran">
            <RadixSelectField value={form.school_year_id} onValueChange={(value) => setForm((current) => ({ ...current, school_year_id: value }))} placeholder="Pilih tahun ajaran" options={schoolYears.map((item) => ({ value: item.id, label: item.name, description: `${item.start_year} - ${item.end_year}` }))} />
          </FieldGroup>
          <FieldGroup label="Status Membership">
            <RadixSelectField value={form.status} onValueChange={(value) => setForm((current) => ({ ...current, status: value }))} placeholder="Pilih status" options={[{ value: "ACTIVE", label: "ACTIVE" }, { value: "TRANSFERRED", label: "TRANSFERRED" }, { value: "GRADUATED", label: "GRADUATED" }, { value: "INACTIVE", label: "INACTIVE" }]} />
          </FieldGroup>
          <FieldGroup label="Status Aktif">
            <RadixSelectField value={String(form.is_active)} onValueChange={(value) => setForm((current) => ({ ...current, is_active: value === "true" }))} placeholder="Pilih status" options={[{ value: "true", label: "Aktif" }, { value: "false", label: "Nonaktif" }]} />
          </FieldGroup>
        </div>

        <ModalActions isPending={isPending} onCancel={() => handleOpenChange(false)} onSubmit={() => onSubmit(form)} submitLabel="Simpan Penempatan" />
      </div>
    </PremiumModal>
  );
}

function AttendanceRuleCreateModal({
  open,
  onOpenChange,
  schoolYears,
  isPending,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolYears: AdminSchoolYear[];
  isPending: boolean;
  onSubmit: (payload: AdminAttendanceRulePayload) => void;
}) {
  const [form, setForm] = useState<AdminAttendanceRulePayload>({
    school_year_id: "",
    check_in_start: "06:30:00",
    on_time_until: "07:00:00",
    late_until: "07:30:00",
    is_active: true,
  });

  const reset = () =>
    setForm({
      school_year_id: "",
      check_in_start: "06:30:00",
      on_time_until: "07:00:00",
      late_until: "07:30:00",
      is_active: true,
    });

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) reset();
  };

  return (
    <PremiumModal open={open} onOpenChange={handleOpenChange} title="Tambah Aturan Absensi" description="Atur window hadir, telat, dan cutoff absensi per tahun ajaran." icon={TimerReset}>
      <div className="grid gap-5">
        <FieldGroup label="Tahun Ajaran">
          <RadixSelectField value={form.school_year_id} onValueChange={(value) => setForm((current) => ({ ...current, school_year_id: value }))} placeholder="Pilih tahun ajaran" options={schoolYears.map((item) => ({ value: item.id, label: item.name, description: `${item.start_year} - ${item.end_year}` }))} />
        </FieldGroup>

        <div className="grid gap-4 md:grid-cols-3">
          <FieldGroup label="Mulai Absen">
            <Input value={form.check_in_start} onChange={(event) => setForm((current) => ({ ...current, check_in_start: event.target.value }))} placeholder="06:30:00" className={inputClassName} />
          </FieldGroup>
          <FieldGroup label="Batas Tepat Waktu">
            <Input value={form.on_time_until} onChange={(event) => setForm((current) => ({ ...current, on_time_until: event.target.value }))} placeholder="07:00:00" className={inputClassName} />
          </FieldGroup>
          <FieldGroup label="Batas Telat">
            <Input value={form.late_until} onChange={(event) => setForm((current) => ({ ...current, late_until: event.target.value }))} placeholder="07:30:00" className={inputClassName} />
          </FieldGroup>
        </div>

        <FieldGroup label="Status Rule">
          <RadixSelectField value={String(form.is_active)} onValueChange={(value) => setForm((current) => ({ ...current, is_active: value === "true" }))} placeholder="Pilih status" options={[{ value: "true", label: "Aktif" }, { value: "false", label: "Nonaktif" }]} />
        </FieldGroup>

        <ModalActions isPending={isPending} onCancel={() => handleOpenChange(false)} onSubmit={() => onSubmit(form)} submitLabel="Simpan Aturan Absensi" />
      </div>
    </PremiumModal>
  );
}

function StudentDataTableCard({
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
    <div className="overflow-hidden rounded-[24px] border border-emerald-100/80">
      <div className="overflow-x-auto">{isLoading ? <LoadingTable columnCount={columnCount} /> : children}</div>
      {!isLoading && columnCount === 0 ? (
        <div className="p-5">
          <EmptyState icon={icon} title={emptyTitle} description={emptyDescription} compact />
        </div>
      ) : null}
    </div>
  );
}

function StudentEmptyRow({
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
        <EmptyState icon={icon} title={title} description={description} compact />
      </td>
    </tr>
  );
}

function LoadingTable({ columnCount }: { columnCount: number }) {
  return (
    <div className="space-y-3 px-4 py-4">
      {Array.from({ length: 5 }).map((_, rowIndex) => (
        <div key={`student-loading-${rowIndex}`} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(120px, 1fr))` }}>
          {Array.from({ length: columnCount }).map((__, cellIndex) => (
            <div key={`student-loading-cell-${rowIndex}-${cellIndex}`} className="h-4 animate-pulse rounded-full bg-slate-100" />
          ))}
        </div>
      ))}
    </div>
  );
}

function StudentStatCard({
  label,
  value,
  icon: Icon,
  accentClass,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  accentClass: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[26px] border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(244,252,248,0.96)_100%)] p-4 shadow-[0_18px_34px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_54px_rgba(15,23,42,0.1)]">
      <div className="absolute right-[-10px] top-[-26px] h-24 w-24 rounded-full bg-emerald-100/40 blur-2xl transition duration-300 group-hover:scale-110" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
          <p className="text-[2.15rem] font-semibold tracking-[-0.04em] text-slate-950">{value}</p>
        </div>
        <div className="flex flex-col items-center gap-2 text-right">
          <span className={`inline-flex size-12 items-center justify-center rounded-[18px] bg-gradient-to-br ${accentClass} text-white shadow-[0_14px_28px_rgba(15,23,42,0.16)]`}>
            <Icon className="size-5" />
          </span>
          <div className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50/80 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
            Live
            <ArrowUpRight className="size-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge variant="outline" className={isActive ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-100 text-slate-500"}>
      {isActive ? "Aktif" : "Nonaktif"}
    </Badge>
  );
}

function FieldGroup({
  label,
  helper,
  children,
}: {
  label: string;
  helper?: string;
  children: ReactNode;
}) {
  return (
    <div className="ui-modal-field">
      <label className="ui-modal-label">{label}</label>
      {helper ? <p className="ui-modal-helper">{helper}</p> : null}
      {children}
    </div>
  );
}

function ModalActions({
  isPending,
  onCancel,
  onSubmit,
  submitLabel,
}: {
  isPending: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
}) {
  return (
    <div className="ui-modal-actions">
      <Button variant="outline" className="h-12 rounded-[1.1rem] border-slate-200 px-5 text-sm font-semibold text-slate-600" onClick={onCancel} disabled={isPending}>
        Batal
      </Button>
      <Button className="h-12 rounded-[1.1rem] bg-[linear-gradient(135deg,#0f766e_0%,#166534_100%)] px-5 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(22,101,52,0.2)] hover:opacity-95" onClick={onSubmit} disabled={isPending}>
        <Sparkles className="size-4" />
        {isPending ? "Menyimpan..." : submitLabel}
      </Button>
    </div>
  );
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "S";
  if (words.length === 1) return words[0].slice(0, 1).toUpperCase();
  return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
}

function formatGender(gender?: string) {
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

function formatDateTime(value?: string) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("id-ID");
}

const inputClassName =
  "h-14 rounded-[1.25rem] border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f5fbf7_100%)] px-4 text-sm shadow-[0_14px_30px_rgba(15,23,42,0.05),inset_0_1px_0_rgba(255,255,255,0.95)]";

const textareaClassName =
  "min-h-[140px] rounded-[1.4rem] border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f5fbf7_100%)] px-4 py-3 text-sm shadow-[0_14px_30px_rgba(15,23,42,0.05),inset_0_1px_0_rgba(255,255,255,0.95)]";
