# Design System — Portofolio Farrel Muhammad Zaki

> Semua nilai visual di kode berasal dari token di `:root` pada `src/styles.css`.
> Acuan gaya dan nilai terukur dari situs referensi: `docs/RISET_DESAIN.md`.

Status: **v2 (mengikuti brandappart.com dengan palet hitam–biru–putih)** · Diperbarui 2026-11-03

## 1. Prinsip

1. Cenderung cerah dengan blok gelap sebagai kontras: hero, projek, keahlian, prestasi, stack, dan
   pengalaman terang; showreel, cincin, dan kontak gelap.
2. Huruf display raksasa yang rapat dan judul dua warna (tinta + abu-biru).
3. Gerak terikat scroll dan kursor, bukan dekorasi acak; setiap section punya satu gerak khas.
4. Elemen tetap di keempat sudut (logo, CTA, MENU, jam) mengikuti tema section di bawahnya.

## 2. Warna

| Token | Nilai | Pemakaian |
| --- | --- | --- |
| `--bg` | `#F6F8FC` | Latar utama, teks di atas gelap |
| `--paper` | `#FFFFFF` | Kartu terang |
| `--ink` | `#0B1220` | Teks, section dan panel gelap |
| `--ink-2` / `--ink-3` | `#141D33` / `#1C2847` | Kartu gelap, wordmark footer |
| `--muted` | `#7C8BA6` | Bagian kedua judul dua warna, label sekunder |
| `--slate` | `#475569` | Teks sekunder di latar terang |
| `--blue` / `--blue-b` | `#1D4ED8` / `#2563EB` | Aksen: kata aksen hero, kartu sorotan, tile, tombol hover |
| `--sky` | `#7DB2FF` | Aksen di atas gelap, tile langit |

## 3. Tipografi

| Peran | Font | Nilai |
| --- | --- | --- |
| Display (judul, link menu, nama) | Archivo Variable | bobot 800, `font-stretch: 112%`, `letter-spacing: -0.05em`, `line-height: 0.82` |
| Hero | Archivo | `clamp(54px, 7.8vw, 128px)` (ponsel/tablet `11.5vw`) |
| Judul section | Archivo | `clamp(56px, 9vw, 140px)`; kecil `clamp(44px, 6.4vw, 96px)` |
| Teks | Manrope Variable | 17 px / 1.5 (16 px di ≤ 520 px) |
| Label | IBM Plex Mono 500 | 11 px, kapital, `letter-spacing: 0.04em` |

## 4. Bentuk dan Gerak

| Token | Nilai |
| --- | --- |
| `--r-card` / `--r-panel` | 10 px / 20 px; tombol dan tag berbentuk pill |
| `--ease` | `cubic-bezier(0.36, 0.33, 0, 1)` — warna 0.32 s, opacity 0.42 s, transform 0.64 s |
| `--ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` |
| GSAP | Masuk: `expo.out` 1–1.2 s; stagger kata 0.05–0.06 s |
| `--gut` | `clamp(16px, 2.2vw, 32px)` |

## 5. Breakpoint

| Lebar | Perubahan |
| --- | --- |
| < 1100 px | Hero memakai lebar penuh, turun di bawah logo |
| < 900 px | Dock, garis progres, dan jam disembunyikan; CTA melayang di kanan bawah; mosaik 1 kolom; tile bertumpuk dengan `sticky`; kipas jadi geser horizontal |
| ≤ 520 px | Body 16 px |

## 6. Komponen

| Komponen | Perilaku |
| --- | --- |
| Panel menu | Gelap, lebar ≤ 650 px, radius 20; link 40–60 px putih 50% → penuh saat hover; Esc menutup |
| Dock | Ikon 40 px; hover menampilkan tag pill; section aktif berwarna tinta |
| CTA melayang | Muncul setelah hero, hilang dekat footer |
| Kursor | Titik 12 px `mix-blend-mode: difference`; label pill dari `data-cursor` |
| Kartu projek | Label pill kiri atas; hover: bilah melebar + "Lihat projek", gambar zoom 1.045 |
| Tile keahlian | 4 warna (biru, langit, tinta, putih); desktop di-pin dan terbang ke atas |
| Kartu prestasi | Kipas yang menyebar saat scroll; terang/gelap berselang |
| Panel projek | Dari kanan, radius 20; menandai cover ilustrasi |

## 7. Aksesibilitas

- Fokus keyboard terlihat (biru di terang, langit di gelap); link "Lewati ke konten".
- Judul animasi per kata memakai `aria-label` berisi kalimat utuh.
- Panel menu dan panel projek: Esc menutup, fokus dipindah dan dikembalikan.
- `prefers-reduced-motion`: tanpa Lenis, tanpa animasi scroll, marquee berhenti.
