import { skillsData } from '../data/skillsData.js';

export class TechStackSection {
  constructor() {
    this.technologies = skillsData.technologies;
    this.tools = skillsData.tools;
  }

  renderItems(list) {
    return list
      .map(
        (item) => `
          <div class="flex items-center gap-3 px-3 md:px-6 text-zinc-400 hover:text-white transition-colors cursor-pointer">
            <img src="${item.icon}" alt="${item.name}" class="w-5 h-5 object-contain" />
            <span class="text-sm font-semibold uppercase tracking-wider whitespace-nowrap">${item.name}</span>
          </div>`
      )
      .join('');
  }

  renderRow({ label, list, animationClass }) {
    const singleSet = this.renderItems(list);
    const doubleSet = singleSet + singleSet;
    return `
      <div class="mb-6">
        <div class="max-w-6xl mx-auto px-6">
          <p class="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">${label}</p>
        </div>
        <div class="relative w-screen left-1/2 right-1/2 -mx-[50vw] py-4 bg-zinc-900/50 border-y border-zinc-800/80 overflow-hidden">
          <div class="flex whitespace-nowrap ${animationClass} hover:[animation-play-state:paused] [animation-duration:18s] md:[animation-duration:40s]">
            <div class="flex items-center gap-6 md:gap-12 shrink-0">${doubleSet}</div>
            <div class="flex items-center gap-6 md:gap-12 shrink-0">${doubleSet}</div>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const techRow = this.renderRow({
      label: 'Technologies',
      list: this.technologies,
      animationClass: 'animate-marquee',
    });

    const toolsRow = this.renderRow({
      label: 'Tools & Software',
      list: this.tools,
      animationClass: 'animate-marquee-reverse',
    });

    return `
      <section id="tech-tools" class="py-16 reveal scroll-mt-24">
        <div class="max-w-6xl mx-auto px-6">
          <h2 class="text-4xl md:text-5xl font-black uppercase text-white mb-8 tracking-tight">
            Tech & Tools
          </h2>
        </div>
        ${techRow}
        ${toolsRow}
      </section>
    `;
  }
}