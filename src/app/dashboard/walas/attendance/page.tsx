import { StaffPlaceholderPage } from "@/components/dashboard/staff/staff-placeholder-page";

export default function HomeroomAttendancePage() {
  return (
    <StaffPlaceholderPage
      expectedRole="walas"
      title="Class Attendance Dashboard"
      subtitle="Rekap absensi harian kelas walas dengan filter tanggal dan status."
      description="Section absensi kelas akan memusatkan monitoring hadir, telat, izin, sakit, dan alfa untuk satu rombel walas."
    />
  );
}
