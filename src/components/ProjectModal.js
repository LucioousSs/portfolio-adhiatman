export class ProjectModal {
  constructor() {
    this._isOpen = false;
    this._isAnimating = false;
    this._activeIndex = 0;
    this._images = [];
    this._boundKeyHandler = this._onKeydown.bind(this);
    this._renderShell();
    this._cacheDOM();
    this._bindEvents();
  }

  _renderShell() {
    const shell = document.createElement('div');
    shell.id = 'project-modal';
    shell.className = 'fixed inset-0 z-50 pointer-events-none';
    shell.innerHTML = `
      <div id="modal-backdrop-close"
        class="absolute inset-0 bg-black/70 backdrop-blur-sm opacity-0 transition-opacity duration-300 ease-out"></div>
      <div class="relative flex items-start justify-center min-h-screen p-4 pt-10 sm:pt-16 overflow-y-auto">
        <div id="modal-box"
          class="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl mb-10 opacity-0 scale-95 translate-y-8 transition-all duration-300 ease-out">

          <button id="modal-close-btn"
            class="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/80 text-white text-xl transition-colors">
            &times;
          </button>

          <div id="modal-slider-section" class="relative">
            <div id="modal-main-slider" class="relative w-full aspect-video bg-zinc-950 overflow-hidden rounded-t-2xl">
              <div id="modal-slides-container" class="relative w-full h-full"></div>

              <button id="modal-prev-btn"
                class="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-colors z-10 hidden"
                aria-label="Previous image">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button id="modal-next-btn"
                class="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-colors z-10 hidden"
                aria-label="Next image">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div id="modal-slide-counter" class="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full hidden"></div>
            </div>

            <div id="modal-dots" class="flex justify-center gap-2 py-3 hidden"></div>

            <div id="modal-thumbnails" class="flex gap-2 px-4 pb-4 overflow-x-auto scrollbar-none hidden"></div>
          </div>

          <div class="p-6">
            <h3 id="modal-title" class="text-2xl font-bold text-white mb-2"></h3>
            <div id="modal-tags" class="flex flex-wrap gap-2 mb-4"></div>
            <p id="modal-description" class="text-zinc-400 text-sm leading-relaxed mb-6"></p>
            <div class="flex items-center gap-3">
              <a id="modal-demo" href="#" target="_blank" rel="noopener"
                class="flex-1 text-center px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-full hover:bg-zinc-200 transition-colors">
                Live Demo
              </a>
              <a id="modal-code" href="#" target="_blank" rel="noopener"
                class="flex-1 text-center px-5 py-2.5 border border-zinc-700 text-zinc-300 text-sm font-semibold rounded-full hover:border-zinc-500 hover:text-white transition-colors">
                Code
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(shell);
  }

  _cacheDOM() {
    this._el = document.getElementById('project-modal');
    this._backdrop = document.getElementById('modal-backdrop-close');
    this._box = document.getElementById('modal-box');
    this._closeBtn = document.getElementById('modal-close-btn');
    this._slidesContainer = document.getElementById('modal-slides-container');
    this._prevBtn = document.getElementById('modal-prev-btn');
    this._nextBtn = document.getElementById('modal-next-btn');
    this._dots = document.getElementById('modal-dots');
    this._thumbnails = document.getElementById('modal-thumbnails');
    this._counter = document.getElementById('modal-slide-counter');
    this._title = document.getElementById('modal-title');
    this._tags = document.getElementById('modal-tags');
    this._description = document.getElementById('modal-description');
    this._demoLink = document.getElementById('modal-demo');
    this._codeLink = document.getElementById('modal-code');
  }

  _bindEvents() {
    this._closeBtn.addEventListener('click', () => this.close());
    this._backdrop.addEventListener('click', () => this.close());
    this._prevBtn.addEventListener('click', () => this.prev());
    this._nextBtn.addEventListener('click', () => this.next());
  }

  open(projectData) {
    if (this._isOpen || this._isAnimating) return;

    this._images = projectData.allImages || [];
    this._activeIndex = 0;

    this._title.textContent = projectData.title;
    this._description.textContent = projectData.description;
    this._tags.innerHTML = projectData.tags
      .map((t) => `<span class="px-2.5 py-1 text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-full">${t}</span>`)
      .join('');
    this._demoLink.href = projectData.demo;
    this._codeLink.href = projectData.repo;

    const hasMultiple = this._images.length > 1;

    if (hasMultiple) {
      this._renderSlides();
      this._renderDots();
      this._renderThumbnails();
      this._prevBtn.classList.remove('hidden');
      this._nextBtn.classList.remove('hidden');
      this._dots.classList.remove('hidden');
      this._thumbnails.classList.remove('hidden');
      this._counter.classList.remove('hidden');
    } else {
      this._slidesContainer.innerHTML = this._images.length === 1
        ? `<img src="${this._images[0]}" alt="${projectData.title}" class="w-full h-full object-cover" />`
        : '';
      this._prevBtn.classList.add('hidden');
      this._nextBtn.classList.add('hidden');
      this._dots.classList.add('hidden');
      this._thumbnails.classList.add('hidden');
      this._counter.classList.add('hidden');
    }

    this._isOpen = true;
    document.body.style.overflow = 'hidden';
    this._el.style.pointerEvents = 'auto';
    document.addEventListener('keydown', this._boundKeyHandler);

    this._isAnimating = true;
    requestAnimationFrame(() => {
      this._backdrop.classList.remove('opacity-0');
      this._backdrop.classList.add('opacity-100');
      this._box.classList.remove('opacity-0', 'scale-95', 'translate-y-8');
      this._box.classList.add('opacity-100', 'scale-100', 'translate-y-0');
    });

    const onOpenEnd = () => {
      this._isAnimating = false;
      this._box.removeEventListener('transitionend', onOpenEnd);
    };
    this._box.addEventListener('transitionend', onOpenEnd, { once: true });
  }

  close() {
    if (!this._isOpen || this._isAnimating) return;

    this._isAnimating = true;

    this._backdrop.classList.remove('opacity-100');
    this._backdrop.classList.add('opacity-0');
    this._box.classList.remove('opacity-100', 'scale-100', 'translate-y-0');
    this._box.classList.add('opacity-0', 'scale-95', 'translate-y-8');

    const onCloseEnd = () => {
      this._el.classList.add('hidden');
      this._el.style.pointerEvents = 'none';
      document.body.style.overflow = '';
      this._isOpen = false;
      this._isAnimating = false;
      this._box.removeEventListener('transitionend', onCloseEnd);
      document.removeEventListener('keydown', this._boundKeyHandler);
    };

    this._box.addEventListener('transitionend', onCloseEnd, { once: true });

    setTimeout(() => {
      if (this._isAnimating) {
        onCloseEnd();
      }
    }, 350);
  }

  _renderSlides() {
    this._slidesContainer.innerHTML = this._images
      .map((src, i) =>
        `<img src="${src}" alt="Project image ${i + 1}"
              class="modal-slide absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${i === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}"
              data-index="${i}" loading="lazy" />`
      )
      .join('');
    this._counter.textContent = `1 / ${this._images.length}`;
  }

  _renderDots() {
    this._dots.innerHTML = this._images
      .map((_, i) =>
        `<button data-dot="${i}"
          class="modal-dot w-2 h-2 rounded-full transition-all ${i === 0 ? 'bg-white w-4' : 'bg-white/40 hover:bg-white/60'}"
          aria-label="Go to image ${i + 1}"></button>`
      )
      .join('');

    this._dots.querySelectorAll('.modal-dot').forEach((dot) => {
      dot.addEventListener('click', () => {
        this.goTo(parseInt(dot.dataset.dot, 10));
      });
    });
  }

  _renderThumbnails() {
    this._thumbnails.innerHTML = this._images
      .map((src, i) =>
        `<button data-thumb="${i}"
          class="flex-none w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === 0 ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'}">
          <img src="${src}" alt="" class="w-full h-full object-cover" loading="lazy" />
        </button>`
      )
      .join('');

    this._thumbnails.querySelectorAll('[data-thumb]').forEach((thumb) => {
      thumb.addEventListener('click', () => {
        this.goTo(parseInt(thumb.dataset.thumb, 10));
      });
    });
  }

  goTo(index) {
    if (!this._images.length) return;
    const len = this._images.length;
    const i = ((index % len) + len) % len;
    if (i === this._activeIndex) return;

    const slides = this._slidesContainer.querySelectorAll('.modal-slide');
    const oldSlide = slides[this._activeIndex];
    const newSlide = slides[i];

    if (oldSlide) {
      oldSlide.classList.remove('opacity-100', 'z-10');
      oldSlide.classList.add('opacity-0', 'z-0');
    }
    if (newSlide) {
      newSlide.classList.remove('opacity-0', 'z-0');
      newSlide.classList.add('opacity-100', 'z-10');
    }

    this._activeIndex = i;
    this._counter.textContent = `${i + 1} / ${len}`;

    this._dots.querySelectorAll('.modal-dot').forEach((dot, di) => {
      dot.className = di === i
        ? 'modal-dot w-2 h-2 rounded-full transition-all bg-white w-4'
        : 'modal-dot w-2 h-2 rounded-full transition-all bg-white/40 hover:bg-white/60';
    });

    this._thumbnails.querySelectorAll('[data-thumb]').forEach((thumb, ti) => {
      thumb.className = ti === i
        ? 'flex-none w-16 h-16 rounded-lg overflow-hidden border-2 transition-all border-white'
        : 'flex-none w-16 h-16 rounded-lg overflow-hidden border-2 transition-all border-transparent opacity-60 hover:opacity-100';
    });

    const activeThumb = this._thumbnails.querySelector(`[data-thumb="${i}"]`);
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  next() {
    this.goTo(this._activeIndex + 1);
  }

  prev() {
    this.goTo(this._activeIndex - 1);
  }

  _onKeydown(e) {
    if (!this._isOpen) return;
    if (e.key === 'Escape') this.close();
    if (e.key === 'ArrowRight') this.next();
    if (e.key === 'ArrowLeft') this.prev();
  }
}
