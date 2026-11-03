// Semua konten portofolio ada di sini. Ubah teks/tautan di file ini saja.
import lensa from './assets/lensajentik.jpg'
import certIfest from './assets/cert-ifest.jpg'
import certEnergy from './assets/cert-energy.jpg'
import certTic from './assets/cert-tic.jpg'
import certHimavo from './assets/cert-himavo.jpg'

export const profile = {
  name: 'Farrel Muhammad Zaki',
  email: 'farrelmzaki77@gmail.com',
  whatsapp: '6289523006094',
  // Isi tautan di bawah agar tombolnya muncul. Kosong = disembunyikan.
  links: { linkedin: '', github: '', instagram: '', cv: '' },
}

export const stack = [
  'Laravel', 'MongoDB', 'React', 'Next.js', 'TypeScript', 'REST API',
  'Flutter', 'Web-GIS', 'Capacitor', 'PHPUnit', 'Postman', 'Figma',
]

export const projects = [
  {
    id: 'lensajentik', cover: 'image', image: lensa,
    name: 'LensaJentik',
    tags: ['Web-GIS', 'Open-Meteo', 'Crowdsourcing'],
    cat: { id: 'Web-GIS · Kesehatan', en: 'Web-GIS · Health' },
    text: {
      id: 'Platform Web-GIS yang menyatukan cuaca real-time, angka bebas jentik dari kader, dan laporan warga menjadi peta risiko DBD dan Malaria per kecamatan. Ada skor risiko 0–100, prediksi 14 hari, notifikasi otomatis, dan gamifikasi untuk warga.',
      en: 'A Web-GIS platform that merges real-time weather, larvae-free rates from health volunteers and citizen reports into a dengue and malaria risk map per district. It adds a 0–100 risk score, a 14-day forecast, automatic alerts and citizen gamification.',
    },
  },
  {
    id: 'sudepi', cover: 'sudepi',
    name: 'SUDEPI',
    tags: ['Edge AI', 'ONNX INT8', 'Capacitor', 'Offline-first'],
    cat: { id: 'Aksesibilitas · Finalis IFEST 2026', en: 'Accessibility · IFEST 2026 finalist' },
    text: {
      id: 'Asisten transaksi tunai untuk tunanetra. Kamera membaca banyak lembar Rupiah sekaligus, menghitung kembalian, dan berjalan 100% offline di Android. Peran saya di backend: konversi model YOLOv8-Nano ke ONNX INT8 (±6 MB), state machine transaksi, kalkulator kembalian, filter IoU, dan basis data lokal.',
      en: 'A cash-transaction assistant for blind users. The camera reads several Rupiah notes at once, calculates change and runs 100% offline on Android. My part was the backend: converting YOLOv8-Nano to ONNX INT8 (~6 MB), the transaction state machine, change calculator, IoU filter and the local database.',
    },
  },
  {
    id: 'reservaseat', cover: 'reservaseat',
    name: 'ReservaSeat',
    tags: ['Laravel 13', 'MongoDB', 'Flutter', 'PHPUnit'],
    cat: { id: 'REST API · Multi-platform', en: 'REST API · Multi-platform' },
    text: {
      id: 'Sistem reservasi meja restoran multi-cabang. Satu RESTful API Laravel + MongoDB melayani aplikasi Flutter untuk pelanggan dan dasbor Blade untuk admin. 10 endpoint diuji dengan PHPUnit dan Postman, respons rata-rata 214–589 ms, dan konflik slot waktu ditolak dengan 422.',
      en: 'A multi-branch restaurant table reservation system. One Laravel + MongoDB RESTful API serves a Flutter app for customers and a Blade dashboard for admins. 10 endpoints tested with PHPUnit and Postman, 214–589 ms average response, and overlapping slots rejected with a 422.',
    },
  },
  {
    id: 'cocokin', cover: 'cocokin',
    name: 'Cocokin!',
    tags: ['Next.js 15', 'React 19', 'TypeScript', 'Gemini 2.5 Flash'],
    cat: { id: 'Web · Pendidikan', en: 'Web · Education' },
    text: {
      id: 'Platform rekomendasi jurusan dan simulasi akademik untuk siswa SMA kelas akhir. Mesin skoring deterministik (korelasi Pearson, sigmoid passing score, aturan SNBP/SNBT 2026) dipadukan dengan Gemini 2.5 Flash. Proposal untuk Hackathon JOINTS UGM 2026.',
      en: 'A major-recommendation and academic-simulation platform for final-year high-school students. A deterministic scoring engine (Pearson correlation, sigmoid passing score, SNBP/SNBT 2026 rules) is combined with Gemini 2.5 Flash. Proposed for the JOINTS UGM 2026 Hackathon.',
    },
  },
  {
    id: 'trisis', cover: 'trisis',
    name: 'Trisis Gym',
    tags: ['Full-stack', 'QR scanner', 'Membership'],
    cat: { id: 'Sistem absensi · Proyek klien', en: 'Attendance system · Client project' },
    text: {
      id: 'Sistem scan absensi untuk gym klien, menggantikan pencatatan manual di buku yang menyulitkan pemantauan dan manajemen membership. Saya mengerjakannya sebagai full-stack developer.',
      en: 'A scan-based attendance system for a client’s gym, replacing paper-book logging that made memberships hard to track and manage. I worked on it as the full-stack developer.',
    },
  },
]

