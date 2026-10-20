import { t, text } from '../lib/i18n.js';
import { projects } from '../data/projects.js';
import { icons } from '../lib/icons.js';
import { projectMedia } from '../lib/media.js';
import { projectModal } from './ProjectModal.js';
import { gsap, isDesktop, bindPointer, reducedMotion, revealUp } from '../lib/motion.js';

export class Work {
  render() {
    const rows = projects
      .map((project, i) => {
        const index = String(i + 1).padStart(2, '0');
        return `
          <li>
            <button
              type="button"
              class="work-row group flex w-full items-center gap-4 border-t border-zinc-800 py-6 text-left sm:gap-8 sm:py-8"
              data-work-index="${i}"
              aria-haspopup="dialog"
              aria-label="${t('work.open')}: ${project.title}"
            >
              <span class="type-display w-8 flex-none text-sm text-zinc-400">${index}</span>

              <span class="min-w-0 flex-1">
                <span
                  class="type-display block text-balance text-2xl uppercase text-zinc-200 transition-colors group-hover:text-white sm:text-4xl lg:text-5xl"
                >${project.title}</span>
                <span class="mt-1.5 block text-sm text-zinc-400">${text(project.summary)} &middot; ${project.year}</span>
              </span>

              <span class="hidden max-w-[34%] flex-wrap justify-end gap-2 lg:flex">
                ${project.stack
                  .map(
                    (tech) =>
                      `<span class="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-400">${tech}</span>`
                  )
                  .join('')}
              </span>

              <span class="flex-none text-zinc-500 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white">
                <span class="block h-5 w-5">${icons.arrowUpRight}</span>
              </span>
            </button>
          </li>`;
      })
      .join('');

    const list =
      projects.length > 0
        ? `<p class="mb-5 text-xs text-zinc-400">${t('work.hint')}</p>
           <ul class="border-b border-zinc-800">${rows}</ul>
           <a
             href="https://github.com/LucioousSs?tab=repositories"
             target="_blank"
             rel="noreferrer"
             class="mt-6 inline-flex items-center gap-2 py-2 text-sm text-zinc-400 transition-colors hover:text-white"
           >
             ${t('work.all')}
             <span class="block h-3.5 w-3.5">${icons.arrowUpRight}</span>
           </a>`
        : `<p class="rounded-xl border border-dashed border-zinc-800 px-6 py-10 text-center text-zinc-400">${t('work.empty')}</p>`;

    return `
      <section id="work" class="relative px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div class="mx-auto max-w-6xl">
          <div class="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 class="type-display text-4xl uppercase sm:text-5xl">${t('work.title')}</h2>
            <p class="max-w-sm text-sm text-zinc-400">${t('work.subtitle')}</p>
          </div>

          ${list}
        </div>

        <div class="work-preview" id="work-preview" aria-hidden="true">
          <div class="w-[300px] overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl sm:w-[340px]">
            <div class="aspect-[16/10] w-full" data-preview-media></div>
          </div>
        </div>
      </section>`;
  }

  init() {
    const rows = Array.from(document.querySelectorAll('[data-work-index]'));
    if (!rows.length) return;

    revealUp(rows, { y: 22, stagger: 0.05 });

    rows.forEach((row) => {
      row.addEventListener('click', () => {
        const project = projects[Number(row.dataset.workIndex)];
        if (project) projectModal.open(project, row);
      });
    });

    const preview = document.getElementById('work-preview');
    const mediaEl = preview?.querySelector('[data-preview-media]');

    if (!preview || !mediaEl || !isDesktop() || reducedMotion()) return;

    const xTo = gsap.quickTo(preview, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(preview, 'y', { duration: 0.5, ease: 'power3' });

    const show = (row) => {
      const project = projects[Number(row.dataset.workIndex)];
      if (!project) return;

      mediaEl.innerHTML = projectMedia(project, {
        className: 'h-full w-full object-cover',
        pendingLabel: t('work.shotPending'),
      });

      rows.forEach((other) => other.classList.toggle('is-dim', other !== row));
      gsap.set(preview, { visibility: 'visible', opacity: 1 });
    };

    const hide = () => {
      rows.forEach((row) => row.classList.remove('is-dim'));
      gsap.set(preview, { opacity: 0, visibility: 'hidden' });
    };

    rows.forEach((row) => {
      row.addEventListener('mouseenter', () => show(row));
      row.addEventListener('focus', () => show(row));
      row.addEventListener('blur', hide);
    });

    const section = document.getElementById('work');
    section?.addEventListener('mouseleave', hide);

    // Preview follows the pointer: hover gives visual context without a click.
    bindPointer('work', (event) => {
      xTo(event.clientX + 28);
      yTo(event.clientY - 96);
    });
  }
}
