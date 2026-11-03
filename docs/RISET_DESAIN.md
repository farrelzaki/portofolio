# Riset Desain — brandappart.com

Status: **riset selesai, menunggu persetujuan arah** · Diperiksa: 2026-11-03 lewat browser (viewport 1024×768 dan 1440×900)

Nilai di bawah **diukur langsung** dari halaman (computed style, atribut `style` hasil animasi, struktur DOM),
bukan perkiraan. Kolom "Untuk portofolio" adalah usulan padanannya dengan palet hitam–biru–putih.

## 1. Fondasi visual

| Hal | brandappart.com (terukur) | Untuk portofolio |
| --- | --- | --- |
| Latar | Krem `#FBF9EF` | Putih kebiruan `#F6F8FC` (tetap cerah, lebih dingin) |
| Tinta | Hitam hangat `#171412`; panel gelap kedua `#241F1D` | `#0B1220`; panel kedua `#141D33` |
| Warna kedua pada judul | Taupe `#8E827C` (judul dua warna: "Featured **work**") | Abu-biru `#7C8BA6` |
| Aksen | Oranye `#FE8923`, dipakai hemat (simbol ©, avatar CTA) | Biru `#2563EB` |
| Font display | **Youth** (komersial), bold 700 | Pengganti gratis: **Archivo** variabel (bobot 800, lebar 100–110) |
| Font teks | **PP Neue Montreal** (komersial) | **Manrope** (sudah terpasang) |
| Font label | **IBM Plex Mono**, ±8 px, huruf kapital | IBM Plex Mono (gratis, sama persis) |
| Judul | `line-height` **0.8**, `letter-spacing` **−0.05em**; h1 ±80 px di 1024 px; "big results" ±239 px (±23vw) | Sama |
| Radius | Kartu 8.5 px, panel menu 20 px, tombol pill | Sama |
| Kurva gerak | `cubic-bezier(0.36, 0.33, 0, 1)`; warna 0.32 s, opacity 0.42 s, transform 0.64 s | Sama |
| Scroll | **Lenis** (smooth scroll) | Lenis 1.3.27 |
| Animasi scroll | **GSAP** ScrollTrigger (`pin-spacer`) dan **Flip** (`data-flip-id`) | GSAP 3.15.0 (gratis termasuk plugin) |

## 2. Kerangka tetap (selalu tampil)

| Elemen | Perilaku | Untuk portofolio |
| --- | --- | --- |
| Logo kiri atas | Wordmark bertumpuk dua baris | "Farrel / Zaki" |
| CTA kanan atas | Pill hitam kecil "BOOK A CALL NOW" | "HUBUNGI SAYA" |
| MENU kiri bawah | Teks kapital + titik tiga; hover/klik membuka panel | Sama |
| Panel menu | Panel gelap lebar 650 px, radius 20 px, muncul dari kiri (opacity 0.42 s + transform 0.64 s). Link raksasa 56 px berwarna putih 50%, link yang di-hover menjadi penuh (0.32 s). Ada "+" untuk submenu, link kecil kapital, dan ikon sosial di bawah | Sama: Projek, Keahlian, Pengalaman, Prestasi, Kontak |
| Dock ikon kiri | 6 ikon dalam kotak membulat, vertikal di tengah layar | Ikon per section |
| Garis progres kanan | Garis tipis vertikal + titik yang turun mengikuti scroll | Sama |
| Jam lokal kanan bawah | "Paris, France 7:28 PM" | "Bogor, Indonesia 19:28" (jam berjalan) |
| Pill CTA melayang | Muncul setelah hero: pill gelap "Book a free discovery call · BOOK A CALL" + avatar | "Ada projek atau lowongan? · HUBUNGI SAYA" + foto |
| Kursor kustom | Titik 12 px `mix-blend-mode: difference`; di atas kartu berubah jadi label "See our case studies →" | "Lihat projek →" |

## 3. Section dan gerakannya

