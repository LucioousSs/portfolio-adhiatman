# PRD: Portfolio Adhiatman menjadi Landing Page Statis

Status: draft terimplementasi
Versi: 2.0
Tanggal: 19 Oktober 2026

---

## 1. Ringkasan

Portfolio lama adalah aplikasi PHP + MySQL dengan admin dashboard untuk mengelola project dan pengalaman lewat CRUD. Struktur itu berat untuk kebutuhan sebenarnya: memperkenalkan diri dan menunjukkan karya. Setiap kunjungan menembak API, dan kontennya tidak bisa tampil kalau backend mati.

PRD ini mengubah portfolio menjadi **satu landing page statis tanpa backend**. Semua konten disimpan di file data, halaman dibangun dengan Vite, dan hasilnya adalah aset statis yang bisa di-host di GitHub Pages. Tidak ada database, tidak ada login, tidak ada endpoint.

## 2. Tujuan dan kriteria sukses

| # | Tujuan | Kriteria terukur |
|---|--------|------------------|
| G1 | Pengunjung paham siapa pemiliknya dalam sekali layar | Hero memuat nama, foto, dan satu CTA; peran terbaca di bio Tentang |
| G2 | Karya bisa dilihat tanpa hambatan teknis | Tidak ada request ke API, halaman tetap utuh tanpa server |
| G3 | Pengunjung bisa menghubungi dalam maksimal dua klik | Email dan WhatsApp tersedia di section kontak dan footer navigasi |
| G4 | Situs terasa cepat dan rapi di semua ukuran layar | Skor Lighthouse mobile Performance >= 90, tidak ada overflow horizontal 320px sampai 1440px |
| G5 | Identitas visual tetap khas, tidak generik | Monochrome kinetic dipertahankan, semua keputusan visual punya alasan tertulis |

## 3. Non-goals

- Tanpa CMS, login, atau panel admin.
- Tanpa database dan tanpa penyimpanan sisi server.
- Tanpa blog.
- Tanpa form yang mengirim data ke server sendiri (kontak memakai mailto dan WhatsApp).
- Tanpa testimoni, angka statistik, atau logo klien (tidak ada data nyata, jadi tidak ditampilkan).

## 4. Audiens dan positioning

- **Audiens utama:** recruiter, dosen pembimbing, teman tim organisasi, dan calon kolaborator.
- **Pesan utama:** mahasiswa Teknologi Informasi yang mendesain antarmuka lalu membangunnya sendiri, berbasis di Denpasar, Bali.
- **Aksi yang diharapkan:** melihat karya, mengunduh CV, atau menghubungi lewat email/WhatsApp.
- **Status:** terbuka untuk kolaborasi, disebutkan sebagai kalimat pembuka di section Kontak.

## 5. Arah desain dan dials

> Reading this as: personal portfolio landing untuk recruiter dan calon kolaborator, dengan bahasa visual monochrome kinetic brutalist, dial **ENERGY 3 / RHYTHM 3 / MOTION 3**, turun ke MOTION 2 di layar kecil.

Prinsip yang mengikat semua keputusan:

1. Satu momen gerak fokus per section, sisanya tenang.
2. Warna dibatasi monochrome (zinc) dengan putih sebagai accent tunggal; emerald hanya muncul sebagai warna aksi WhatsApp.
3. Gerak dekoratif hanya memakai `transform` dan `opacity`. Satu animasi layout diizinkan: tinggi panel detail Perjalanan, karena tingginya harus mengikuti panjang teks supaya tidak terpotong.
4. `prefers-reduced-motion` mematikan loop dan gerak transform, menyisakan konten yang langsung terlihat.
5. Tema gelap tetap, dengan alasan identitas: gaya ini sudah jadi merek visual pemiliknya sejak versi sebelumnya.

## 6. Arsitektur informasi

| Urutan | Section | Anchors |
|--------|---------|---------|
| 1 | Navbar (tautan, toggle bahasa, progress bar) | `#home` |
| 2 | Hero (nama, foto, CTA) | `#home` |
| 3 | Karya pilihan (daftar project) | `#work` |
| 4 | Tentang (satu pernyataan) | `#about` |
| 5 | Perjalanan (kronologi per tahun: pendidikan, organisasi, acara) | `#journey` |
| 6 | Teknologi dan alat | `#tech` |
| 7 | Kontak | `#contact` |
| 8 | Footer | - |

Navigasi hanya memuat destinasi yang benar-benar ada: Work, About, Journey, Contact. Tidak ada tautan ke halaman yang belum dibangun.

