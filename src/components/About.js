import { t } from '../lib/i18n.js';
import { gsap, reducedMotion } from '../lib/motion.js';

/**
 * The section is one statement, not a bio followed by fragments. The tagline and
 * the one bio sentence sit in the same block so it reads as one voice, and the
 * whole block stays short enough to survive being centred.
 *
 * The phrases are authored, not split at runtime: the comma in the first sentence
 * and the full stop before the student line are what give the ink-in its three
 * beats, and a regex would be guessing at them.
 */
const PHRASES = {
  id: [
    'Merancang antarmuka yang enak dipakai,',
    'lalu membangunnya sendiri.',
    'Mahasiswa Teknologi Informasi di ITB STIKOM Bali.',
  ],
  en: [
    'I design interfaces that feel good to use,',
    'then build them myself.',
    'An Information Technology student at ITB STIKOM Bali.',
  ],
};

export class About {
  render() {
    const lang = document.documentElement.lang;
    const phrases = PHRASES[lang] ?? PHRASES.id;
    const statement = phrases
      .map((phrase) => `<span class="about-phrase" data-about-phrase>${phrase}</span>`)
      .join(' ');

    return `
      <section id="about" class="relative flex min-h-[70svh] overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
        <svg class="grain-overlay" aria-hidden="true">
          <filter id="grain-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain-filter)" />
        </svg>

        <div class="about-glow" data-about-glow aria-hidden="true"></div>

        <div class="relative z-10 mx-auto grid w-full max-w-6xl grid-rows-[auto_1fr]">
          <div class="about-head col-start-1 row-start-1">
            <h2 class="type-display text-4xl uppercase sm:text-5xl">${t('about.title')}</h2>
            <span class="about-rule" data-about-rule aria-hidden="true"></span>
          </div>

          <div class="about-block col-start-1 row-start-2 self-center">
            <div class="about-mask">
              <p class="type-display about-text" data-about-text>${statement}</p>
            </div>
          </div>
        </div>
      </section>`;
  }

  init() {
    const section = document.getElementById('about');
    const statement = section?.querySelector('[data-about-text]');
    if (!section || !statement) return;

    if (!reducedMotion()) this.reveal(section, statement);
    this.glow(section);
  }

  /**
   * Three beats, once: the block rises out of its clip edge, the rule draws
   * across, and the phrases ink in one after another while it is still landing.
   * Every start state is created here and never in CSS, so a visitor without the
   * script, or with reduced motion, sees the rule already drawn and every phrase
   * already white.
   */
  reveal(section, statement) {
    const rule = section.querySelector('[data-about-rule]');
    const phrases = Array.from(statement.querySelectorAll('[data-about-phrase]'));

    const timeline = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top 78%', once: true },
    });

    timeline.from(statement, { yPercent: 100, duration: 0.9, ease: 'power3.out' });
    if (rule) {
      timeline.from(rule, { scaleX: 0, duration: 0.7, ease: 'power2.inOut' }, 0.2);
    }
    if (phrases.length) {
      timeline.from(
        phrases,
        { color: '#71717a', duration: 0.35, stagger: 0.15, ease: 'none' },
        0.35
      );
    }
  }

  /**
   * A soft light that follows the pointer behind the text. It lives on its own
   * layer and moves by transform, so the paragraph never reflows or repaints
   * while the pointer moves. Touch devices and reduced motion get nothing, which
   * is fine: the section is complete without it.
   */
  glow(section) {
    const glow = section.querySelector('[data-about-glow]');
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (!glow || reducedMotion() || !finePointer) return;

    const xTo = gsap.quickTo(glow, 'x', { duration: 0.55, ease: 'power2.out' });
    const yTo = gsap.quickTo(glow, 'y', { duration: 0.55, ease: 'power2.out' });

    const place = (event) => {
      const rect = section.getBoundingClientRect();
      xTo(event.clientX - rect.left);
      yTo(event.clientY - rect.top);
    };

    section.addEventListener('pointermove', place, { passive: true });
    section.addEventListener(
      'pointerenter',
      (event) => {
        place(event);
        // 'auto' matters: overwrite:true would kill the x/y tweens above.
        gsap.to(glow, { opacity: 1, duration: 0.4, overwrite: 'auto' });
      },
      { passive: true }
    );
    section.addEventListener(
      'pointerleave',
      () => {
        gsap.to(glow, { opacity: 0, duration: 0.4, overwrite: 'auto' });
      },
      { passive: true }
    );
  }
}
