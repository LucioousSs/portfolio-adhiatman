export class ContactSection {
  render() {
    return `
      <section id="contact" class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 reveal scroll-mt-24">
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white tracking-tight mb-2">
          Contact
        </h2>
        <p class="text-zinc-400 mb-6">Let's work together. Send me a message.</p>

        <div class="flex items-center gap-4 text-zinc-400 mb-10">
          <a href="https://www.instagram.com/adhiatmn/" target="_blank" rel="noopener" aria-label="Instagram" class="hover:text-white hover:-translate-y-0.5 transition-all">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.26.07 1.64.07 4.85s0 3.6-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.26.06-1.64.07-4.85.07s-3.6 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.15 0-3.52.01-4.76.07-.9.04-1.38.19-1.7.32-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.13.32-.28.8-.32 1.7-.06 1.24-.07 1.61-.07 4.76s.01 3.52.07 4.76c.04.9.19 1.38.32 1.7.17.43.37.74.69 1.06.32.32.63.52 1.06.69.32.13.8.28 1.7.32 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c.9-.04 1.38-.19 1.7-.32.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.13-.32.28-.8.32-1.7.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.04-.9-.19-1.38-.32-1.7a2.85 2.85 0 0 0-.69-1.06 2.85 2.85 0 0 0-1.06-.69c-.32-.13-.8-.28-1.7-.32-1.24-.06-1.61-.07-4.76-.07Zm0 3.06A4.94 4.94 0 1 1 7.06 12 4.94 4.94 0 0 1 12 7.06Zm0 1.8A3.14 3.14 0 1 0 15.14 12 3.14 3.14 0 0 0 12 8.86Zm5.14-.9a1.15 1.15 0 1 1-1.15 1.15 1.15 1.15 0 0 1 1.15-1.15Z"/></svg>
          </a>
          <a href="https://github.com/LucioousSs" target="_blank" rel="noopener" aria-label="GitHub" class="hover:text-white hover:-translate-y-0.5 transition-all">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .3a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93a4.64 4.64 0 0 1 1.24-3.22 4.3 4.3 0 0 1 .12-3.18s1.01-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23a4.3 4.3 0 0 1 .12 3.18 4.64 4.64 0 0 1 1.24 3.22c0 4.61-2.82 5.62-5.5 5.92.43.37.82 1.11.82 2.24v3.32c0 .32.21.7.82.58A12 12 0 0 0 12 .3Z"/></svg>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener" aria-label="LinkedIn" class="hover:text-white hover:-translate-y-0.5 transition-all">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05a3.75 3.75 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.02H3.56V9h3.56ZM22.22 0H1.77A1.75 1.75 0 0 0 0 1.73v20.54A1.75 1.75 0 0 0 1.77 24h20.45A1.75 1.75 0 0 0 24 22.27V1.73A1.75 1.75 0 0 0 22.22 0Z"/></svg>
          </a>
        </div>

        <form id="contact-form" class="max-w-xl grid gap-5">

          <div class="flex gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-full w-fit">
            <button type="button" data-method="email"
              class="contact-toggle px-5 py-2 text-sm font-semibold rounded-full transition-colors bg-white text-black">
              Email
            </button>
            <button type="button" data-method="whatsapp"
              class="contact-toggle px-5 py-2 text-sm font-semibold rounded-full transition-colors text-zinc-400 hover:text-white">
              WhatsApp
            </button>
          </div>

          <div>
            <label for="contact-name" class="block text-sm text-zinc-400 mb-2">Name</label>
            <input id="contact-name" type="text" placeholder="Your name" required
              class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500
                     focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition" />
          </div>

          <div id="email-fields">
            <label for="contact-email" class="block text-sm text-zinc-400 mb-2">Email</label>
            <input id="contact-email" type="email" placeholder="you@email.com"
              class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500
                     focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition" />
          </div>

          <div>
            <label for="contact-message" class="block text-sm text-zinc-400 mb-2">Message</label>
            <textarea id="contact-message" rows="5" placeholder="Your message" required
              class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 resize-none
                     focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition"></textarea>
          </div>

          <button type="submit" id="contact-submit"
            class="justify-self-start px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-colors shadow-lg">
            Send via Email
          </button>
        </form>
      </section>
    `;
  }

  init() {
    const form = document.getElementById('contact-form');
    const toggles = document.querySelectorAll('.contact-toggle');
    const emailFields = document.getElementById('email-fields');
    const submitBtn = document.getElementById('contact-submit');

    let activeMethod = 'email';

    const EMAIL = 'putuadhi133@gmail.com';
    const PHONE = '6289635263050';

    toggles.forEach((btn) => {
      btn.addEventListener('click', () => {
        activeMethod = btn.dataset.method;

        toggles.forEach((t) => {
          t.classList.toggle('bg-white', t.dataset.method === activeMethod);
          t.classList.toggle('text-black', t.dataset.method === activeMethod);
          t.classList.toggle('text-zinc-400', t.dataset.method !== activeMethod);
        });

        emailFields.classList.toggle('hidden', activeMethod === 'whatsapp');
        submitBtn.textContent = activeMethod === 'email' ? 'Send via Email' : 'Send via WhatsApp';
        submitBtn.classList.toggle('bg-emerald-600', activeMethod === 'whatsapp');
        submitBtn.classList.toggle('text-white', activeMethod === 'whatsapp');
        submitBtn.classList.toggle('hover:bg-emerald-500', activeMethod === 'whatsapp');
        submitBtn.classList.toggle('bg-white', activeMethod === 'email');
        submitBtn.classList.toggle('text-black', activeMethod === 'email');
        submitBtn.classList.toggle('hover:bg-zinc-200', activeMethod === 'email');
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const message = document.getElementById('contact-message').value.trim();
      if (!name || !message) return;

      if (activeMethod === 'email') {
        const email = document.getElementById('contact-email').value.trim();
        const subject = encodeURIComponent('Portfolio Contact — ' + name);
        const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
        window.open('mailto:' + EMAIL + '?subject=' + subject + '&body=' + body, '_blank');
      } else {
        const text = encodeURIComponent('Hi, I\'m ' + name + '.\n\n' + message);
        window.open('https://wa.me/' + PHONE + '?text=' + text, '_blank');
      }
    });
  }
}