## 7. Spesifikasi per section

### 7.1 Navbar
- Tautan section dengan penanda section aktif (`aria-current`).
- Toggle bahasa ID dan EN, memakai `aria-pressed`.
- Progress bar tipis di dasar navbar sebagai penanda posisi baca.
- Navbar memadat saat halaman digulir.
- Menu mobile dengan `aria-expanded`, ikon berganti antara menu dan close.

### 7.2 Hero
- Satu layar penuh dengan komposisi poster: nama, foto, satu CTA.
- Nama "ADHIATMAN" satu baris dengan reveal per huruf. Lebar huruf mengikuti ukuran layar, dari 100 persen di mobile sampai 125 persen di desktop, supaya sembilan huruf tetap utuh di satu baris tanpa patah atau meluber.
- Foto profil menjadi lapisan depan: badannya menimpa nama sehingga tipografi lewat di belakang potret. Timpaan ditentukan oleh geometri berkasnya sendiri (408x612, 22,2 persen atas transparan), jadi kepala selalu mendarat di garis kapital nama pada setiap ukuran layar. Kepala yang lebih lebar hanya mungkin kalau nama juga lebih besar, jadi lebar foto dan kedalaman timpaan dinaikkan bersama.
- Lebar foto punya batas `vh` sebagai pengaman: di jendela pendek foto mengecil, bukan mendorong CTA ke bawah lipatan.
- Glow tipis, mask yang memudar di dasar, parallax scroll, dan respons pointer (desktop saja).
- Tidak ada baris peran di bawah foto. Peran tetap muncul sebagai tekstur marquee dan diuraikan di bio Tentang, jadi informasinya tidak hilang, hanya tidak diulang di hero.
- Marquee latar berisi peran sebagai tekstur, opacity rendah dan `aria-hidden`. Berjalan terus dan berhenti saat reduced motion.
- Sparkle mengambang sebagai tekstur latar, `aria-hidden`, mati saat reduced motion.
- Satu CTA "Lihat karya" menuju `#work`: tengah di mobile, kanan di desktop.
- Tanpa badge status; kalimat ketersediaan sudah ada di pembuka section Kontak.
- Tagline pindah ke Tentang. Lokasi dan tombol "Unduh CV" pindah ke Kontak.

### 7.3 Karya pilihan
- Daftar baris, bukan kartu. Setiap baris memuat nomor, judul, ringkasan, tahun, dan chip teknologi.
- Tiga proyek yang dipajang: UD. Kariasa, KopiKhe, dan Todo List Life Dashboard. Tiga repo lain (API tahap awal, utility form kontak, dataset resep) tidak dipajang sebagai karya unggulan, cukup diarahkan lewat satu tautan ke profil GitHub.
- Hover: baris terangkat dan menampilkan preview gambar yang mengikuti kursor, baris lain meredup. Fokus keyboard memberi perilaku yang sama.
- Klik atau Enter membuka modal detail.
- Modal memuat summary, tahun, peran, stack, deskripsi, galeri, dan tautan demo/repo. Tombol yang tidak punya URL tidak dirender.
- Modal bisa ditutup dengan Escape, fokus terkunci di dalamnya, dan fokus kembali ke baris pemicu.

### 7.4 Tentang
- Satu blok pernyataan, bukan bio dua paragraf lalu potongan-potongan terpisah. Tagline dan satu kalimat bio digabung, karena dipisah keduanya terbaca sebagai dua suara yang berbeda.
- Rata tengah dan setinggi satu layar penuh (`min-h-svh`), tanpa foto, tanpa chip, tanpa kolom data, tanpa tautan keluar. Section ini hanya teks, jadi tipografinya yang menjadi isi.
- Label "Tentang" kecil dengan tracking lebar di atas blok; pernyataannya sendiri yang berperan sebagai headline visual. Labelnya tetap `h2` supaya struktur dokumen tidak berubah.
- Lebar kolom `max-w-4xl` dengan `text-wrap: balance`: tiga baris di desktop dan paling banyak lima baris di 360px. Rata tengah tidak dibiarkan melewati batas itu.
- Garis rambut 64px di atas blok menjadi sisi tempat blok naik, bukan hiasan tambahan.
- Grain halus tetap dipakai sebagai tekstur identitas poster.
- Motion: blok naik 100 persen dari balik wadah `overflow: hidden`, sekali, saat section masuk viewport. Nilai awal hanya dipasang oleh GSAP dan tidak pernah di CSS, jadi tanpa JavaScript atau dengan reduced motion teksnya langsung terbaca utuh.
- Reduced motion: tanpa transform sama sekali.
- Tidak ada potret di section ini. Frame penuh tetap eksklusif di hero.

