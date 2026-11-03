# Rencana — Portofolio Dengan Admin Lokal (Git-Based)

Status: **disetujui (Fase 0–5, 2026-11-03); Fase 1B menunggu persetujuan** · Diperbarui: 2026-11-03 · Task: `T-08` di `TASK.md`

Setelah disetujui, keputusan final dipindahkan ke `docs/PRD.md` dan `docs/ARSITEKTUR.md`, dan file ini
dipakai sebagai urutan kerja (checklist fase).

## 1. Ringkasan

Situs publik yang ada sekarang (desain, animasi, dua bahasa) **dipertahankan** dan tetap **statis**.
Isinya dipindah dari `src/data.js` ke file JSON di folder `content/`, dan gambar ke `public/media/`.

Panel admin **hanya berjalan di laptop Farrel** (`npm run admin`) dan tidak pernah ikut di-deploy. Admin
mengubah file JSON dan gambar, lalu tombol **Publikasikan** menjalankan `git commit` + `git push`.
Hosting yang tersambung ke GitHub otomatis membangun ulang situs, dan sekitar 1–2 menit kemudian
portofolio online sudah berubah.

Keputusan pengguna (2026-11-03): admin lokal berbasis Git (cara B) · tanpa database · frontend publik
dipertahankan · dua bahasa ID/EN · semua bagian bisa diubah · identitas commit `farrelmzaki77@gmail.com`.

## 2. Arsitektur

```
LAPTOP FARREL (npm run admin)                         INTERNET
┌─────────────────────────────────────────┐
│ Vite dev server — hanya localhost       │
│  ├─ /admin.html   UI admin (React)      │
│  ├─ /             pratinjau situs (HMR) │
│  └─ /__admin/*    API lokal (plugin):   │
│       baca/tulis content/*.json         │
│       simpan/hapus public/media/*       │
│       git status · commit · push ───────┼──> GitHub ──> Vercel/Netlify ──> situs statis
└─────────────────────────────────────────┘     (repo)    (build otomatis)   (pengunjung)
```

- **Situs publik** membaca JSON saat build, jadi hasilnya HTML/JS/CSS statis tanpa request ke server mana pun.
- **Admin** adalah entry Vite terpisah (`admin.html`). Konfigurasi build hanya memasukkan `index.html`,
  sehingga kode admin dan API lokal tidak pernah ada di `dist/`.
- **API lokal** berupa plugin Vite (`configureServer`) yang aktif hanya pada `vite --mode admin`, dengan
  server yang hanya mendengar `localhost`.
- **Satu skema untuk semua**: skema `zod` di `src/content/schema.js` dipakai oleh form admin, API lokal
  sebelum menulis file, dan test yang dijalankan saat build. JSON yang rusak tidak bisa tersimpan dan tidak
  bisa ter-deploy.

### Struktur file konten

```
content/
  settings.json      identitas, kontak, tautan sosial, foto, CV, teks hero dan kontak, meta deskripsi
  stats.json         tiga angka di hero
  projects.json      daftar projek
  services.json      kartu keahlian
  stack.json         band tech stack
  experiences.json   pendidikan dan pengalaman
  achievements.json  prestasi dan sertifikat
public/media/
  projects/  achievements/  profile/  cv/
```

Teks dua bahasa berbentuk `{ "id": "...", "en": "..." }`; jika `en` kosong, situs memakai `id`.
Setiap item daftar punya `id` (slug), `published` (true/false), dan urutan mengikuti urutan di array.

| File | Isi item |
| --- | --- |
| `projects.json` | `id`, `name`, `category`, `description`, `role`, `tags[]`, `cover`, `coverAlt`, `demoUrl`, `repoUrl`, `published` |
| `services.json` | `id`, `title`, `description`, `tags[]`, `published` |
| `experiences.json` | `id`, `title`, `organization`, `description`, `start` (YYYY-MM), `end` (YYYY-MM atau kosong = sekarang), `published` |
| `achievements.json` | `id`, `title`, `issuer`, `description`, `image`, `date`, `published` |

