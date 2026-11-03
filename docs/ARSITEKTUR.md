# Arsitektur — Portofolio Farrel Muhammad Zaki

> Menjawab: **dengan apa dan dalam bentuk apa sistem dibangun.**
> Keputusan di sini mengikat. Perubahan besar butuh persetujuan pengguna (lihat `AGENTS.md` bagian 6).

Status: **disepakati (v2: konten JSON + desain ulang)** · Diperbarui 2026-11-03

## 1. Stack

| Lapisan | Pilihan | Versi | Alasan |
| --- | --- | --- | --- |
| Frontend | React | 19.3.1 | Komponen dan state sederhana |
| Build tool | Vite + `@vitejs/plugin-react` | 8.3.5 / 6.2.1 | Dev server cepat, build statis ke `dist/` |
| Animasi | GSAP (ScrollTrigger) | 3.15.0 | Animasi terikat scroll, pin, scrub |
| Smooth scroll | Lenis | 1.3.27 | Scroll halus, disinkronkan ke ticker GSAP |
| Validasi konten | zod | 4.6.7 | Skema `content/*.json`, dijalankan sebelum build |
| Font | Archivo (variabel, `wdth`), Manrope, IBM Plex Mono (fontsource) | 5.3.x | Di-bundle, tanpa request ke Google Fonts |
| Test / lint | Vitest / ESLint | 5.1.0 / 10.14.0 | |
| Hosting | Vercel, deploy otomatis dari `farrelzaki/portofolio` branch `main` | — | https://portofolio-omega-one-97.vercel.app/ |
| Backend / DB | Tidak ada | — | Situs statis; konten di file JSON (lihat `RENCANA_ADMIN.md`) |

**Sengaja tidak dipakai:** Tailwind, router, library komponen, Supabase (diganti admin lokal berbasis Git).

## 2. Gambaran Sistem

```
content/*.json + public/media/*  ──(npm run build: test skema → vite build)──>  dist/  ──>  Vercel
        ▲
        └── (nanti) admin lokal: npm run admin → tulis file → git commit + push
```

## 3. Struktur Kode

```
content/              ISI PORTOFOLIO (diubah lewat admin nanti, bukan lewat kode)
  settings.json       identitas, kontak, tautan, teks hero, judul tiap section, CTA
  projects.json       projek (cover, galeri, kategori, deskripsi, peran, tag, tautan)
  services.json       kartu keahlian (+ projek terkait)
  stack.json          daftar teknologi (marquee, tornado, stiker)
  experiences.json    pendidikan dan pengalaman (bulan mulai/selesai)
  achievements.json   prestasi dan sertifikat (highlight = kartu sorotan di mosaik)
public/media/         gambar dan file yang dirujuk konten (/media/...)
src/
  main.jsx            mount React, impor font dan CSS
  App.jsx             susunan halaman, bahasa, panel projek
  i18n.js             teks antarmuka tetap (label tombol, navigasi) ID/EN
  content/
    index.js          memuat JSON, menyaring published, helper t(), formatPeriod(), splitAccent()
    schema.js         skema zod untuk semua file konten
    content.test.js   validasi konten + test helper
  lib/motion.js       registrasi GSAP/ScrollTrigger, Lenis, useMedia, prefersReduced, scrollToTarget
  components/
    Chrome.jsx        elemen tetap: logo, CTA atas, MENU + panel, dock, progres, jam, CTA melayang
    Cursor.jsx        kursor kustom + label dari atribut data-cursor
    TwoTone.jsx       judul dua warna dengan animasi per kata
    ProjectPanel.jsx  panel detail projek dari kanan
  sections/           Hero, Showreel, Work, Ring, Services, Achievements, Stack, Journey, Contact
  styles.css          token (:root) dan seluruh styling
```

Aturan batas:

- Semua isi portofolio ada di `content/*.json`; komponen tidak boleh menulis teks isi secara langsung.
- Setiap file konten wajib punya skema di `src/content/schema.js` (dicek oleh test).
- Section memberi `data-theme="light" | "dark"` agar elemen tetap menyesuaikan warna.
- Animasi dibuat di `useEffect` dengan `gsap.context()` dan dibersihkan (`revert`) saat unmount.

## 4. Kontrak Data

Bentuk lengkap ada di `src/content/schema.js` (sumber kebenaran). Ringkasan:

- Teks dua bahasa: `{ "id": "...", "en": "..." }`; EN kosong → memakai ID.
- Media: string `/media/...` atau `""`.
- Item daftar: `id` (slug), `published` (boolean); urutan = urutan array.

## 5. Konvensi

| Hal | Konvensi |
| --- | --- |
| Penamaan | camelCase (JS/JSON), kebab-case (kelas CSS) |
| Penyimpanan browser | Hanya `localStorage.lang`, dibungkus try/catch |
| Animasi | Hanya `transform`, `opacity`, `clip-path`; efek hover di dalam `@media (hover: hover) and (pointer: fine)` |
| Reduced motion | Lenis dan semua animasi scroll dimatikan; tata letak tetap utuh |
| Bahasa | Indonesia (default), Inggris |

## 6. Strategi Test

- `npm test`: validasi semua file konten (skema, id unik, file media ada, rujukan projek valid) + helper.
- `prebuild` menjalankan test konten, jadi konten rusak menggagalkan build dan situs lama tetap tayang di Vercel.
- Cek visual manual di 1440, 768, dan 390 px (tanpa error konsol dan tanpa scroll horizontal).

## 7. Keputusan Terbuka

| Kode | Pertanyaan | Pemilik |
| --- | --- | --- |
| TBD-03 | Domain sendiri | Farrel |

## 8. Risiko Teknis

| Risiko | Mitigasi |
| --- | --- |
| Bundle JS ± 130 KB gzip (GSAP + Lenis + React) | Masih wajar; pantau saat menambah library |
| Animasi berat di ponsel lama | Efek berat dimatikan/disederhanakan di < 900 px dan untuk reduced motion |
| Gambar besar | Kompres ≤ 1600 px sebelum masuk `public/media/` |
