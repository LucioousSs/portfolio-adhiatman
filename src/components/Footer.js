import { t, text } from '../lib/i18n.js';
import { asset } from '../lib/media.js';
import { profile } from '../data/profile.js';
import { icons, socialIcon } from '../lib/icons.js';

const PAGES = [
  { href: '#about', key: 'nav.about' },
  { href: '#work', key: 'nav.work' },
  { href: '#journey', key: 'nav.journey' },
  { href: '#contact', key: 'nav.contact' },
];

/**
 * The footer is a directory, not a second contact section: the brand and the
 * way back on the left, the four real destinations in the middle, and the three
 * ways to reach him on the right. Every target already exists somewhere on the
 * page or in the profile, so nothing here can be a dead link.
 */
export class Footer {
  render() {
    const year = new Date().getFullYear();

    const pages = PAGES.map(
      (page) => `
        <li>
          <a href="${page.href}"
             class="block py-1.5 text-sm text-zinc-300 transition-colors hover:text-white">${t(page.key)}</a>
        </li>`
    ).join('');

    const socials = profile.socials
      .map(
        (social) => `
          <a href="${social.url}" target="_blank" rel="noopener" aria-label="${social.label}"
             class="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white">
            <span class="block h-4 w-4">${socialIcon[social.key] ?? icons.external}</span>
          </a>`
      )
      .join('');

    return `
      <footer class="border-t border-zinc-800">
        <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div class="grid gap-10 py-12 md:grid-cols-12 md:gap-0 md:py-16">
            <div class="md:col-span-5 md:pr-10">
              <p class="type-display text-2xl tracking-tight">${profile.name}<span class="text-zinc-500">.</span></p>
              <p class="mt-3 max-w-xs text-sm text-zinc-400">${text(profile.role)}</p>
              <a href="#home" class="mt-6 inline-flex items-center gap-2 py-2 text-sm text-zinc-300 transition-colors hover:text-white">
                ${t('footer.top')}<span class="block h-4 w-4">${icons.arrowUp}</span>
              </a>
            </div>

            <nav class="md:col-span-3 md:border-l md:border-zinc-800 md:pl-8" aria-labelledby="footer-pages">
              <h3 id="footer-pages" class="label mb-3">${t('footer.pages')}</h3>
              <ul>${pages}</ul>
            </nav>

            <div class="md:col-span-4 md:border-l md:border-zinc-800 md:pl-8">
              <h3 class="label mb-3">${t('footer.contact')}</h3>
              <ul class="flex flex-col gap-1">
                <li>
                  <a href="mailto:${profile.email}"
                     class="inline-flex items-center gap-3 py-1.5 text-sm text-zinc-300 transition-colors hover:text-white">
                    <span class="block h-4 w-4 text-zinc-500">${icons.mail}</span>${profile.email}
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/${profile.whatsapp}" target="_blank" rel="noopener"
                     class="inline-flex items-center gap-3 py-1.5 text-sm text-zinc-300 transition-colors hover:text-white">
                    <span class="block h-4 w-4 text-zinc-500">${icons.whatsapp}</span>${profile.whatsappDisplay}
                  </a>
                </li>
                <li>
                  <a href="${profile.cv}" download
                     class="inline-flex items-center gap-3 py-1.5 text-sm text-zinc-300 transition-colors hover:text-white">
                    <span class="block h-4 w-4 text-zinc-500">${icons.download}</span>${t('contact.cv')}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div class="flex flex-col gap-4 border-t border-zinc-800 py-6 sm:grid sm:grid-cols-3 sm:items-center">
            <div class="flex items-center gap-2">${socials}</div>
            <p class="text-sm text-zinc-400 sm:text-center">${text(profile.location)}</p>
            <p class="text-sm text-zinc-400 sm:text-right">${t('footer.rights').replace('{year}', String(year))}</p>
          </div>
        </div>

        <div class="relative h-[240px] w-full overflow-hidden sm:h-[300px] lg:h-[380px]">
          <img
            src="${asset('/images/footer-art.webp')}"
            alt=""
            aria-hidden="true"
            width="1376"
            height="768"
            loading="lazy"
            decoding="async"
            class="h-full w-full object-cover object-[50%_30%] [mask-image:linear-gradient(to_bottom,transparent,#000_32%)]"
          />
        </div>
      </footer>`;
  }
}
