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
| G1 | Pengunjung paham siapa pemiliknya dalam sekali layar | Hero memuat nama, foto, dan satu CTA; peran terbaca di pernyataan Tentang |
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
| 1 | Rel navigasi (tautan, toggle bahasa, progress bar) | - |
| 2 | Hero (nama, foto, CTA) | `#home` |
| 3 | Tentang (satu pernyataan) | `#about` |
| 4 | Karya pilihan (daftar kode dan rancangan desain) | `#work` |
| 5 | Perjalanan (kronologi per tahun: pendidikan, organisasi, acara) | `#journey` |
| 6 | Teknologi dan alat | `#tech` |
| 7 | Kontak | `#contact` |
| 8 | Footer | - |

Navigasi hanya memuat destinasi yang benar-benar ada: Tentang, Karya, Perjalanan, Kontak. Tidak ada tautan ke halaman yang belum dibangun.

## 7. Spesifikasi per section

### 7.1 Navbar
- Rel mengambang: header `fixed` dengan jarak 16px dari atas, selebar grid konten (`max-w-7xl`), border 1px, radius 12px, latar ink 85 persen dengan blur tipis.
- Karena berada di luar alur, hero memakai tinggi layar penuh dan nama besar berjalan di bawah rel tanpa terdorong.
- Tautan section dengan penanda section aktif (`aria-current`), urutannya mengikuti urutan baca: Tentang, Karya, Perjalanan, Kontak.
- Toggle bahasa ID dan EN, memakai `aria-pressed`.
- Progress bar tipis di dasar rel sebagai penanda posisi baca.
- Rel memadat saat halaman digulir (64px ke 56px). Karena `fixed`, perubahan itu tidak menggeser konten.
- Menu mobile dengan `aria-expanded`, ikon berganti antara menu dan close. Panelnya turun di dalam rel, jadi sudut dan bordernya tetap satu benda.
- `scroll-padding-top` 5.5rem menjaga judul section tidak tertutup rel saat anchor diklik.

### 7.2 Hero
- Satu layar penuh dengan komposisi poster: nama, foto, satu CTA.
- Rel navbar mengambang, jadi hero tidak didorong olehnya: komposisi tetap di tengah, tetapi `padding-top` di sm ke atas ditambah (7rem) supaya nama tidak menempel ke rel di jendela pendek. Jarak rel ke nama minimal sekitar 49px di 1280x720.
- Nama "ADHIATMAN" satu baris dengan reveal per huruf. Lebar huruf mengikuti ukuran layar, dari 100 persen di mobile sampai 125 persen di desktop, supaya sembilan huruf tetap utuh di satu baris tanpa patah atau meluber.
- Foto profil menjadi lapisan depan: badannya menimpa nama sehingga tipografi lewat di belakang potret. Timpaan ditentukan oleh geometri berkasnya sendiri (408x612, 22,2 persen atas transparan), jadi kepala selalu mendarat di garis kapital nama pada setiap ukuran layar. Kepala yang lebih lebar hanya mungkin kalau nama juga lebih besar, jadi lebar foto dan kedalaman timpaan dinaikkan bersama.
- Lebar foto punya batas `vh` sebagai pengaman: di jendela pendek foto mengecil, bukan mendorong CTA ke bawah lipatan.
- Glow tipis, mask yang memudar di dasar, parallax scroll, dan respons pointer (desktop saja).
- Tidak ada baris peran di bawah foto. Peran tetap muncul sebagai tekstur marquee dan di pernyataan Tentang, jadi informasinya tidak hilang, hanya tidak diulang di hero.
- Marquee latar berisi peran sebagai tekstur, opacity rendah dan `aria-hidden`. Berjalan terus dan berhenti saat reduced motion.
- Sparkle mengambang sebagai tekstur latar, `aria-hidden`, mati saat reduced motion.
- Satu CTA "Lihat karya" menuju `#work`: tengah di mobile, kanan di desktop.
- Tanpa badge status; kalimat ketersediaan sudah ada di pembuka section Kontak.
- Tagline pindah ke Tentang. Lokasi dan tombol "Unduh CV" pindah ke Kontak.