export const services = [
  {
    key: 'backend', title: { id: 'Backend', en: 'Backend' },
    text: {
      id: 'REST API, logika bisnis, dan basis data yang konsisten. Validasi konflik slot, autentikasi token, state machine, dan pengujian otomatis.',
      en: 'REST APIs, business logic and consistent data. Slot-conflict validation, token auth, state machines and automated tests.',
    },
    tags: ['Laravel', 'PHP', 'MongoDB', 'PHPUnit', 'Postman'],
  },
  {
    key: 'frontend', title: { id: 'Frontend', en: 'Frontend' },
    text: {
      id: 'Antarmuka web yang cepat dan jelas. Komponen React, aksesibilitas, dan animasi yang punya alasan.',
      en: 'Fast, clear web interfaces. React components, accessibility and motion that has a reason.',
    },
    tags: ['React', 'Next.js', 'TypeScript', 'CSS'],
  },
  {
    key: 'fullstack', title: { id: 'Full-stack', en: 'Full-stack' },
    text: {
      id: 'Dari database sampai layar, dibawa sampai dipakai. Salah satunya sistem scan absensi gym yang menggantikan buku catatan.',
      en: 'From database to screen, carried through to real use. One of them is a gym attendance scanner that replaced a paper logbook.',
    },
    tags: ['REST API', 'Web', 'Mobile', 'Deploy'],
  },
  {
    key: 'design', title: { id: 'Desain web & grafis', en: 'Web & graphic design' },
    text: {
      id: 'Rancangan UI/UX di Figma sebelum kode ditulis, supaya yang dibangun sudah jelas bentuknya.',
      en: 'UI/UX designed in Figma before code is written, so what gets built already has a clear shape.',
    },
    tags: ['Figma', 'UI/UX', 'Prototyping'],
  },
]

export const experience = [
  {
    date: '2024 — 2028',
    title: { id: 'Software Engineering', en: 'Software Engineering' },
    org: 'IPB University, Bogor',
    text: {
      id: 'Kuliah rekayasa perangkat lunak. Sebagian besar projek di portofolio ini lahir dari tugas proyek, hackathon, dan kompetisi kampus.',
      en: 'Studying software engineering. Most projects in this portfolio came out of coursework, hackathons and campus competitions.',
    },
  },
  {
    date: 'Okt 2024 — Nov 2025',
    title: { id: 'Digital Media Staff', en: 'Digital Media Staff' },
    org: 'Himavo Micro IT Community, IPB',
    text: {
      id: 'Anggota Biro Digital Media periode 2024/2025 dengan predikat Baik.',
      en: 'Member of the Digital Media Bureau for 2024/2025, rated “Baik” (Good).',
    },
  },
]