### 7.5 Perjalanan
- Satu kolom kronologis, bukan grid kartu: babak 2024, 2025, dan 2026 berurutan dari yang paling lama.
- Babak tahun diturunkan dari data (`start` tiap entri), bukan diketik ulang, jadi label tidak bisa melenceng dari isinya. Rentang 2026 sampai 2027 tetap dibaca sebagai satu entri, bukan babak 2027.
- Nomor tahun adalah `h3` besar rata kanan di tiap babak, muncul dengan wipe yang di-clip wadahnya sendiri. Tanpa outline, tanpa `text-stroke`, tanpa pengecualian kontras.
- Indeks tahun tipis di kiri, lengket selama section terlihat, dan menandai babak yang sedang dibaca.
- Garis spine tergambar mengikuti scroll, dan tiap baris menyala saat garis melewatinya (opacity 0,5 ke 1, geser 16px ke posisi aslinya).
- Kategori dibawa chip (Pendidikan, Organisasi, Acara), bukan sub-judul yang memecah alur.
- Periode ditulis dari angka: `2026 – 2027`, `2026`, atau `2024 – sekarang`. Entri yang masih berjalan dapat penanda garis terbuka, bukan denyut.
- Detail acara dibuka sebaris di tempat, bukan flip card: tombol dengan `aria-expanded` dan `aria-controls`, ikon plus berubah jadi minus, tinggi panel dianimasikan lalu dilepas ke `auto` supaya teksnya tidak pernah terpotong.

### 7.6 Teknologi dan alat
- Dua baris marquee, arah berlawanan: teknologi dan alat.
- Satu kecepatan untuk kedua baris, 60 px per detik. Durasi dihitung dari lebar grup yang diukur setelah font siap, jadi daftar yang lebih panjang atau pergantian bahasa tidak mengubah kecepatan baca.
- Marquee berhenti saat hover dan mati saat reduced motion.

### 7.7 Kontak
- Toggle Email dan WhatsApp.
- Submit membuka mailto atau WhatsApp dengan pesan terisi. Tidak ada request ke server.
- Tautan langsung ke email, WhatsApp, dan sosial: GitHub, LinkedIn, Instagram.
- Tombol "Unduh CV" dan lokasi (Denpasar, Bali) di kolom kontak langsung.
- Field wajib divalidasi browser sebelum submit.

### 7.8 Footer
- Hak cipta dengan tahun dinamis dan tautan kembali ke atas.

### 7.9 Spesifikasi motion

| Section | Motion | Alasan |
|---------|--------|--------|
| Navbar | Progress bar, navbar memadat, penanda section aktif | Orientasi pada halaman panjang |
| Hero | Reveal huruf, foto naik, marquee latar, sparkle, parallax, drift mengikuti pointer | Momen pembuka, menegaskan identitas tipografi |
| Karya | Baris terangkat, preview mengikuti kursor, baris lain meredup, morph ke modal | Interaksi tanda tangan, memberi konteks visual tanpa klik |
| Tentang | Satu blok naik dari balik garis rambutnya, sekali | Section ini hanya satu pernyataan; satu gerakan yang sama dengan isinya, bukan tiga gerakan yang bersaing |
| Perjalanan | Garis progres scrub, baris menyala saat dilewati garis, wipe angka tahun | Menghubungkan posisi baca dengan urutan waktu |
| Teknologi | Marquee konten | Menunjukkan luas stack |
| Kontak | Focus ring, transition tombol | Umpan balik aksi |

Diputuskan **tidak dipakai**: blob pulse dan blob float di hero. Dua loop itu tidak membawa informasi dan membuat halaman terasa generik.

Sparkle mengambang dan marquee latar dipakai kembali setelah revisi hero, dengan alasan yang sama: keduanya adalah tekstur poster, bukan hiasan acak. Keduanya opacity rendah, bergerak sangat lambat (11 sampai 15 detik per siklus untuk sparkle), `aria-hidden`, dan mati total saat `prefers-reduced-motion: reduce`.

Di Perjalanan, garis yang tergambar dan baris yang menyala saat garis melewatinya punya satu alasan: menghubungkan posisi baca dengan urutan waktu. Saat reduced motion, rail tetap utuh, semua baris menyala tanpa animasi, dan angka tahun langsung terlihat utuh.

