"use client";

import { EmptyState } from "@/components/dashboard/admin/widgets/empty-state";
import { WalasShell } from "@/components/dashboard/staff/walas-shell";
import { getTeacherSubjectAssignments, getTeacherSubjectRecap } from "@/services/staff.service";
import type { StaffSubjectRecapStudentRow } from "@/types/staff";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { BookOpenCheck, ChartColumnBig, Loader2 } from "lucide-react";
import { useState } from "react";

export function MapelRecapPage() {
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const assignmentsQuery = useQuery({
    queryKey: ["teacher-subject-assignments"],
    queryFn: getTeacherSubjectAssignments,
    staleTime: 60_000,
  });

  const recapQuery = useQuery({
    queryKey: ["subject-recap", selectedAssignmentId, dateFrom, dateTo],
    queryFn: () =>
      getTeacherSubjectRecap({
        assignment_id: selectedAssignmentId,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
      }),
    enabled: !!selectedAssignmentId,
    staleTime: 0,
  });

  const assignments = assignmentsQuery.data ?? [];
  const recap = recapQuery.data;

  return (
    <WalasShell>
      {() => (
        <>
          {/* Filter */}
          <section className="rounded-[32px] border border-white/70 bg-white/88 p-5 shadow-[0_24px_52px_rgba(150,163,184,0.12)]">
            <p className="mb-4 text-lg font-semibold text-slate-950">Filter Rekap</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-3">
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Mata Pelajaran</label>
                <select
                  value={selectedAssignmentId}
                  onChange={(e) => setSelectedAssignmentId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">-- Pilih mata pelajaran --</option>
                  {assignments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.subject_name} — {a.class_name} ({a.school_year_name})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Dari Tanggal</label>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Sampai Tanggal</label>
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
              </div>
            </div>
          </section>

          {/* Recap table */}
          {!selectedAssignmentId ? (
            <section>
              <EmptyState icon={ChartColumnBig} title="Pilih mata pelajaran" description="Pilih mata pelajaran untuk melihat rekap kehadiran siswa." />
            </section>
          ) : recapQuery.isLoading ? (
            <section>
              <EmptyState icon={Loader2} title="Memuat rekap..." description="Mengambil data rekap kehadiran." />
            </section>
          ) : recap ? (
            <section className="rounded-[32px] border border-white/70 bg-white/88 p-5 shadow-[0_24px_52px_rgba(150,163,184,0.12)]">
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xl font-semibold text-slate-950">
                    {recap.assignment.subject_name} — {recap.assignment.class_name}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {recap.assignment.school_year_name} ·{" "}
                    <span className="font-medium text-emerald-700">{recap.total_pertemuan} pertemuan</span>
                  </p>
                </div>
              </div>

              {recap.students.length === 0 ? (
                <EmptyState icon={BookOpenCheck} title="Belum ada data pertemuan" description="Belum ada sesi yang divalidasi dalam rentang tanggal ini." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        <th className="pb-3 pr-4">Siswa</th>
                        <th className="pb-3 pr-4">NIS</th>
                        <th className="pb-3 pr-4 text-right text-emerald-600">Hadir</th>
                        <th className="pb-3 pr-4 text-right text-amber-600">Telat</th>
                        <th className="pb-3 pr-4 text-right text-orange-600">Alfa Kelas</th>
                        <th className="pb-3 pr-4 text-right text-violet-600">Dispensasi</th>
                        <th className="pb-3 pr-4 text-right text-rose-600">Alfa</th>
                        <th className="pb-3 pr-4 text-right text-sky-600">Sakit</th>
                        <th className="pb-3 text-right text-slate-500">Izin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {recap.students.map((s, i) => (
                        <motion.tr
                          key={s.student_id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.15, delay: i * 0.02 }}
                        >
                          <td className="py-3 pr-4 font-medium text-slate-900">{s.student_name}</td>
                          <td className="py-3 pr-4 text-slate-500">{s.nis}</td>
                          <RecapCell value={s.hadir} cls="text-emerald-700 bg-emerald-50" />
                          <RecapCell value={s.telat} cls="text-amber-700 bg-amber-50" />
                          <RecapCell value={s.alfa_kelas} cls="text-orange-700 bg-orange-50" />
                          <RecapCell value={s.dispensasi} cls="text-violet-700 bg-violet-50" />
                          <RecapCell value={s.alfa} cls="text-rose-700 bg-rose-50" />
                          <RecapCell value={s.sakit} cls="text-sky-700 bg-sky-50" />
                          <RecapCell value={s.izin} cls="text-slate-600 bg-slate-50" />
                        </motion.tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-slate-100">
                        <td colSpan={2} className="py-3 text-xs font-semibold text-slate-500">
                          Total ({recap.students.length} siswa)
                        </td>
                        <SumCell rows={recap.students} field="hadir" cls="text-emerald-700" />
                        <SumCell rows={recap.students} field="telat" cls="text-amber-700" />
                        <SumCell rows={recap.students} field="alfa_kelas" cls="text-orange-700" />
                        <SumCell rows={recap.students} field="dispensasi" cls="text-violet-700" />
                        <SumCell rows={recap.students} field="alfa" cls="text-rose-700" />
                        <SumCell rows={recap.students} field="sakit" cls="text-sky-700" />
                        <SumCell rows={recap.students} field="izin" cls="text-slate-600" />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </section>
          ) : null}
        </>
      )}
    </WalasShell>
  );
}

function RecapCell({ value, cls }: { value: number; cls: string }) {
  return (
    <td className="py-3 pr-4 text-right">
      {value > 0 ? (
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${cls}`}>{value}</span>
      ) : (
        <span className="text-xs text-slate-300">—</span>
      )}
    </td>
  );
}

function SumCell({ rows, field, cls }: { rows: StaffSubjectRecapStudentRow[]; field: keyof StaffSubjectRecapStudentRow; cls: string }) {
  const total = rows.reduce((sum, r) => sum + (r[field] as number), 0);
  return <td className={`py-3 pr-4 text-right text-xs font-bold ${cls}`}>{total}</td>;
}
