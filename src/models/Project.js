export class Project {
  constructor(data, index) {
    this._index = index;
    this._title = data.title;
    this._description = data.description;
    this._tags = data.tags || [];
    this._demo = data.demo || '#';
    this._repo = data.repo || '#';
    this._image = data.image || '';
    this._collage = data.collage || [];
    this._allImages = this._image
      ? [this._image, ...this._collage]
      : [...this._collage];
  }

  get index() { return this._index; }
  get title() { return this._title; }
  get description() { return this._description; }
  get tags() { return this._tags; }
  get demo() { return this._demo; }
  get repo() { return this._repo; }
  get image() { return this._image; }
  get collage() { return this._collage; }
  get allImages() { return this._allImages; }
  get hasMultipleImages() { return this._allImages.length > 1; }

  render() {
    const imgAlt = `Preview of ${this.title}`;

    const slidesMarkup = this._allImages.map((src, i) =>
      `<img src="${src}" alt="${imgAlt}"
            class="slide-item absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${i === 0 ? 'opacity-100' : 'opacity-0'}"
            data-slide="${i}" loading="lazy" />`
    ).join('');

    const imageSection = this.hasMultipleImages
      ? `<div class="relative w-full h-48 overflow-hidden rounded-t-2xl cursor-pointer project-card-images" data-project-index="${this._index}">
           <div class="relative w-full h-full">${slidesMarkup}</div>
           <div class="absolute inset-0 bg-gradient-to-t from-zinc-950/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
         </div>`
      : this._image
        ? `<div class="relative w-full h-48 overflow-hidden rounded-t-2xl cursor-pointer project-card-images" data-project-index="${this._index}">
             <img src="${this._image}" alt="${imgAlt}"
                  class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
             <div class="absolute inset-0 bg-gradient-to-t from-zinc-950/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
           </div>`
        : `<div class="relative w-full h-48 overflow-hidden rounded-t-2xl cursor-pointer project-card-images" data-project-index="${this._index}">
             <div class="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500 text-sm">Image placeholder</div>
           </div>`;

    return `
      <article class="project-card group flex-none w-[300px] sm:w-[350px] md:w-[380px] snap-start bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden
                      hover:border-zinc-600 hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer">
        ${imageSection}

        <div class="p-5 flex flex-col flex-1" data-project-index="${this._index}">
          <h3 class="text-white font-bold text-lg">${this.title}</h3>
          <p class="text-zinc-400 text-sm mt-1 mb-4 flex-1 leading-relaxed">${this.description}</p>

          <div class="flex flex-wrap gap-2 mb-5">
            ${this.tags.map((t) => `<span class="px-2.5 py-1 text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-full">${t}</span>`).join('')}
          </div>

          <div class="flex items-center gap-3 border-t border-zinc-800 pt-4">
            <a href="${this.demo}" target="_blank" rel="noopener" onclick="event.stopPropagation()" class="flex-1 text-center px-4 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-zinc-200 transition-colors">Demo</a>
            <a href="${this.repo}" target="_blank" rel="noopener" onclick="event.stopPropagation()" class="flex-1 text-center px-4 py-2 border border-zinc-700 text-zinc-300 text-sm font-semibold rounded-full hover:border-zinc-500 hover:text-white transition-colors">Code</a>
          </div>
        </div>
      </article>
    `;
  }
}
