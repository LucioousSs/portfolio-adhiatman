export class Navbar {
  render() {
    return `
      <header class="sticky top-0 z-50 bg-zinc-900/90 backdrop-blur border-b border-zinc-800">
        <nav class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          <a href="#home" class="text-xl font-bold text-white tracking-tight">Adhiatman<span class="text-zinc-400">.</span></a>

          <ul class="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            <li><a href="#home" class="hover:text-white transition-colors">Home</a></li>
            <li><a href="#about" class="hover:text-white transition-colors">About</a></li>
            <li><a href="#projects" class="hover:text-white transition-colors">Projects</a></li>
            <li><a href="#contact" class="hover:text-white transition-colors">Contact</a></li>
          </ul>

          <button id="navbar-toggle" aria-label="Open menu"
            class="md:hidden text-3xl text-white leading-none">
            &#9776;
          </button>
        </nav>

        <div id="navbar-overlay" class="hidden md:hidden bg-zinc-900 border-t border-zinc-800">
          <ul class="px-4 py-4 flex flex-col gap-4 text-zinc-400">
            <li><a href="#home" class="block py-2 hover:text-white transition-colors">Home</a></li>
            <li><a href="#about" class="block py-2 hover:text-white transition-colors">About</a></li>
            <li><a href="#projects" class="block py-2 hover:text-white transition-colors">Projects</a></li>
            <li><a href="#contact" class="block py-2 hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>
      </header>
    `;
  }

  init() {
    const toggle = document.getElementById('navbar-toggle');
    const overlay = document.getElementById('navbar-overlay');

    if (!toggle || !overlay) return;

    toggle.addEventListener('click', () => {
      overlay.classList.toggle('hidden');
    });

    overlay.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        overlay.classList.add('hidden');
      });
    });
  }
}
