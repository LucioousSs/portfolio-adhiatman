/**
 * Selected work. Three of the six repositories are featured: the client store
 * build, the brand landing page, and the one project with a live demo. The other
 * three (an early-stage API, a contact-form utility, and a recipe dataset) are
 * pointed at through the GitHub profile instead of being dressed up as featured
 * work.
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
];

/**
 * Design work. These sit in their own block below the code list: there is no
 * repository, and only the first has a prototype the owner can point at.
 *
 * `year` stays null until the owner confirms it, and the UI hides the field
 * rather than guessing. `prototype` is a public Figma link; an entry without one
 * renders no button at all, never a dead one.
 */
export const designProjects = [
  {
    kind: 'design',
    slug: 'bantusesama-app',
    title: 'BantuSesama',
    summary: { id: 'Aplikasi donasi untuk layar HP', en: 'Donation app for phone screens' },
    year: null,
    role: { id: 'Desain UI/UX', en: 'UI/UX design' },
    stack: ['Figma'],
    description: {
      id: 'Rancangan aplikasi donasi untuk layar HP, dikerjakan seluruhnya di Figma.',
      en: 'A donation app design for phone screens, designed entirely in Figma.',
    },
    prototype: null,
    image: null,
    gallery: [],
  },
  {
    kind: 'design',
    slug: 'jelajah-nusantara',
    title: 'JelajahNusantara',
    summary: { id: 'Rancangan situs travel untuk desktop', en: 'Desktop travel site design' },
    year: null,
    role: { id: 'Desain UI/UX', en: 'UI/UX design' },
    stack: ['Figma'],
    description: {
      id: 'Rancangan situs travel untuk layar desktop, dikerjakan di Figma.',
      en: 'A travel site design for desktop screens, designed in Figma.',
    },
    prototype: null,
    image: null,
    gallery: [],
  },
  {
    kind: 'design',
    slug: 'adidas-samba-concept',
    title: 'Adidas Samba',
    summary: { id: 'Konsep situs sepatu, bukan resmi', en: 'Shoe site concept, unofficial' },
    year: null,
    role: { id: 'Desain UI/UX', en: 'UI/UX design' },
    stack: ['Figma'],
    description: {
      id: 'Konsep pribadi untuk situs sepatu Adidas Samba di layar desktop, dikerjakan di Figma. Tidak berafiliasi dengan Adidas dan tidak disetujui Adidas.',
      en: 'A personal concept for an Adidas Samba shoe site on desktop, designed in Figma. Not affiliated with or endorsed by Adidas.',
    },
    prototype: null,
    image: null,
    gallery: [],
  },
];
