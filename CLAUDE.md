@AGENTS.md

# Absensi CN — Design System & Project Intelligence

## Konteks Proyek

Absensi CN adalah platform manajemen kehadiran digital untuk sekolah menengah kejuruan (SMK).
Sistem ini multi-role: **Admin**, **Wali Kelas (Walas)**, **BK (Bimbingan Konseling)**, dan **Siswa**.
Siswa absen mandiri lewat foto; Walas/BK memantau dan mereview; Admin mengelola data master.

**Arah desain:** Premium · Enterprise · Profesional · Konsisten.
Setiap perubahan UI harus mempertahankan nuansa ini — bukan sekadar fungsional, tapi terasa *polished*.

---

## Stack Teknologi Kritis

| Layer | Library | Versi | Catatan |
|---|---|---|---|
| Framework | Next.js | 16.x | App Router, lihat AGENTS.md |
| Styling | Tailwind CSS | v4 | PostCSS config, bukan tailwind.config.js |
| UI Primitives | @base-ui/react + shadcn | latest | Button wajib dari base-ui |
| Animation | Motion (Framer) | v12 | API mungkin berbeda dari training data |
| Forms | react-hook-form + zod | v7 + v4 | Zod v4 API berbeda dari v3 |
| State | TanStack Query | v5 | |
| Tables | TanStack Table | v8 | |
| Charts | Recharts | v3 | |
| Toasts | Sonner | v2 | |
| Icons | Lucide React | v1 | |

---

## Design Tokens (Sumber Kebenaran)

Semua token ada di `src/app/globals.css`. **Jangan hardcode warna atau radius.**

### Color System (OKLCH)

```css
/* Light */
--background:           oklch(0.985 0.01 235)   /* near-white */
--foreground:           oklch(0.24 0.04 245)    /* dark text */
--primary:              oklch(0.49 0.15 243)    /* blue-teal */
--primary-foreground:   oklch(0.99 0.01 240)
--accent:               oklch(0.93 0.04 92)     /* green accent */
--accent-foreground:    oklch(0.33 0.04 82)
--muted:                oklch(0.96 0.01 228)
--muted-foreground:     oklch(0.56 0.03 228)
--card:                 oklch(0.99 0.005 240)
--border:               oklch(0.91 0.02 228)
--destructive:          oklch(0.61 0.21 27)

/* Dark mode — semua di-override via .dark selector */
```

### Border Radius Tokens

```css
--radius:     1.2rem   /* base */
--radius-sm:  0.72rem
--radius-md:  0.96rem
--radius-lg:  1.2rem
--radius-xl:  1.68rem
--radius-2xl: 2.16rem
```

Gunakan `rounded-[var(--radius)]`, bukan angka arbitrary.
Kecuali pill: `rounded-full` untuk tag, badge kecil, icon button.

### Typography

Font diset di `src/app/layout.tsx`:
- **Body/UI:** `Plus Jakarta Sans` → `--font-plus-jakarta-sans`
- **Heading/Mono:** `Space Grotesk` → `--font-space-grotesk`

Hierarki weight:
- `font-bold (700)` — page title utama
- `font-semibold (600)` — card title, section heading
- `font-medium (500)` — label, button, caption
- `font-normal (400)` — body, description

---

## Status Attendance — Color Coding (Jangan Ubah)

Sistem warna status ini dipakai di seluruh aplikasi dan harus konsisten:

| Status | Background | Text | Makna |
|---|---|---|---|
| `hadir` | `emerald-100` | `emerald-800` | Hadir tepat waktu |
| `telat` | `amber-100` | `amber-800` | Terlambat |
| `izin` | `sky-100` | `sky-800` | Izin resmi |
| `sakit` | `violet-100` | `violet-800` | Sakit |
| `alfa` | `rose-100` | `rose-800` | Alpha/bolos |

Selalu gunakan `AttendanceStatusBadge` untuk render status ini, jangan buat ulang.

---

## Pola Komponen Wajib

### Forms

- Gunakan `react-hook-form` + `zod` schema. Selalu pakai `@hookform/resolvers/zod`.
- Input field: gunakan `PremiumInput` untuk form dengan ikon, atau `<Input>` dari `src/components/ui/input.tsx`.
- Error display: gunakan `<FieldError>` dari `src/components/ui/field-error.tsx`.
- Submit button: state loading wajib, teks berubah, ada spinner.

### Modals

- Modal besar (form kompleks): gunakan `PremiumModal` dari `src/components/modals/premium-modal.tsx`.
- Konfirmasi hapus: gunakan `DeleteConfirmationModal`.
- Dialog kecil: gunakan `<Dialog>` dari `src/components/ui/dialog.tsx`.
- Key prop: **selalu unik**. Pola: `key={item?.id ?? "nama-modal-closed"}` — bukan generic `"closed"`.

### Tables

- Selalu pakai `AppDataTable` dari `src/components/data-table/`.
- Kolom action: icon button (edit, delete, view) dengan `Tooltip`.
- Empty state: pakai komponen `EmptyState`.
- Pagination terintegrasi di `AppDataTable`.

### Cards

- KPI/stat: pakai `KpiCard` atau `StatCard` dari `src/components/dashboard/shared/`.
- Card biasa: pakai `<Card>` dengan `<CardHeader>/<CardContent>/<CardFooter>`.
- Hover elevation: `hover:-translate-y-0.5 transition-transform` untuk card interaktif.

### Buttons

