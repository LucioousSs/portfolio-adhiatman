# Portfolio Adhiatman

Landing page statis untuk personal branding I Putu Adhiatman, UI/UX Designer dan Frontend Developer asal Denpasar, Bali. Tidak ada backend: tanpa PHP, tanpa MySQL, tanpa admin dashboard.

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Build | Vite |
| Styling | Tailwind CSS v4 (plugin Vite) |
| Interaksi | JavaScript vanilla, ES Modules |
| Motion | GSAP + ScrollTrigger |
| Font | Archivo Variable (display), Plus Jakarta Sans Variable (body), self-hosted |

## Fitur

- Rel navigasi mengambang di atas konten: tautan section dengan penanda aktif, toggle bahasa, dan progress bar. Memadat saat scroll tanpa menggeser halaman.
- Hero satu layar penuh: nama raksasa satu baris dengan reveal per huruf, foto yang menimpa nama sebagai lapisan depan, marquee latar sebagai tekstur, dan parallax foto.
- Tentang berupa satu pernyataan rata tengah setinggi 70 persen layar, dengan label di kiri pada sumbu judul Karya, langsung setelah hero: tagline dan satu kalimat bio dalam satu blok, tanpa foto, chip, atau tautan keluar.
- Karya pilihan berupa daftar baris (tiga project kode): hover menampilkan preview yang mengikuti kursor, klik membuka modal detail dengan galeri dan tautan, plus satu tautan ke sisa repo di GitHub.
- Rancangan desain di blok sendiri di bawah daftar kode: tiga kartu bersampul berwarna yang membuka modal yang sama, tanpa baris tambahan dan tanpa tombol untuk tautan yang belum ada.
- Perjalanan satu kolom kronologis: babak tahun dengan indeks lengket, garis yang tergambar saat scroll, baris yang menyala saat dilewati, dan detail acara yang dibuka sebaris.
- Marquee teknologi dan alat dengan satu kecepatan terukur (60 px per detik) untuk kedua baris, berhenti saat hover.
- Kontak memakai mailto dan WhatsApp, tanpa server.
- Bilingual Indonesia dan Inggris dengan toggle di navbar, pilihan tersimpan di `localStorage`.
- Menghormati `prefers-reduced-motion`.

## Struktur

```
index.html
vite.config.js
public/                 aset statis (favicon, foto, CV, robots)
src/
  main.js               bootstrap, ganti bahasa
  styles/main.css       token Tailwind, keyframes, util
  lib/                  i18n, motion GSAP, ikon, helper media
  i18n/                 string antarmuka (id, en)
  data/                 konten (profile, projects, skills, journey)
  components/           satu file per section
scripts/smoke.mjs       uji klik-through dengan Chrome headless
scripts/shots.mjs       tangkapan layar hero dan section untuk review visual
.github/workflows/      deploy ke GitHub Pages
docs/PRD.md             dokumen produk
docs/CONTENT-TODO.md    daftar konten yang masih dibutuhkan
```

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:5173/portfolio-adhiatman/
npm run build      # build ke dist/
npm run preview    # http://localhost:4173/portfolio-adhiatman/
```

## Verifikasi

```bash
npm run build
npm run preview    # di terminal lain, buka http://localhost:4173/portfolio-adhiatman/
npm run smoke
```

`npm run smoke` membuka halaman dengan Chrome headless dan memeriksa render hero, tiga baris karya beserta tautan ke GitHub, blok rancangan desain dan kartunya, buka/tutup modal, toggle bahasa, toggle kontak, detail Perjalanan lewat keyboard, kecepatan kedua baris marquee, pernyataan Tentang (termasuk tinggi section dan jumlah barisnya di 360px), menu mobile, kontras teks WCAG AA, overflow pada 360px, ukuran target sentuh, reduced motion, serta error console. Atur `CHROME_PATH` kalau Chrome tidak ada di lokasi umum.

`npm run shots` menyimpan tangkapan layar hero pada 1440, 768, dan 360 piksel plus section Karya (tiga baris kode dan tiga kartu desain), Kontak, Tentang (satu tangkapan per lebar layar), dan Perjalanan (lengkap dengan pemeriksaan indeks lengket dan tinggi panel detail), lalu melaporkan overflow dan lebar nama di beberapa lebar layar. Skrip itu juga mencatat apakah blok Tentang benar-benar masih tersembunyi di balik klipnya sebelum section-nya digulir. Berguna saat menyetel komposisi hero. Hasilnya masuk ke folder sementara; atur `SHOT_DIR` untuk memilih folder lain.

## Mengubah Konten

| Yang diubah | Berkas |
|-------------|--------|
| Nama, peran, email, WhatsApp, sosial, CV | `src/data/profile.js` |
| Pernyataan section Tentang | `src/components/About.js` |
| Daftar project kode dan rancangan desain | `src/data/projects.js` |
| Teknologi dan alat | `src/data/skills.js` |
| Pendidikan, organisasi, acara (periode ditulis sebagai angka `start` dan `end`) | `src/data/journey.js` |
| Teks antarmuka | `src/i18n/id.js`, `src/i18n/en.js` |

### Tangkapan layar project

Setiap project punya `image: null`, jadi sementara ditampilkan placeholder "Tangkapan layar menyusul". Untuk mengaktifkan thumbnail, preview hover, dan galeri modal:

1. Simpan gambar di `public/images/projects/<slug>.png`.
2. Isi `image: '/images/projects/<slug>.png'` pada project tersebut.
3. Untuk galeri tambahan, isi `gallery: ['/images/projects/<slug>-2.png']`.

### CV

Letakkan file PDF di `public/cv/putu-adhiatman-cv.pdf` supaya tombol "Unduh CV" tidak menuju tautan kosong.

Daftar lengkap konten yang masih dibutuhkan, beserta langkah pengisiannya, ada di `docs/CONTENT-TODO.md`.

## Deploy ke GitHub Pages

Workflow di `.github/workflows/deploy.yml` membangun dan mengunggah `dist/` setiap push ke `main`.

1. Di GitHub, buka Settings, lalu Pages, dan set Source ke "GitHub Actions".
2. `vite.config.js` memakai `base: '/portfolio-adhiatman/'` karena repo ini adalah project site. Situsnya akan hidup di `https://lucioousss.github.io/portfolio-adhiatman/`.
3. Kalau nanti repo ini di-rename menjadi `<username>.github.io` (user site), ubah `base` kembali ke `/` dan sesuaikan URL di `scripts/smoke.mjs` serta README ini.

