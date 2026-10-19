import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: 'power3.out', duration: 0.9 });

export { gsap, ScrollTrigger };

export function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Fine pointer + wide viewport: richer motion is allowed here only. */
export function isDesktop() {
  return (
    window.matchMedia('(min-width: 1024px)').matches &&
    window.matchMedia('(pointer: fine)').matches
  );
}

/**
 * Fade a set of elements up as they enter the viewport.
 * Purpose: reveal sections in reading order so long sections do not arrive at once.
 */
export function revealUp(targets, { y = 28, stagger = 0.06 } = {}) {
  const els = gsap.utils.toArray(targets);
  if (!els.length || reducedMotion()) return;

  els.forEach((el, i) => {
    gsap.from(el, {
      y,
      opacity: 0,
      duration: 0.8,
      delay: i * stagger,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
}

const pointerHandlers = new Map();
let pointerBound = false;

function dispatchPointer(event) {
  pointerHandlers.forEach((handler) => handler(event));
}

/**
 * Register a pointer handler under an id, so several components can react to the
 * pointer without fighting over the same window listener. Re-registering an id
 * replaces its handler, which keeps re-renders from stacking listeners.
 */
export function bindPointer(id, handler) {
  if (!pointerBound) {
    window.addEventListener('mousemove', dispatchPointer, { passive: true });
    pointerBound = true;
  }
  if (handler) pointerHandlers.set(id, handler);
  else pointerHandlers.delete(id);
}

/** Kill every trigger, tween, and pointer handler. Used before a full re-render. */
export function resetMotion() {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  ScrollTrigger.clearScrollMemory('manual');
  gsap.globalTimeline.clear();
  pointerHandlers.clear();
}

export function refreshMotion() {
  ScrollTrigger.refresh();
}