| # | Section referensi | Gerakan (terukur) | Untuk portofolio |
| --- | --- | --- | --- |
| 1 | **Hero** | Judul raksasa di tengah dengan satu glyph beraksen. **Jejak gambar mengikuti kursor**: gambar muncul di titik kursor dengan rotasi acak (±40°), lalu scale dan opacity turun bersamaan dari 1 ke 0. Di bawahnya marquee logo klien, paragraf pendek, dan CTA + avatar | Judul "Software yang bisa diandalkan" dengan aksen biru; jejak gambar memakai cover projek dan sertifikat; marquee logo teknologi |
| 2 | **Showreel** | Garis membulat (lebar 688 px, tinggi 0, radius 9 px) di bawah hero **membesar mengikuti scroll** hingga penuh layar (radius 0) memakai GSAP Flip; isi video bergeser parallax ±15%. Strip thumbnail di bawahnya | Montase layar projek (LensaJentik dan screenshot lain) atau video rekaman layar |
| 3 | **Featured work** | Judul dua warna + panah ↓. Mosaik 2 kolom: kartu pertama selebar penuh, lalu dua kolom; satu kartu testimoni berwarna diselipkan. Kartu gelap radius 8.5 px dengan label kiri atas (judul display 18 px + meta mono tahun/kategori). **Hover: bilah label melebar ke seluruh lebar kartu** dan muncul "DISCOVER CASE" di kanan; video pratinjau diputar | 5 projek; kartu biru berisi sorotan "Finalis Hackathon IFEST 2026" menggantikan testimoni |
| 4 | **See more work** | Section gelap. **Cincin kartu projek dan gantungan kunci berputar** mengelilingi teks raksasa; rotasi terikat scroll (257° → …). Kata-kata judul masuk satu per satu | Cincin sertifikat dan cover mengelilingi "Lihat semua prestasi" |
| 5 | **What we ship** | Judul dua warna. **Tumpukan kartu warna (biru, oranye, merah) di-pin**: kartu depan terbang ke atas (`translateY(-100vh) rotateX(15deg)`), kartu berikutnya naik dari belakang (`translateZ` negatif, `rotateX` kecil → 0). Tiap kartu: nomor (01), judul, deskripsi, kutipan, dan deretan gambar | 4 kartu Keahlian dengan warna biru `#1D4ED8`, langit `#7DB2FF`, tinta `#0B1220`, putih |
| 6 | **Trusted by +40 founders** | Kartu testimoni **bertumpuk seperti kipas** (rotasi kecil, warna krem dan taupe berselang) yang **menyebar** saat di-scroll | **Tidak dipakai untuk testimoni** (tidak ada testimoni asli). Dipakai untuk Pengalaman/organisasi sebagai kartu kipas |
| 7 | **Small team, big results** | Teks raksasa dua warna dengan **cincin 3D foto tim ("tornado")** yang berputar di depan dan belakang teks | Cincin 3D kartu tech stack mengelilingi "Satu orang, banyak stack" |
| 8 | **Footer** | Gelap. Judul raksasa dua warna "Make every pixel pay for itself!", CTA, kolom sitemap kecil kapital, ikon sosial, **wordmark raksasa** di dasar. **Gantungan kunci jatuh dan memantul** (fisika) di atas | "Ayo bikin sesuatu yang berguna." + email; stiker teknologi jatuh dengan fisika (opsional, matter-js 0.20.0) |

Animasi umum: judul dipecah per kata dan naik dari bawah; warna kedua judul memudar masuk; section terang
dan gelap berganti tegas (krem → hitam → krem).

## 4. Kebutuhan aset (penting)

Gaya referensi sangat bergantung pada **gambar dan video**. Saat ini portofolio hanya punya 1 screenshot
projek (LensaJentik) dan 4 sertifikat. Agar hasilnya setara, dibutuhkan:

| Aset | Untuk | Status |
| --- | --- | --- |
| Foto profil (latar polos) | Pill CTA, kontak, avatar | Belum ada |
| Screenshot asli SUDEPI, ReservaSeat, Cocokin!, Trisis Gym (2–3 per projek) | Mosaik, jejak kursor, cincin | Belum ada |
| Rekaman layar 10–20 detik (opsional) | Showreel dan pratinjau video di kartu | Belum ada |
| Slide lain dari pitch deck LensaJentik | Tambahan gambar | Bisa diekstrak dari PDF yang ada |

Sampai aset tersedia, posisinya diisi ilustrasi antarmuka yang digambar dengan kode (seperti sekarang),
dan bisa diganti lewat admin setelah T-08 selesai.

## 5. Yang sengaja tidak ditiru

- Logo klien, testimoni, dan angka klien, karena tidak ada versi aslinya untuk Farrel (`PRD.md` BR-01).
- Font Youth dan Neue Montreal (berbayar); diganti padanan gratis.
- Gambar 3D gantungan kunci (aset milik brandappart); diganti gambar milik Farrel.
- Analitik dan pelacak (PostHog, GTM, Facebook Pixel).
