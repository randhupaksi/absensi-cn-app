import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/lib/config/site";
import { roleSummaries, stackHighlights } from "@/lib/constants/site";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden bg-[linear-gradient(180deg,#f7fafc_0%,#eef6ff_46%,#f4efe4_100%)]">
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.18),_transparent_58%)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-10 lg:px-10">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
              Absensi CN
            </p>
            <h1 className="mt-2 font-heading text-2xl font-semibold text-slate-950">
              Sistem Absensi Sekolah SMK Citra Negara
            </h1>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <Button variant="ghost" render={<Link href="/login" />}>
              Masuk
            </Button>
            <Button render={<Link href="/dashboard" />} className="rounded-full px-6">
              Lihat Dashboard
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Badge className="rounded-full bg-sky-100 px-4 py-1 text-sky-800 hover:bg-sky-100">
              Premium school attendance workspace
            </Badge>
            <div className="mt-6 max-w-3xl space-y-6">
              <h2 className="font-heading text-5xl leading-tight font-semibold text-slate-950 md:text-6xl">
                Absensi harian yang rapi, cepat, dan jelas untuk semua role.
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Frontend ini disiapkan untuk memisahkan alur siswa, walas, BK,
                dan admin dengan tampilan dashboard yang modern, clean, dan
                siap dihubungkan ke REST API Golang.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button
                render={<Link href="/login" />}
                size="lg"
                className="rounded-full px-7"
              >
                Buka Halaman Login
                <ArrowRight className="size-4" />
              </Button>
              <Button
                render={<Link href="/dashboard" />}
                size="lg"
                variant="outline"
                className="rounded-full border-slate-300 bg-white/70 px-7"
              >
                Preview Dashboard
              </Button>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <Card className="border-white/60 bg-white/70 shadow-sm backdrop-blur">
                <CardHeader className="space-y-2 pb-2">
                  <Clock3 className="size-5 text-sky-700" />
                  <CardTitle className="text-base">Core Flow Jelas</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-slate-600">
                  Satu siswa satu absensi per hari, status konsisten, dan proses
                  izin/sakit mudah dipahami.
                </CardContent>
              </Card>
              <Card className="border-white/60 bg-white/70 shadow-sm backdrop-blur">
                <CardHeader className="space-y-2 pb-2">
                  <ShieldCheck className="size-5 text-amber-700" />
                  <CardTitle className="text-base">Role Ketat</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-slate-600">
                  Akses siswa, walas, BK, dan admin dipisahkan agar sistem tetap
                  rapi dan realistis.
                </CardContent>
              </Card>
              <Card className="border-white/60 bg-white/70 shadow-sm backdrop-blur">
                <CardHeader className="space-y-2 pb-2">
                  <CalendarDays className="size-5 text-emerald-700" />
                  <CardTitle className="text-base">Siap Berkembang</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-slate-600">
                  Struktur folder, services, dan komponen disusun supaya enak
                  dikembangkan bertahap.
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="overflow-hidden border-white/60 bg-white/75 shadow-xl shadow-slate-200/60 backdrop-blur">
              <CardHeader className="border-b border-slate-200/80 bg-white/80">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Sistem Frontend
                    </p>
                    <CardTitle className="mt-1 text-2xl">
                      {siteConfig.name}
                    </CardTitle>
                  </div>
                  <Badge
                    variant="secondary"
                    className="rounded-full bg-slate-100 px-3 py-1 text-slate-700"
                  >
                    <Sparkles className="size-4" />
                    Ready
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6 p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {roleSummaries.map((role) => (
                    <Card
                      key={role.title}
                      className="border-slate-200/70 bg-slate-50/70 shadow-none"
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">{role.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 text-sm leading-6 text-slate-600">
                        {role.description}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Separator />
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Frontend Stack
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {stackHighlights.map((item) => (
                      <Badge
                        key={item}
                        variant="outline"
                        className="rounded-full border-slate-300 bg-white px-3 py-1 text-slate-700"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
