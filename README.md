# Portofolio Farrel Muhammad Zaki

Situs portofolio satu halaman. React 19 + Vite 8, tanpa backend. Palet hitam–biru–putih, section terang
berselang-seling dengan blok gelap, dan dua bahasa (ID/EN).

## Menjalankan

```bash
npm install
npm run dev      # pengembangan
npm run build    # hasil produksi di folder dist/
npm run preview  # menyajikan dist/ secara lokal
```

Hasil `dist/` harus disajikan lewat server (Netlify, Vercel, GitHub Pages, dsb.), bukan dibuka langsung dengan klik dua kali.

## Mengubah isi

- Teks, projek, pengalaman, prestasi: `src/data.js` (dua bahasa, ID dan EN).
- Tautan LinkedIn / GitHub / Instagram / CV: isi `profile.links` di `src/data.js`. Kosong = tombol disembunyikan.
- Warna: variabel di bagian atas `src/styles.css` (`--ink`, `--blue`, `--sky`, `--soft`).
- Cover projek: `src/Covers.jsx`. LensaJentik memakai tangkapan layar asli; ganti dengan screenshot asli projek lain dengan mengubah `cover: 'image'` dan `image` di `src/data.js`.
- Gambar sertifikat: `src/assets/`.

## Dokumentasi

| File | Isi |
| --- | --- |
| `docs/PRD.md` | Tujuan, fitur, aturan konten |
| `docs/ARSITEKTUR.md` | Stack, struktur kode, bentuk data |
| `docs/DESIGN_SYSTEM.md` | Warna, tipografi, komponen, motion |