### 7.3 Karya pilihan
- Tiga proyek kode tampil sebagai daftar baris, bukan kartu. Setiap baris memuat nomor, judul, ringkasan, tahun, dan chip teknologi.
- Tiga proyek yang dipajang: UD. Kariasa, KopiKhe, dan Todo List Life Dashboard. Tiga repo lain (API tahap awal, utility form kontak, dataset resep) tidak dipajang sebagai karya unggulan, cukup diarahkan lewat satu tautan ke profil GitHub.
- Hover: baris terangkat dan menampilkan preview gambar yang mengikuti kursor, baris lain meredup. Fokus keyboard memberi perilaku yang sama.
- Klik atau Enter membuka modal detail.
- Modal memuat summary, tahun, peran, stack, deskripsi, galeri, dan tautan. Tombol yang tidak punya URL tidak dirender; kalau tidak ada satu pun tautan, bar tautannya disembunyikan seluruhnya.
- Modal bisa ditutup dengan Escape, fokus terkunci di dalamnya, dan fokus kembali ke elemen pemicu.
- Rancangan desain mendapat blok sendiri di bawah tautan GitHub, bukan tiga baris tambahan: baris kode menjanjikan repo dan tangkapan layar, sementara rancangan tidak punya keduanya.
- Tiga kartu: BantuSesama (aplikasi donasi untuk layar HP), JelajahNusantara (situs travel desktop), dan Adidas Samba (konsep pribadi situs sepatu desktop, bukan resmi). Grid tiga kolom di desktop, dua di tablet, satu di HP.
- Sampul kartu tampil berwarna apa adanya. Ini satu-satunya warna di halaman dan disengaja: yang berwarna adalah hasil desainnya, bukan bingkainya.
- Klik kartu membuka modal yang sama. Prototipe hanya ditautkan kalau URL publiknya ada; entri tanpa prototipe tidak mendapat tombol, dan tidak ada area tautan kosong yang ditinggalkan.
- Tahun yang belum dikonfirmasi disembunyikan, tidak ditebak.
- Selama gambar belum ada, kartu memakai placeholder "Gambar menyusul", bukan tangkapan layar palsu.

