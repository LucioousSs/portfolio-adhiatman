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

- Hero satu layar penuh: nama raksasa satu baris dengan reveal per huruf, foto yang menimpa nama sebagai lapisan depan, marquee latar sebagai tekstur, dan parallax foto.
- Karya pilihan berupa daftar baris: hover menampilkan preview yang mengikuti kursor, klik membuka modal detail dengan galeri dan tautan.
- Bio dengan reveal per kata dan badge soft skill magnetik.
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
npm run dev        # server pengembangan
npm run build      # build ke dist/
npm run preview    # pratinjau hasil build di port 4173
```

## Verifikasi

```bash
npm run build
npm run preview    # di terminal lain
npm run smoke
```

`npm run smoke` membuka halaman dengan Chrome headless dan memeriksa render hero, buka/tutup modal, toggle bahasa, toggle kontak, detail Perjalanan lewat keyboard, kecepatan kedua baris marquee, menu mobile, kontras teks WCAG AA, overflow pada 360px, ukuran target sentuh, reduced motion, serta error console. Atur `CHROME_PATH` kalau Chrome tidak ada di lokasi umum.

`npm run shots` menyimpan tangkapan layar hero pada 1440, 768, dan 360 piksel plus section Kontak, Tentang, dan Perjalanan (lengkap dengan pemeriksaan indeks lengket dan tinggi panel detail), lalu melaporkan overflow dan lebar nama di beberapa lebar layar. Berguna saat menyetel komposisi hero. Hasilnya masuk ke folder sementara; atur `SHOT_DIR` untuk memilih folder lain.

## Mengubah Konten

| Yang diubah | Berkas |
|-------------|--------|
| Nama, peran, tagline, email, WhatsApp, sosial, CV | `src/data/profile.js` |
| Daftar project | `src/data/projects.js` |
| Teknologi, alat, soft skills | `src/data/skills.js` |
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
2. Untuk user site, repositori harus bernama `<username>.github.io` dan `base` di `vite.config.js` tetap `/`.
3. Kalau memakai project site (misalnya `portfolio-adhiatman`), ubah `base` menjadi `/portfolio-adhiatman/`.

## Keputusan Desain

- Identitas monochrome kinetic dipertahankan: ground nyaris hitam, tinta putih, aksen putih dipakai hemat.
- Setiap animasi punya alasan. Loop abadi hanya pada marquee teknologi dan tekstur hero; keduanya mati saat reduced motion.
- Perjalanan dibaca dari yang paling lama dan babak tahunnya diturunkan dari data, jadi label tahun tidak bisa berbeda dari isinya.
- Kecepatan marquee dihitung dari lebar konten yang diukur, bukan dari durasi tetap, supaya kedua baris selalu sama cepat.
- Tidak ada angka, testimoni, atau klaim tanpa bukti. Aset yang belum ada ditandai apa adanya.
- Tema gelap tetap, dengan alasan identitas visual, bukan karena sekadar terlihat teknologi.

Detail lengkap ada di `docs/PRD.md`.

## Browser

Chrome, Edge, Firefox, dan Safari versi modern. Butuh dukungan ES Modules dan `prefers-reduced-motion`.

## Lisensi

MIT
