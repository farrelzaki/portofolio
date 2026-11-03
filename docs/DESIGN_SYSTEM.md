# Design System — Portofolio Farrel Muhammad Zaki

> Semua nilai visual di kode harus berasal dari token di sini (didefinisikan di `:root` pada `src/styles.css`).

Status: **disepakati (v1)** · Sumber desain: palet hitam–biru–putih dari CV Figma Farrel
(`#0B1220`, `#1D4ED8`, `#7DB2FF`); gaya tata letak dan kontras terinspirasi brandappart.com.

Penanda nilai: `[Dari Desain]` diambil dari desain · `[Improvisasi]` dirancang di sini.

## 1. Prinsip

1. Cenderung terang, dengan blok gelap sebagai kontras: hero dan pengalaman putih, projek abu-biru
   lembut, band stack, keahlian, dan kontak hitam, prestasi biru penuh.
2. Hover menjadi gelap: elemen terang berubah hitam saat di-hover (pill navbar, baris projek, kartu
   prestasi); di atas latar gelap kebalikannya (putih atau biru).
3. Satu hal besar per layar: judul sangat besar, teks pendukung kecil, sedikit ukuran di antaranya.
4. Tanpa bayangan dan tanpa gradien; pemisah memakai beda warna latar atau garis tipis `--line`.

## 2. Warna

| Token | Nilai | Pemakaian |
| --- | --- | --- |
| `--ink` | `#0B1220` `[Dari Desain]` | Teks utama, section gelap, hover gelap |
| `--ink-2` | `#101A30` `[Improvisasi]` | Kartu di atas section gelap |
| `--ink-3` | `#16213D` `[Improvisasi]` | Nama besar di footer |
| `--blue` | `#1D4ED8` `[Dari Desain]` | Aksen teks (kata miring di hero, angka), section prestasi, panel navbar saat gelap |
| `--blue-b` | `#2563EB` `[Improvisasi]` | Tombol biru, isi hover tombol, garis bawah email |
| `--sky` | `#7DB2FF` `[Dari Desain]` | Aksen di atas latar gelap (tag, kategori) |
| `--paper` | `#FFFFFF` | Latar terang, teks di atas gelap |
| `--soft` | `#F2F5FD` `[Improvisasi]` | Latar section projek, latar gambar |
| `--slate` | `#475569` `[Dari Desain]` | Teks sekunder di latar terang |
| `--mist` | `#B8C4DA` `[Dari Desain]` | Teks sekunder di latar gelap |
| `--line` | `rgba(11,18,32,.16)` `[Improvisasi]` | Garis pemisah baris projek dan pengalaman |

## 3. Tipografi

| Token | Font | Ukuran / tinggi baris | Bobot | Pemakaian |
| --- | --- | --- | --- | --- |
| Display | Manrope Variable | `clamp(40px, 9.6vw, 148px)` / 0.95, tracking −0.045em | 800 | Judul hero |
| Aksen display | Instrument Serif Italic | 1.08em dari induk | 400 | Satu kata di hero ("diandalkan") |
| Heading section | Manrope Variable | `clamp(40px, 6.6vw, 104px)` / 0.98 | 800 | Judul tiap section |
| Nama projek | Manrope Variable | `clamp(34px, 5.6vw, 92px)` / 1 | 800 | Baris projek |
| Heading kartu | Manrope Variable | 21–52px (clamp) | 800 | Kartu keahlian, pengalaman, prestasi |
| Body | Manrope Variable | 17px (16px di ≤ 520px) / 1.55 | 400–600 | Paragraf |
| Kecil | Manrope Variable | 13–15px | 600–800 | Nomor, kategori, tag, tombol bahasa |

## 4. Spasi, Radius, Bayangan

| Token | Nilai |
| --- | --- |
| `--gut` (margin samping) | `clamp(16px, 3vw, 40px)` |
| `--nav-h` | `68px` |
| Jarak antar-section | `clamp(80px, 11vw, 160px)` atas dan bawah |
| Lebar maksimum `.wrap` | `1480px` |
| Radius | `999px` untuk tombol, pill navbar, dan tag; `0` untuk semua kartu dan gambar |
| Bayangan | Tidak dipakai; outline tombol memakai `inset box-shadow` 1.5px |

## 5. Tata Letak Dan Breakpoint

| Breakpoint | Perubahan |
| --- | --- |
| ≤ 1100px | Panel dropdown navbar 3 kolom |
| ≤ 900px | Link navbar diganti tombol menu layar penuh; projek, keahlian, pengalaman, dan prestasi jadi satu kolom |
| ≤ 520px | Body 16px; tombol hero melebar |

## 6. Komponen

| Komponen | Varian / state | Catatan |
| --- | --- | --- |
| Button | `btn-ink`, `btn-line`, `btn-blue`, `btn-ghost`, `btn-nav` | Hover: isi warna naik dari bawah (420ms); tekan: `scale(0.97)` |
| Nav link | normal, hover, `on` | Pill hitam (putih saat bar gelap) muncul dengan scale 0.86 → 1 |
| Panel dropdown | tertutup, `show` | Hitam di bar terang, biru di bar gelap; `clip-path` dari atas, isi stagger 45ms |
| Baris projek | tertutup, hover, `open` | Isi hitam naik dari bawah; detail membuka lewat `grid-template-rows` |
| Pratinjau projek | `show` | Mengikuti kursor dengan lerp 0.16; hanya pointer halus |
| Kartu keahlian | normal, hover/fokus | Latar `--ink-2` → `--blue` |
| Kartu prestasi | normal, hover | Gambar zoom 1.045; caption jadi hitam |
| Email besar | normal, hover/fokus | Teks biru menyapu dari kiri lewat `clip-path` |

Motion:

| Token | Nilai | Pemakaian |
| --- | --- | --- |
| `--ease` | `cubic-bezier(0.23, 1, 0.32, 1)` | Masuk dan hover |
| `--ease-io` | `cubic-bezier(0.77, 0, 0.175, 1)` | Isi warna, panel, membuka baris |
| Reveal | 0.8s, naik 28px, stagger 70ms × `--i` | Semua `[data-reveal]` |

## 7. Microcopy

- Bahasa santai tapi sopan, orang pertama ("Saya"), kalimat pendek.
- Tombol berupa kata kerja: "Lihat projek", "Hubungi saya", "Kirim email".
- Tidak ada klaim yang tidak didukung dokumen (lihat `PRD.md` BR-01).

## 8. Aksesibilitas

- Fokus keyboard: outline 3px `--blue-b` (atau `--sky` di latar gelap), offset 3px.
- Baris projek memakai `<button aria-expanded>`; menu dan panel bisa ditutup dengan Esc.
- Semua gambar punya alt; strip dan marquee dekoratif memakai `aria-hidden`.
- `prefers-reduced-motion`: reveal, judul, marquee, dan strip tidak bergerak; transisi dipersingkat ke 1ms.
- Kontras teks utama memakai `--ink` di atas putih dan putih di atas `--ink`.