- Komponen: `<Button>` dari `src/components/ui/button.tsx` (base-ui wrapper dengan CVA).
- Variants: `default` · `outline` · `secondary` · `ghost` · `destructive` · `link`
- Sizes: `default` · `xs` · `sm` · `lg` · `icon` · `icon-xs` · `icon-sm` · `icon-lg`
- CTA utama halaman: `default` (primary color) atau custom gradient emerald.
- Destructive action: variant `destructive`, selalu ada konfirmasi modal.

---

## Animasi & Motion

Framework: **Motion v12** (bukan framer-motion v10). API mungkin beda.

### Prinsip

1. **Meaningful** — animasi harus punya tujuan (feedback, orientasi, delight), bukan dekorasi.
2. **Fast** — duration 200–500ms. Lebih dari 600ms terasa lambat.
3. **Spring** — gunakan spring physics untuk interaksi langsung (`type: "spring", stiffness: 220, damping: 24`).
4. **Ease-out** — gunakan `ease: "easeOut"` untuk entrance, `ease: "easeIn"` untuk exit.
5. **Reduced motion** — selalu check `useReducedMotion()` dan skip animasi jika true.

### Entrance Pattern Standar

```tsx
initial={{ opacity: 0, y: 16 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.35, ease: "easeOut" }}
```

### Stagger List Pattern

```tsx
// Parent
transition={{ staggerChildren: 0.06 }}

// Child
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
```

### Jangan gunakan animasi untuk:
- Loading skeleton (cukup `animate-pulse`)
- State perubahan data yang tidak disadari user
- Elemen yang sering re-render (list item dalam tabel besar)

---

## Layout & Struktur Halaman

### Dashboard Staff (Admin/Walas/BK)

```
StaffShell
├── Sidebar (272px, gradient #1f7a65→#154f44)
│   └── NavItem: rounded-[22px], active bg-white/16
└── Main Area
    ├── TopBar (mobile: hamburger menu)
    └── Content: p-4 md:p-5, space-y-5
```

### Dashboard Siswa

```
StudentShell
├── Top Navigation
└── Content Area (centered, max-w-*)
```

### Spacing Hierarchy

- Antar section besar: `space-y-6` atau `gap-6`
- Antar card dalam grid: `gap-4` atau `gap-5`
- Padding konten dalam card: `p-5` atau `p-6`
- Padding form field: `space-y-4`

---

## Konvensi Kode

- Semua komponen dalam `src/components/` adalah **Client Components** kecuali ada `async` atau eksplisit server.
- Data fetching via TanStack Query (`useQuery`, `useMutation`) — jangan fetch langsung di komponen.
- Services ada di `src/services/` — tambahkan fungsi baru di sana.
- Types ada di `src/types/` — selalu buat interface/type untuk data baru.
- Validasi Zod ada di `src/lib/validations/` — pisahkan schema dari komponen.
- Utility: `cn()` dari `src/lib/utils.ts` untuk conditional classNames.

---

## Checklist Kualitas UI (Setiap Perubahan)

Sebelum menganggap selesai, verifikasi:

- [ ] Tidak ada hardcoded color (hex/rgb) — gunakan Tailwind class atau CSS var
- [ ] Semua key prop unik, tidak ada duplikat `"closed"` atau generic string
- [ ] Loading state ada di setiap aksi async
- [ ] Empty state ada di setiap list/table
- [ ] Error handling dengan toast (sonner) atau inline error
- [ ] Button destructive punya confirmation modal
- [ ] Form punya validasi Zod dan error display
- [ ] Responsive: test di mobile (< 768px), tablet (768–1024px), desktop
- [ ] Dark mode tidak rusak (gunakan CSS var, bukan hardcode)
- [ ] Animasi memiliki `useReducedMotion()` check jika motion-heavy
- [ ] Status attendance selalu pakai `AttendanceStatusBadge`
- [ ] Icon sizes konsisten: `size-4` (16px) default, `size-5` (20px) medium

---

## Area yang Perlu Konsistensi (Known Issues)

Ini adalah inkonsistensi yang sudah teridentifikasi. Saat mengerjakan fitur di area ini, sekalian perbaiki:

1. **Sidebar gradient** — masih hardcoded hex, idealnya pindah ke CSS var `--sidebar-*`
2. **Landing page colors** — masih hex biasa, belum pakai OKLCH tokens seperti dashboard
3. **Button rounded corners** — beberapa `rounded-full`, beberapa `rounded-[var(--radius)]`, perlu distandarisasi ke `rounded-[var(--radius)]` untuk button normal
4. **Modal max-width** — belum ada token, gunakan `sm: max-w-sm`, `md: max-w-md`, `lg: max-w-2xl`, `xl: max-w-4xl`
5. **Input focus ring** — standardkan ke `focus-visible:ring-2 focus-visible:ring-primary/30`

---

## Referensi Cepat File Penting

| Kebutuhan | File |
|---|---|
| Design tokens | `src/app/globals.css` |
| Button component | `src/components/ui/button.tsx` |
| Input premium | `src/components/auth/premium-input.tsx` |
| Modal besar | `src/components/modals/premium-modal.tsx` |
| Data table | `src/components/data-table/` |
| Status badge | `src/components/attendance/` |
| Dashboard KPI card | `src/components/dashboard/shared/stat-card.tsx` |
| Staff layout | `src/components/dashboard/staff/` |
| Auth types | `src/types/auth.ts` |
| API services | `src/services/` |
| Form schemas | `src/lib/validations/` |
| Utility cn() | `src/lib/utils.ts` |
