import { StaffPlaceholderPage } from "@/components/dashboard/staff/staff-placeholder-page";

export default function BKCounselingPage() {
  return (
    <StaffPlaceholderPage
      expectedRole="bk"
      title="Counseling Dashboard"
      subtitle="Ruang kerja untuk catatan pembinaan, tindak lanjut, dan histori konseling."
      description="Section konseling akan memusatkan catatan BK, histori pembinaan, dan tindak lanjut per siswa."
    />
  );
}
