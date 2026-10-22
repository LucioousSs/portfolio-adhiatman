/**
 * One-page site, clean address bar. Clicking an in-page link makes the browser
 * write the section hash into the URL; a portfolio has no per-section addresses
 * to share, and a hash left behind reads like a broken route. The jump itself
 * stays native (smooth scroll, scroll-padding, keyboard activation); only the
 * fragment is dropped afterwards.
 */
export function initCleanAnchors() {
  const clean = () => {
    if (!window.location.hash) return;
    history.replaceState(null, '', window.location.pathname + window.location.search);
  };

  window.addEventListener('hashchange', clean);

  // A URL opened with a fragment never scrolled here anyway: the sections are
  // rendered after load, so the browser had no target. Drop the stale fragment.
  if (window.location.hash) requestAnimationFrame(clean);
}
