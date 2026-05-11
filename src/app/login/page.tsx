import { LoginForm } from "@/components/forms/login-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { roleSummaries } from "@/lib/constants/site";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7fafc_0%,#eef6ff_46%,#f3eee2_100%)] px-6 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-white/60 bg-white/80 shadow-xl shadow-slate-200/60 backdrop-blur">
          <CardHeader className="space-y-4">
            <Badge className="w-fit rounded-full bg-sky-100 px-4 py-1 text-sky-800 hover:bg-sky-100">
              Login Portal
            </Badge>
            <div className="space-y-2">
              <CardTitle className="font-heading text-3xl text-slate-950">
                Masuk ke Absensi CN
              </CardTitle>
              <p className="max-w-md text-sm leading-6 text-slate-600">
                Frontend sudah disiapkan untuk autentikasi berbasis role dan
                terhubung ke backend API Golang melalui service layer.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {roleSummaries.map((role) => (
            <Card
              key={role.title}
              className="border-white/60 bg-white/70 shadow-sm backdrop-blur"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{role.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-slate-600">
                {role.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