`role` di projek adalah kolom baru untuk melengkapi peran yang belum tercatat (OQ-03). Cover ilustrasi
SVG buatan kode tetap dipakai selama `cover` kosong (dicocokkan lewat `id`); begitu screenshot asli
diunggah, gambar itu yang tampil.

### API lokal (hanya saat `npm run admin`)

| Endpoint | Fungsi |
| --- | --- |
| `GET /__admin/content/:file` | Baca satu file konten |
| `PUT /__admin/content/:file` | Validasi dengan zod, lalu tulis file (format rapi, 2 spasi) |
| `POST /__admin/media/:folder` | Simpan gambar/PDF (gambar sudah dikompres di browser), nama file aman dan unik |
| `DELETE /__admin/media/:path` | Hapus file media yang tidak dipakai lagi |
| `GET /__admin/git/status` | Daftar perubahan yang belum dipublikasikan |
| `POST /__admin/publish` | `git add content public/media` → commit → `git pull --rebase` → `git push` |
| `POST /__admin/discard` | Batalkan perubahan yang belum dipublikasikan (dengan konfirmasi) |

Pengaman: nama `:file` dan `:folder` dari daftar putih (tanpa `../`); jenis dan ukuran file dibatasi
(JPG/PNG/WebP ≤ 2 MB, PDF ≤ 5 MB); git hanya menyentuh `content/` dan `public/media/`; tidak pernah
`--force`.

### Stack tambahan (versi dicek di npm 2026-11-03, dicek ulang saat instal)

| Paket | Versi | Untuk |
| --- | --- | --- |
| `zod` | 4.6.7 | Skema konten bersama |
| `react-hook-form` | 7.91.0 | Form admin |
| `browser-image-compression` | 2.0.2 | Kompres gambar sebelum disimpan |
| `@dnd-kit/sortable` | 10.0.0 | Urutkan dengan drag (bisa diganti tombol naik/turun) |
| `vitest` + `@testing-library/react` | 5.1.0 / 16.3.3 | Test |
| `gsap` + `@gsap/react` | 3.15.0 / 2.1.2 | ScrollTrigger, Flip, SplitText (Fase 1B) |
| `lenis` | 1.3.27 | Smooth scroll (Fase 1B) |
| `@fontsource-variable/archivo`, `@fontsource/ibm-plex-mono` | 5.3.0 | Font display dan label (Fase 1B) |
| `matter-js` | 0.20.0 | Fisika stiker di footer (opsional, Fase 1B) |
| `eslint` | 10.14.0 | Lint |

Tidak perlu router, React Query, Supabase, atau server terpisah. Git memakai Git yang sudah terpasang di
laptop beserta login GitHub-nya (Git Credential Manager).

## 3. Panel Admin

| Halaman | Isi |
| --- | --- |
| Beranda | Ringkasan isi, jumlah perubahan belum dipublikasikan, tombol **Publikasikan** dan **Lihat pratinjau** |
| Profil | Identitas, email, WhatsApp, tautan sosial, foto, unggah CV (PDF) |
| Halaman | Teks hero, tiga angka, teks kontak, meta deskripsi |
| Projek | Daftar + form: cover, kategori, deskripsi, peran, tag, tautan demo/repo |
| Prestasi | Daftar + form, unggah sertifikat |
| Pengalaman | Daftar + form dengan bulan mulai/selesai |
| Keahlian | Kartu keahlian dan daftar tech stack |

Perilaku di semua daftar: urutkan, tampil/sembunyi, hapus dengan konfirmasi, simpan dengan notifikasi.
Form punya kolom ID dan EN berdampingan. Pratinjau = situs publik di tab lain yang ikut berubah begitu
disimpan (HMR), sebelum dipublikasikan.

**Alur publikasi:**
1. Admin menampilkan daftar perubahan (mis. "Projek: ubah LensaJentik", "Media: tambah 1 gambar").
2. Pesan commit dibuat otomatis mengikuti `AGENTS.md`, mis. `konten: perbarui projek lensajentik`, dan bisa diedit.
3. Commit → pull → push. Jika gagal (belum login GitHub, tidak ada internet, konflik), muncul pesan yang
   jelas dan perubahan **tetap tersimpan** di laptop; tidak ada force push.
