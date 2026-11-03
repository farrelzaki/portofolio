# Rencana — Portofolio Dengan Panel Admin

Status: **draf, menunggu persetujuan** · Dibuat: 2026-11-03 · Task: `T-08` di `TASK.md`

Setelah disetujui, keputusan final dipindahkan ke `docs/PRD.md` dan `docs/ARSITEKTUR.md`, dan file ini
dipakai sebagai urutan kerja (checklist fase).

## 1. Ringkasan

Situs publik yang ada sekarang (desain, animasi, dua bahasa) **dipertahankan**. Bedanya, isinya tidak lagi
ditulis di `src/data.js` tetapi dibaca dari **Supabase**. Ditambah halaman **`/admin`** (login hanya untuk
Farrel) untuk mengubah semua isi tanpa menyentuh kode: projek, prestasi dan sertifikat, pengalaman,
keahlian, tech stack, profil, teks halaman, foto, dan file CV. Setiap teks punya kolom ID dan EN.

Keputusan yang sudah diambil pengguna (2026-11-03): backend Supabase · frontend publik dipertahankan ·
dua bahasa ID/EN · semua bagian bisa diubah dari admin.

## 2. Arsitektur Yang Diusulkan

```
Pengunjung ──> Situs publik  (/)       ─┐
                                        ├─ React 19 + Vite (satu aplikasi, hosting statis)
Farrel     ──> Panel admin   (/admin)  ─┘
                    │  supabase-js (publishable key)
                    ▼
              Supabase
              ├─ Postgres  : tabel isi + Row Level Security
              ├─ Auth      : login email + password, pendaftaran publik dimatikan
              └─ Storage   : bucket `media` (cover, sertifikat, foto, CV)
```

Satu aplikasi, dua area. Panel admin dimuat terpisah (lazy-load), jadi pengunjung publik tidak ikut
mengunduh kode admin.

**Kunci keamanan:** penjaga di `/admin` hanya untuk tampilan. Perlindungan sebenarnya ada di
**RLS Postgres**: semua orang boleh membaca isi yang `is_published`, dan hanya user yang terdaftar di
tabel `admins` yang boleh menulis. Publishable key aman ditaruh di frontend; secret key **tidak pernah**
masuk ke kode frontend maupun repo.

### Stack tambahan (versi dicek di npm 2026-11-03, dicek ulang saat instal)

| Paket | Versi | Untuk |
| --- | --- | --- |
| `@supabase/supabase-js` | 2.118.0 | Database, auth, storage |
| `react-router` | 8.5.1 | Rute `/` dan `/admin/*` |
| `@tanstack/react-query` | 5.105.3 | Fetch, cache, dan refresh data setelah disimpan |
| `react-hook-form` + `zod` | 7.91.0 / 4.6.7 | Form admin dan validasi |
| `@dnd-kit/sortable` | 10.0.0 | Mengatur urutan dengan drag (opsional, fase 3) |
| `browser-image-compression` | 2.0.2 | Mengecilkan gambar sebelum diunggah |
| `vitest` + `@testing-library/react` | 5.1.0 / 16.3.3 | Test logika dan komponen |
| `eslint` | 10.14.0 | Lint |
| `supabase` (CLI, dev) | 3.0.0 | Migrasi SQL tersimpan di repo |

## 3. Skema Database (usulan)

Semua tabel punya `id uuid`, `created_at`, dan `updated_at`. Teks dua bahasa memakai pasangan kolom
`*_id` dan `*_en`; jika `*_en` kosong, situs memakai versi ID.

| Tabel | Kolom penting | Catatan |
| --- | --- | --- |
| `settings` | `name`, `email`, `whatsapp`, `linkedin_url`, `github_url`, `instagram_url`, `cv_path`, `photo_path`, `hero_line1_*`, `hero_line2_*`, `hero_accent_*`, `hero_sub_*`, `contact_title_*`, `contact_sub_*`, `meta_description_*` | Satu baris saja |
| `stats` | `value`, `label_*`, `sort_order` | Tiga angka di hero |
| `projects` | `slug`, `name`, `category_*`, `description_*`, `role_*`, `tags text[]`, `cover_path`, `cover_alt_*`, `demo_url`, `repo_url`, `sort_order`, `is_published` | `role_*` baru, untuk OQ-03 |
| `services` | `title_*`, `description_*`, `tags text[]`, `sort_order`, `is_published` | Kartu keahlian |
| `stack_items` | `name`, `sort_order` | Band tech stack |
| `experiences` | `title_*`, `organization`, `description_*`, `start_date`, `end_date`, `is_current`, `sort_order`, `is_published` | Periode diformat otomatis per bahasa |
| `achievements` | `title_*`, `issuer_*`, `description_*`, `image_path`, `awarded_on`, `sort_order`, `is_published` | Sertifikat |
| `admins` | `user_id → auth.users` | Daftar akun yang boleh menulis |

