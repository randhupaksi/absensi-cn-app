import { AppShell } from "@/components/layouts/app-shell";
import { AttendanceStatusBadge } from "@/components/attendance/attendance-status-badge";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { StatCard } from "@/components/dashboard/stat-card";
import { AppDataTable } from "@/components/data-table/app-data-table";
import { attendanceColumns } from "@/components/data-table/columns/attendance-columns";
import { attendanceHistory } from "@/lib/constants/mock-data";
import { dashboardStats } from "@/lib/constants/site";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <DashboardHero />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <Card className="border-white/70 bg-white/80 shadow-sm backdrop-blur">
            <CardHeader>
              <CardTitle>Riwayat Absensi Siswa</CardTitle>
            </CardHeader>
            <CardContent>
              <AppDataTable columns={attendanceColumns} data={attendanceHistory} />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-white/70 bg-white/80 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle>Status Hari Ini</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <div>
                    <p className="text-sm text-slate-500">XI RPL 1</p>
                    <p className="font-medium text-slate-900">Raka Pratama</p>
                  </div>
                  <AttendanceStatusBadge status="hadir" />
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <div>
                    <p className="text-sm text-slate-500">XI RPL 1</p>
                    <p className="font-medium text-slate-900">Nabila Putri</p>
                  </div>
                  <AttendanceStatusBadge status="telat" />
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <div>
                    <p className="text-sm text-slate-500">XI TKJ 2</p>
                    <p className="font-medium text-slate-900">Dimas Alfarizi</p>
                  </div>
                  <AttendanceStatusBadge status="izin" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/70 bg-white/80 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle>Kalender Rekap</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={new Date("2026-05-11")}
                  className="rounded-2xl border border-slate-200 bg-white p-3"
                />
              </CardContent>
            </Card>
          </div>
        </section>

        <Card className="border-white/70 bg-white/80 shadow-sm backdrop-blur">
          <CardHeader>
            <CardTitle>Ringkasan Peran</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="siswa" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="siswa">Siswa</TabsTrigger>
                <TabsTrigger value="walas">Walas</TabsTrigger>
                <TabsTrigger value="bk">BK</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
              <TabsContent value="siswa" className="text-sm leading-7 text-slate-600">
                Siswa fokus pada absen masuk, absen pulang, riwayat harian, dan
                pengajuan izin atau sakit.
              </TabsContent>
              <TabsContent value="walas" className="text-sm leading-7 text-slate-600">
                Walas memantau kehadiran per kelas, memvalidasi pengajuan, dan
                melihat siswa telat atau alfa.
              </TabsContent>
              <TabsContent value="bk" className="text-sm leading-7 text-slate-600">
                BK memonitor pola keterlambatan, alfa berulang, dan menambahkan
                catatan pembinaan singkat.
              </TabsContent>
              <TabsContent value="admin" className="text-sm leading-7 text-slate-600">
                Admin mengelola data master, user, kelas, dan seluruh data
                absensi secara menyeluruh.
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
