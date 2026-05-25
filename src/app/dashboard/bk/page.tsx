import { StaffPlaceholderPage } from "@/components/dashboard/staff/staff-placeholder-page";

export default function CounselingDashboardPage() {
  return (
    <StaffPlaceholderPage
      expectedRole="bk"
      title="BK Dashboard"
      subtitle="Monitoring lintas kelas untuk keterlambatan, alfa, dan tindak lanjut konseling."
      description="Dashboard BK akan menjadi pusat monitoring siswa, ringkasan absensi lintas kelas, dan catatan pembinaan."
    />
  );
}
