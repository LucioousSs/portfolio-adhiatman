import { t, text } from '../lib/i18n.js';
import { profile } from '../data/profile.js';
import { skills } from '../data/skills.js';
import { gsap, isDesktop, reducedMotion } from '../lib/motion.js';

const BIO = {
  id: [
    'Saya mahasiswa Teknologi Informasi di ITB STIKOM Bali yang tertarik pada titik temu antara visual yang enak dilihat dan aplikasi yang nyaman dipakai. Saya terbiasa menyusun mockup UI/UX di Figma, lalu menerjemahkannya menjadi antarmuka responsif yang rapi.',
    'Di luar kelas, saya aktif di organisasi kampus, mengerjakan proyek web untuk kebutuhan nyata, dan terus melatih frontend serta dasar-dasar backend.',
  ],
  en: [
    'I am an Information Technology student at ITB STIKOM Bali, drawn to the meeting point between visuals that look good and software that feels good to use. I build UI/UX mockups in Figma, then turn them into clean, responsive interfaces.',
    'Outside class I am active in campus organizations, build web projects for real needs, and keep practising frontend along with backend fundamentals.',
  ],
};

export class About {
  render() {
    const paragraphs = (BIO[document.documentElement.lang] ?? BIO.id)
      .map(
        (paragraph, i) => `
          <p class="${i === 0 ? 'text-lg text-zinc-300' : 'mt-5 text-base text-zinc-400'} leading-relaxed">
            ${paragraph
              .split(/\s+/)
              .map((word) => `<span class="inline-block" data-bio-word>${word}</span>`)
              .join(' ')}
          </p>`
      )
      .join('');

    const badges = (skills.soft[document.documentElement.lang] ?? skills.soft.id)
      .map((skill) => `<span class="magnetic-badge" data-magnetic>${skill}</span>`)
      .join('');

    return `
      <section id="about" class="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <svg class="grain-overlay" aria-hidden="true">
          <filter id="grain-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain-filter)" />
        </svg>

        <div class="relative z-10 mx-auto max-w-6xl">
          <h2 class="type-display mb-10 text-4xl uppercase sm:text-5xl">${t('about.title')}</h2>

          <div class="grid gap-12 lg:grid-cols-12">
            <div class="lg:col-span-7">
              <p class="mb-7 max-w-xl text-xl leading-snug text-zinc-100 sm:text-2xl" data-bio-lead>
                ${text(profile.tagline)}
              </p>
              ${paragraphs}
            </div>

            <div class="lg:col-span-5">
              <h3 class="label mb-4">${t('about.soft')}</h3>
              <div class="flex flex-wrap gap-3">${badges}</div>
            </div>
          </div>
        </div>
      </section>`;
  }

  init() {
    if (!reducedMotion()) {
      // Word-by-word reveal: sets the reading rhythm of the bio.
      gsap.from('[data-bio-lead], [data-bio-word]', {
        opacity: 0,
        y: 8,
        duration: 0.5,
        stagger: 0.012,
        scrollTrigger: { trigger: '#about', start: 'top 72%', once: true },
      });
    }

    if (!isDesktop() || reducedMotion()) return;

    // Magnetic badges: playful pointer response, desktop only.
    document.querySelectorAll('[data-magnetic]').forEach((badge) => {
      badge.addEventListener('mousemove', (event) => {
        const rect = badge.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        gsap.to(badge, { x: x * 0.28, y: y * 0.34, duration: 0.3, ease: 'power2.out' });
      });
      badge.addEventListener('mouseleave', () => {
        gsap.to(badge, { x: 0, y: 0, duration: 0.4, ease: 'power3.out' });
      });
    });
  }
}