### 7.4 Tentang
- Satu blok pernyataan, bukan bio dua paragraf lalu potongan-potongan terpisah. Tagline dan satu kalimat bio digabung, karena dipisah keduanya terbaca sebagai dua suara yang berbeda.
- Ditaruh langsung setelah hero: satu kalimat ini menerangkan nama di atas sebelum karya masuk. Di antara Karya dan Perjalanan ia terbaca sebagai jeda, bukan pembuka.
- Setinggi 70 persen layar (`min-h-[70svh]`), tanpa foto, tanpa chip, tanpa kolom data, tanpa tautan keluar. Section ini hanya teks, jadi tipografinya yang menjadi isi. Tingginya sengaja tidak penuh: dua layar penuh berurutan membuat karya pertama dua kali geser jauhnya.
- Dua poros, disengaja. Judul "Tentang" memakai `type-display` dengan ukuran yang sama seperti judul section lain (`text-4xl uppercase sm:text-5xl`) dan duduk di kiri, di sumbu yang sama dengan judul Karya. Pernyataannya rata tengah dan di tengah ruang di bawah judul, jadi kalimatnya tetap satu objek simetris, bukan paragraf yang perlu dipindai.
- Judulnya tetap `h2` supaya struktur dokumen tidak berubah.
- Lebar kolom `max-w-4xl` dengan `text-wrap: balance`: tiga baris di desktop dan paling banyak lima baris di 360px. Batas itu tidak dilanggar.
- Grain halus tetap dipakai sebagai tekstur identitas poster.
- Tiga ketukan, sekali, saat section masuk: blok naik 100 persen dari balik wadah `overflow: hidden`, garis selebar kolom di bawah judul tumbuh dari kiri (`scaleX` 0 ke 1, 0,7 detik), lalu tiga frasa menyala berurutan dari `zinc-500` ke putih dengan jeda 0,15 detik. Frasa ditulis eksplisit per bahasa, bukan dipecah dengan regex, karena koma dan titiknya yang memberi ketukan itu.
- Garis di bawah judul satu-satunya penanda diam di section ini: ia menahan ruang kosong supaya pernyataan tidak mengambang. Tanpa animasi pun garisnya sudah tergambar penuh.
- Cahaya lembut 7 persen putih mengikuti kursor di belakang teks. Ia lapisan sendiri yang digeser dengan transform, jadi paragraf tidak pernah repaint; hanya untuk pointer halus, dan tidak ada sama sekali di layar sentuh atau saat reduced motion.
- Nilai awal hanya dipasang oleh GSAP dan tidak pernah di CSS, jadi tanpa JavaScript atau dengan reduced motion teksnya langsung terbaca utuh, garisnya penuh, dan semua frasa sudah putih.
- Reduced motion: tanpa transform, tanpa cahaya kursor.
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
- Footer memakai grid yang sama dengan section lain (`max-w-7xl` di dalam padding yang sama), jadi tepi kiri teksnya sejajar dengan judul section di atasnya, dan bar bawah serta band ilustrasi tetap selebar layar.
- Tiga kolom di md ke atas, dipisah garis rambut 1px: brand (nama, peran, tautan "Ke atas"), "Halaman" (empat tautan section), dan "Kontak" (email, WhatsApp, CV). Di bawah md kolomnya bertumpuk, tanpa garis pemisah.
- Bar bawah: ikon sosial (GitHub, LinkedIn, Instagram) di kiri, lokasi di tengah, hak cipta dengan tahun dinamis di kanan. Di layar sempit ketiganya bertumpuk rata kiri.
- Semua tujuan nyata: empat anchor section yang memang ada, email, WhatsApp, CV, dan tiga profil. Tidak ada `href="#"`, tidak ada kredit "Designed by" karangan, dan tidak ada tautan ke halaman yang tidak ada.
- Ilustrasi penutup: band full-bleed selebar layar di bawah bar bawah, tinggi 240px di ponsel, 300px di tablet, dan 380px di desktop, memakai `object-cover` dengan posisi `50% 30%` supaya bulan, air terjun, dan kepala dragon tetap utuh. Tepi atasnya melebur ke latar lewat `mask-image` gradient (transparan ke pekat di 32%), jadi tidak ada garis potong yang terasa ditempel. Dekoratif (`alt=""`, `aria-hidden`), `loading="lazy"`, WebP sekitar 303 kB dari master 1376x768. Tanpa parallax.
- Ilustrasi hanya muncul sekali, di footer. Hero tetap milik potret, dan tidak ada gambar dekoratif lain di halaman.

### 7.9 Spesifikasi motion

| Section | Motion | Alasan |
|---------|--------|--------|
| Navbar | Progress bar, navbar memadat, penanda section aktif | Orientasi pada halaman panjang |
| Hero | Reveal huruf, foto naik, marquee latar, sparkle, parallax, drift mengikuti pointer | Momen pembuka, menegaskan identitas tipografi |
| Karya | Baris terangkat, preview mengikuti kursor, baris lain meredup, morph ke modal, kartu desain naik saat masuk | Interaksi tanda tangan, memberi konteks visual tanpa klik; kartu desain cukup satu gerakan masuk karena sampulnya sudah berwarna |
| Tentang | Blok naik dari balik wadahnya, garis tumbuh dari kiri, tiga frasa menyala berurutan, cahaya mengikuti kursor (pointer halus saja) | Section ini hanya satu pernyataan; gerakannya satu arah baca, bukan tiga gerakan yang bersaing, dan cahaya hanya menambah kedalaman di belakang teks |
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
  data/{profile,projects,skills,journey}.js   konten, termasuk entri desain
  components/{Navbar,Hero,About,Work,ProjectModal,Journey,TechStack,Contact,Footer}.js
