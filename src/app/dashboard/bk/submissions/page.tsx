import { StaffPlaceholderPage } from "@/components/dashboard/staff/staff-placeholder-page";

export default function BKSubmissionsPage() {
  return (
    <StaffPlaceholderPage
      expectedRole="bk"
      title="BK Submission Dashboard"
      subtitle="Monitoring pengajuan izin dan sakit yang perlu diketahui BK."
      description="Section pengajuan BK akan membantu monitoring lintas kelas untuk izin dan sakit yang memerlukan perhatian tambahan."
    />
  );
}
