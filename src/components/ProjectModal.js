import { t, text } from '../lib/i18n.js';
import { icons } from '../lib/icons.js';
import { projectMedia } from '../lib/media.js';
import { gsap, reducedMotion } from '../lib/motion.js';

/**
 * Single project dialog, mounted once outside the re-rendered app tree.
 * Closable with Escape, focus is trapped while open, and the previously
 * focused row regains focus on close.
 */
class ProjectModal {
  constructor() {
    this.root = null;
    this.panel = null;
    this.project = null;
    this.index = 0;
    this.images = [];
    this.lastFocus = null;
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  mount() {
    const host = document.getElementById('modal-root');
    if (!host || this.root) return;

    host.innerHTML = `
      <div id="project-modal" class="fixed inset-0 z-[70] hidden" role="dialog" aria-modal="true" aria-labelledby="pm-title">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" data-modal-close></div>

        <div class="relative z-10 flex min-h-full items-start justify-center px-4 py-8 sm:py-12">
          <div id="pm-panel" class="w-full max-w-3xl overflow-hidden rounded-2xl border border-zinc-800 bg-ink">
            <div class="flex items-start justify-between gap-4 border-b border-zinc-800 p-5 sm:p-6">
              <div class="min-w-0">
                <p class="label" data-pm-summary></p>
                <h2 id="pm-title" class="type-display mt-1 text-2xl uppercase sm:text-3xl"></h2>
              </div>
              <button
                type="button"
                data-modal-close
                class="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-zinc-800 text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
                aria-label="${t('work.close')}"
              ><span class="block h-5 w-5">${icons.close}</span></button>
            </div>

            <div class="max-h-[62vh] overflow-y-auto p-5 sm:p-6">
              <div class="mb-6" data-pm-media></div>

              <dl class="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <dt class="label mb-1">${t('work.year')}</dt>
                  <dd class="text-sm text-zinc-200" data-pm-year></dd>
                </div>
                <div>
                  <dt class="label mb-1">${t('work.role')}</dt>
                  <dd class="text-sm text-zinc-200" data-pm-role></dd>
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <dt class="label mb-1">${t('work.stack')}</dt>
                  <dd class="text-sm text-zinc-200" data-pm-stack></dd>
                </div>
              </dl>

              <p class="leading-relaxed text-zinc-300" data-pm-desc></p>
            </div>

            <div class="flex flex-wrap gap-3 border-t border-zinc-800 p-5 sm:p-6" data-pm-links></div>
          </div>
        </div>
      </div>`;

    this.root = document.getElementById('project-modal');
    this.panel = document.getElementById('pm-panel');

    this.root.querySelectorAll('[data-modal-close]').forEach((el) => {
      el.addEventListener('click', () => this.close());
    });
  }

  open(project, triggerEl) {
    if (!this.root || !project) return;

    this.project = project;
    this.index = 0;
    this.lastFocus = triggerEl || document.activeElement;
    this.images = [project.image, ...(project.gallery || [])].filter(Boolean);

    this.fill();
    this.root.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', this.handleKeydown);
    gsap.set(this.panel, { clearProps: 'opacity,transform' });

    const closeBtn = this.root.querySelector('[data-modal-close]');
    closeBtn?.focus();

    if (!reducedMotion() && triggerEl) {
      const trig = triggerEl.getBoundingClientRect();
      const pan = this.panel.getBoundingClientRect();
      gsap.fromTo(
        this.panel,
        {
          x: trig.left - pan.left,
          y: trig.top - pan.top,
          scaleX: Math.max(0.25, trig.width / pan.width),
          scaleY: 0.35,
          transformOrigin: 'top left',
          opacity: 0.35,
        },
        { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1, duration: 0.5, clearProps: 'transform,opacity' }
      );
    }
  }

  fill() {
    const project = this.project;
    const root = this.root;

    root.querySelector('[data-pm-summary]').textContent = text(project.summary);
    root.querySelector('#pm-title').textContent = project.title;
    root.querySelector('[data-pm-year]').textContent = project.year;
    root.querySelector('[data-pm-role]').textContent = text(project.role);
    root.querySelector('[data-pm-stack]').textContent = project.stack.join(', ');
    root.querySelector('[data-pm-desc]').textContent = text(project.description);

    this.renderMedia();

    const links = [];
    if (project.demo) {
      links.push(`
        <a href="${project.demo}" target="_blank" rel="noopener"
           class="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black transition-colors hover:bg-zinc-200">
          ${t('work.demo')}<span class="block h-4 w-4">${icons.arrowUpRight}</span>
        </a>`);
    }
    if (project.repo) {
      links.push(`
        <a href="${project.repo}" target="_blank" rel="noopener"
           class="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-5 py-2.5 text-sm font-bold text-zinc-200 transition-colors hover:border-zinc-500 hover:text-white">
          <span class="block h-4 w-4">${icons.github}</span>${t('work.repo')}
        </a>`);
    }

    const linksBar = root.querySelector('[data-pm-links]');
    linksBar.innerHTML = links.join('');
    linksBar.classList.toggle('hidden', links.length === 0);
  }

  renderMedia() {
    const media = this.root.querySelector('[data-pm-media]');

    if (this.images.length === 0) {
      media.innerHTML = projectMedia(this.project, {
        className: 'h-52 w-full rounded-xl border border-zinc-800 sm:h-72',
        pendingLabel: t('work.shotPending'),
      });
      return;
    }

    const slides = this.images
      .map(
        (src, i) => `<img src="${src}" alt="" loading="lazy"
          class="gallery-slide h-52 w-full flex-none snap-center object-cover sm:h-72 ${i === 0 ? 'opacity-100' : 'opacity-0'}"
          data-pm-slide="${i}" />`
      )
      .join('');

    const controls =
      this.images.length > 1
        ? `<div class="absolute inset-x-2 top-1/2 flex -translate-y-1/2 justify-between">
             <button type="button" data-pm-prev aria-label="${t('work.prev')}"
               class="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black">
               <span class="block h-4 w-4">${icons.arrowLeft}</span>
             </button>
             <button type="button" data-pm-next aria-label="${t('work.next')}"
               class="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black">
               <span class="block h-4 w-4">${icons.arrowRight}</span>
             </button>
           </div>`
        : '';

    media.innerHTML = `
      <div class="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900" data-pm-gallery>
        <div class="flex snap-x snap-mandatory overflow-x-auto scrollbar-none" data-pm-track>${slides}</div>
        ${controls}
      </div>`;

    media.querySelector('[data-pm-prev]')?.addEventListener('click', () => this.goto(this.index - 1));
    media.querySelector('[data-pm-next]')?.addEventListener('click', () => this.goto(this.index + 1));
  }

  goto(next) {
    if (this.images.length < 2) return;
    this.index = (next + this.images.length) % this.images.length;

    const track = this.root.querySelector('[data-pm-track]');
    const slides = this.root.querySelectorAll('[data-pm-slide]');
    slides.forEach((slide, i) => {
      slide.classList.toggle('opacity-100', i === this.index);
      slide.classList.toggle('opacity-0', i !== this.index);
    });
    track?.children[this.index]?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
  }

  handleKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }
    if (event.key === 'ArrowRight') this.goto(this.index + 1);
    if (event.key === 'ArrowLeft') this.goto(this.index - 1);
    if (event.key === 'Tab') this.trapTab(event);
  }

  trapTab(event) {
    const focusable = this.panel.querySelectorAll(
      'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  close() {
    if (!this.root || this.root.classList.contains('hidden')) return;

    const finish = () => {
      this.root.classList.add('hidden');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', this.handleKeydown);
      this.lastFocus?.focus?.();
      this.lastFocus = null;
    };

    if (reducedMotion()) {
      finish();
      return;
    }

    gsap.to(this.panel, { opacity: 0, y: 12, duration: 0.2, onComplete: finish });
  }
}

export const projectModal = new ProjectModal();
