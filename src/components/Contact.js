import { t, text } from '../lib/i18n.js';
import { profile } from '../data/profile.js';
import { icons, socialIcon } from '../lib/icons.js';

export class Contact {
  render() {
    const socials = profile.socials
      .map(
        (social) => `
          <a href="${social.url}" target="_blank" rel="noopener" aria-label="${social.label}"
             class="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white">
            <span class="block h-5 w-5">${socialIcon[social.key] ?? icons.external}</span>
          </a>`
      )
      .join('');

    return `
      <section id="contact" class="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div class="mx-auto max-w-6xl">
          <h2 class="type-display mb-4 text-4xl uppercase sm:text-5xl">${t('contact.title')}</h2>
          <p class="mb-10 max-w-xl text-zinc-400">${t('contact.subtitle')}</p>

          <div class="grid gap-12 lg:grid-cols-12">
            <div class="lg:col-span-7">
              <form id="contact-form" class="grid max-w-xl gap-5" novalidate>
                <div class="flex w-fit gap-1 rounded-full border border-zinc-800 p-1" role="group">
                  <button type="button" data-method="email" aria-pressed="true"
                    class="contact-toggle rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition-colors">
                    ${t('contact.toggleEmail')}
                  </button>
                  <button type="button" data-method="whatsapp" aria-pressed="false"
                    class="contact-toggle rounded-full px-5 py-2 text-sm font-bold text-zinc-400 transition-colors hover:text-white">
                    ${t('contact.toggleWa')}
                  </button>
                </div>

                <div>
                  <label for="contact-name" class="label mb-2 block">${t('contact.name')}</label>
                  <input id="contact-name" name="name" type="text" required autocomplete="name"
                    placeholder="${t('contact.namePlaceholder')}"
                    class="w-full rounded-lg border border-zinc-800 bg-panel px-4 py-3 text-white placeholder:text-zinc-400 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white" />
                </div>

                <div id="email-field">
                  <label for="contact-email" class="label mb-2 block">${t('contact.email')}</label>
                  <input id="contact-email" name="email" type="email" autocomplete="email"
                    placeholder="${t('contact.emailPlaceholder')}"
                    class="w-full rounded-lg border border-zinc-800 bg-panel px-4 py-3 text-white placeholder:text-zinc-400 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white" />
                </div>

                <div>
                  <label for="contact-message" class="label mb-2 block">${t('contact.message')}</label>
                  <textarea id="contact-message" name="message" rows="5" required
                    placeholder="${t('contact.messagePlaceholder')}"
                    class="w-full resize-none rounded-lg border border-zinc-800 bg-panel px-4 py-3 text-white placeholder:text-zinc-400 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white"></textarea>
                </div>

                <p id="contact-status" role="status" class="hidden text-sm text-zinc-400"></p>

                <button type="submit" id="contact-submit"
                  class="justify-self-start rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-zinc-200">
                  ${t('contact.sendEmail')}
                </button>
              </form>
            </div>

            <div class="lg:col-span-5">
              <h3 class="label mb-4">${t('contact.direct')}</h3>
              <div class="flex flex-col gap-3 text-sm">
                <a href="mailto:${profile.email}"
                   class="inline-flex items-center gap-3 py-2 text-zinc-300 transition-colors hover:text-white">
                  <span class="block h-5 w-5 text-zinc-500">${icons.mail}</span>${profile.email}
                </a>
                <a href="https://wa.me/${profile.whatsapp}" target="_blank" rel="noopener"
                   class="inline-flex items-center gap-3 py-2 text-zinc-300 transition-colors hover:text-white">
                  <span class="block h-5 w-5 text-zinc-500">${icons.whatsapp}</span>${profile.whatsappDisplay}
                </a>
              </div>
              <div class="mt-6 flex items-center gap-3">${socials}</div>

              <a
                href="${profile.cv}"
                download
                class="mt-8 inline-flex items-center gap-2 rounded-full border border-zinc-700 px-5 py-2.5 text-sm font-bold text-zinc-200 transition-colors hover:border-zinc-500 hover:text-white"
              >
                <span class="block h-4 w-4">${icons.download}</span>${t('contact.cv')}
              </a>

              <p class="mt-6 text-sm text-zinc-400">${text(profile.location)}</p>
            </div>
          </div>
        </div>
      </section>`;
  }

  init() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const toggles = Array.from(form.querySelectorAll('.contact-toggle'));
    const emailField = document.getElementById('email-field');
    const submit = document.getElementById('contact-submit');
    const status = document.getElementById('contact-status');

    let method = 'email';

    const setMethod = (next) => {
      method = next;

      toggles.forEach((toggle) => {
        const on = toggle.dataset.method === next;
        toggle.setAttribute('aria-pressed', String(on));
        toggle.classList.toggle('bg-white', on);
        toggle.classList.toggle('text-black', on);
        toggle.classList.toggle('text-zinc-400', !on);
        toggle.classList.toggle('hover:text-white', !on);
      });

      emailField?.classList.toggle('hidden', next === 'whatsapp');
      if (submit) submit.textContent = next === 'email' ? t('contact.sendEmail') : t('contact.sendWa');
    };

    toggles.forEach((toggle) => {
      toggle.addEventListener('click', () => setMethod(toggle.dataset.method));
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = form.querySelector('#contact-name').value.trim();
      const email = form.querySelector('#contact-email').value.trim();
      const message = form.querySelector('#contact-message').value.trim();

      if (!name || !message) {
        form.reportValidity();
        return;
      }

      if (method === 'email') {
        const subject = encodeURIComponent(`Portfolio contact: ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
        window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      } else {
        const text = encodeURIComponent(`Halo, saya ${name}.\n\n${message}`);
        window.open(`https://wa.me/${profile.whatsapp}?text=${text}`, '_blank', 'noopener');
      }

      if (status) {
        status.classList.remove('hidden');
        status.textContent = method === 'email' ? t('contact.sendEmail') : t('contact.sendWa');
      }

      form.reset();
      setMethod(method);
    });
  }
}
