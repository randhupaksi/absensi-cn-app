<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

<!-- BEGIN:design-system-rules -->
# Design System Rules — Baca Sebelum Menyentuh UI

## Prinsip Utama

Desain Absensi CN adalah **premium, enterprise, profesional, dan konsisten**.
Setiap komponen baru harus terasa seperti bagian dari sistem yang sama — bukan ditempel dari luar.
Kalau ragu antara "fungsi saja" vs "fungsi + detail visual yang tepat": pilih keduanya.

---

## Aturan Wajib

### 1. Jangan Hardcode Warna

**Salah:**
```tsx
<div className="bg-[#10b981] text-[#102a24]">
```

**Benar:**
```tsx
<div className="bg-emerald-500 text-emerald-950">
// atau untuk brand colors:
<div className="bg-primary text-primary-foreground">
```

Semua token ada di `src/app/globals.css` sebagai CSS variables.
Tailwind v4 di proyek ini membaca CSS variables secara langsung — tidak ada `tailwind.config.js` terpisah.

### 2. Tailwind v4 — Perhatikan Perbedaan

- Config ada di `src/app/globals.css` dengan `@theme { ... }`, bukan `tailwind.config.js`
- `@apply` masih bisa dipakai tapi hindari kecuali perlu
- Custom utilities dengan `@utility { ... }`
- Arbitrary values tetap bisa: `text-[15px]`, `gap-[18px]`
- Baca `node_modules/next/dist/docs/` untuk panduan terbaru sebelum nulis kode baru

### 3. Border Radius — Pakai Token, Bukan Angka

| Token Class | Value | Gunakan Untuk |
|---|---|---|
| `rounded-[var(--radius-sm)]` | 0.72rem | Input kecil, badge |
| `rounded-[var(--radius-md)]` | 0.96rem | Button, chip |
| `rounded-[var(--radius)]` | 1.2rem | Card, modal content |
| `rounded-[var(--radius-xl)]` | 1.68rem | Section container |
| `rounded-[var(--radius-2xl)]` | 2.16rem | Hero card, large panel |
| `rounded-full` | 999px | Pill badge, avatar, icon button |

### 4. Typography — Ikuti Hierarki

```tsx
// Page title (h1)
<h1 className="font-bold text-2xl tracking-tight text-foreground">

// Section heading (h2)
<h2 className="font-semibold text-xl text-foreground">

// Card title
<h3 className="font-semibold text-base text-foreground">

// Label / caption
<span className="font-medium text-sm text-muted-foreground">

// Body text
<p className="text-sm text-foreground/80">

// Helper text
<p className="text-xs text-muted-foreground">
```

Heading font (Space Grotesk): apply via `font-[family-name:var(--font-space-grotesk)]`
Body font default (Plus Jakarta Sans): sudah di-set di root.

### 5. Spacing — Konsisten

- Padding halaman: `p-4 md:p-5 lg:p-6`
- Gap antar card dalam grid: `gap-4` atau `gap-5`
- Jarak antar section: `space-y-6` atau `mb-6`
- Padding dalam card: `p-5` atau `p-6`
- Padding dalam form field group: `space-y-4`

### 6. Shadow System

```
Shadow ringan (card hover):   shadow-sm
Shadow standar (card):        shadow-md atau shadow: 0 8px 24px rgba(0,0,0,0.06)
Shadow medium (modal):        shadow-xl
Shadow berat (floating):      shadow-2xl
```

Jangan pakai `shadow-none` pada card yang interaktif — selalu ada sedikit depth.

### 7. Icon Sizes — Konsisten

| Context | Class | Size |
|---|---|---|
| Dalam teks/label | `size-3.5` | 14px |
| Button/input icon | `size-4` | 16px |
| Card icon kecil | `size-5` | 20px |
| Card icon besar | `size-6` | 24px |
| Hero icon | `size-8` atau `size-10` | 32–40px |

Selalu set via `size-*` (bukan `w-* h-*` terpisah).

---

## Komponen — Pakai Yang Sudah Ada

**Jangan buat komponen baru** kalau yang sudah ada bisa dipakai atau di-extend.

| Kebutuhan | Komponen |
|---|---|
| Form input dengan ikon | `PremiumInput` dari `src/components/auth/premium-input.tsx` |
| Input biasa | `Input` dari `src/components/ui/input.tsx` |
| Button | `Button` dari `src/components/ui/button.tsx` |
| Modal form kompleks | `PremiumModal` dari `src/components/modals/premium-modal.tsx` |
| Konfirmasi hapus | `DeleteConfirmationModal` dari `src/components/modals/delete-confirmation-modal.tsx` |
| Tabel data | `AppDataTable` dari `src/components/data-table/` |
| Badge status absensi | Komponen dari `src/components/attendance/` |
| KPI card | `StatCard` / `KpiCard` dari `src/components/dashboard/shared/` |
| Toast notifikasi | `toast` dari `sonner` |
| Select dropdown | `RadixSelect` dari `src/components/ui/radix-select.tsx` |
| Skeleton loading | `Skeleton` dari `src/components/ui/skeleton.tsx` |