**RLS:** `select` untuk `anon` hanya baris `is_published = true` (tabel tanpa kolom itu boleh dibaca
semua); `insert/update/delete` hanya jika `auth.uid()` ada di `admins`. `admins` tidak bisa dibaca publik.

**Storage:** bucket `media` publik untuk dibaca; unggah, ubah, dan hapus hanya admin (policy pada
`storage.objects`). Folder: `projects/`, `achievements/`, `profile/`, `cv/`.

**Cover ilustrasi:** cover SVG buatan kode tetap dipakai sebagai cadangan selama `cover_path` kosong
(dicocokkan lewat `slug`). Begitu Farrel mengunggah screenshot asli, gambar itu yang tampil.

## 4. Panel Admin

| Halaman | Isi |
| --- | --- |
| `/admin/login` | Email + password, pesan galat yang jelas |
| `/admin` | Ringkasan: jumlah item per bagian, tautan cepat, tombol "Lihat situs" |
| `/admin/profil` | Settings: identitas, kontak, tautan sosial, foto, unggah CV (PDF) |
| `/admin/halaman` | Teks hero, angka statistik, teks kontak |
| `/admin/projek` | Daftar + form tambah/ubah: unggah cover, tag, peran, tautan demo/repo |
| `/admin/prestasi` | Daftar + form, unggah sertifikat |
| `/admin/pengalaman` | Daftar + form dengan tanggal mulai/selesai |
| `/admin/keahlian` | Kartu keahlian dan tech stack |

Perilaku di semua daftar: urutkan (drag atau tombol naik/turun), tampil/sembunyi (`is_published`), hapus
dengan konfirmasi, simpan dengan notifikasi berhasil/gagal. Form punya tab ID / EN berdampingan. Gambar
dikompres di browser (maksimal 1600 px, ±300 KB) sebelum diunggah, dan file lama dihapus saat diganti.

Tampilan admin memakai token di `docs/DESIGN_SYSTEM.md` versi sederhana: putih, teks `--ink`, aksen `--blue`.

## 5. Fase Pengerjaan

Setiap fase diakhiri verifikasi dan commit. Perkiraan dalam sesi kerja.

### Fase 0 — Fondasi (± 1 sesi)

