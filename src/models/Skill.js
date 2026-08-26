export class Skill {
  constructor(name, type, icon = '') {
    this._name = name;
    this._type = type;
    this._icon = icon;
  }

  get name() { return this._name; }
  get type() { return this._type; }
  get icon() { return this._icon; }

  render() {
    return `<span class="px-4 py-2 text-sm rounded-full bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700 text-zinc-200">${this.name}</span>`;
  }

  renderTool() {
    return `
      <div class="group flex flex-col items-center gap-2" title="${this.name}">
        <img src="${this.icon}" alt="${this.name}"
          class="h-8 w-8 object-contain grayscale group-hover:grayscale-0 hover:scale-110 transition-all duration-300" />
        <span class="text-xs text-zinc-400 group-hover:text-white transition-colors">${this.name}</span>
      </div>`;
  }
}