## Keputusan Desain

- Identitas monochrome kinetic dipertahankan: ground nyaris hitam, tinta putih, aksen putih dipakai hemat.
- Setiap animasi punya alasan. Loop abadi hanya pada marquee teknologi dan tekstur hero; keduanya mati saat reduced motion.
- Perjalanan dibaca dari yang paling lama dan babak tahunnya diturunkan dari data, jadi label tahun tidak bisa berbeda dari isinya.
- Kecepatan marquee dihitung dari lebar konten yang diukur, bukan dari durasi tetap, supaya kedua baris selalu sama cepat.
- Tiga karya yang dipajang, sisanya lewat tautan ke GitHub, supaya yang lemah tidak menenggelamkan yang kuat.
- Tidak ada angka, testimoni, atau klaim tanpa bukti. Aset yang belum ada ditandai apa adanya.
- Aset dari luar tidak dipakai untuk dekorasi. Foto yang tampil adalah milik pemilik; foto stok yang menggambarkan orang atau ruang kerja orang lain tidak dipakai, karena itu akan terbaca sebagai cerita pemilik yang sebenarnya tidak terjadi.
- Section Tentang sengaja hanya berisi teks: satu pernyataan rata tengah, setinggi 70 persen layar, tanpa foto dan tanpa tautan keluar.
- Label Tentang ikut sumbu kiri Karya, tapi pernyataannya tetap di tengah: label berperan sebagai penanda section, kalimatnya sebagai satu objek.
- Rancangan desain ditampilkan berwarna. Itu satu-satunya warna di halaman, dan disengaja: yang berwarna adalah hasil desainnya, bukan bingkainya.
- Tentang ditaruh setelah hero, bukan di antara Karya dan Perjalanan: satu kalimat itu menerangkan nama di atas, lalu karya jadi buktinya.
- Navbar berupa rel mengambang dengan radius kecil dan border rambut, bukan pil kaca. Relnya di luar alur, jadi hero memakai layar penuh dan memadatnya navbar tidak menggeser konten.
- Tema gelap tetap, dengan alasan identitas visual, bukan karena sekadar terlihat teknologi.

Detail lengkap ada di `docs/PRD.md`.

## Browser

Chrome, Edge, Firefox, dan Safari versi modern. Butuh dukungan ES Modules dan `prefers-reduced-motion`.

## Lisensi

MIT
