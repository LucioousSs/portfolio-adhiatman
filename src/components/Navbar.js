import { t, lang, setLang } from '../lib/i18n.js';
import { icons } from '../lib/icons.js';
import { ScrollTrigger, gsap } from '../lib/motion.js';

const LINKS = [
  { id: 'about', href: '#about', key: 'nav.about' },
  { id: 'work', href: '#work', key: 'nav.work' },
  { id: 'journey', href: '#journey', key: 'nav.journey' },
  { id: 'contact', href: '#contact', key: 'nav.contact' },
];

const SECTION_IDS = ['home', 'about', 'work', 'journey', 'contact'];

export class Navbar {
  render() {
    const current = lang();

    const langButton = (code) => `
      <button
        type="button"
        data-lang="${code}"
        aria-pressed="${current === code}"
        class="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
          current === code ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
        }"
      >${code}</button>`;

    const links = LINKS.map(
      (link) => `
        <li>
          <a href="${link.href}" data-nav-link="${link.id}"
             class="transition-colors hover:text-white">${t(link.key)}</a>
        </li>`
    ).join('');

    const mobileLinks = LINKS.map(
      (link) => `
        <li>
          <a href="${link.href}" data-nav-link="${link.id}"
             class="block py-3 text-zinc-300 transition-colors hover:text-white">${t(link.key)}</a>
        </li>`
    ).join('');

    return `
      <header id="site-nav" class="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
        <div class="nav-rail relative mx-auto max-w-6xl overflow-hidden rounded-xl border border-zinc-800 bg-ink/85 backdrop-blur">
          <div
            id="scroll-progress"
            class="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-zinc-100"
            style="transform: scaleX(0)"
            role="progressbar"
            aria-label="${t('a11y.progress')}"
          ></div>

          <nav class="flex h-16 items-center justify-between px-4 transition-[height] duration-300 sm:px-5">
            <a href="#home" class="type-display flex items-center py-2 text-lg tracking-tight">
              Adhiatman<span class="text-zinc-500">.</span>
            </a>

            <ul class="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
              ${links}
            </ul>

            <div class="flex items-center gap-2 sm:gap-3">
              <div
                class="flex items-center gap-1 rounded-full border border-zinc-800 p-1"
                role="group"
                aria-label="${t('nav.lang')}"
              >
                ${langButton('id')}
                ${langButton('en')}
              </div>

              <button
                type="button"
                id="nav-toggle"
                class="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 text-zinc-200 md:hidden"
                aria-expanded="false"
                aria-controls="nav-menu"
                aria-label="${t('nav.menu')}"
              >
                <span class="block h-5 w-5" data-nav-icon>${icons.menu}</span>
              </button>
            </div>
          </nav>

          <div id="nav-menu" class="hidden border-t border-zinc-800 bg-ink md:hidden">
            <ul class="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-5">${mobileLinks}</ul>
          </div>
        </div>
      </header>`;
  }

  init() {
    const header = document.getElementById('site-nav');
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    const progress = document.getElementById('scroll-progress');

    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        const open = menu.classList.toggle('hidden') === false;
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? t('nav.closeMenu') : t('nav.menu'));
        const icon = toggle.querySelector('[data-nav-icon]');
        if (icon) icon.innerHTML = open ? icons.close : icons.menu;
      });
    }

    document.querySelectorAll('[data-nav-link]').forEach((link) => {
      link.addEventListener('click', () => {
        if (menu && !menu.classList.contains('hidden')) {
          menu.classList.add('hidden');
          toggle?.setAttribute('aria-expanded', 'false');
        }
      });
    });

    document.querySelectorAll('[data-lang]').forEach((button) => {
      button.addEventListener('click', () => setLang(button.dataset.lang));
    });

    // One scroll trigger drives the progress bar and the active-link state,
    // so it is killed cleanly on the next re-render.
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        if (progress) gsap.set(progress, { scaleX: self.progress });
        if (header) header.classList.toggle('is-compact', window.scrollY > 24);
        this.setActiveLink();
      },
    });
    this.setActiveLink();
  }

  setActiveLink() {
    const line = window.innerHeight * 0.35;
    let active = SECTION_IDS[0];

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= line) active = id;
    });

    document.querySelectorAll('[data-nav-link]').forEach((link) => {
      const on = link.dataset.navLink === active;
      link.classList.toggle('text-white', on);
      if (on) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }
}
