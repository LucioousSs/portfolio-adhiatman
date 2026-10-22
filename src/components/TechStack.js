import { t } from '../lib/i18n.js';
import { skills } from '../data/skills.js';
import { revealUp } from '../lib/motion.js';

/** Pixels per second. One constant, so a longer list never reads as a faster row. */
const MARQUEE_SPEED = 60;

export class TechStack {
  row({ label, list, reverse }) {
    const group = `
      <div class="flex shrink-0 items-center" data-marquee-group>
        ${list
          .map(
            (item) => `
              <div class="flex items-center gap-3 px-5 text-zinc-400 sm:px-7">
                <img src="${item.icon}" alt="" width="20" height="20" loading="lazy" class="h-5 w-5 object-contain" />
                <span class="whitespace-nowrap text-sm font-semibold uppercase tracking-wider">${item.name}</span>
              </div>`
          )
          .join('')}
      </div>`;

    return `
      <div class="mb-8">
        <div class="px-4 sm:px-6 lg:px-8">
          <div class="mx-auto mb-3 max-w-7xl">
            <p class="label">${label}</p>
          </div>
        </div>
        <div class="marquee border-y border-zinc-800 bg-panel/40 py-4">
          <div class="marquee-track ${reverse ? 'is-reverse' : ''}" data-marquee-track>${group}${group}</div>
        </div>
      </div>`;
  }

  render() {
    return `
      <section id="tech" class="py-16 sm:py-20">
        <div class="px-4 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-7xl" data-tech-head>
            <h2 class="type-display text-4xl uppercase sm:text-5xl">${t('tech.title')}</h2>
          </div>
        </div>
        <div class="mt-8">
          ${this.row({
            label: t('tech.technologies'),
            list: skills.technologies,
            reverse: false,
          })}
          ${this.row({
            label: t('tech.tools'),
            list: skills.tools,
            reverse: true,
          })}
        </div>
      </section>`;
  }

  /**
   * Duration comes from the group's measured width, so every row travels at the
   * same 60 px/s no matter how long the list is or which language is loaded.
   */
  async measure() {
    try {
      await document.fonts.ready;
    } catch {
      // No Font Loading API: measure with whatever is already on screen.
    }

    document.querySelectorAll('[data-marquee-track]').forEach((track) => {
      const group = track.querySelector('[data-marquee-group]');
      const width = group?.getBoundingClientRect().width;
      if (!width) return;
      track.style.setProperty('--marquee-duration', `${(width / MARQUEE_SPEED).toFixed(2)}s`);
    });
  }

  init() {
    revealUp('[data-tech-head]', { y: 20 });
    this.measure();
  }
}
