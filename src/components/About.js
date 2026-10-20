import { t, text } from '../lib/i18n.js';
import { profile } from '../data/profile.js';
import { asset } from '../lib/media.js';
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
      .map((skill) => `<span class="about-badge">${skill}</span>`)
      .join('');

    // The role as a type plate, one word per line. This is where the profession
    // lives now that the hero only carries the name.
    const roleWords = text(profile.role).split(/\s*&\s*|\s+/).filter(Boolean);

    // Three plates close the section: one crop of the portrait (the full frame
    // stays exclusive to the hero), one CC0 texture with the location set in HTML
    // on top, and one type plate for the role.
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

          <div class="about-strip" data-about-strip>
            <figure class="about-panel about-panel--torso" data-about-panel>
              <img
                src="${asset('/images/about/portrait-torso.webp')}"
                alt="${t('about.altTorso')}"
                width="408"
                height="510"
                loading="lazy"
                decoding="async"
              />
            </figure>

            <figure class="about-panel about-panel--texture" data-about-panel>
              <img
                src="${asset('/images/about/texture-concrete.webp')}"
                alt=""
                aria-hidden="true"
                width="960"
                height="1440"
                loading="lazy"
                decoding="async"
              />
              <figcaption class="about-panel-caption">${text(profile.location)}</figcaption>
            </figure>

            <figure class="about-panel about-panel--type" data-about-panel>
              <div class="about-type">
                <span class="label">${t('about.focus')}</span>
                <p class="about-type-lines">
                  ${roleWords.map((word) => `<span class="type-display">${word}</span>`).join(' ')}
                </p>
              </div>
            </figure>
          </div>
        </div>
      </section>`;
  }

  init() {
    const panels = document.querySelectorAll('[data-about-panel]');
    const strip = document.querySelector('[data-about-strip]');

    if (!reducedMotion()) {
      // Word-by-word reveal: sets the reading rhythm of the bio.
      gsap.from('[data-bio-lead], [data-bio-word]', {
        opacity: 0,
        y: 8,
        duration: 0.5,
        stagger: 0.012,
        scrollTrigger: { trigger: '#about', start: 'top 72%', once: true },
      });

      // The plates arrive in reading order, like prints laid down one by one.
      // clearProps hands the transform back to the hover style once it settles.
      if (panels.length) {
        gsap.from(panels, {
          y: 28,
          opacity: 0,
          duration: 0.7,
          stagger: 0.09,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: { trigger: strip, start: 'top 84%', once: true },
        });
      }
    }

    if (!isDesktop() || reducedMotion() || !strip) return;

    // A short lateral drift, tied to scroll progress. It hints that the row is
    // wider than the screen without turning it into a third marquee.
    gsap.to(strip, {
      x: -28,
      ease: 'none',
      scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: true },
    });
  }
}
