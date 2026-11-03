# PRD — Portofolio Farrel Muhammad Zaki

> Menjawab: **apa yang dibangun dan mengapa.** Bentuk teknisnya di `ARSITEKTUR.md`.
> Isi secukupnya; bagian yang belum relevan boleh ditulis `TBD`.

## 0. Metadata

| Butir | Isi |
| --- | --- |
| Versi | 1.0 |
| Tanggal | 2026-11-03 |
| Status | Disetujui untuk versi pertama (sudah dibangun) |
| Sumber | CV Farrel (Figma), sertifikat, pitch deck LensaJentik, exsum SUDEPI, jurnal ReservaSeat, proposal Cocokin!, catatan Trisis Gym; referensi gaya: brandappart.com |

## 1. Ringkasan

Situs portofolio satu halaman untuk Farrel Muhammad Zaki, mahasiswa Software Engineering IPB University
(2024–2028). Situs menampilkan projek, keahlian, pengalaman, dan prestasi secara ringkas dan meyakinkan,
lalu mengarahkan pengunjung untuk menghubungi Farrel lewat email atau WhatsApp.

## 2. Masalah

CV satu halaman tidak cukup ruang untuk menunjukkan isi projek: masalah yang diselesaikan, teknologi,
dan peran. Perekrut juga butuh satu tautan yang cepat dibaca di ponsel maupun laptop.

## 3. Tujuan, Non-Goals, Metrik

- **Tujuan:** pengunjung paham dalam satu layar siapa Farrel dan apa yang dikerjakannya; bisa menilai
  5 projek pilihan; dan bisa menghubungi Farrel dalam satu klik.
- **Non-goals (sengaja tidak dibangun):** backend atau database, CMS, blog, formulir kontak dengan server,
  halaman detail terpisah per projek, analitik.
- **Metrik keberhasilan:** tidak ada error konsol; tidak ada scroll horizontal di 390/768/1440 px;
  setiap judul maksimal dua baris; tombol kontak bisa dijangkau dari layar pertama.

## 4. Pengguna

| Pengguna | Kebutuhan utama |
| --- | --- |
| Perekrut / HR | Cepat tahu peran, stack, dan bukti kerja nyata |
| Pemberi magang / dosen | Melihat projek, prestasi, dan sertifikat |
| Calon kolaborator / tim lomba | Melihat keahlian dan cara menghubungi |

## 5. Fitur

| ID | Fitur | Prioritas | Kriteria terima |
| --- | --- | --- | --- |
| F-01 | Navbar dengan hover hitam dan panel dropdown (Projek, Keahlian); berubah tema di atas section gelap | Wajib | Hover memunculkan pill hitam; di atas section gelap warnanya terbalik |
| F-02 | Hero: judul, ringkasan diri, dua tombol, tiga angka, strip cover berjalan | Wajib | Judul ≤ 2 baris di semua lebar; tombol terlihat tanpa scroll di laptop |
| F-03 | Daftar projek bisa dibuka-tutup dengan pratinjau mengikuti kursor | Wajib | Satu baris terbuka; pratinjau hanya di perangkat dengan mouse |
| F-04 | Band tech stack berjalan | Sebaiknya | Berhenti bergerak saat reduced motion |
| F-05 | Keahlian (Backend, Frontend, Full-stack, Desain) | Wajib | 4 kartu dengan tag teknologi |
| F-06 | Pendidikan dan pengalaman | Wajib | Tanggal, judul, organisasi, deskripsi |
| F-07 | Prestasi dan sertifikat bergambar | Wajib | 4 sertifikat dengan gambar asli |
| F-08 | Kontak: email, WhatsApp, tautan sosial opsional | Wajib | Tautan sosial kosong tidak ditampilkan |
| F-09 | Toggle bahasa ID/EN, tersimpan di browser | Sebaiknya | Pilihan bertahan setelah muat ulang; tetap jalan bila storage diblokir |
| F-10 | Menu layar penuh di ponsel | Wajib | Muncul di ≤ 900 px, bisa ditutup dengan Esc |

### Alur pengguna utama

1. Pengunjung membuka tautan dan membaca hero.
2. Menggulir ke Projek, membuka satu atau dua projek.
3. Melihat keahlian dan prestasi sebagai bukti tambahan.
4. Menekan "Kirim email" atau "WhatsApp".

## 6. Aturan Bisnis

| ID | Aturan |
| --- | --- |
| BR-01 | Semua isi berasal dari dokumen asli Farrel. Tidak boleh mengarang testimoni, klien, angka, atau peran. |
| BR-02 | Peran per projek hanya ditulis bila tercatat di dokumen atau repo (saat ini: LensaJentik = backend, repo `farrelzaki/BackendLensaJentik`; SUDEPI = backend + rancangan pipeline model; Cocokin! = Backend, Data & AI menurut `KOLABORASI.md` repo; Trisis Gym = full-stack). |
| BR-03 | Cover diambil dari aset asli repo (screenshot aplikasi, logo, denah) dan disusun di atas latar palet; cover ilustrasi ditandai `illustration: true` dan diberi keterangan di panel detail (saat ini hanya Trisis Gym). |
| BR-04 | Tautan demo hanya dipasang bila sudah diverifikasi bisa dibuka. |

## 7. Data

Semua konten statis di `src/data.js` (dua bahasa). Data pribadi yang tampil: nama, email, nomor WhatsApp.
Gambar sertifikat di `src/assets/`. Tidak ada data yang dikirim ke server.

## 8. Kebutuhan Non-Fungsional

- Responsif 390–1480 px; navigasi khusus ponsel di ≤ 900 px.
- Aksesibilitas: fokus keyboard terlihat, `aria-expanded` pada baris projek, alt pada gambar,
  `prefers-reduced-motion` dihormati.
- Animasi hanya `transform`, `opacity`, dan `clip-path`.
- Hover hanya aktif di perangkat dengan pointer halus.

## 9. Rilis Dan Milestone

| Milestone | Target | Isi |
| --- | --- | --- |
| v1 | 2026-11-03 (selesai) | Semua fitur F-01 s.d. F-10 |
| v1.1 | TBD | Tautan sosial, foto profil, screenshot asli projek, deploy |

## 10. Asumsi, Risiko, Pertanyaan Terbuka

| Kode | Hal | Pemilik |
| --- | --- | --- |
| OQ-01 | Tautan LinkedIn, GitHub, Instagram, dan CV belum ada | Farrel |
| OQ-02 | Foto profil belum ada di proyek | Farrel |
| OQ-03 | Peran Farrel di LensaJentik, ReservaSeat, dan Cocokin! belum tercatat | Farrel |
| OQ-04 | Screenshot asli SUDEPI, ReservaSeat, Cocokin!, Trisis Gym | Farrel |
| OQ-05 | Tempat hosting dan domain | Farrel |
