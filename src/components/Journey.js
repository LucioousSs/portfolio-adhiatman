import { t, text } from '../lib/i18n.js';
import { journey } from '../data/journey.js';
import { gsap, ScrollTrigger, reducedMotion, revealUp } from '../lib/motion.js';

export class Journey {
  /**
   * Education, organization, and events share one shape here, so the year chapters
   * can be built from a single list instead of three parallel code paths.
   */
  entries() {
    const education = journey.education.map((item) => ({
      category: 'edu',
      start: item.start,
      end: item.end,
      title: text(item.title),
      meta: item.org,
      detail: null,
    }));

    const organization = journey.organization.map((item) => ({
      category: 'org',
      start: item.start,
      end: item.end,
      title: text(item.title),
      meta: item.org,
      detail: null,
    }));

    const experience = journey.experience.map((item) => ({
      category: 'event',
      start: item.year,
      end: item.year,
      title: text(item.role),
      meta: item.event,
      detail: text(item.description),
    }));

    return [...education, ...organization, ...experience];
  }

  /** Oldest first: a journey reads forward, and the title promises exactly that. */
  chapters() {
    const entries = this.entries();
    const years = [...new Set(entries.map((entry) => entry.start))].sort((a, b) => a - b);
    return years.map((year) => ({
      year,
      items: entries.filter((entry) => entry.start === year),
    }));
  }

  /** Derived from the numbers, so the label can never drift from the data. */
  period({ start, end }) {
    if (end === null) {
      return `${start} – <span class="journey-present">${t('journey.present')}</span><span class="journey-ongoing" aria-hidden="true"></span>`;
    }
    if (end === start) return String(start);
    return `${start} – ${end}`;
  }

  item(entry, key) {
    const detailId = `journey-detail-${key}`;

    return `
      <li class="journey-item relative pl-12" data-journey-item>
        <span class="journey-node absolute left-[11px] top-1.5 h-3 w-3 -translate-x-1/2 rounded-full" data-journey-node aria-hidden="true"></span>
        <div data-journey-body>
          <div class="flex flex-wrap items-center gap-2.5">
            <span class="text-xs font-bold uppercase tracking-wider text-zinc-400">${this.period(entry)}</span>
            <span class="journey-chip">${t(`journey.${entry.category}`)}</span>
          </div>
          <p class="mt-1.5 font-semibold text-white">${entry.title}</p>
          <p class="text-sm text-zinc-400">${entry.meta}</p>
          ${
            entry.detail
              ? `
            <button
              type="button"
              class="journey-toggle"
              aria-expanded="false"
              aria-controls="${detailId}"
              data-journey-toggle
            >
              <span class="journey-toggle-icon" aria-hidden="true"></span>${t('journey.detail')}
            </button>
            <div id="${detailId}" class="journey-detail" data-journey-detail hidden>
              <p class="text-sm leading-relaxed text-zinc-300">${entry.detail}</p>
            </div>`
              : ''
          }
        </div>
      </li>`;
  }

  chapter({ year, items }) {
    return `
      <section class="journey-chapter pb-14 last:pb-0" data-journey-chapter="${year}" aria-labelledby="journey-year-${year}">
        <div class="flex flex-col gap-6 md:flex-row-reverse md:items-start md:gap-10 lg:gap-12">
          <div class="relative overflow-hidden bg-ink md:shrink-0">
            <h3 id="journey-year-${year}" class="journey-year type-display" data-journey-year>${year}</h3>
          </div>
          <ol class="flex-1 space-y-9">
            ${items.map((item, index) => this.item(item, `${year}-${index}`)).join('')}
          </ol>
        </div>
      </section>`;
  }