- [ ] `git init`, `.gitignore` dicek, commit kondisi v1 sebagai titik awal.
- [ ] Repo GitHub pribadi, lalu push.
- [ ] ESLint + Vitest dan skrip `npm run lint` / `npm test`; isi tabel *Perintah* di `AGENTS.md`.
- [ ] `.env.example` berisi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY`.
- **Selesai jika:** build, lint, dan test (minimal 1 test) lulus; repo ter-push.

### Fase 1 — Supabase: database, keamanan, data awal (± 1–2 sesi)

- [ ] Buat projek Supabase baru `portfolio` (region Singapura, terdekat dari Jakarta). *Butuh persetujuan; projek baru.*
- [ ] Migrasi SQL di `supabase/migrations/`: tabel, trigger `updated_at`, indeks `sort_order`.
- [ ] RLS dan policy storage seperti bagian 3.
- [ ] Matikan pendaftaran publik; buat satu akun admin dan masukkan ke `admins`.
- [ ] Skrip seed dari isi `src/data.js` dan `src/assets/` saat ini, sehingga datanya sama persis dengan v1.
- [ ] Jalankan advisor keamanan Supabase; tidak boleh ada peringatan RLS.
- **Selesai jika:** `anon` bisa membaca data publik, `anon` **gagal** menulis, dan admin **berhasil** menulis
  (diuji dengan query nyata, bukan asumsi).

### Fase 2 — Situs publik membaca dari Supabase (± 1–2 sesi)

- [ ] `src/lib/supabase.js`, router (`/` dan `/admin/*`), dan React Query.
- [ ] Hook data per bagian; fungsi murni `pick(lang, row, field)` (fallback EN ke ID) dan `formatPeriod()` beserta test.
- [ ] Komponen yang ada membaca dari hook, bukan dari `data.js`; bentuk props dipertahankan agar tampilan tidak berubah.
- [ ] Keadaan memuat (skeleton yang menjaga tata letak) dan keadaan galat (pesan + email tetap tampil).
- [ ] **Snapshot cadangan:** skrip `npm run snapshot` menyimpan isi Supabase ke `src/snapshot.json` saat build;
  situs memakainya jika Supabase tidak bisa dihubungi (lihat risiko R-01).
- **Selesai jika:** tampilan identik dengan v1 di 1440/768/390 px, data datang dari Supabase, dan situs
  tetap tampil dari snapshot saat jaringan ke Supabase diputus.

### Fase 3 — Panel admin (± 3–4 sesi)

- [ ] Login, logout, sesi tersimpan, penjaga rute, dan halaman "tidak berhak" bagi akun yang bukan admin.
- [ ] Layout admin: sidebar (atau menu bawah di ponsel), header, notifikasi.
- [ ] Komponen bersama: `BilingualField`, `ImageUpload`, `TagInput`, `SortableList`, `ConfirmDialog`.
- [ ] Halaman CRUD sesuai bagian 4, satu per satu (Profil → Projek → Prestasi → Pengalaman → Keahlian → Halaman).
- [ ] Setelah menyimpan, cache React Query di-refresh sehingga situs publik langsung berubah.
- **Selesai jika:** setiap bagian bisa ditambah, diubah, disembunyikan, diurutkan, dan dihapus dari admin,
  dan perubahannya terlihat di situs publik tanpa deploy ulang.

### Fase 4 — Pengujian dan pengerasan (± 1 sesi)

- [ ] Test: logika murni, skema validasi zod, dan alur login (dengan mock Supabase).
- [ ] Uji keamanan manual: memanggil API dengan publishable key tanpa login, lalu insert/update/delete harus ditolak.
- [ ] Aksesibilitas admin: label form, fokus keyboard, pesan galat terbaca.
- [ ] Cek ukuran bundle: kode admin tidak ikut dimuat di halaman publik.

### Fase 5 — Deploy (± 1 sesi)

- [ ] Hosting statis (usulan: **Vercel** atau **Netlify**, gratis) dengan rewrite SPA agar `/admin/...` tidak 404.
- [ ] Variabel lingkungan di hosting; URL situs didaftarkan di Supabase Auth (Site URL dan Redirect URLs).
- [ ] Penjaga agar tidak dijeda (R-01): GitHub Action terjadwal yang membaca satu baris tiap 2 hari.
- [ ] Domain sendiri (opsional).

### Fase 6 — Serah terima (± 0,5 sesi)

- [ ] Perbarui `PRD.md`, `ARSITEKTUR.md` (skema, RLS, perintah), `DESIGN_SYSTEM.md` (komponen admin), dan `README.md`.
- [ ] Panduan singkat "cara update portofolio" di README.
- [ ] Hapus `src/data.js` setelah seed dan snapshot terbukti bekerja.

## 6. Risiko

| Kode | Risiko | Mitigasi |
| --- | --- | --- |
| R-01 | Supabase gratis **menjeda projek** yang sepi selama 7 hari; situs bisa kosong | Snapshot cadangan saat build + ping terjadwal; Supabase juga mengirim email peringatan seminggu sebelumnya |
| R-02 | Salah konfigurasi RLS membuat orang lain bisa mengubah isi | Uji tulis sebagai `anon` di Fase 1 dan 4; advisor keamanan Supabase |
| R-03 | Secret key bocor ke repo | Hanya publishable key di frontend; `.env` di-gitignore; cek diff sebelum commit |
| R-04 | Konten berkedip saat dimuat | Skeleton dengan ukuran tetap + snapshot sebagai data awal |
| R-05 | Gambar besar memperlambat situs | Kompres di browser sebelum unggah; batas ukuran di policy |
| R-06 | Kuota gratis (500 MB DB, 1 GB storage) | Jauh di atas kebutuhan portofolio; dipantau di dashboard |

## 7. Di Luar Cakupan

Blog, formulir kontak ke server, analitik, banyak admin dengan peran berbeda, riwayat versi isi, dan
halaman detail per projek. Semua ini bisa ditambahkan nanti tanpa mengubah skema inti.

## 8. Yang Perlu Dikonfirmasi

1. Setuju dengan rencana ini secara umum (urutan fase dan skema)?
2. Boleh membuat projek Supabase baru bernama `portfolio` di organisasimu (gratis; slotnya masih ada,
   saat ini baru ada `cocokin`)?
3. Hosting: Vercel, Netlify, atau yang lain?
4. Email untuk akun admin (default: `farrelmzaki77@gmail.com`)?