export const achievements = [
  {
    image: certIfest,
    title: { id: 'Finalis Hackathon IFEST 2026', en: 'Finalist, Hackathon IFEST 2026' },
    meta: { id: 'Informatics Festival, FMIPA UNPAD', en: 'Informatics Festival, FMIPA UNPAD' },
    text: { id: 'Tim PenungguTokenReset dengan SUDEPI.', en: 'Team PenungguTokenReset with SUDEPI.' },
  },
  {
    image: certEnergy,
    title: { id: 'Semifinalis Lomba Poster Ilmiah', en: 'Semifinalist, Scientific Poster Competition' },
    meta: { id: 'Energy Week 2025, BRIN · 17 Des 2025', en: 'Energy Week 2025, BRIN · 17 Dec 2025' },
    text: { id: 'Poster tinjauan literatur ubi jalar sebagai bahan baku bioetanol.', en: 'Literature-review poster on sweet potato as a bioethanol feedstock.' },
  },
  {
    image: certTic,
    title: { id: 'Peserta TIC 9.0', en: 'Participant, TIC 9.0' },
    meta: { id: 'HIMATIF Universitas Jember · 22 Jun – 16 Agu 2026', en: 'HIMATIF Universitas Jember · 22 Jun – 16 Aug 2026' },
    text: { id: 'Technology Innovative Challenge tingkat nasional.', en: 'National Technology Innovative Challenge.' },
  },
  {
    image: certHimavo,
    title: { id: 'Anggota Himavo Micro IT', en: 'Member, Himavo Micro IT' },
    meta: { id: 'Biro Digital Media · 2024/2025', en: 'Digital Media Bureau · 2024/2025' },
    text: { id: 'Sertifikat keanggotaan, predikat Baik.', en: 'Membership certificate, rated Good.' },
  },
]

export const ui = {
  id: {
    nav: { projects: 'Projek', skills: 'Keahlian', experience: 'Pengalaman', achievements: 'Prestasi', contact: 'Kontak', cta: 'Hubungi saya', menu: 'Menu', close: 'Tutup' },
    hero: {
      l1: 'Software yang', l2a: 'bisa ', l2b: 'diandalkan', l2c: '.',
      sub: 'Saya Farrel Muhammad Zaki, mahasiswa Software Engineering IPB University. Saya mengerjakan backend, frontend, dan full-stack, dari API reservasi sampai sistem scan absensi gym, dan sudah sampai final di hackathon nasional.',
      cta1: 'Lihat projek', cta2: 'Hubungi saya',
      stats: [['5', 'projek pilihan'], ['3', 'lomba & kompetisi'], ['10', 'endpoint API teruji']],
    },
    projects: { title: 'Projek pilihan', hint: 'Arahkan kursor ke baris untuk melihat tampilannya.', role: 'Teknologi' },
    skills: { title: 'Yang saya kerjakan' },
    experience: { title: 'Pendidikan & pengalaman' },
    achievements: { title: 'Prestasi & sertifikat' },
    contact: { title: 'Ayo ngobrol.', sub: 'Ada projek, magang, atau kolaborasi? Kirim kabar, saya balas secepatnya.', email: 'Kirim email', wa: 'WhatsApp' },
    footer: { rights: 'Dibuat dengan React.', top: 'Kembali ke atas' },
  },
  en: {
    nav: { projects: 'Projects', skills: 'Skills', experience: 'Experience', achievements: 'Achievements', contact: 'Contact', cta: 'Let’s talk', menu: 'Menu', close: 'Close' },
    hero: {
      l1: 'Software you', l2a: 'can ', l2b: 'rely on', l2c: '.',
      sub: 'I’m Farrel Muhammad Zaki, a Software Engineering student at IPB University. I work across backend, frontend and full-stack, from reservation APIs to gym attendance scanners, and I’ve reached the finals of a national hackathon.',
      cta1: 'See projects', cta2: 'Get in touch',
      stats: [['5', 'selected projects'], ['3', 'competitions'], ['10', 'API endpoints tested']],
    },
    projects: { title: 'Selected projects', hint: 'Hover a row to preview it.', role: 'Technology' },
    skills: { title: 'What I do' },
    experience: { title: 'Education & experience' },
    achievements: { title: 'Achievements & certificates' },
    contact: { title: 'Let’s talk.', sub: 'A project, an internship or a collaboration? Drop a line and I’ll reply as soon as I can.', email: 'Send an email', wa: 'WhatsApp' },
    footer: { rights: 'Built with React.', top: 'Back to top' },
  },
}
