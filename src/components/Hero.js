import { t, text } from '../lib/i18n.js';
import { profile } from '../data/profile.js';
import { gsap, isDesktop, bindPointer, reducedMotion } from '../lib/motion.js';

// Fixed scatter, inherited from the first version of the hero. Decorative only,
// never announced to assistive tech, and stopped by prefers-reduced-motion.
const SPARKLES = [
  { char: '✦', top: '14%', left: '12%', dur: '12s', delay: '0s', drift: 'diagonal' },
  { char: '·', top: '22%', left: '26%', dur: '14s', delay: '2s', drift: 'vertical' },
  { char: '✦', top: '10%', left: '72%', dur: '11s', delay: '4s', drift: 'vertical' },
  { char: '·', top: '30%', left: '88%', dur: '15s', delay: '5s', drift: 'diagonal' },
  { char: '✦', top: '38%', left: '6%', dur: '12s', delay: '3s', drift: 'diagonal' },
  { char: '·', top: '45%', left: '20%', dur: '13s', delay: '1s', drift: 'vertical' },
  { char: '✦', top: '55%', left: '80%', dur: '11s', delay: '6s', drift: 'vertical' },
  { char: '·', top: '62%', left: '12%', dur: '14s', delay: '2.5s', drift: 'diagonal' },
  { char: '✦', top: '70%', left: '32%', dur: '12s', delay: '4.5s', drift: 'diagonal' },
  { char: '·', top: '76%', left: '90%', dur: '15s', delay: '3.5s', drift: 'vertical' },
  { char: '✦', top: '82%', left: '60%', dur: '13s', delay: '0.5s', drift: 'vertical' },
  { char: '·', top: '88%', left: '40%', dur: '12s', delay: '5.5s', drift: 'diagonal' },
  { char: '✦', top: '26%', left: '50%', dur: '11s', delay: '1.5s', drift: 'diagonal' },
  { char: '·', top: '64%', left: '55%', dur: '15s', delay: '4s', drift: 'vertical' },
];

export class Hero {
  render() {
    const letters = profile.name
      .toUpperCase()
      .split('')
      .map((char) => `<span class="inline-block" data-hero-letter>${char}</span>`)
      .join('');

    const sparkles = SPARKLES.map(
      (sparkle) => `
        <span
          class="animate-float-${sparkle.drift} pointer-events-none absolute z-0 select-none text-zinc-400/60"
          style="top: ${sparkle.top}; left: ${sparkle.left}; animation-duration: ${sparkle.dur}; animation-delay: ${sparkle.delay}"
          aria-hidden="true"
        >${sparkle.char}</span>`
    ).join('');

    // Background texture: the role, repeated. Two identical groups so the -50%
    // marquee keyframe loops seamlessly.
    const role = text(profile.role);
    const marqueeRow = `
      <span class="type-display whitespace-nowrap px-4 text-6xl uppercase text-white sm:text-7xl md:text-8xl">
        ${Array.from({ length: 4 }, () => `${role} \u2022 `).join('')}
      </span>`;

    return `
      <section
        id="home"
        class="relative flex min-h-svh flex-col justify-center overflow-hidden px-6 py-10 sm:pb-10 sm:pt-28"
      >
        ${sparkles}

        <div
          class="pointer-events-none absolute inset-0 z-0 flex select-none items-center overflow-hidden opacity-10"
          aria-hidden="true"
        >
          <div class="marquee-track" style="--marquee-duration: 72s">${marqueeRow}${marqueeRow}</div>
        </div>

        <div class="relative flex w-full flex-col items-center">
          <h1
            class="hero-title type-display relative z-10 select-none whitespace-nowrap text-center uppercase leading-none text-white"
          >
            ${letters}
          </h1>

          <div class="hero-photo relative z-20 flex justify-center" data-hero-photo>
            <div class="pointer-events-none absolute inset-0 -z-10 rounded-full bg-zinc-600/20 blur-3xl"></div>
            <div class="w-full" data-hero-photo-inner>
              <img
                src="${profile.photo}"
                alt="${t('hero.photoAlt')}"
                width="408"
                height="612"
                fetchpriority="high"
                class="h-auto w-full object-contain transition-transform duration-500 ease-out hover:scale-105 [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]"
              />
            </div>
          </div>
        </div>

        <div
          class="relative z-30 mx-auto mt-10 flex w-full max-w-5xl items-center justify-center md:justify-end"
        >
          <a
            href="#work"
            data-hero-cta
            class="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-black shadow-lg transition-colors hover:bg-zinc-200"
          >${t('hero.ctaWork')}</a>
        </div>
      </section>`;
  }

  init() {
    const letters = document.querySelectorAll('[data-hero-letter]');
    const inner = document.querySelector('[data-hero-photo-inner]');
    const cta = document.querySelector('[data-hero-cta]');
    const photo = document.querySelector('[data-hero-photo]');

    if (reducedMotion() || !photo) return;

    // Entrance: the name arrives letter by letter, then the portrait rises.
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        // Pointer and parallax are attached after the intro, so nothing competes
        // for the same transform on the photo wrapper.
        if (!isDesktop()) return;

        gsap.to(photo, {
          yPercent: -7,
          ease: 'none',
          scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true },
        });

        const xTo = gsap.quickTo(photo, 'x', { duration: 0.7, ease: 'power3' });
        const yTo = gsap.quickTo(photo, 'y', { duration: 0.7, ease: 'power3' });
        bindPointer('hero', (event) => {
          xTo((event.clientX / window.innerWidth - 0.5) * 18);
          yTo((event.clientY / window.innerHeight - 0.5) * 14);
        });
      },
    });

    if (letters.length) tl.from(letters, { yPercent: 70, opacity: 0, duration: 0.85, stagger: 0.035 }, 0.05);
    if (inner) tl.from(inner, { y: 56, opacity: 0, duration: 1 }, 0.3);
    if (cta) tl.from(cta, { y: 14, opacity: 0, duration: 0.6 }, 0.62);
  }
}
