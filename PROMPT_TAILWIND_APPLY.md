Prompt untuk mempertahankan penggunaan `@apply` di Tailwind
=========================================================

Tujuan
------
Simpan prompt ini ke dalam file agar bisa kamu jalankan sendiri atau kirim ke LLM/engineer. Prompt difokuskan pada opsi B: memperbarui `tailwind.config.js` sehingga kelas utilitas kustom (mis. `bg-background`, `text-foreground`, `border-border`) dihasilkan oleh Tailwind dan tetap bisa digunakan bersama `@apply`.

Prompt singkat
--------------
Periksa dan perbarui `tailwind.config.js` di repo `D:\PORTAL PONDOK\pesantren-hub-digital` agar men-map nama warna (background, foreground, border, input, primary, dsb.) ke CSS variables (`hsl(var(--...))`). Pastikan `content` paths benar dan sarankan safelist bila diperlukan. Berikan patch config dan langkah verifikasi build (PowerShell).

Prompt rinci (untuk LLM / engineer)
-----------------------------------
Context:
- Project root: D:\PORTAL PONDOK\pesantren-hub-digital
- Target CSS: `src/index.css` (mengandung `@apply bg-background text-foreground` dan beberapa `@apply` dengan arbitrary values)
- Goal: Pertahankan `@apply` untuk utilitas bernama dengan menambahkan/memodifikasi `tailwind.config.js` sehingga kelas tersebut dihasilkan.

Tugas (urutan eksekusi):
1. Buka `tailwind.config.js`. Pastikan `content`/`purge` paths mencakup `./src/**/*.{js,ts,jsx,tsx,css,html}`.
2. Tambahkan mapping warna di `theme.extend.colors` menggunakan `'hsl(var(--...))'` sehingga Tailwind membuat kelas seperti `bg-background`, `text-foreground`, `border-border`.
3. Identifikasi penggunaan kelas arbitrary (mis. `bg-[hsl(var(--verified))]`) karena Tailwind tidak mengizinkan `@apply` pada arbitrary value. Untuk kasus ini pilih salah satu:
   - Buat kelas CSS manual di `index.css` (background-color: hsl(var(--verified))) dan jangan pakai `@apply` pada arbitrary value; atau
   - Buat custom utilities via plugin `addUtilities` di `tailwind.config.js` (mis. `.bg-verified { background-color: hsl(var(--verified)); }`) sehingga `@apply bg-verified` aman.
   Rekomendasi: gunakan plugin utilities untuk konsistensi dan maintainability jika ada banyak status serupa.
4. (Opsional) Tambahkan `safelist` di `tailwind.config.js` untuk memastikan utility yang dipakai di CSS tidak di-purge oleh JIT/purge.
5. Jalankan build Tailwind dan capture error log. Jika muncul error `@apply` tunjukkan file dan baris serta berikan patch spesifik.
6. Commit perubahan dengan pesan yang menjelaskan mapping CSS variables ke Tailwind colors dan/atau penambahan utilities.

Contoh patch `tailwind.config.js` (snippet)
-------------------------------------------
```js
// tailwind.config.js (contoh)
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,css,html}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        // tambahkan sesuai variabel di src/index.css
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtils = {
        '.bg-verified': { 'background-color': 'hsl(var(--verified))' },
        '.text-verified-foreground': { color: 'hsl(var(--verified-foreground))' },
        '.bg-in-progress': { 'background-color': 'hsl(var(--in-progress))' },
        '.text-in-progress-foreground': { color: 'hsl(var(--in-progress-foreground))' },
        // tambahkan utilities lain sesuai kebutuhan
      }
      addUtilities(newUtils, { variants: ['responsive', 'hover', 'focus'] })
    }
  ],
}
```

PowerShell commands (copy-paste)
--------------------------------
- Cek versi Tailwind:
```powershell
Set-Location 'D:\PORTAL PONDOK\pesantren-hub-digital'
npx tailwindcss --version
```

- Build sekali (lihat error jika ada):
```powershell
npx tailwindcss -i ./src/index.css -o ./dist/tailwind.css
```

- Build dengan watch (debug interaktif):
```powershell
npx tailwindcss -i ./src/index.css -o ./dist/tailwind.css --watch
```

- Capture error log lengkap:
```powershell
npx tailwindcss -i ./src/index.css -o ./dist/tailwind.css 2> tailwind-build-error.log
Get-Content .\tailwind-build-error.log -Raw
```

Jika build error mengatakan “You can’t @apply an arbitrary value”, cari file & baris yang disebut di log, lalu ganti `@apply` tersebut dengan:
- salah satu utility baru (mis. `.bg-verified`) yang dibuat lewat plugin, atau
- deklarasi CSS langsung (background-color / color) di `index.css`.

Acceptance criteria
-------------------
1. `npx tailwindcss -i ./src/index.css -o ./dist/tailwind.css` selesai tanpa error terkait `@apply` atau class-not-found.
2. Kelas utilitas seperti `bg-background`, `text-foreground`, `border-border` dapat di-`@apply` di `index.css` dan memang dihasilkan oleh Tailwind.
3. Untuk nilai status yang awalnya arbitrary, ada solusi konsisten (plugin utilities atau CSS manual) sehingga tidak ada `@apply` pada arbitrary classes.
4. Visual smoke-test: app berjalan (`npm run dev`) dan badge/status/warna tampil sesuai desain.

Delivery & commit message
-------------------------
- Commit file patch `tailwind.config.js` dan (jika dibuat) file CSS utilities.
- Pesan commit: "chore(tailwind): map design-system CSS variables to tailwind colors + add custom utilities to support @apply"

Notes & edge-cases
------------------
- Pastikan `content` mencakup semua extension yang dipakai (.tsx, .mdx, dsb.) agar JIT tidak menghapus utilitas.
- Jika tim memutuskan untuk terus pakai arbitrary classes di markup (bukan di CSS), tidak perlu perubahan — namun `@apply` tetap tidak akan bekerja pada arbitrary values.
- Jika proyek menggunakan framework (Next/Vite), sesuaikan perintah build dan content paths.

Usage
-----
File ini disimpan agar bisa kamu jalankan sendiri. Jika kamu mau, saya bisa juga:
- Membuat patch otomatis dan menjalankan verifikasi build; atau
- Hanya menyimpan prompt ini (sesuai permintaanmu saat ini).

---
File disimpan oleh asisten di: `d:\PORTAL PONDOK\pesantren-hub-digital\PROMPT_TAILWIND_APPLY.md`
