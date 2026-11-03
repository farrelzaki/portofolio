# Portofolio Farrel Muhammad Zaki

Situs portofolio satu halaman. React 19 + Vite 8 + GSAP + Lenis, tanpa backend. Gaya mengikuti
brandappart.com dengan palet hitam–biru–putih, dua bahasa (ID/EN). Online di https://portofolio-omega-one-97.vercel.app/

## Menjalankan

```bash
npm install
npm run dev      # pengembangan
npm run build    # hasil produksi di folder dist/
npm run preview  # menyajikan dist/ secara lokal
```

Hasil `dist/` harus disajikan lewat server (Netlify, Vercel, GitHub Pages, dsb.), bukan dibuka langsung dengan klik dua kali.

## Mengubah isi

Semua isi ada di folder `content/` (dua bahasa: `{ "id": "...", "en": "..." }`) dan gambar di `public/media/`.
Setelah diubah, `npm test` memastikan isinya valid; build otomatis gagal jika ada yang rusak.
Panel admin lokal (`npm run admin`) sedang dibangun (lihat `docs/RENCANA_ADMIN.md`).

| File | Isi |
| --- | --- |
| `content/settings.json` | Nama, kontak, tautan sosial, foto, teks hero, judul tiap section |
| `content/projects.json` | Projek (cover, galeri, deskripsi, peran, tag, tautan repo/demo) |
| `content/services.json` | Kartu keahlian |
| `content/stack.json` | Daftar teknologi |
| `content/experiences.json` | Pendidikan dan pengalaman |
| `content/achievements.json` | Prestasi dan sertifikat |

## Dokumentasi

| File | Isi |
| --- | --- |
| `docs/PRD.md` | Tujuan, fitur, aturan konten |
| `docs/ARSITEKTUR.md` | Stack, struktur kode, bentuk data |
| `docs/DESIGN_SYSTEM.md` | Warna, tipografi, komponen, motion |
| `docs/RISET_DESAIN.md` | Riset gaya brandappart.com |
| `docs/RENCANA_ADMIN.md` | Rencana fase pengerjaan |
