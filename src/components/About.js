import { t } from '../lib/i18n.js';
import { gsap, reducedMotion } from '../lib/motion.js';

/**
 * The section is one statement, not a bio followed by fragments. The tagline and
 * the one bio sentence sit in the same block so it reads as one voice, and the
 * whole block stays short enough to survive being centred.
 */
const STATEMENT = {
  id: 'Merancang antarmuka yang enak dipakai, lalu membangunnya sendiri. Mahasiswa Teknologi Informasi di ITB STIKOM Bali.',
  en: 'I design interfaces that feel good to use, then build them myself. An Information Technology student at ITB STIKOM Bali.',
};

export class About {
  render() {
    const statement = STATEMENT[document.documentElement.lang] ?? STATEMENT.id;

    return `
      <section id="about" class="relative flex min-h-[70svh] overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
        <svg class="grain-overlay" aria-hidden="true">
          <filter id="grain-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain-filter)" />
        </svg>

        <div class="relative z-10 mx-auto grid w-full max-w-6xl grid-rows-[auto_1fr]">
          <h2 class="type-display col-start-1 row-start-1 text-4xl uppercase sm:text-5xl">
            ${t('about.title')}
          </h2>

          <div class="about-block col-start-1 row-start-2 self-center">
            <div class="about-mask">
              <p class="type-display about-text" data-about-text>${statement}</p>
            </div>
          </div>
        </div>
      </section>`;
  }

  init() {
    const statement = document.querySelector('[data-about-text]');
    const section = document.getElementById('about');
    if (!statement || !section || reducedMotion()) return;

    // The block rises from behind its own clip edge, once. The start state is
    // created here and never in CSS, so the statement stays readable if the
    // script never runs or the visitor asks for reduced motion.
    gsap.from(statement, {
      yPercent: 100,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 78%', once: true },
    });
  }
}