scripts/{smoke,shots}.mjs
.github/workflows/deploy.yml
docs/PRD.md
docs/CONTENT-TODO.md
```

- Tanpa service layer dan tanpa API. Komponen merender HTML, lalu `init()` memasang perilaku.
- Modal dipasang sekali di luar `#app` supaya tidak ikut ter-render ulang saat ganti bahasa.
- Tidak ada aset dekoratif dari luar. Foto yang dipakai adalah milik pemilik, dan tidak ada foto stok yang menggambarkan orang, ruang kerja, atau kehidupan pemilik.
- Bentuk keluaran build: CSS sekitar 10,3 kB gzip, JS sekitar 61,3 kB gzip (termasuk GSAP dan ScrollTrigger), font sekitar 269 kB woff2 untuk subset Latin, Latin-ext, dan Vietnamese.

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
- **Navigasi mengambang:** rel `fixed` dengan `scroll-padding-top` 5.5rem, jadi judul section tidak tertutup saat anchor diklik, dan hero tetap setinggi satu layar. Rel selebar grid konten dan menyisakan 12 sampai 16px di kiri-kanan, jadi tidak pernah menempel ke tepi.
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
| Hero memberi jarak ke rel navbar (minimal 56px) | PASS |
| Semua section, navbar, dan footer berbagi tepi kiri yang sama (satu grid) | PASS |
| Karya menampilkan tiga project dan tautan ke sisanya di GitHub | PASS |
| Blok rancangan desain tampil di bawah tautan GitHub dengan tiga sampul berwarna | PASS |
| Kartu desain membuka modal tanpa tautan atau tahun karangan | PASS |
| Menutup kartu desain mengembalikan fokus ke kartu pemicu | PASS |
| Tentang mengisi jeda ringkas (65 sampai 95 persen viewport) dengan satu pernyataan rata tengah, tanpa gambar atau kontrol | PASS |
| Judul Tentang memakai tipografi yang sama dengan section lain dan duduk di sumbu judul Karya, pernyataannya tetap di tengah | PASS |
| Animasi Tentang selesai: garis tergambar penuh dan ketiga frasa sudah putih | PASS |
| Cahaya Tentang mengikuti pointer halus dan tidak menangkap klik | PASS |
| Urutan section dan urutan tautan navbar sama: Tentang lebih dulu, lalu Karya | PASS |
| Navbar mengambang sebagai rel di luar alur, dan hero tetap setinggi satu layar | PASS |
| Tautan section melompat tanpa meninggalkan hash di address bar | PASS |
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
| Footer hanya menautkan tujuan nyata: empat anchor, email, WhatsApp, CV, tiga sosial | PASS |
| Footer diakhiri ilustrasi dekoratif yang lazy, dan tahun hak cipta berjalan | PASS |
| Reduced motion menyisakan pernyataan Tentang terlihat tanpa transform, garis penuh, dan semua frasa putih | PASS |

Ringkasan: 45 dari 45 pemeriksaan lolos.

## 15. Milestone dan item terbuka

Selesai: discovery, keputusan produk, scaffold Vite + Tailwind, implementasi 8 section, i18n, motion GSAP, pembersihan backend, workflow deploy, verifikasi otomatis.

Item terbuka (perlu data dari pemilik). Daftar lengkap, termasuk konfirmasi teks dan keputusan teknis, ada di `docs/CONTENT-TODO.md`:

| # | Item | Lokasi | Status |
|---|------|--------|--------|
| T1 | Tangkapan layar tiap project | `public/images/projects/<slug>.png`, lalu isi `image` di `src/data/projects.js` | Ditunda sampai tampilan project diubah |
| T7 | Konfirmasi entri Perjalanan | `src/data/journey.js` | Menunggu konfirmasi pemilik |
| T10 | Sampul dan galeri tiga rancangan desain, URL prototipe BantuSesama, dan tahun tiap rancangan | `public/images/design/`, `src/data/projects.js` | Menunggu aset dan konfirmasi pemilik |

