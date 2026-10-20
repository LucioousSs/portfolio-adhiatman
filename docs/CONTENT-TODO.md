# Konten yang masih dibutuhkan

Situsnya sudah selesai dan berjalan tanpa backend. Yang tersisa adalah data nyata yang hanya kamu yang punya. Item di bawah ini sengaja tidak saya karang, karena mengarang data akan merusak satu hal yang paling dijaga di situs ini: kejujuran isinya.

Diperbarui: 20 Oktober 2026, setelah jawabanmu untuk K1 sampai K9. Daftar yang sama juga dicatat sebagai item terbuka di `docs/PRD.md` bagian 15.

## Masih terbuka

| # | Item | Status |
|---|------|--------|
| K1 | Tangkapan layar project | Ditunda sampai tampilan project-nya selesai kamu ubah |
| K7 | Bio, tagline, dan Perjalanan | Ditunda sampai desain section Tentang selesai kamu ubah |

### K1. Tangkapan layar project

Kamu bilang mau mengubah tampilan beberapa project dulu, jadi tangkapan layarnya menyusul. Situs tetap utuh tanpa itu: yang tampil sekarang adalah placeholder jujur "Tangkapan layar menyusul", bukan tangkapan layar palsu.

Kalau nanti sudah siap, tiga project yang dipajang dan nama berkas yang diharapkan:

| Slug | Judul | Berkas gambar |
|------|-------|---------------|
| `ud-kariasa-web` | UD. Kariasa | `public/images/projects/ud-kariasa-web.png` |
| `kopikhe-website` | KopiKhe | `public/images/projects/kopikhe-website.png` |
| `todo-life-dashboard` | Todo List Life Dashboard | `public/images/projects/todo-life-dashboard.png` |

Langkahnya:

1. Simpan gambar dengan nama di atas. Lebar 1440 sampai 1920 px sudah cukup, rasio 16:10 atau 16:9 paling enak dilihat di modal.
2. Buka `src/data/projects.js`, ganti `image: null` menjadi `image: '/images/projects/ud-kariasa-web.png'`. Path-nya boleh mulai dari akar situs, karena `projectMedia()` yang menambahkan base deploy.
3. Opsional, kalau mau galeri: `gallery: ['/images/projects/ud-kariasa-web-2.png']`.

Tidak perlu semua sekaligus. Satu project yang sudah punya gambar langsung tampil lengkap, sisanya tetap memakai placeholder.

### K7. Bio, tagline, dan Perjalanan

Kamu bilang mau mengubah desain section Tentang dulu, jadi teks dan datanya saya biarkan apa adanya sampai itu selesai. Isinya sekarang:

**Bio** (`src/components/About.js`, objek `BIO`) menyebut kamu mahasiswa Teknologi Informasi di ITB STIKOM Bali, biasa menyusun mockup di Figma lalu membangun antarmukanya, serta aktif di organisasi kampus.

**Tagline** (`src/data/profile.js`): "Merancang antarmuka yang enak dipakai, lalu membangunnya sendiri."

**Perjalanan** (`src/data/journey.js`):

| Kategori | Entri | Periode sekarang |
|----------|-------|------------------|
| Pendidikan | S1 Teknologi Informasi, ITB STIKOM Bali | 2024 sampai sekarang |
| Organisasi | Kepala Divisi Media & Hubungan Masyarakat, Himpunan Mahasiswa TI | 2026 sampai 2027 |
| Organisasi | Anggota Komite Hubungan Masyarakat, Himpunan Mahasiswa TI | 2025 sampai 2026 |
| Acara | Staf Konsumsi & Kerohanian, Apolo | 2026 |
| Acara | Koordinator Hubungan Masyarakat, Gebyar Teknologi Informasi | 2026 |
| Acara | Koordinator Hubungan Masyarakat, IT Family Gathering | 2025 |
| Acara | Koordinator Peralatan, Gebyar Teknologi Informasi | 2025 |

Babak tahun di section Perjalanan (2024, 2025, 2026) dihitung otomatis dari tahun mulai tiap entri, jadi tahunnya tidak perlu diketik dua kali. Rentang 2026 sampai 2027 tetap dibaca sebagai satu entri di babak 2026, bukan babak 2027.

Kalau nanti desainnya berubah dan ada entri yang perlu ditambah atau dibuang (misalnya magang, sertifikasi, atau lomba), kirim daftarnya.

## Sudah beres

Semua ini sudah masuk ke kode dan diverifikasi.

- **K2, deskripsi project versi Inggris:** kamu bilang aman, jadi tidak ada yang diubah.
- **K3, LinkedIn:** `https://www.linkedin.com/in/adhiatman` sekarang dirender di section Kontak, lengkap dengan ikonnya.
- **K4, email dan WhatsApp:** kamu konfirmasi sudah benar, jadi `putuadhi133@gmail.com` dan `+62 896-3526-3050` tetap dipakai.
- **K5, CV:** file yang kamu letakkan di `public/cv/` sudah dipakai. Namanya saya rapikan menjadi `putu-adhiatman-cv.pdf` supaya tidak ada spasi dan huruf besar di URL, dan `src/data/profile.js` menunjuk ke situ.
- **K6, base Vite:** repo ini project site, jadi `base` sudah diset `/portfolio-adhiatman/`. Kalau nanti repo di-rename menjadi `<username>.github.io`, nilai itu harus kembali ke `/`.
- **K8, daftar teknologi dan alat:** kamu bilang aman, jadi `src/data/skills.js` tidak diubah.
- **K9, ikon dari CDN:** kamu pilih tetap seperti sekarang, jadi ikon masih diunduh dari `cdn.jsdelivr.net` dan `cdn.simpleicons.org`. Satu-satunya konsekuensi: tanpa koneksi, ikonnya kosong sementara namanya tetap terbaca.
- **Teks di bawah foto hero:** baris peran "UI/UX Designer & Frontend Developer" di bawah foto sudah dihapus. Peran yang sama masih muncul sebagai marquee di latar hero, jadi identitasnya tidak hilang.

## Cara memeriksa setelah ada perubahan

```bash
npm run build
npm run preview    # http://localhost:4173/portfolio-adhiatman/
npm run smoke      # 28 dari 28 harus lolos
```

`npm run shots` menyimpan tangkapan layar hero, Karya, Kontak, Tentang, dan Perjalanan ke folder sementara. Saya bisa bantu memperbarui `README.md` dan `docs/PRD.md` kalau ada yang berubah.
