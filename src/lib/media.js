/** Two letters taken from the project title, used for the honest screenshot placeholder. */
export function initials(title) {
  return title
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}

/**
 * Renders a project image, or a labelled placeholder when no screenshot exists.
 * The placeholder says "screenshot pending" on purpose: it must not look like a
 * finished screenshot (no fake UI, no skeleton pretending to be the product).
 */
export function projectMedia(project, { className = '', alt = '', pendingLabel = 'Screenshot pending', eager = false } = {}) {
  if (project.image) {
    return `<img src="${project.image}" alt="${alt}" loading="${eager ? 'eager' : 'lazy'}" class="${className}" />`;
  }

  return `<div class="${className} flex flex-col items-center justify-center gap-2 bg-zinc-900 text-center">
    <span class="type-display text-4xl text-zinc-500">${initials(project.title)}</span>
    <span class="label">${pendingLabel}</span>
  </div>`;
}
