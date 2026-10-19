import id from '../i18n/id.js';
import en from '../i18n/en.js';

const STORAGE_KEY = 'portfolio.lang';
const dictionaries = { id, en };
const listeners = new Set();

function detectInitial() {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved && dictionaries[saved]) return saved;
  // Product decision: Indonesian is the default, English is opt-in via the toggle.
  return 'id';
}

let current = detectInitial();

export function lang() {
  return current;
}

/** Translate a UI string key, e.g. t('nav.work'). Keys are nested in the dictionaries. */
export function t(key) {
  const resolve = (dict) =>
    key
      .split('.')
      .reduce((value, part) => (value && value[part] != null ? value[part] : undefined), dict);

  return resolve(dictionaries[current]) ?? resolve(dictionaries.en) ?? key;
}

/**
 * Resolve a bilingual content field.
 * Accepts either a plain string or an { id, en } object from the data files.
 */
export function text(value) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return value[current] ?? value.en ?? value.id ?? '';
}

export function setLang(next) {
  if (!dictionaries[next] || next === current) return;
  current = next;
  window.localStorage.setItem(STORAGE_KEY, next);
  applyDocumentMeta();
  listeners.forEach((fn) => fn(next));
}

export function onLangChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function applyDocumentMeta() {
  const dict = dictionaries[current];
  document.documentElement.lang = current;
  document.title = dict.meta.title;

  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute('content', dict.meta.description);

  const skip = document.querySelector('[data-skip-link]');
  if (skip) skip.textContent = dict.a11y.skip;
}

