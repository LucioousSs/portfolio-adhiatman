# Konten yang masih dibutuhkan

Situsnya sudah selesai dan berjalan tanpa backend. Yang tersisa adalah data nyata yang hanya kamu yang punya. Item di bawah ini sengaja tidak saya karang, karena mengarang data akan merusak satu hal yang paling dijaga di situs ini: kejujuran isinya.

Diperbarui: 19 Oktober 2026. Daftar yang sama juga dicatat sebagai item terbuka di `docs/PRD.md` bagian 15.

## Ringkasan

| # | Item | Berkas yang diubah | Kalau belum diisi |
|---|------|--------------------|-------------------|
| K1 | Tangkapan layar 6 project | `public/images/projects/<slug>.png`, lalu `src/data/projects.js` | Preview hover dan galeri modal menampilkan "Tangkapan layar menyusul" |
| K2 | Cek deskripsi project versi Inggris | `src/data/projects.js` | Teks Inggris memakai tulisan saya, belum kamu baca |
| K3 | URL LinkedIn asli | `src/data/profile.js` dan `src/lib/icons.js` | LinkedIn tidak dirender sama sekali |
| K4 | Konfirmasi email dan WhatsApp | `src/data/profile.js` | Situs memakai nilai sementara |
| K5 | File CV PDF | `public/cv/putu-adhiatman-cv.pdf` | Tombol "Unduh CV" menuju tautan kosong |
| K6 | Nama repositori dan `base` Vite | `vite.config.js`, `README.md` | Aset berisiko 404 di GitHub Pages |
| K7 | Konfirmasi bio, tagline, dan Perjalanan | `src/components/About.js`, `src/data/profile.js`, `src/data/journey.js` | Teks dan tahun masih versi saya |
| K8 | Konfirmasi daftar teknologi dan alat | `src/data/skills.js` | Bisa jadi terlalu banyak atau ada yang kurang |
| K9 | Keputusan soal ikon dari CDN | `src/data/skills.js` | Ikon diunduh dari jsdelivr dan simpleicons setiap halaman dibuka |

## Detail

### K1. Tangkapan layar project

Setiap project masih `image: null`, jadi yang tampil adalah placeholder jujur "Tangkapan layar menyusul". Enam project dan nama berkas yang diharapkan:

| Slug | Judul | Berkas gambar |
|------|-------|---------------|
| `ud-kariasa-web` | UD. Kariasa | `public/images/projects/ud-kariasa-web.png` |
| `kopikhe-website` | KopiKhe | `public/images/projects/kopikhe-website.png` |
| `todo-life-dashboard` | Todo List Life Dashboard | `public/images/projects/todo-life-dashboard.png` |
| `bimaone-api` | bimaone-api | `public/images/projects/bimaone-api.png` |
| `phpmail` | phpMail | `public/images/projects/phpmail.png` |
| `data-resep-mobile` | Data Resep Mobile | `public/images/projects/data-resep-mobile.png` |

Langkahnya:

1. Simpan gambar dengan nama di atas. Lebar 1440 sampai 1920 px sudah cukup, rasio 16:10 atau 16:9 paling enak dilihat di modal.
2. Buka `src/data/projects.js`, ganti `image: null` menjadi `image: '/images/projects/ud-kariasa-web.png'` (tanpa `public`, karena isi `public/` dilayani dari akar situs).
3. Opsional, kalau mau galeri: `gallery: ['/images/projects/ud-kariasa-web-2.png']`.

Tidak perlu semua sekaligus. Satu project yang sudah punya gambar langsung tampil lengkap, sisanya tetap memakai placeholder.

Untuk `bimaone-api` yang masih tahap awal, tangkapan layar terminal atau respons endpoint juga sah. Lebih baik apa adanya daripada tidak ada.

### K2. Deskripsi project versi Inggris

Semua deskripsi Inggris di `src/data/projects.js` adalah terjemahan saya. Isinya sudah saya jaga setia dengan versi Indonesia, tapi silakan baca ulang dan perbaiki kalau ada istilah yang kamu tidak nyaman memakainya. Yang paling perlu dicek: penamaan peran (`role`) dan label stack, karena keduanya saya turunkan dari ringkasan repo, bukan dari catatanmu.

### K3. URL LinkedIn

LinkedIn tidak dirender karena nilai di kode lama masih `https://linkedin.com` (placeholder). Kalau URL aslinya sudah ada, ada dua tempat yang perlu diubah:

1. `src/lib/icons.js`: tambahkan ikon LinkedIn di objek `icons` (pola `solid('<path d="..."/>')`), lalu daftarkan di objek `socialIcon` dengan key `linkedin`.
2. `src/data/profile.js`: tambahkan `{ key: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/...' }` ke array `socials`.

Kalau tidak ada LinkedIn, tidak ada yang perlu diubah. Bagian itu tetap bersih.

### K4. Email dan WhatsApp

Nilai yang dipakai sekarang:

| Field | Nilai sekarang |
|-------|----------------|
| `email` | `putuadhi133@gmail.com` |
| `whatsapp` | `6289635263050` (format internasional, tanpa tanda plus dan tanpa spasi untuk tautan) |
| `whatsappDisplay` | `+62 896-3526-3050` (yang terlihat di halaman) |

Tolong pastikan nomor WhatsApp-nya benar, karena tombol kirim membuka `wa.me` dengan nomor itu. Kalau berubah, ubah ketiga nilai di `src/data/profile.js` sekaligus.

### K5. File CV

