/**
 * Selected work. Every entry is a real repository from github.com/LucioousSs;
 * descriptions come from the repos' own summaries.
 *
 * TODO(screenshots): each project has `image: null` because no screenshots exist
 * yet. Drop a file at `public/images/projects/<slug>.png` and set
 * `image: '/images/projects/<slug>.png'` to enable the thumbnail, hover preview,
 * and modal gallery.
 *
 * TODO(verify): confirm the featured order, the "role" labels, and the stack
 * labels (stack is derived from repo topics + primary language).
 */
export const projects = [
  {
    slug: 'ud-kariasa-web',
    title: 'UD. Kariasa',
    summary: {
      id: 'Profil & katalog toko sembako',
      en: 'Grocery store profile & catalog',
    },
    year: '2026',
    role: { id: 'Frontend & backend', en: 'Frontend & backend' },
    stack: ['Laravel', 'Tailwind CSS', 'Alpine.js', 'MySQL'],
    description: {
      id: 'Website profil & katalog produk UD. Kariasa, toko sembako keluarga di Denpasar, Bali. Dibangun menggunakan Laravel dengan styling Tailwind CSS dan interaktivitas Alpine.js.',
      en: 'Profile and product catalog site for UD. Kariasa, a family grocery store in Denpasar, Bali. Built with Laravel, styled with Tailwind CSS, and given interactivity with Alpine.js.',
    },
    demo: null,
    repo: 'https://github.com/LucioousSs/ud-kariasa-web',
    image: null,
    gallery: [],
  },
  {
    slug: 'kopikhe-website',
    title: 'KopiKhe',
    summary: {
      id: 'Landing page brand kopi',
      en: 'Coffee brand landing page',
    },
    year: '2026',
    role: { id: 'Frontend', en: 'Frontend' },
    stack: ['HTML', 'CSS', 'JavaScript'],
    description: {
      id: 'Landing page brand kopi KopiKhe: katalog produk, keranjang belanja, dan checkout lewat WhatsApp. Dibangun dengan HTML, CSS, dan JavaScript murni tanpa framework.',
      en: 'Landing page for the coffee brand KopiKhe: product catalog, shopping cart, and checkout over WhatsApp. Built with plain HTML, CSS, and JavaScript, no framework.',
    },
    demo: null,
    repo: 'https://github.com/LucioousSs/KopiKhe-Website',
    image: null,
    gallery: [],
  },
  {
    slug: 'todo-life-dashboard',
    title: 'Todo List Life Dashboard',
    summary: {
      id: 'Dasbor produktivitas harian',
      en: 'Daily productivity dashboard',
    },
    year: '2026',
    role: { id: 'Frontend', en: 'Frontend' },
    stack: ['HTML', 'CSS', 'JavaScript', 'localStorage'],
    description: {
      id: 'Dasbor produktivitas harian berisi sapaan otomatis, timer Pomodoro, daftar tugas, dan tautan cepat. Data disimpan di localStorage.',
      en: 'Daily productivity dashboard with an automatic greeting, a Pomodoro timer, a to-do list, and quick links. Data is stored in localStorage.',
    },
    demo: 'https://lucioousss.github.io/CodingCamp-24August26-IPutuAdhiatman/',
    repo: 'https://github.com/LucioousSs/CodingCamp-24August26-IPutuAdhiatman',
    image: null,
    gallery: [],
  },
  {
    slug: 'bimaone-api',
    title: 'bimaone-api',
    summary: {
      id: 'REST API backend',
      en: 'Backend REST API',
    },
    year: '2026',
    role: { id: 'Backend', en: 'Backend' },
    stack: ['Go', 'Gin', 'PostgreSQL', 'Docker'],
    description: {
      id: 'Backend REST API dengan Go (Gin) dan PostgreSQL. Masih tahap awal: baru endpoint health check dan koneksi database.',
      en: 'Backend REST API in Go (Gin) with PostgreSQL. Early stage: currently the health check endpoint and the database connection.',
    },
    demo: null,
    repo: 'https://github.com/LucioousSs/bimaone-api',
    image: null,
    gallery: [],
  },
  {
    slug: 'phpmail',
    title: 'phpMail',
    summary: {
      id: 'Form kontak dengan PHPMailer',
      en: 'Contact form with PHPMailer',
    },
    year: '2026',
    role: { id: 'Backend', en: 'Backend' },
    stack: ['PHP', 'PHPMailer', 'Composer'],
    description: {
      id: 'Form kontak PHP yang mengirim email melalui PHPMailer, dipasang lewat Composer.',
      en: 'PHP contact form that sends email through PHPMailer, installed via Composer.',
    },
    demo: null,
    repo: 'https://github.com/LucioousSs/phpMail',
    image: null,
    gallery: [],
  },
  {
    slug: 'data-resep-mobile',
    title: 'Data Resep Mobile',
    summary: {
      id: 'Dataset resep untuk aplikasi Android',
      en: 'Recipe dataset for an Android app',
    },
    year: '2026',
    role: { id: 'Data', en: 'Data' },
    stack: ['JSON', 'Android'],
    description: {
      id: 'Dataset 31 resep masakan Indonesia dalam format JSON, dipakai sebagai sumber data aplikasi Android ResepKu.',
      en: 'A dataset of 31 Indonesian recipes in JSON, used as the data source for the ResepKu Android app.',
    },
    demo: null,
    repo: 'https://github.com/LucioousSs/Data-Resep-Mobile',
    image: null,
    gallery: [],
  },
];
