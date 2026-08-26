export class Footer {
  render() {
    return `
      <footer class="border-t border-zinc-800 reveal">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-zinc-500 text-sm text-center sm:text-left">
            &copy; ${new Date().getFullYear()} Adhiatman Portfolio. All rights reserved.
          </p>
          <a href="#home"
            class="text-sm text-zinc-400 hover:text-white transition-colors">
            Back to Top &uarr;
          </a>
        </div>
      </footer>
    `;
  }
}