`src/data/profile.js` menunjuk ke `/cv/putu-adhiatman-cv.pdf`. Letakkan file PDF-nya di:

```
public/cv/putu-adhiatman-cv.pdf
```

Nama berkas harus persis itu, atau ubah nilai `cv` di `src/data/profile.js` menyesuaikan nama filemu. Sebelum file ada, tombol "Unduh CV" di section Kontak mengarah ke tautan kosong.

### K6. Nama repositori dan `base` Vite

Remote repo sekarang: `https://github.com/LucioousSs/portfolio-adhiatman.git`. Namanya bukan `<username>.github.io`, jadi kalau repo ini yang kamu push ke GitHub Pages, situsnya menjadi **project site** dan `base: '/'` di `vite.config.js` membuat semua aset 404. Ada dua jalan keluar:

1. **Biarkan repo seperti sekarang**, lalu ubah `vite.config.js`:

   ```js
   base: '/portfolio-adhiatman/',
   ```

   Efek samping yang perlu ikut diubah: `npm run preview` melayani situs di `http://localhost:4173/portfolio-adhiatman/`, bukan di akar, jadi `SMOKE_URL` dan petunjuk di `README.md` perlu menyesuaikan.
2. **Buat repo baru bernama `lucioousss.github.io`** (atau rename repo ini kalau memang mau dipakai sebagai situs utama akun). Dengan begitu `base: '/'` sudah benar dan tidak ada yang perlu diubah.

Sebutkan pilihanmu, karena saya yang akan menyesuaikan `vite.config.js`, `README.md`, dan perintah verifikasinya sekaligus.

### K7. Konfirmasi bio, tagline, dan entri Perjalanan

Semua ini ditulis dari data yang ada di kode lama dan dari ringkasan repo. Perlu kamu baca ulang:

**Bio** (`src/components/About.js`, objek `BIO`) menyebut kamu mahasiswa Teknologi Informasi di ITB STIKOM Bali, biasa menyusun mockup di Figma lalu membangun antarmukanya, serta aktif di organisasi kampus.

**Tagline** (`src/data/profile.js`): "Merancang antarmuka yang enak dipakai, lalu membangunnya sendiri."

**Perjalanan** (`src/data/journey.js`):

| Kategori | Entri | Periode sekarang | Yang perlu dikonfirmasi |
|----------|-------|------------------|------------------------|
| Pendidikan | S1 Teknologi Informasi, ITB STIKOM Bali | 2024 sampai sekarang | Tahun mulai 2024 dan penanda "sekarang" |
| Organisasi | Kepala Divisi Media & Hubungan Masyarakat, Himpunan Mahasiswa TI | 2026 sampai 2027 | Nama jabatan dan kepanjangan periode akhir |
| Organisasi | Anggota Komite Hubungan Masyarakat, Himpunan Mahasiswa TI | 2025 sampai 2026 | Nama jabatan |
| Acara | Staf Konsumsi & Kerohanian, Apolo | 2026 | Nama peran dan nama acara |
| Acara | Koordinator Hubungan Masyarakat, Gebyar Teknologi Informasi | 2026 | Nama peran |
| Acara | Koordinator Hubungan Masyarakat, IT Family Gathering | 2025 | Nama peran |
| Acara | Koordinator Peralatan, Gebyar Teknologi Informasi | 2025 | Nama peran |

Catatan cara kerja datanya: babak tahun di section Perjalanan (2024, 2025, 2026) dihitung otomatis dari tahun mulai tiap entri, jadi kamu tidak perlu mengetik tahunnya dua kali. Rentang 2026 sampai 2027 tetap dibaca sebagai satu entri di babak 2026, bukan babak 2027. Semua deskripsi acara juga punya versi Inggris hasil tulisan saya yang perlu kamu cek.

Kalau ada entri yang salah atau ada yang hilang (misalnya magang, sertifikasi, atau lomba), kirim daftarnya dan saya susun ulang.

### K8. Daftar teknologi dan alat

Daftar di `src/data/skills.js` sekarang:

- **Teknologi:** HTML5, CSS3, JavaScript, PHP, Laravel, Tailwind CSS, Go, Kotlin, Git
- **Alat & Aplikasi:** Android Studio, VS Code, Figma, Docker, Cisco Packet Tracer

Yang perlu dicek: ada yang belum kamu pakai cukup sering, dan ada yang penting tapi belum masuk. Daftar ini muncul di marquee, jadi panjangnya juga memengaruhi berapa lama satu putaran penuh.

### K9. Ikon dari CDN

Ikon teknologi dan alat diunduh dari `cdn.jsdelivr.net` dan `cdn.simpleicons.org` saat halaman dibuka. Jadi situs ini bukan sepenuhnya bebas permintaan luar, dan kalau offline ikonnya kosong (namanya tetap terbaca).

Dua pilihan:

1. Biarkan seperti sekarang, halaman tetap ringan dan ikon selalu terbaru.
2. Saya salin ikonnya ke `public/icons/` supaya nol permintaan luar, dengan konsekuensi repo bertambah sekitar belasan berkas SVG.

Sebutkan pilihanmu, karena ini keputusan yang memengaruhi prinsip "tanpa ketergantungan luar".

## Setelah terisi

Jalankan `npm run build`, lalu `npm run smoke` (harus tetap 27 dari 27), dan `npm run shots` untuk melihat perubahannya di tangkapan layar. Saya bisa bantu sekaligus memperbarui `README.md` dan `docs/PRD.md` kalau ada yang berubah.
