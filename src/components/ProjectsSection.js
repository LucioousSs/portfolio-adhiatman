import { ProjectService } from '../services/ProjectService.js';
import { Project } from '../models/Project.js';

export class ProjectsSection {
  constructor(modal) {
    this.projects = [];
    this.modal = modal;
    this._intervals = new Map();
  }

  renderSkeleton() {
    return Array(3).fill('').map(() => `
      <article class="flex-none w-[300px] sm:w-[350px] md:w-[380px] snap-start bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col animate-pulse">
        <div class="w-full h-48 bg-zinc-800"></div>
        <div class="p-5 flex flex-col flex-1 gap-3">
          <div class="h-5 bg-zinc-800 rounded w-3/4"></div>
          <div class="h-3 bg-zinc-800 rounded w-full"></div>
          <div class="h-3 bg-zinc-800 rounded w-2/3"></div>
          <div class="flex gap-2 mt-auto pt-4">
            <div class="h-8 bg-zinc-800 rounded-full flex-1"></div>
            <div class="h-8 bg-zinc-800 rounded-full flex-1"></div>
          </div>
        </div>
      </article>
    `).join('');
  }

  render() {
    const cards = this.projects.length > 0
      ? this.projects.map((project) => project.render()).join('')
      : this.renderSkeleton();

    return `
      <section id="projects" class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 reveal scroll-mt-24">
        <div class="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white tracking-tight mb-2">
              Projects
            </h2>
            <p class="text-zinc-400">A selection of my recent work.</p>
          </div>

          <div class="flex gap-2">
            <button id="projects-prev" aria-label="Previous projects"
              class="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors">
              &larr;
            </button>
            <button id="projects-next" aria-label="Next projects"
              class="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors">
              &rarr;
            </button>
          </div>
        </div>

        <div id="projects-track" class="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 scrollbar-none px-4 md:px-8 -mx-4 md:-mx-8">
          ${cards}
        </div>
      </section>
    `;
  }

  async init() {
    const data = await ProjectService.fetchProjects();
    this.projects = data.map((d, i) => new Project(d, i));

    const track = document.getElementById('projects-track');
    if (track) {
      track.innerHTML = this.projects.map((project) => project.render()).join('');
    }

    this.bindArrows();
    this.bindHoverSlideshow();
    this.bindCardClicks();
  }

  bindArrows() {
    const track = document.getElementById('projects-track');
    const prev  = document.getElementById('projects-prev');
    const next  = document.getElementById('projects-next');

    if (!track || !prev || !next) return;

    const cardWidth = () => {
      const firstCard = track.querySelector('article');
      return firstCard ? firstCard.getBoundingClientRect().width + 24 : 380;
    };

    prev.addEventListener('click', () => {
      track.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
    });

    next.addEventListener('click', () => {
      track.scrollBy({ left: cardWidth(), behavior: 'smooth' });
    });
  }

  bindHoverSlideshow() {
    const imageContainers = document.querySelectorAll('.project-card-images');

    imageContainers.forEach((container) => {
      const projectIndex = parseInt(container.dataset.projectIndex, 10);
      const project = this.projects[projectIndex];
      if (!project || !project.hasMultipleImages) return;

      const slides = container.querySelectorAll('.slide-item');
      if (slides.length <= 1) return;

      let currentIndex = 0;
      let intervalId = null;

      const startSlideshow = () => {
        intervalId = setInterval(() => {
          const nextIndex = (currentIndex + 1) % slides.length;

          slides[currentIndex].classList.remove('opacity-100');
          slides[currentIndex].classList.add('opacity-0');

          slides[nextIndex].classList.remove('opacity-0');
          slides[nextIndex].classList.add('opacity-100');

          currentIndex = nextIndex;
        }, 1500);
      };

      const stopSlideshow = () => {
        if (intervalId !== null) {
          clearInterval(intervalId);
          intervalId = null;
        }

        slides.forEach((slide) => {
          slide.classList.remove('opacity-100');
          slide.classList.add('opacity-0');
        });

        if (slides[0]) {
          slides[0].classList.remove('opacity-0');
          slides[0].classList.add('opacity-100');
        }

        currentIndex = 0;
      };

      container.addEventListener('mouseenter', startSlideshow);
      container.addEventListener('mouseleave', stopSlideshow);

      container.__stopSlideshow = stopSlideshow;
      this._intervals.set(projectIndex, container);
    });
  }

  bindCardClicks() {
    const cards = document.querySelectorAll('.project-card');
    if (!this.modal) return;

    cards.forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;

        const index = parseInt(
          card.querySelector('[data-project-index]')?.dataset.projectIndex,
          10
        );
        const project = this.projects[index];
        if (!project) return;

        this.modal.open({
          title: project.title,
          description: project.description,
          tags: project.tags,
          demo: project.demo,
          repo: project.repo,
          allImages: project.allImages,
        });
      });
    });
  }

  destroy() {
    this._intervals.forEach((container) => {
      if (container.__stopSlideshow) {
        container.__stopSlideshow();
      }
    });
    this._intervals.clear();
  }
}