4. Setelah berhasil: tautan ke halaman deploy hosting dan perkiraan waktu tayang.

Tampilan admin memakai token di `docs/DESIGN_SYSTEM.md` versi sederhana: putih, teks `--ink`, aksen `--blue`.

## 4. Fase Pengerjaan

Setiap fase diakhiri verifikasi dan commit. Perkiraan dalam sesi kerja; total ± 9–12 sesi (termasuk Fase 1B).

### Fase 0 — Fondasi dan jalur deploy (± 1 sesi)

- [ ] `git init`, atur identitas commit (`Farrel Muhammad Zaki <farrelmzaki77@gmail.com>`), commit kondisi v1.
- [ ] Repo GitHub, push ke `main`.
- [ ] ESLint + Vitest, skrip `npm run lint` / `npm test`; isi tabel *Perintah* di `AGENTS.md`.
- [ ] Sambungkan repo ke hosting (Vercel/Netlify) dan deploy pertama, supaya jalur push → online sudah terbukti sejak awal.
- **Selesai jika:** build, lint, test lulus; URL publik menampilkan v1; push kecil (mis. ubah README) memicu deploy otomatis.

### Fase 1 — Konten pindah ke file (± 1 sesi)

- [ ] Skema zod di `src/content/schema.js`.
- [ ] Konversi `src/data.js` ke `content/*.json`; gambar dari `src/assets/` ke `public/media/`.
- [ ] Situs publik membaca JSON; fungsi murni `t(lang, value)` (fallback EN ke ID) dan `formatPeriod()` beserta test.
- [ ] Test yang memvalidasi semua file konten terhadap skema, dijalankan sebelum build (`prebuild`).
- **Selesai jika:** tampilan identik dengan v1 di 1440/768/390 px, dan JSON yang sengaja dirusak membuat build gagal.

### Fase 1B — Desain ulang situs publik mengikuti brandappart.com (± 4–5 sesi)

Acuan lengkap dan nilai terukur: `docs/RISET_DESAIN.md`. Desain ulang memakai data dari `content/*.json`
(Fase 1), sehingga panel admin nanti langsung mengisi tampilan baru.

- [ ] Fondasi: token baru (latar `#F6F8FC`, tinta `#0B1220`, abu-biru `#7C8BA6`, aksen `#2563EB`),
      Archivo + Manrope + IBM Plex Mono, Lenis, GSAP + ScrollTrigger + Flip, kurva `cubic-bezier(0.36,0.33,0,1)`.
- [ ] Kerangka tetap: logo, CTA kanan atas, MENU kiri bawah + panel gelap 650 px, dock ikon kiri,
      garis progres kanan, jam Bogor, pill CTA melayang, kursor kustom dengan label.
- [ ] Hero: judul raksasa + jejak gambar mengikuti kursor + marquee logo teknologi.
- [ ] Showreel: garis yang membesar ke layar penuh (Flip) + parallax.
- [ ] Projek: mosaik 2 kolom, label kartu yang melebar saat hover, kartu sorotan IFEST.
- [ ] Prestasi: cincin kartu berputar terikat scroll di section gelap.
- [ ] Keahlian: tumpukan kartu warna yang di-pin dan terbang ke atas.
- [ ] Pengalaman: kartu kipas yang menyebar saat di-scroll.
- [ ] Tech stack: cincin 3D mengelilingi teks raksasa.
- [ ] Footer gelap: judul raksasa dua warna, kontak, sitemap, wordmark raksasa; stiker jatuh (opsional).
- [ ] Ponsel: komposisi sendiri (efek berat disederhanakan); `prefers-reduced-motion` mematikan gerak berpindah.
- **Selesai jika:** semua section berjalan di 1440/768/390 px tanpa error konsol dan tanpa scroll horizontal;
  animasi hanya `transform`/`opacity`/`clip-path`; Lighthouse performa ≥ 85 di desktop.