Item lain sudah ditutup pada 20 Oktober 2026: T2 (deskripsi Inggris) dan T8 (daftar teknologi) dikonfirmasi pemilik, T3 (LinkedIn) diisi `linkedin.com/in/adhiatman`, T4 (email dan WhatsApp) dikonfirmasi, T5 (CV) memakai berkas asli di `public/cv/putu-adhiatman-cv.pdf`, T6 (base) diset untuk project site, T9 (ikon CDN) diputuskan tetap seperti sekarang, dan teks Tentang dikonfirmasi memakai versi pendek satu blok. Baris peran di bawah foto hero juga dihapus atas permintaan pemilik (lihat 7.2). T11 (asal ilustrasi footer) ditutup pada 22 Oktober 2026: gambar dibuat dengan AI atas permintaan pemilik, jadi tidak ada karya pihak ketiga yang perlu dilisensikan.

## 16. Lampiran: keputusan dan alasan

| Keputusan | Alasan |
|-----------|--------|
| Monochrome zinc dengan aksen putih | Identitas yang sudah ada; satu accent dipakai hemat di titik penting |
| Tema gelap tetap, tanpa toggle tema | Ini merek visualnya, bukan pilihan mode |
| Tanpa kartu statistik atau testimoni | Tidak ada data nyata untuk ditampilkan |
| Loop hanya pada marquee teknologi dan tekstur hero | Marquee teknologi membawa konten; marquee latar dan sparkle hero adalah tekstur poster yang dimatikan saat reduced motion; blob pulse dan blob float tetap dibuang |
| Foto sebagai lapisan depan nama | Tipografi lewat di belakang potret, komposisi poster yang khas, bukan sekadar foto di samping teks |
| Baris peran di bawah foto dihapus | Pemilik ingin hero lebih bersih; peran tetap terbaca sebagai marquee dan di pernyataan Tentang, jadi tidak ada informasi yang hilang |
| Panah pada baris karya | Satu isyarat arah untuk "membuka detail", bukan hiasan di setiap tombol |
| Placeholder "Tangkapan layar menyusul" | Jujur menandai aset yang belum ada, bukan menyamarkan sebagai screenshot |
| Perjalanan satu kolom kronologis, bukan grid kartu | Grid kartu lama menetapkan tinggi tetap sementara kedua sisinya `absolute`, jadi deskripsi terpanjang meluber sekitar 50px; panel sebaris yang tumbuh mengikuti isi menghilangkan masalah itu secara struktural |
| Angka tahun rata kanan, entri rata kiri | Mengisi lebar kolom dan memberi tensi poster, bukan menumpuk semua di kiri lalu menyisakan separuh layar kosong |
| Detail acara dibuka sebaris, bukan flip 3D | Flip menyembunyikan separuh konten di balik rotasi dan mengunci tinggi kartu; panel sebaris menjaga kronologi tetap utuh dan teksnya tetap terbaca |
| Kecepatan marquee diukur, bukan ditetapkan | Dua durasi tetap membuat baris teknologi (sekitar 31 px per detik) dan alat (sekitar 15 px per detik) tampak berlomba; satu konstanta 60 px per detik menyamakan keduanya tanpa perlu disetel ulang saat konten berubah |
| Entri berjalan ditandai "sekarang" tanpa denyut | Kata dan garis yang memudar sudah cukup menandai sesuatu yang belum selesai; denyut tidak menambah informasi |
| Tiga karya dipajang, tiga lain lewat tautan GitHub | Tiga repo sisanya lebih lemah sebagai karya unggulan (API tahap awal, utility form kontak, dataset resep); memajang semuanya membuat yang kuat tenggelam |
| Tentang satu blok pernyataan, bukan bio lalu chip dan plat | Potongan-potongan itu terbaca sebagai tiga section yang ditempel, padahal isinya hanya satu kalimat. Satu blok utuh lebih jujur pada isinya |
| Judul Tentang memakai tipografi judul yang sama dengan section lain, pernyataan tetap di tengah | Judul adalah penanda section, jadi ia harus terbaca dengan bobot yang sama seperti "Karya" dan "Kontak"; pernyataannya dibiarkan di tengah supaya tetap terasa sebagai satu objek, bukan paragraf. Garis tipis selebar kolom di bawah judul adalah penanda diam yang menahan ruang kosong antara judul kiri dan pernyataan tengah |
| Tentang bergerak lewat tiga ketukan tipografi, bukan efek teks | Naik, garis tergambar, lalu tinta masuk berurutan semuanya bekerja pada satu kalimat yang sama. Scramble, ghost word, atau parallax akan menambah objek yang bersaing dengan kalimat, padahal kalimat itu satu-satunya isi section |
| Cahaya Tentang hanya untuk pointer halus | Ia menambah kedalaman di belakang teks tanpa mengubah konten. Di layar sentuh tidak ada kursor untuk diikuti, dan saat reduced motion section itu sudah lengkap tanpa gerakan apa pun |
| Batas tiga sampai lima baris untuk pernyataan | Lebih dari lima baris sudah jadi paragraf yang harus dipindai, bukan satu tarikan mata. Batas itu menjaga section tetap terbaca sekali lihat |
| Tidak ada foto di Tentang | Frame penuh sudah jadi pembuka di hero; mengulang potret di bawah melemahkan hero, dan foto kedua hanya mengisi ruang yang seharusnya dibiarkan kosong |
| Tentang ditaruh setelah hero | Satu kalimat itu menerangkan nama di hero; di antara Karya dan Perjalanan ia terbaca sebagai jeda, bukan pembuka |
| Tentang 70svh, bukan satu layar penuh | Dua layar penuh berurutan membuat karya pertama dua kali geser jauhnya; 70 persen masih memberi jeda yang terasa |
| Navbar berupa rel mengambang, bukan pil kaca | Halaman ini bahasa editorial: garis rambut, radius kecil, Archivo besar. Kapsul blur akan terbaca sebagai widget dan bersaing dengan kartu desain |
| Rel di luar alur (`fixed`), bukan `sticky` | Hero bisa memakai layar penuh dengan nama berjalan di bawah rel, dan memadatnya rel tidak lagi menggeser konten sekitar 8px |
| Sampul rancangan desain berwarna, satu-satunya warna di halaman | Yang berwarna adalah hasil desainnya; membuatnya hitam putih akan menyembunyikan bagian yang paling ingin ditunjukkan |
| Rancangan desain di blok sendiri, bukan baris keempat sampai keenam | Baris kode menjanjikan repo dan tangkapan layar. Rancangan tidak punya keduanya, dan mencampurnya membuat daftar karya berbohong soal apa yang bisa diklik |
| Entri desain tanpa URL prototipe tidak diberi tombol | Tombol mati lebih buruk daripada tidak ada tombol; lebih baik ruangnya kosong sampai URL publiknya ada |
| Footer berupa peta halaman tiga kolom, bukan satu baris hak cipta | Halaman ini panjang, jadi footer yang berguna adalah daftar tujuan: section, kontak, dan profil. Satu baris hak cipta hanya mengulang informasi yang sudah ada di atas |
| Ilustrasi penutup di footer, bukan di section lain | Ia menutup halaman tanpa menambah klaim apa pun; karena dekoratif, `alt`-nya kosong dan pembaca layar melewatinya. Satu gambar saja, supaya potret di hero tetap yang pertama dan paling penting |
| Ilustrasi footer berupa band full-bleed yang pendek, bukan plate 16:9 penuh | Band memberi penutup yang tenang tanpa memakan satu layar penuh; crop `object-cover` pada posisi `50% 30%` menjaga bulan, air terjun, dan kepala dragon tetap terbaca, dan tepi atasnya dilebur ke latar lewat mask supaya tidak terlihat seperti spanduk terpisah |
| Tautan section tidak meninggalkan hash di address bar | Situs satu halaman tidak punya alamat per section untuk dibagikan; hash yang tertinggal setelah klik membuat alamat terlihat seperti rute yang rusak. Lompatannya tetap lompatan anchor biasa, hanya fragmennya yang dibuang |
| Tahun yang belum dikonfirmasi disembunyikan | Menebak tahun adalah klaim palsu kecil yang tidak perlu, dan field kosong terbaca seperti bug |
