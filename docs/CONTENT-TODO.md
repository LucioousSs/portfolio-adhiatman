# Konten yang masih dibutuhkan

Situsnya sudah selesai dan berjalan tanpa backend. Yang tersisa adalah data nyata yang hanya kamu yang punya. Item di bawah ini sengaja tidak saya karang, karena mengarang data akan merusak satu hal yang paling dijaga di situs ini: kejujuran isinya.

Diperbarui: 22 Oktober 2026, setelah footer dirombak dan ilustrasi penutup ditambahkan.

## Masih terbuka

| # | Item | Status |
|---|------|--------|
| K1 | Tangkapan layar project kode | Ditunda sampai tampilan project-nya selesai kamu ubah |
| K7 | Entri Perjalanan | Menunggu konfirmasi isi dan periodenya |
| K10 | Aset dan data rancangan desain | Menunggu gambar, URL prototipe, dan tahun |
| K11 | Asal dan lisensi ilustrasi footer | Menunggu konfirmasi sumber |

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

### K7. Entri Perjalanan

Teks section Tentang sudah final dan tidak perlu dikonfirmasi lagi: satu blok pendek, "Merancang antarmuka yang enak dipakai, lalu membangunnya sendiri. Mahasiswa Teknologi Informasi di ITB STIKOM Bali.", disimpan di `src/components/About.js`.

Yang belum saya sentuh justru isi Perjalanan (`src/data/journey.js`), karena itu wilayahmu:

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

Kalau ada entri yang perlu ditambah atau dibuang (misalnya magang, sertifikasi, atau lomba), kirim daftarnya.

### K10. Aset dan data rancangan desain

Blok "Rancangan desain" sudah jalan dengan tiga entri: BantuSesama, JelajahNusantara, dan Adidas Samba. Yang belum ada hanya aset dan tiga detail data. Sampai itu datang, kartunya memakai placeholder "Gambar menyusul", dan modalnya tidak menampilkan tautan apa pun.

| Slug | Berkas sampul yang diharapkan |
|------|-------------------------------|
| `bantusesama-app` | `public/images/design/bantusesama-app.webp` |
| `jelajah-nusantara` | `public/images/design/jelajah-nusantara.webp` |
| `adidas-samba-concept` | `public/images/design/adidas-samba-concept.webp` |

1. **Sampul:** lembar komposisi Figma dengan lebar 1600 sampai 1920 px, rasio 16:10. Simpan sebagai WebP sekitar 150 sampai 250 kB, lalu isi `image: '/images/design/<slug>.webp'` di `src/data/projects.js`. Sampul ini tampil berwarna, tanpa filter.
2. **Galeri:** frame individual masuk ke `gallery: ['/images/design/<slug>-1.webp']`. Semuanya tampil di modal, dan panah muncul otomatis kalau lebih dari satu gambar.
3. **Prototipe:** BantuSesama punya prototipe publik, tapi URL-nya belum ada di tangan saya. Isi `prototype: 'https://www.figma.com/proto/...'` pada entri itu, dan tombol "Buka prototipe" langsung muncul di modal. Entri tanpa URL tetap tanpa tombol, bukan tombol mati.
4. **Tahun:** `year` sengaja `null` karena belum kamu sebutkan. Isi `year: '2026'` (atau tahun yang benar) supaya tahun muncul di kartu dan modal. Yang kosong disembunyikan, tidak ditebak.
5. **Deskripsi:** sekarang hanya memakai fakta yang sudah kamu sampaikan. Kalau mau menambah satu kalimat soal isi rancangannya, misalnya layar atau alur apa saja yang ada di dalamnya, kirim teksnya dan saya masukkan.

Catatan Adidas: entri itu sudah diberi label "konsep pribadi, bukan resmi" dan deskripsinya menyebut tidak berafiliasi dengan Adidas. Label itu jangan dihapus selama gambarnya memakai nama Adidas.

### K11. Asal dan lisensi ilustrasi footer

Ilustrasi penutup di footer (`public/images/footer-art.webp`) memakai gambar yang kamu kirim. Saya belum tahu dari mana asalnya, dan itu satu-satunya hal yang belum jelas dari aset ini.

Kalau gambar itu kamu buat sendiri, atau dibeli/diizinkan untuk dipakai, cukup bilang begitu dan item ini ditutup. Kalau ternyata milik orang lain atau hasil alat yang membatasi pemakaian komersial, ganti berkasnya dengan nama yang sama (16:9, sisi terpanjang sekitar 1400 px) supaya tidak ada yang perlu diubah di kode.