---

## Motion / Animasi

Gunakan **Motion v12** (`import { motion } from "motion/react"`).
Ini bukan Framer Motion v10 — periksa changelog di `node_modules/motion/` sebelum pakai API baru.

### Pattern Entrance Wajib

```tsx
import { motion } from "motion/react"
import { useReducedMotion } from "motion/react"

function MyComponent() {
  const shouldReduce = useReducedMotion()
  
  return (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      ...
    </motion.div>
  )
}
```

### Pattern Spring (Interaksi Langsung)

```tsx
transition={{ type: "spring", stiffness: 220, damping: 24, mass: 0.9 }}
```

### Pattern Stagger List

```tsx
// Wrapper
<motion.ul initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }}>
// Items
<motion.li variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
```

### Jangan Animasi:
- Loading skeleton (gunakan CSS `animate-pulse`)
- Row tabel yang sering update
- Komponen yang di-render > 20 kali sekaligus
- Apapun jika `useReducedMotion()` return true

---

## Form Pattern

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"  // Zod v4 — API beda dari v3!

const schema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
})

function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  })
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nama</Label>
          <Input id="name" {...form.register("name")} />
          <FieldError message={form.formState.errors.name?.message} />
        </div>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  )
}
```

**Zod v4 perubahan penting:**
- `z.string().nonempty()` → `z.string().min(1)`
- Error messages diset di masing-masing method, bukan di `{ message: "..." }`
- Baca `node_modules/zod/` untuk API terbaru

---

## Modal Pattern — Key Prop

Setiap modal edit yang menggunakan ID sebagai key **harus punya fallback unik**:

```tsx
// SALAH — multiple modal dengan key "closed" = React warning
<EditModalA key={itemA?.id ?? "closed"} />
<EditModalB key={itemB?.id ?? "closed"} />

// BENAR — fallback unik per modal
<EditModalA key={itemA?.id ?? "modal-a-closed"} />
<EditModalB key={itemB?.id ?? "modal-b-closed"} />
```

---

## Dark Mode

Dark mode berjalan via `.dark` selector di CSS variables — **jangan pakai `dark:` prefix** kecuali ada kasus khusus.
Kalau komponen hanya pakai `bg-background`, `text-foreground`, `bg-card`, dll — dark mode otomatis berfungsi.

Landing page belum punya dark mode — jangan tambahkan dark mode ke landing page kecuali diminta.

---

## Data Fetching — TanStack Query v5

```tsx
import { useQuery, useMutation } from "@tanstack/react-query"

// Query
const { data, isLoading, error } = useQuery({
  queryKey: ["students"],
  queryFn: () => studentService.getAll(),
})

// Mutation dengan toast
const mutation = useMutation({
  mutationFn: studentService.create,
  onSuccess: () => {
    toast.success("Siswa berhasil ditambahkan")
    queryClient.invalidateQueries({ queryKey: ["students"] })
  },
  onError: () => toast.error("Gagal menambahkan siswa"),
})
```

**TanStack Query v5 perubahan penting:**
- `onSuccess`/`onError` di `useQuery` sudah deprecated — pakai di `useMutation` atau `useEffect`
- `cacheTime` → `gcTime`
- Baca `node_modules/@tanstack/react-query/` untuk API terbaru

---

## Quality Standards — Checklist Sebelum Selesai

Setiap perubahan UI wajib lolos checklist ini:

**Visual:**
- [ ] Tidak ada hardcoded color hex atau rgb
- [ ] Border radius pakai token, bukan angka arbitrary
- [ ] Icon size konsisten dengan context (`size-4` untuk button icon)
- [ ] Shadow ada pada card yang perlu depth
- [ ] Hover state ada pada elemen interaktif
- [ ] Focus state ada untuk keyboard navigation (`focus-visible:ring-2`)

**Fungsional:**
- [ ] Loading state di semua async action (button disabled + spinner)
- [ ] Empty state di semua list/table
- [ ] Error handling dengan toast atau inline error
- [ ] Form validation dengan Zod schema
- [ ] Destructive action punya confirmation modal

**Konsistensi:**
- [ ] Key prop unik, tidak ada duplikat `"closed"` dalam satu parent
- [ ] Status absensi pakai komponen badge yang sudah ada
- [ ] Typography mengikuti hierarki weight (bold/semibold/medium/normal)
- [ ] Spacing mengikuti skala yang ada (4, 5, 6 untuk padding/gap besar)

**Accessibility:**
- [ ] `useReducedMotion()` di-check sebelum animasi berat
- [ ] Label ada di setiap form input (`htmlFor` matching `id`)
- [ ] Tombol icon punya `aria-label` atau `Tooltip`
- [ ] Contrast ratio cukup (text minimal 4.5:1 pada background)
<!-- END:design-system-rules -->