  render() {
    const chapters = this.chapters();

    const index = `
      <nav class="hidden lg:col-span-3 lg:block" aria-label="${t('journey.indexLabel')}">
        <ol class="sticky top-24 z-10 space-y-1">
          ${chapters
            .map(
              (chapter) => `
            <li>
              <a href="#journey-year-${chapter.year}" class="journey-index-link" data-journey-index="${chapter.year}">
                <span class="journey-index-mark" aria-hidden="true"></span>
                <span class="type-display text-2xl">${chapter.year}</span>
              </a>
            </li>`
            )
            .join('')}
        </ol>
      </nav>`;

    const spine = `
      <div id="journey-spine" class="relative">
        <div class="absolute inset-y-0 left-[11px] w-px bg-zinc-800" aria-hidden="true"></div>
        <div
          id="journey-progress"
          class="absolute inset-y-0 left-[11px] w-px origin-top bg-white"
          style="transform: scaleY(0)"
          aria-hidden="true"
        ></div>
        ${chapters.map((chapter) => this.chapter(chapter)).join('')}
      </div>`;

    return `
      <section id="journey" class="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div class="mx-auto max-w-6xl">
          <h2 class="type-display mb-12 text-4xl uppercase sm:text-5xl" data-journey-head>${t('journey.title')}</h2>

          <div class="grid gap-10 lg:grid-cols-12">
            ${index}
            <div class="lg:col-span-9">${spine}</div>
          </div>
        </div>
      </section>`;
  }

  /** The year index lights the chapter you are reading. */
  bindIndex() {
    const links = new Map(
      gsap.utils
        .toArray('[data-journey-index]')
        .map((link) => [link.getAttribute('data-journey-index'), link])
    );
    if (!links.size) return;

    const setActive = (year) => {
      links.forEach((link, key) => link.setAttribute('data-active', String(key === year)));
    };

    gsap.utils.toArray('[data-journey-chapter]').forEach((chapter) => {
      const year = chapter.getAttribute('data-journey-chapter');
      ScrollTrigger.create({
        trigger: chapter,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: (self) => {
          if (self.isActive) setActive(year);
        },
        onRefresh: (self) => {
          if (self.isActive) setActive(year);
        },
      });
    });
  }

  /** Detail opens in place, so the chronology is never left behind. */
  bindToggles() {
    document.querySelectorAll('[data-journey-toggle]').forEach((button) => {
      button.addEventListener('click', () => {
        const panel = document.getElementById(button.getAttribute('aria-controls'));
        if (!panel) return;

        const open = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!open));

        // Without motion the panel still works, it just appears immediately.
        if (reducedMotion()) {
          panel.hidden = open;
          return;
        }

        gsap.killTweensOf(panel);

        if (open) {
          gsap.to(panel, {
            height: 0,
            opacity: 0,
            duration: 0.28,
            ease: 'power2.in',
            onComplete: () => {
              panel.hidden = true;
              panel.style.height = '';
            },
          });
        } else {
          panel.hidden = false;
          gsap.fromTo(
            panel,
            { height: 0, opacity: 0 },
            {
              height: 'auto',
              opacity: 1,
              duration: 0.38,
              ease: 'power2.out',
              onComplete: () => {
                panel.style.height = '';
              },
            }
          );
        }
      });
    });
  }

  init() {
    const progress = document.getElementById('journey-progress');
    const spine = document.getElementById('journey-spine');

    if (!reducedMotion()) {
      // The line draws with scroll, then each row lights as the line reaches it, so
      // the progress bar carries the reading position instead of just filling space.
      if (progress && spine) {
        gsap.fromTo(
          progress,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: spine, start: 'top 78%', end: 'bottom 60%', scrub: 0.5 },
          }
        );
      }

      gsap.utils.toArray('[data-journey-item]').forEach((row) => {
        const body = row.querySelector('[data-journey-body]');
        const node = row.querySelector('[data-journey-node]');
        if (!body) return;

        const scrollTrigger = { trigger: row, start: 'top 88%', end: 'top 60%', scrub: 0.4 };
        gsap.fromTo(
          body,
          { opacity: 0.5, x: -16 },
          { opacity: 1, x: 0, ease: 'none', scrollTrigger: { ...scrollTrigger } }
        );
        if (node) {
          gsap.fromTo(
            node,
            { opacity: 0.2, scale: 0.5 },
            { opacity: 1, scale: 1, ease: 'none', scrollTrigger: { ...scrollTrigger } }
          );
        }
      });

      // Year numerals wipe in from their own side, clipped by their wrapper.
      gsap.utils.toArray('[data-journey-year]').forEach((year) => {
        gsap.from(year, {
          xPercent: 100,
          duration: 0.9,
          ease: 'power4.out',
          scrollTrigger: { trigger: year.parentElement, start: 'top 82%', once: true },
        });
      });

      this.bindIndex();
    }

    revealUp('[data-journey-head]', { y: 20 });
    this.bindToggles();
  }
}