### Fase 2 — API lokal admin (± 1 sesi)

- [ ] Plugin Vite dengan endpoint di bagian 2, aktif hanya pada `--mode admin` dan hanya di `localhost`.
- [ ] `admin.html` + `src/admin/main.jsx` (kerangka kosong); skrip `npm run admin` membuka admin di browser.
- [ ] Test: penolakan `../`, file di luar daftar putih, JSON tidak valid, dan ukuran file berlebih.
- **Selesai jika:** endpoint baca/tulis bekerja, test pengaman lulus, dan `dist/` tidak berisi kode admin (dicek dengan grep).

### Fase 3 — UI admin (± 2–3 sesi)

- [ ] Layout: navigasi bagian, header dengan indikator "N perubahan belum dipublikasikan", notifikasi.
- [ ] Komponen bersama: `BilingualField`, `ImageUpload` (kompres maksimal 1600 px), `TagInput`, `SortableList`, `ConfirmDialog`.
- [ ] Halaman sesuai bagian 3, urutan: Profil → Projek → Prestasi → Pengalaman → Keahlian → Halaman.
- [ ] Gambar lama dihapus otomatis saat diganti atau saat itemnya dihapus.
- **Selesai jika:** setiap bagian bisa ditambah, diubah, disembunyikan, diurutkan, dan dihapus, dan pratinjau langsung berubah.

### Fase 4 — Publikasi (± 1 sesi)

- [ ] Status git, ringkasan perubahan, pesan commit otomatis, tombol Publikasikan dan Batalkan.
- [ ] Penanganan galat: tidak ada remote, belum login GitHub, tanpa internet, konflik.
- **Selesai jika:** ubah satu projek di admin → Publikasikan → dalam ± 2 menit situs online berubah (diuji nyata).

### Fase 5 — Pengujian akhir dan serah terima (± 0,5–1 sesi)

- [ ] Uji alur lengkap di Windows (laptop Farrel), termasuk menambah projek baru dengan cover.
- [ ] Hapus `src/data.js` dan aset lama yang sudah dipindah.
- [ ] Perbarui `PRD.md`, `ARSITEKTUR.md`, `DESIGN_SYSTEM.md` (komponen admin), dan `AGENTS.md` (perintah).
- [ ] Panduan singkat "cara update portofolio" di `README.md`.

## 5. Risiko

| Kode | Risiko | Mitigasi |
| --- | --- | --- |
| R-01 | Push gagal (belum login GitHub, tanpa internet, konflik) | Pesan jelas; perubahan tetap di laptop; coba lagi tanpa force |
| R-02 | JSON rusak masuk ke situs | Skema zod saat simpan dan saat build; build gagal = situs lama tetap tayang |
| R-03 | Lupa menekan Publikasikan | Indikator "N perubahan belum dipublikasikan" di setiap halaman admin |
| R-04 | Repo membesar karena gambar | Kompres di browser, batas ukuran, hapus otomatis gambar yang tidak dipakai |
| R-05 | API lokal bisa diakses dari jaringan lain | Hanya `localhost`, hanya mode admin, tidak ada di build |
| R-06 | Isi repo publik terlihat orang (email, nomor WA) | Data itu memang tampil di situs; repo boleh dibuat private (hosting tetap bisa) |
| R-07 | Update hanya bisa dari laptop | Disengaja (sesuai permintaan); bisa ditambah nanti jika perlu |

## 6. Di Luar Cakupan

Update dari HP, database, akun login, blog, formulir kontak ke server, analitik, dan halaman detail per
projek. Riwayat perubahan sudah otomatis tersedia lewat Git.

## 7. Yang Perlu Dikonfirmasi

1. Setuju dengan rencana ini (urutan fase dan struktur konten)?
2. Hosting: **Vercel** atau **Netlify**? Keduanya gratis dan deploy otomatis dari GitHub.
3. Username GitHub, dan repo dibuat **private** atau **public**?
4. Git sudah terpasang di laptop dan pernah login ke GitHub (pernah `git push`)?
