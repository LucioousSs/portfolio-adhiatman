import { t } from '../lib/i18n.js';
import { profile } from '../data/profile.js';
import { icons } from '../lib/icons.js';

export class Footer {
  render() {
    return `
      <footer class="border-t border-zinc-800">
        <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
          <p class="text-center text-sm text-zinc-400 sm:text-left">
            ${t('footer.rights').replace('{year}', String(new Date().getFullYear()))}
            <span class="text-zinc-400">${profile.fullName}</span>
          </p>
          <a href="#home" class="inline-flex items-center gap-2 py-2 text-sm text-zinc-400 transition-colors hover:text-white">
            ${t('footer.top')}<span class="block h-4 w-4">${icons.arrowUp}</span>
          </a>
        </div>
      </footer>`;
  }
}
