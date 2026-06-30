"use client";

import { EmptyState } from "@/components/dashboard/admin/widgets/empty-state";
import { WalasShell } from "@/components/dashboard/staff/walas-shell";
import { getTeacherSubjectAssignments, getTeacherSubjectSessions } from "@/services/staff.service";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { BookOpenCheck, History, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  belum_divalidasi: { label: "Belum Divalidasi", cls: "bg-amber-100 text-amber-700" },
  sudah_divalidasi: { label: "Sudah Divalidasi", cls: "bg-emerald-100 text-emerald-700" },
  diedit: { label: "Diedit", cls: "bg-violet-100 text-violet-700" },
};

const HARI_LABEL: Record<string, string> = {
  senin: "Senin", selasa: "Selasa", rabu: "Rabu", kamis: "Kamis",
  jumat: "Jumat", sabtu: "Sabtu", minggu: "Minggu",
};

export function MapelHistoryPage() {
  const searchParams = useSearchParams();
  const defaultAssignment = searchParams.get("assignment_id") ?? "";

  const [selectedAssignmentId, setSelectedAssignmentId] = useState(defaultAssignment);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const assignmentsQuery = useQuery({
    queryKey: ["teacher-subject-assignments"],
    queryFn: getTeacherSubjectAssignments,
    staleTime: 60_000,
  });

  const sessionsQuery = useQuery({
    queryKey: ["subject-sessions", selectedAssignmentId, statusFilter, dateFrom, dateTo],
    queryFn: () =>
      getTeacherSubjectSessions({
        assignment_id: selectedAssignmentId,
        status: statusFilter || undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
      }),
    enabled: !!selectedAssignmentId,
    staleTime: 30_000,
  });

  const assignments = assignmentsQuery.data ?? [];
  const sessions = sessionsQuery.data?.sessions ?? [];

  return (
    <WalasShell>
      {() => (
        <>
          {/* Filter */}
          <section className="rounded-[32px] border border-white/70 bg-white/88 p-5 shadow-[0_24px_52px_rgba(150,163,184,0.12)]">
            <p className="mb-4 text-lg font-semibold text-slate-950">Filter Riwayat Sesi</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Mata Pelajaran</label>
                <select
                  value={selectedAssignmentId}
                  onChange={(e) => setSelectedAssignmentId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">-- Pilih mata pelajaran --</option>
                  {assignments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.subject_name} — {a.class_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">Semua status</option>
                  <option value="belum_divalidasi">Belum Divalidasi</option>
                  <option value="sudah_divalidasi">Sudah Divalidasi</option>
                  <option value="diedit">Diedit</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">Dari</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">Sampai</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Sessions list */}
          {!selectedAssignmentId ? (
            <section>
              <EmptyState
                icon={History}
                title="Pilih mata pelajaran"
                description="Pilih mata pelajaran di atas untuk melihat riwayat sesi."
              />
            </section>
          ) : sessionsQuery.isLoading ? (
            <section>
              <EmptyState icon={Loader2} title="Memuat riwayat..." description="Mengambil data sesi dari server." />
            </section>
          ) : sessions.length === 0 ? (
            <section>
              <EmptyState
                icon={BookOpenCheck}
                title="Belum ada sesi tercatat"
                description="Belum ada sesi yang tersimpan untuk mata pelajaran ini."
              />
            </section>
          ) : (
            <section className="rounded-[32px] border border-white/70 bg-white/88 p-5 shadow-[0_24px_52px_rgba(150,163,184,0.12)]">
              <p className="mb-4 text-lg font-semibold text-slate-950">
                Riwayat Sesi
                <span className="ml-2 text-sm font-normal text-slate-500">
                  ({sessions.length} sesi)
                </span>
              </p>

              <div className="divide-y divide-slate-50">
                {sessions.map((sess, i) => {
                  const statusInfo = STATUS_MAP[sess.status] ?? {
                    label: sess.status,
                    cls: "bg-slate-100 text-slate-600",
                  };
                  return (
                    <motion.div
                      key={sess.session_id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18, delay: i * 0.03 }}
                      className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          {sess.tanggal}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {HARI_LABEL[sess.hari] ?? sess.hari} · {sess.jam_mulai}–{sess.jam_selesai}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusInfo.cls}`}>
                          {statusInfo.label}
                        </span>
                        <Link
                          href={`/dashboard/walas/mapel/session?session_id=${sess.session_id}`}
                          className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
                        >
                          Lihat
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}
    </WalasShell>
  );
}