Tooling: GSAP dan ScrollTrigger, dipisah lewat `matchMedia` untuk desktop dan mobile. Preview project memakai `gsap.quickTo`. Modal memakai transisi FLIP dari baris pemicu.

## 8. Tipografi dan design token

| Peran | Font | Alasan |
|-------|------|--------|
| Display (H1, H2, angka, marquee) | Archivo Variable, sumbu lebar 62 sampai 125 persen | Memberi karakter poster dan kemungkinan ditarik lebar, sesuatu yang tidak dimiliki satu font netral |
| Body dan label | Plus Jakarta Sans Variable | Terbaca untuk teks panjang, dibuat oleh desainer Indonesia, menjaga kaitan identitas lokal |

- Keduanya variable font, di-host sendiri lewat `@fontsource-variable`, subset Latin (cukup untuk ID dan EN).
- Ukuran bobot Plus Jakarta Sans 200 sampai 800, jadi hindari 900 untuk body.
- Token: `--color-ink` (#09090b), `--color-panel` (#121215), `--color-line` (#27272a).

## 9. Model konten dan i18n

- Konten berada di `src/data/`: `profile.js`, `projects.js`, `skills.js`, `journey.js`.
- Field yang bisa diterjemahkan memakai bentuk `{ id, en }`, dan dibaca lewat helper `text()`.
- String antarmuka berada di `src/i18n/id.js` dan `src/i18n/en.js`, dibaca lewat `t()` dengan key bertingkat (contoh: `work.title`).
- Bahasa default Indonesia. Pilihan disimpan di `localStorage` dengan key `portfolio.lang`.
- Ganti bahasa memicu re-render penuh. Motion di-reset lebih dulu (`resetMotion()`), lalu posisi scroll dikembalikan dan ScrollTrigger di-refresh.
- `document.title`, meta description, dan atribut `lang` ikut diperbarui.
- Batasan yang disadari: satu URL dengan toggle sisi klien, jadi SEO hanya optimal untuk bahasa default.

## 10. Arsitektur teknis

```
index.html
vite.config.js
public/
  favicon.svg
  robots.txt
  .nojekyll
  images/profile.png
  cv/                     (letakkan PDF CV di sini)
src/
  main.js
  styles/main.css
  lib/{i18n,motion,icons,media}.js
  i18n/{id,en}.js
  data/{profile,projects,skills,journey}.js
  components/{Navbar,Hero,Work,ProjectModal,About,Journey,TechStack,Contact,Footer}.js
scripts/{smoke,shots}.mjs
.github/workflows/deploy.yml
docs/PRD.md
docs/CONTENT-TODO.md
```

- Tanpa service layer dan tanpa API. Komponen merender HTML, lalu `init()` memasang perilaku.
- Modal dipasang sekali di luar `#app` supaya tidak ikut ter-render ulang saat ganti bahasa.
- Tidak ada aset dekoratif dari luar. Foto yang dipakai adalah milik pemilik, dan tidak ada foto stok yang menggambarkan orang, ruang kerja, atau kehidupan pemilik.
- Bentuk keluaran build: CSS sekitar 10,2 kB gzip, JS sekitar 60,4 kB gzip (termasuk GSAP dan ScrollTrigger), font sekitar 269 kB woff2 untuk subset Latin, Latin-ext, dan Vietnamese.

## 11. Deployment

- Target: GitHub Pages tipe **project site**, karena repositori bernama `portfolio-adhiatman`. Situsnya hidup di `https://lucioousss.github.io/portfolio-adhiatman/`.
- `base` di `vite.config.js` diset `/portfolio-adhiatman/`. Satu nilai itu dipakai dev, preview, build, dan smoke, jadi tidak ada URL yang bisa berbeda diam-diam.
- Alur: `.github/workflows/deploy.yml` menjalankan `npm ci`, `npm run build`, lalu mengunggah `dist/`.
- `public/.nojekyll` mencegah pemrosesan Jekyll.
- Kalau nanti repo di-rename menjadi `<username>.github.io` (user site), `base` kembali ke `/` dan URL di `scripts/smoke.mjs` serta `README.md` ikut disesuaikan.
- Di GitHub, set Pages source ke "GitHub Actions".
- Langkah sekali di sisi pemilik repo: Settings, lalu Pages, lalu Source ke "GitHub Actions". Tanpa itu `actions/configure-pages` gagal, karena token workflow tidak boleh membuat situs Pages sendiri, dan alamatnya masih 404.

## 12. Non-fungsional

- **Responsive:** diuji tanpa overflow horizontal pada 360px. Rentang target 320px sampai 1440px.
- **Aksesibilitas:** focus indicator terlihat, skip link, dialog dengan Escape dan focus trap, toggle memakai `aria-pressed`, detail Perjalanan memakai `aria-expanded` dan `aria-controls`, indeks tahun punya `aria-label`, status bahasa diumumkan lewat atribut `lang`, reduced motion dihormati, dan kontras teks diperiksa otomatis terhadap ambang WCAG AA.
- **Target sentuh:** semua tautan dan tombol minimal 24px, aksi utama lebih besar.
- **Aset gambar:** potret hero punya `alt` yang menyebut namanya. Section Tentang tidak memuat gambar sama sekali.
- **SEO:** title, description, canonical, Open Graph, Twitter card, dan JSON-LD Person.
- **Kejujuran konten:** tidak ada angka, testimoni, atau klaim yang dibuat-buat. Placeholder ditulis apa adanya sebagai "Tangkapan layar menyusul".

## 13. Migrasi dan pembersihan

Dihapus dari repositori:

- `api/` (9 endpoint PHP)
- `admin/` (dashboard CRUD)
- `database/` (schema MySQL)
- `uploads/`
- `src/services/`, `src/models/`
- `src/data/aboutData.js`, `projectsData.js`, `skillsData.js`
- `src/components/*Section.js` versi lama dan `ProjectModal` versi lama
- `assets/css/styles.css`, Tailwind CDN, dan Google Fonts CDN

Dipindahkan: `assets/images/portfoliocih.png` menjadi `public/images/profile.png`, `favicon.svg` menjadi `public/favicon.svg`.

## 14. Acceptance criteria dan hasil verifikasi

Diperiksa dengan `npm run smoke` (Chrome headless, viewport desktop dan 360px) setelah `npm run build`.

| Kriteria | Hasil |
|----------|-------|
| Build produksi berhasil | PASS |
| Hero merender nama dan konten Indonesia sebagai default | PASS |
| Karya menampilkan tiga project dan tautan ke sisanya di GitHub | PASS |
| Tentang mengisi satu viewport dengan satu pernyataan rata tengah, tanpa gambar atau kontrol | PASS |
| Pernyataan Tentang tidak lebih dari lima baris di 360px | PASS |
| Klik baris karya membuka modal dengan project yang benar | PASS |
| Escape menutup modal dan fokus kembali ke baris pemicu | PASS |
| Toggle bahasa mengubah seluruh string, tersimpan, dan `lang` ikut berubah | PASS |
| Tidak ada key terjemahan yang bocor | PASS |
| Bahasa bertahan setelah reload | PASS |
| Toggle WhatsApp menyembunyikan field email dan mengubah label tombol | PASS |
| Detail Perjalanan terbuka dengan keyboard | PASS |
| Detail Perjalanan bisa ditutup lagi | PASS |
| Kedua baris marquee berjalan pada kecepatan yang sama (60 px per detik) | PASS |
| Tidak ada overflow horizontal pada 360px | PASS |
| Target sentuh tidak ada yang terlalu kecil | PASS |
| Menu mobile bisa dibuka dan ditutup | PASS |
| Teks memenuhi kontras WCAG AA | PASS |
| Detektor kontras terbukti menandai kegagalan nyata | PASS |
| Tanpa page error dan console error | PASS |
| Reduced motion mematikan loop hero | PASS |
| Reduced motion menyisakan konten hero | PASS |
| Reduced motion menyisakan halaman Perjalanan utuh dan terbaca | PASS |
| Reduced motion menyisakan pernyataan Tentang terlihat tanpa transform | PASS |

Ringkasan: 31 dari 31 pemeriksaan lolos.

## 15. Milestone dan item terbuka

Selesai: discovery, keputusan produk, scaffold Vite + Tailwind, implementasi 8 section, i18n, motion GSAP, pembersihan backend, workflow deploy, verifikasi otomatis.

Item terbuka (perlu data dari pemilik). Daftar lengkap, termasuk konfirmasi teks dan keputusan teknis, ada di `docs/CONTENT-TODO.md`:

| # | Item | Lokasi | Status |
|---|------|--------|--------|
| T1 | Tangkapan layar tiap project | `public/images/projects/<slug>.png`, lalu isi `image` di `src/data/projects.js` | Ditunda sampai tampilan project diubah |
| T7 | Konfirmasi entri Perjalanan | `src/data/journey.js` | Menunggu konfirmasi pemilik |

Item lain sudah ditutup pada 20 Oktober 2026: T2 (deskripsi Inggris) dan T8 (daftar teknologi) dikonfirmasi pemilik, T3 (LinkedIn) diisi `linkedin.com/in/adhiatman`, T4 (email dan WhatsApp) dikonfirmasi, T5 (CV) memakai berkas asli di `public/cv/putu-adhiatman-cv.pdf`, T6 (base) diset untuk project site, T9 (ikon CDN) diputuskan tetap seperti sekarang, dan teks Tentang dikonfirmasi memakai versi pendek satu blok. Baris peran di bawah foto hero juga dihapus atas permintaan pemilik (lihat 7.2).

## 16. Lampiran: keputusan dan alasan

| Keputusan | Alasan |
|-----------|--------|
| Monochrome zinc dengan aksen putih | Identitas yang sudah ada; satu accent dipakai hemat di titik penting |
| Tema gelap tetap, tanpa toggle tema | Ini merek visualnya, bukan pilihan mode |
| Tanpa kartu statistik atau testimoni | Tidak ada data nyata untuk ditampilkan |
| Loop hanya pada marquee teknologi dan tekstur hero | Marquee teknologi membawa konten; marquee latar dan sparkle hero adalah tekstur poster yang dimatikan saat reduced motion; blob pulse dan blob float tetap dibuang |
| Foto sebagai lapisan depan nama | Tipografi lewat di belakang potret, komposisi poster yang khas, bukan sekadar foto di samping teks |
| Baris peran di bawah foto dihapus | Pemilik ingin hero lebih bersih; peran tetap terbaca sebagai marquee dan di bio Tentang, jadi tidak ada informasi yang hilang |
| Panah pada baris karya | Satu isyarat arah untuk "membuka detail", bukan hiasan di setiap tombol |
| Placeholder "Tangkapan layar menyusul" | Jujur menandai aset yang belum ada, bukan menyamarkan sebagai screenshot |
| Perjalanan satu kolom kronologis, bukan grid kartu | Grid kartu lama menetapkan tinggi tetap sementara kedua sisinya `absolute`, jadi deskripsi terpanjang meluber sekitar 50px; panel sebaris yang tumbuh mengikuti isi menghilangkan masalah itu secara struktural |
| Angka tahun rata kanan, entri rata kiri | Mengisi lebar kolom dan memberi tensi poster, bukan menumpuk semua di kiri lalu menyisakan separuh layar kosong |
| Detail acara dibuka sebaris, bukan flip 3D | Flip menyembunyikan separuh konten di balik rotasi dan mengunci tinggi kartu; panel sebaris menjaga kronologi tetap utuh dan teksnya tetap terbaca |
| Kecepatan marquee diukur, bukan ditetapkan | Dua durasi tetap membuat baris teknologi (sekitar 31 px per detik) dan alat (sekitar 15 px per detik) tampak berlomba; satu konstanta 60 px per detik menyamakan keduanya tanpa perlu disetel ulang saat konten berubah |
| Entri berjalan ditandai "sekarang" tanpa denyut | Kata dan garis yang memudar sudah cukup menandai sesuatu yang belum selesai; denyut tidak menambah informasi |
| Tiga karya dipajang, tiga lain lewat tautan GitHub | Tiga repo sisanya lebih lemah sebagai karya unggulan (API tahap awal, utility form kontak, dataset resep); memajang semuanya membuat yang kuat tenggelam |
| Tentang satu blok pernyataan, bukan bio lalu chip dan plat | Potongan-potongan itu terbaca sebagai tiga section yang ditempel, padahal isinya hanya satu kalimat. Satu blok utuh lebih jujur pada isinya |
| Tentang rata tengah dan setinggi satu layar | Section ini hanya punya satu objek, jadi menaruhnya di tengah memberi jarak dari section lain dan membuatnya terbaca sebagai pernyataan, bukan paragraf yang perlu dipindai |
| Batas tiga sampai lima baris untuk teks rata tengah | Rata tengah memaksa mata mencari awal tiap baris; lebih dari lima baris membuatnya sulit dibaca, jadi teksnya dipendekkan dan ukurannya dibatasi |
| Tidak ada foto di Tentang | Frame penuh sudah jadi pembuka di hero; mengulang potret di bawah melemahkan hero, dan foto kedua hanya mengisi ruang yang seharusnya dibiarkan kosong |
