import { StaffPlaceholderPage } from "@/components/dashboard/staff/staff-placeholder-page";

export default function BKStudentsPage() {
  return (
    <StaffPlaceholderPage
      expectedRole="bk"
      title="BK Students Dashboard"
      subtitle="Ringkasan siswa lintas kelas untuk monitoring dan pembinaan."
      description="Section siswa BK akan menampilkan daftar siswa prioritas, histori singkat absensi, dan akses ke detail pembinaan."
    />
  );
}
