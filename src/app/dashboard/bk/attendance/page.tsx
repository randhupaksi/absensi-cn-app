import { StaffPlaceholderPage } from "@/components/dashboard/staff/staff-placeholder-page";

export default function BKAttendancePage() {
  return (
    <StaffPlaceholderPage
      expectedRole="bk"
      title="BK Attendance Dashboard"
      subtitle="Monitoring absensi lintas kelas dengan fokus telat dan alfa berulang."
      description="Section absensi BK akan menjadi pusat pantau siswa telat, alfa, dan tren kehadiran yang perlu ditindaklanjuti."
    />
  );
}
