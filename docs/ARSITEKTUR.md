# Arsitektur — Portofolio Farrel Muhammad Zaki

> Menjawab: **dengan apa dan dalam bentuk apa sistem dibangun.**
> Keputusan di sini mengikat. Perubahan besar butuh persetujuan pengguna (lihat `AGENTS.md` bagian 6).

Status: **disepakati (v1)**

## 1. Stack

| Lapisan | Pilihan | Versi | Alasan |
| --- | --- | --- | --- |
| Frontend | React | 19.3.1 | Komponen dan state sederhana (bahasa, baris terbuka, menu) |
| Build tool | Vite + `@vitejs/plugin-react` | 8.3.5 / 6.2.1 | Dev server cepat, build statis ke `dist/` |
| Backend | — | — | Tidak diperlukan; semua konten statis |
| Basis data | — | — | Tidak diperlukan |
| Styling | CSS biasa + custom properties | — | Token di satu file, tanpa dependency tambahan |
| Font | `@fontsource-variable/manrope`, `@fontsource/instrument-serif` | 5.3.x | Font di-bundle, tanpa request ke Google Fonts |
| Test | Belum ada | — | Lihat bagian 6 |
| Hosting | Belum ditentukan (TBD-01) | — | Hosting statis apa pun (Netlify, Vercel, GitHub Pages) |

Versi di atas diambil dari `package.json` dan `node_modules` yang terpasang pada 2026-11-03.

**Sengaja tidak dipakai:** Tailwind dan library animasi (Framer Motion, GSAP), karena semua gerak cukup
dengan CSS transition, IntersectionObserver, dan `requestAnimationFrame`; React Router, karena situs satu halaman.

## 2. Gambaran Sistem

```
Browser ──> file statis dari dist/ (HTML, JS, CSS, font, gambar)
            └─ mailto: dan wa.me untuk kontak (tanpa server sendiri)
```

## 3. Struktur Kode

```
index.html          Entry HTML; menambahkan kelas .js ke <html> untuk animasi reveal
vite.config.js      Plugin React, base './' agar dist/ bisa disajikan dari subfolder
src/
  main.jsx          Mount React, impor font dan styles.css
  App.jsx           Semua section: Nav, Hero, Projects, Marquee, Skills, Experience,
                    Achievements, Contact, Footer; hook useReveal dan useNavTheme
  Covers.jsx        Cover projek: <img> untuk screenshot asli, SVG untuk ilustrasi
  data.js           SEMUA konten dan teks antarmuka (ID/EN). Ubah isi di sini saja
  styles.css        Token desain (:root) dan seluruh styling
  assets/           Gambar sertifikat dan screenshot LensaJentik
public/             Kosong
docs/               PRD, arsitektur, design system, referensi
```

Aturan batas:

- Teks yang tampil di layar berada di `src/data.js`, bukan di JSX.
- Nilai visual memakai token di `:root` (`src/styles.css`); lihat `DESIGN_SYSTEM.md`.
- Section yang mengubah tema navbar memberi atribut `data-nav="light" | "dark" | "blue"`.
- Elemen yang muncul saat di-scroll memberi `data-reveal` dan `--i` untuk urutan stagger.

## 4. Kontrak API

Tidak ada API. Kontak memakai `mailto:` dan `https://wa.me/<nomor>` dari `profile` di `src/data.js`.

Bentuk data yang dipakai komponen (dianggap kontrak internal):

| Ekspor `data.js` | Bentuk |
| --- | --- |
| `profile` | `{ name, email, whatsapp, links: { linkedin, github, instagram, cv } }` |
| `projects[]` | `{ id, cover: 'image' \| 'sudepi' \| 'reservaseat' \| 'cocokin' \| 'trisis', image?, name, tags[], cat: {id,en}, text: {id,en} }` |
| `services[]` | `{ key, title: {id,en}, text: {id,en}, tags[] }` |
| `experience[]` | `{ date, title: {id,en}, org, text: {id,en} }` |
| `achievements[]` | `{ image, title: {id,en}, meta: {id,en}, text: {id,en} }` |
| `ui` | `{ id: {...}, en: {...} }` dengan kunci yang sama di kedua bahasa |

## 5. Konvensi

| Hal | Konvensi |
| --- | --- |
| Teks dua bahasa | Objek `{ id, en }`; kunci yang sama wajib ada di kedua bahasa |
| Penamaan | camelCase untuk JS; kebab-case untuk kelas CSS |
| Penyimpanan browser | Hanya `localStorage.lang`, selalu dibungkus try/catch |
| Animasi | Hanya `transform`, `opacity`, `clip-path`; hover di dalam `@media (hover: hover) and (pointer: fine)` |
| Bahasa teks antarmuka | Indonesia (default), Inggris |
| Variabel lingkungan | Tidak ada |

## 6. Strategi Test

- **Saat ini:** belum ada test otomatis. Verifikasi = `npm run build` lalu cek visual di 1440, 768, dan
  390 px (tanpa error konsol, tanpa scroll horizontal), serta uji toggle ID/EN dan menu ponsel.
- **Wajib dites bila ditambah:** logika murni baru (mis. pemformatan data).
- **Tidak wajib:** komponen yang murni tampilan.

## 7. Keputusan Terbuka

| Kode | Pertanyaan | Pemilik |
| --- | --- | --- |
| TBD-01 | Hosting dan domain | Farrel |
| TBD-02 | Perlu ESLint/Prettier dan test otomatis? | Farrel |

## 8. Risiko Teknis

| Risiko | Mitigasi |
| --- | --- |
| `dist/index.html` dibuka langsung (file://) tidak jalan | Selalu sajikan lewat server atau `npm run preview` |
| Gambar besar memperlambat muat | Gambar di `src/assets/` dikompres JPEG ≤ 1500 px; ikuti batas ini |
| Teks ID/EN tidak sinkron | Tambah kunci di kedua bahasa sekaligus |