Yang sudah dipastikan: gambar itu dekoratif (`alt=""`, `aria-hidden`), dimuat `lazy`, dan tidak dipakai di tempat lain di halaman.

## Sudah beres

Semua ini sudah masuk ke kode dan diverifikasi.

- **K2, deskripsi project versi Inggris:** kamu bilang aman, jadi tidak ada yang diubah.
- **K3, LinkedIn:** `https://www.linkedin.com/in/adhiatman` sekarang dirender di section Kontak, lengkap dengan ikonnya.
- **K4, email dan WhatsApp:** kamu konfirmasi sudah benar, jadi `putuadhi133@gmail.com` dan `+62 896-3526-3050` tetap dipakai.
- **K5, CV:** file yang kamu letakkan di `public/cv/` sudah dipakai. Namanya saya rapikan menjadi `putu-adhiatman-cv.pdf` supaya tidak ada spasi dan huruf besar di URL, dan `src/data/profile.js` menunjuk ke situ.
- **K6, base Vite:** repo ini project site, jadi `base` sudah diset `/portfolio-adhiatman/`. Kalau nanti repo di-rename menjadi `<username>.github.io`, nilai itu harus kembali ke `/`.
- **K8, daftar teknologi dan alat:** kamu bilang aman, jadi `src/data/skills.js` tidak diubah.
- **K9, ikon dari CDN:** kamu pilih tetap seperti sekarang, jadi ikon masih diunduh dari `cdn.jsdelivr.net` dan `cdn.simpleicons.org`. Satu-satunya konsekuensi: tanpa koneksi, ikonnya kosong sementara namanya tetap terbaca.
- **Teks di bawah foto hero:** baris peran "UI/UX Designer & Frontend Developer" di bawah foto sudah dihapus. Peran yang sama masih muncul sebagai marquee di latar hero dan di pernyataan section Tentang, jadi identitasnya tidak hilang.
- **Section Tentang:** satu blok pernyataan rata tengah, setinggi 70 persen layar, langsung setelah hero, dengan judul bergaya sama seperti section lain di kiri, tanpa foto, chip, atau tautan keluar. Tagline dan kalimat bio digabung karena dipisah keduanya terbaca sebagai dua suara. Blok itu naik dari balik wadahnya, garis di bawah judul tergambar dari kiri, lalu tiga frasa menyala berurutan; cahaya 7 persen mengikuti kursor hanya di pointer halus. Tanpa JavaScript atau dengan reduced motion, garisnya sudah penuh dan semua frasa sudah putih.
- **Footer:** peta halaman tiga kolom (brand, Halaman, Kontak) dengan garis rambut, bar bawah berisi sosial, lokasi, dan hak cipta bertahun dinamis, lalu ilustrasi penutup 16:9 yang dekoratif dan lazy. Semua tautannya tujuan nyata.
- **Tautan section:** klik tautan navbar tidak lagi meninggalkan `#work` dan sejenisnya di address bar. Lompatannya tetap anchor biasa; fragmennya dibuang setelah lompatan.
- **Navbar:** sekarang rel mengambang di atas konten, bukan bar penuh selebar layar. Urutan tautannya mengikuti urutan baca: Tentang, Karya, Perjalanan, Kontak. Karena relnya di luar alur, hero memakai layar penuh dan nama besar berjalan di bawahnya; memadatnya rel juga tidak lagi menggeser halaman.
- **Blok rancangan desain:** tiga kartu di bawah tautan GitHub, membuka modal yang sama dengan baris kode. Sampulnya berwarna dan menjadi satu-satunya warna di halaman. Tidak ada baris keempat sampai keenam, karena baris kode menjanjikan repo dan tangkapan layar yang tidak dimiliki rancangan.

## Cara memeriksa setelah ada perubahan

```bash
npm run build
npm run preview    # http://localhost:4173/portfolio-adhiatman/
npm run smoke      # 43 dari 43 harus lolos
```

`npm run shots` menyimpan tangkapan layar hero, Karya, Kontak, Footer, Tentang, dan Perjalanan ke folder sementara. Saya bisa bantu memperbarui `README.md` dan `docs/PRD.md` kalau ada yang berubah.
