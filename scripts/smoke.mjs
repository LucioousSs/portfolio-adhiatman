import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

const CHROME = CHROME_CANDIDATES.find((candidate) => existsSync(candidate));
if (!CHROME) {
  console.error('No Chrome/Edge binary found. Set CHROME_PATH to run the smoke test.');
  process.exit(2);
}

const URL = process.env.SMOKE_URL ?? 'http://localhost:4173/portfolio-adhiatman/';

const results = [];
const pass = (name, ok, note = '') => results.push({ name, ok, note });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-first-run', '--no-default-browser-check'],
  defaultViewport: { width: 1440, height: 900 },
});

const page = await browser.newPage();
const consoleErrors = [];
const pageErrors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (err) => pageErrors.push(err.message));

await page.goto(URL, { waitUntil: 'load', timeout: 60000 });
await new Promise((r) => setTimeout(r, 2000));

// 1. Hero renders with the default Indonesian content.
const h1 = await page.$eval('h1', (el) => el.textContent.replace(/\s+/g, ''));
pass('Hero name renders', h1 === 'ADHIATMAN', h1);
const heroGap = await page.evaluate(() => {
  const nav = document.querySelector('#site-nav').getBoundingClientRect();
  const title = document.querySelector('.hero-title').getBoundingClientRect();
  return Math.round(title.top - nav.bottom);
});
pass('Hero clears the floating navbar', heroGap >= 56, `${heroGap}px`);

// 1b. One grid: every section heading and the footer sit on the same left edge.
const gridEdges = await page.evaluate(() => {
  const left = (sel) => Math.round(document.querySelector(sel).getBoundingClientRect().left);
  return {
    heads: ['#about h2', '#work h2', '#journey h2', '#tech h2', '#contact h2'].map(left),
    footer: left('footer p.type-display'),
    nav: left('#site-nav > div'),
  };
});
const edges = [...gridEdges.heads, gridEdges.footer, gridEdges.nav];
pass(
  'Sections, navbar, and footer share one grid edge',
  new Set(edges).size === 1,
  edges.join(' / ')
);
const lang = await page.$eval('html', (el) => el.lang);
pass('Default language is Indonesian', lang === 'id', lang);
pass('Indonesian CTA present', (await page.$eval('#home', (el) => el.textContent)).includes('Lihat karya'));

// 1b. Reading order: the statement follows the hero, then the work. The navbar
// order has to travel with it, and the bar itself now floats out of the flow.
const order = await page.evaluate(() => {
  const header = document.getElementById('site-nav');
  const rail = header?.querySelector('.nav-rail');
  const hero = document.getElementById('home');
  return {
    sections: [...document.querySelectorAll('#app > *')]
      .map((el) => el.id || el.tagName.toLowerCase())
      .join(','),
    links: [...document.querySelectorAll('#site-nav nav > ul [data-nav-link]')]
      .map((a) => a.dataset.navLink)
      .join(','),
    position: header ? getComputedStyle(header).position : 'missing',
    railTop: rail ? Math.round(rail.getBoundingClientRect().top) : -1,
    railWidth: rail ? Math.round(rail.getBoundingClientRect().width) : 0,
    viewport: window.innerWidth,
    heroHeight: hero ? Math.round(hero.getBoundingClientRect().height) : 0,
    vh: window.innerHeight,
  };
});
pass(
  'About follows the hero and the navbar follows the sections',
  order.sections === 'site-nav,home,about,work,journey,tech,contact,footer' &&
    order.links === 'about,work,journey,contact',
  `${order.sections} | ${order.links}`
);
pass(
  'Navbar floats as an inset rail over a full-height hero',
  order.position === 'fixed' &&
    order.railTop >= 8 &&
    order.railWidth < order.viewport &&
    Math.abs(order.heroHeight - order.vh) <= 1,
  `position=${order.position} top=${order.railTop} rail=${order.railWidth}/${order.viewport} hero=${order.heroHeight}/${order.vh}`
);

// 2. Work shows the three featured projects, links to the rest on GitHub, and
// opens the modal with the right project.
const work = await page.evaluate(() => ({
  rows: document.querySelectorAll('[data-work-index]').length,
  all: Boolean(document.querySelector('#work a[href="https://github.com/LucioousSs?tab=repositories"]')),
}));
pass('Work shows three projects and links to the rest', work.rows === 3 && work.all, `${work.rows} rows, link=${work.all}`);

await page.click('[data-work-index="0"]');
await new Promise((r) => setTimeout(r, 900));
const modalOpen = await page.$eval('#project-modal', (el) => !el.classList.contains('hidden'));
const modalTitle = await page.$eval('#pm-title', (el) => el.textContent.trim());
pass('Clicking a work row opens the modal', modalOpen);
pass('Modal shows the clicked project', modalTitle === 'UD. Kariasa', modalTitle);

// 3. Escape closes it and focus returns to the row.
await page.keyboard.press('Escape');
await new Promise((r) => setTimeout(r, 500));
const modalClosed = await page.$eval('#project-modal', (el) => el.classList.contains('hidden'));
pass('Escape closes the modal', modalClosed);
const focused = await page.evaluate(() => document.activeElement?.getAttribute('data-work-index'));
pass('Focus returns to the triggering row', focused === '0', String(focused));

// 3a. Design work has its own block below the code list, with no link of its own.
const design = await page.evaluate(() => {
  const cards = [...document.querySelectorAll('[data-design-index]')];
  const link = document.querySelector('#work a[href*="tab=repositories"]');
  const first = cards[0];
  return {
    cards: cards.length,
    block: Boolean(document.querySelector('[data-design-block]')),
    belowLink: Boolean(link && first && link.compareDocumentPosition(first) & 4),
    covers: cards.filter((card) => card.querySelector('[data-design-cover]')).length,
    filters: cards.map((card) => {
      const media = card.querySelector('[data-design-cover] > span > *');
      return media ? getComputedStyle(media).filter : 'missing';
    }),
    links: cards.reduce((n, card) => n + card.querySelectorAll('a').length, 0),
  };
});
pass(
  'Design block sits below the GitHub link with three colour covers',
  design.cards === 3 &&
    design.block &&
    design.belowLink &&
    design.covers === 3 &&
    design.links === 0 &&
    design.filters.every((filter) => filter === 'none'),
  `${design.cards} cards, belowLink=${design.belowLink}, filters=${design.filters.join('/')}`
);

// 3b. A design card opens the same modal. With no prototype URL yet, the modal
// must not show an empty link bar or an invented year.
await page.click('[data-design-index="0"]');
await new Promise((r) => setTimeout(r, 900));
const designModal = await page.evaluate(() => {
  const root = document.getElementById('project-modal');
  const bar = root.querySelector('[data-pm-links]');
  return {
    open: !root.classList.contains('hidden'),
    title: root.querySelector('#pm-title').textContent.trim(),
    yearHidden: root.querySelector('[data-pm-year-wrap]')?.classList.contains('hidden'),
    barHidden: bar.classList.contains('hidden'),
    links: bar.querySelectorAll('a').length,
  };
});
pass(
  'Design card opens the modal without a dead link',
  designModal.open &&
    designModal.title === 'BantuSesama' &&
    designModal.yearHidden &&
    designModal.barHidden &&
    designModal.links === 0,
  `${designModal.title}, links=${designModal.links}, barHidden=${designModal.barHidden}, yearHidden=${designModal.yearHidden}`
);

await page.keyboard.press('Escape');
await new Promise((r) => setTimeout(r, 500));
const designFocus = await page.evaluate(() => document.activeElement?.getAttribute('data-design-index'));
pass('Closing a design card returns focus to it', designFocus === '0', String(designFocus));

// 3b. About is one statement on the work axis: no image, no controls, no side content.
const about = await page.evaluate(() => {
  const section = document.getElementById('about');
  const statement = section?.querySelector('[data-about-text]');
  return {
    height: section ? Math.round(section.getBoundingClientRect().height) : 0,
    viewport: window.innerHeight,
    text: statement?.textContent.trim().length ?? 0,
    align: statement ? getComputedStyle(statement).textAlign : 'missing',
    images: section ? section.querySelectorAll('img').length : -1,
    controls: section ? section.querySelectorAll('a, button').length : -1,
  };
});
pass(
  'About holds a compact pause of about one screen',
  about.height >= about.viewport * 0.65 &&
    about.height <= about.viewport * 0.95 &&
    about.text > 60 &&
    about.align === 'center' &&
    about.images === 0 &&
    about.controls === 0,
  `${about.height}/${about.viewport}px, ${about.text} chars, align=${about.align}, images=${about.images}, controls=${about.controls}`
);

const axes = await page.evaluate(() => {
  const section = document.getElementById('about');
  section.scrollIntoView({ block: 'center' });
  const sectionRect = section.getBoundingClientRect();
  const head = section.querySelector('.about-head').getBoundingClientRect();
  const mask = section.querySelector('.about-mask').getBoundingClientRect();
  const work = document.querySelector('#work h2').getBoundingClientRect();
  const padBottom = parseFloat(getComputedStyle(section).paddingBottom);
  return {
    heading: Math.round(head.left),
    work: Math.round(work.left),
    textCenter: Math.round(mask.left + mask.width / 2),
    viewportCenter: Math.round(window.innerWidth / 2),
    textMiddle: Math.round(mask.top + mask.height / 2),
    bodyMiddle: Math.round((head.bottom + (sectionRect.bottom - padBottom)) / 2),
  };
});
pass(
  'About heading sits on the work axis while the statement stays centred',
  Math.abs(axes.heading - axes.work) <= 1 &&
    Math.abs(axes.textCenter - axes.viewportCenter) <= 1 &&
    Math.abs(axes.textMiddle - axes.bodyMiddle) <= 2,
  `heading=${axes.heading} work=${axes.work} text=${axes.textCenter}/${axes.viewportCenter} middle=${axes.textMiddle}/${axes.bodyMiddle}`
);

// 3c. The reveal has to finish, not just start: rule drawn, every phrase inked in.
const revealEnd = await page.evaluate(async () => {
  const section = document.getElementById('about');
  section.scrollIntoView({ block: 'center' });
  await new Promise((resolve) => setTimeout(resolve, 1900));
  const rule = section.querySelector('[data-about-rule]');
  const phrases = Array.from(section.querySelectorAll('[data-about-phrase]'));
  const raw = getComputedStyle(rule).transform;
  return {
    scale: raw === 'none' ? 1 : Math.round(new DOMMatrixReadOnly(raw).a * 100) / 100,
    count: phrases.length,
    colors: Array.from(new Set(phrases.map((phrase) => getComputedStyle(phrase).color))),
  };
});
pass(
  'About ends with the rule drawn and every phrase inked in',
  revealEnd.scale === 1 && revealEnd.count === 3 && revealEnd.colors.join() === 'rgb(255, 255, 255)',
  `scale=${revealEnd.scale} phrases=${revealEnd.count} colors=${revealEnd.colors.join('|')}`
);

// 3d. The spotlight is decorative, follows a fine pointer, and never blocks clicks.
const spotlightBox = await page.$eval('#about', (el) => {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
});
await page.mouse.move(spotlightBox.x, spotlightBox.y);
await new Promise((r) => setTimeout(r, 700));
const spotlight = await page.evaluate(() => {
  const el = document.querySelector('[data-about-glow]');
  if (!el) return null;
  const style = getComputedStyle(el);
  const matrix = new DOMMatrixReadOnly(style.transform);
  return {
    hidden: el.getAttribute('aria-hidden'),
    pointer: style.pointerEvents,
    opacity: Number(style.opacity),
    x: Math.round(matrix.e),
    y: Math.round(matrix.f),
  };
});
pass(
  'About spotlight follows the pointer and stays out of the way',
  Boolean(spotlight) &&
    spotlight.hidden === 'true' &&
    spotlight.pointer === 'none' &&
    spotlight.opacity > 0.8 &&
    Math.abs(spotlight.x - spotlightBox.w / 2) <= 12 &&
    Math.abs(spotlight.y - spotlightBox.h / 2) <= 12,
  spotlight
    ? `x=${spotlight.x}/${Math.round(spotlightBox.w / 2)} y=${spotlight.y}/${Math.round(spotlightBox.h / 2)} opacity=${spotlight.opacity} pointer=${spotlight.pointer}`
    : 'missing'
);

// 3e. A section link jumps, and the address bar keeps no hash behind.
await page.click('[data-nav-link="work"]');
await new Promise((r) => setTimeout(r, 1500));
const anchorJump = await page.evaluate(() => ({
  hash: window.location.hash,
  top: Math.round(document.getElementById('work').getBoundingClientRect().top),
}));
pass(
  'Section links jump without leaving a hash in the address bar',
  anchorJump.hash === '' && Math.abs(anchorJump.top - 88) <= 12,
  `hash="${anchorJump.hash}" work-top=${anchorJump.top}px`
);

// 4. Language toggle switches every string and persists.
await page.click('[data-lang="en"]');
await new Promise((r) => setTimeout(r, 900));
const navText = await page.$$eval('[data-nav-link]', (els) => els.map((e) => e.textContent.trim()).join('|'));
pass('Language toggle switches nav to English', navText.includes('Work') && navText.includes('About'), navText);
const storedLang = await page.evaluate(() => localStorage.getItem('portfolio.lang'));
pass('Language choice is persisted', storedLang === 'en', storedLang);
const docLang = await page.$eval('html', (el) => el.lang);
pass('html lang attribute updates', docLang === 'en', docLang);
const noKeyLeak = !(await page.$eval('body', (el) => el.textContent)).includes('.label');
pass('No untranslated key leaks', noKeyLeak);

// 5. Inherited language: reload keeps English.
await page.reload({ waitUntil: 'load' });
await new Promise((r) => setTimeout(r, 1500));
const stillEnglish = (await page.$eval('#home', (el) => el.textContent)).includes('See the work');
pass('Language survives a reload', stillEnglish);

// 6. Contact form toggle hides the email field and renames the button.
await page.click('[data-method="whatsapp"]');
await new Promise((r) => setTimeout(r, 200));
const emailHidden = await page.$eval('#email-field', (el) => el.classList.contains('hidden'));
const submitLabel = await page.$eval('#contact-submit', (el) => el.textContent.trim());
pass('WhatsApp toggle hides email field', emailHidden);
pass('Submit label follows the method', submitLabel === 'Send via WhatsApp', submitLabel);

// 7. Journey detail opens in place with the keyboard, and closes again.
await page.evaluate(() => {
  document.documentElement.style.scrollBehavior = 'auto';
  document.querySelector('[data-journey-toggle]')?.scrollIntoView({ block: 'center' });
});
await new Promise((r) => setTimeout(r, 400));
await page.focus('[data-journey-toggle]');
await page.keyboard.press('Enter');
await new Promise((r) => setTimeout(r, 700));
const detailOpened = await page.evaluate(() => {
  const btn = document.querySelector('[data-journey-toggle]');
  const panel = document.getElementById(btn.getAttribute('aria-controls'));
  return {
    expanded: btn.getAttribute('aria-expanded'),
    hidden: panel.hidden,
    height: Math.round(panel.getBoundingClientRect().height),
  };
});
pass(
  'Journey detail opens with the keyboard',
  detailOpened.expanded === 'true' && !detailOpened.hidden && detailOpened.height > 20,
  `${detailOpened.expanded}/${detailOpened.hidden}/${detailOpened.height}px`
);

await page.keyboard.press('Enter');
await new Promise((r) => setTimeout(r, 700));
const detailClosed = await page.evaluate(() => {
  const btn = document.querySelector('[data-journey-toggle]');
  const panel = document.getElementById(btn.getAttribute('aria-controls'));
  return { expanded: btn.getAttribute('aria-expanded'), hidden: panel.hidden };
});
pass(
  'Journey detail closes again',
  detailClosed.expanded === 'false' && detailClosed.hidden,
  `${detailClosed.expanded}/${detailClosed.hidden}`
);

// 7b. Both marquee rows must travel at one measured speed, so neither reads as a race.
const marqueeSpeeds = await page.evaluate(() =>
  [...document.querySelectorAll('#tech [data-marquee-track]')].map((track) => {
    const duration = parseFloat(getComputedStyle(track).animationDuration);
    const group = track.querySelector('[data-marquee-group]');
    return group.getBoundingClientRect().width / duration;
  })
);
pass(
  'Both marquee rows run at the same speed',
  marqueeSpeeds.length === 2 && marqueeSpeeds.every((speed) => Math.abs(speed - 60) < 2),
  marqueeSpeeds.map((speed) => `${speed.toFixed(1)}px/s`).join(', ')
);

// 7c. Contrast: every text element must clear WCAG AA for its size.
function collectContrastIssues() {
  // Tailwind v4 emits oklch(); rasterising to a 1x1 canvas forces sRGB bytes.
  const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  ctx.canvas.width = 1;
  ctx.canvas.height = 1;
  const toRgb = (css) => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = '#000000';
    ctx.fillStyle = css;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return [r, g, b];
  };
  const lum = ([r, g, b]) => {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (a, b) => {
    const l1 = lum(a);
    const l2 = lum(b);
    const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
    return (hi + 0.05) / (lo + 0.05);
  };
  const bgOf = (el) => {
    let node = el;
    while (node && node !== document.documentElement) {
      const bg = getComputedStyle(node).backgroundColor;
      if (bg && !/rgba\(0, 0, 0, 0\)|transparent/.test(bg)) return toRgb(bg);
      node = node.parentElement;
    }
    return [9, 9, 11];
  };

  const issues = [];
  document.querySelectorAll('p,span,a,li,dd,dt,h1,h2,h3,button,label,small').forEach((el) => {
    if (el.closest('svg')) return;
    const hasText = Array.from(el.childNodes).some(
      (n) => n.nodeType === 3 && n.textContent.trim().length > 1
    );
    if (!hasText) return;

    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const fg = toRgb(cs.color);
    const bg = bgOf(el);
    const size = parseFloat(cs.fontSize);
    const weight = parseInt(cs.fontWeight, 10) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const min = large ? 3 : 4.5;
    const value = ratio(fg, bg);

    if (value < min - 0.05) {
      issues.push(
        `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} "${el.textContent.trim().slice(0, 16)}" ` +
          `fg=rgb(${fg.join(',')}) bg=rgb(${bg.join(',')}) ${value.toFixed(2)}<${min}`
      );
    }
  });
  return issues;
}

const contrastIssues = await page.evaluate(collectContrastIssues);
pass('Text meets WCAG AA contrast', contrastIssues.length === 0, contrastIssues.slice(0, 4).join(' | '));

// Self-check: the detector must flag a genuinely low-contrast text element.
await page.evaluate(() => {
  const probe = document.createElement('p');
  probe.id = 'contrast-probe';
  probe.textContent = 'contrast probe';
  probe.style.cssText =
    'position:fixed;top:0;left:0;margin:0;padding:4px;font-size:14px;color:#26262b;background-color:#121215;';
  document.body.appendChild(probe);
});
const probeIssues = await page.evaluate(collectContrastIssues);
await page.evaluate(() => document.getElementById('contrast-probe')?.remove());
pass(
  'Contrast checker detects a real failure',
  probeIssues.length === contrastIssues.length + 1,
  `${probeIssues.length} vs ${contrastIssues.length}`
);

// 8. Mobile: no horizontal overflow, tap targets big enough.
await page.setViewport({ width: 360, height: 740 });
await new Promise((r) => setTimeout(r, 400));
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
pass('No horizontal overflow at 360px', overflow <= 1, `overflow=${overflow}px`);
const smallTargets = await page.$$eval('a[href], button', (els) =>
  els
    .filter((el) => {
      if (el.classList.contains('sr-only')) return false;
      const style = getComputedStyle(el);
      if (style.visibility === 'hidden' || style.display === 'none') return false;
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return false;
      return r.height < 24 || r.width < 24;
    })
    .map((el) => el.textContent.trim().slice(0, 24))
);
pass('Interactive targets are not tiny', smallTargets.length === 0, smallTargets.join(', '));

// 9. Mobile menu opens and closes.
await page.setViewport({ width: 360, height: 740 });
const menuHiddenStart = await page.$eval('#nav-menu', (el) => el.classList.contains('hidden'));
await page.click('#nav-toggle');
await new Promise((r) => setTimeout(r, 200));
const menuOpen = await page.$eval('#nav-menu', (el) => !el.classList.contains('hidden'));
await page.click('#nav-toggle');
await new Promise((r) => setTimeout(r, 200));
const menuClosed = await page.$eval('#nav-menu', (el) => el.classList.contains('hidden'));
pass('Mobile menu opens and closes', menuHiddenStart && menuOpen && menuClosed);

// 9b. The statement keeps a readable measure at 360px: at most five lines.
const statementMobile = await page.evaluate(() => {
  const statement = document.querySelector('[data-about-text]');
  if (!statement) return { lines: 0, width: 0 };
  const style = getComputedStyle(statement);
  return {
    lines: Math.round(statement.getBoundingClientRect().height / parseFloat(style.lineHeight)),
    width: Math.round(statement.getBoundingClientRect().width),
  };
});
pass(
  'Statement stays within five lines at 360px',
  statementMobile.lines > 0 && statementMobile.lines <= 5,
  `${statementMobile.lines} lines in ${statementMobile.width}px`
);

// 9b. Footer: real destinations only, a decorative closing illustration, current year.
const footerInfo = await page.evaluate(async () => {
  const el = document.querySelector('footer');
  el.scrollIntoView();
  const img = el.querySelector('img');
  await img?.decode().catch(() => {});
  const links = [...el.querySelectorAll('a')];
  return {
    links: links.length,
    dead: links.filter((a) => {
      const href = a.getAttribute('href') ?? '';
      if (!href || href === '#') return true;
      if (href.startsWith('#') && !document.querySelector(href)) return true;
      return false;
    }).length,
    anchors: links
      .filter((a) => a.getAttribute('href').startsWith('#'))
      .map((a) => a.getAttribute('href')),
    mail: links.filter((a) => a.href.startsWith('mailto:')).length,
    whatsapp: links.filter((a) => a.href.startsWith('https://wa.me/')).length,
    cv: links.filter((a) => a.hasAttribute('download')).length,
    socials: links.filter((a) => a.target === '_blank' && a.getAttribute('aria-label')).length,
    alt: img?.getAttribute('alt'),
    hidden: img?.getAttribute('aria-hidden'),
    loading: img?.getAttribute('loading'),
    artWidth: img?.naturalWidth ?? 0,
    band: img ? [Math.round(img.getBoundingClientRect().width), Math.round(img.getBoundingClientRect().height)] : [0, 0],
    viewport: window.innerWidth,
    year: el.querySelectorAll('p')[el.querySelectorAll('p').length - 1]?.textContent.trim(),
    currentYear: new Date().getFullYear(),
  };
});
pass(
  'Footer links only to real destinations',
  footerInfo.links === 11 &&
    footerInfo.dead === 0 &&
    footerInfo.anchors.join() === '#home,#about,#work,#journey,#contact' &&
    footerInfo.mail === 1 &&
    footerInfo.whatsapp === 1 &&
    footerInfo.cv === 1 &&
    footerInfo.socials === 3,
  `links=${footerInfo.links} dead=${footerInfo.dead} anchors=${footerInfo.anchors.join(' ')} mail=${footerInfo.mail} wa=${footerInfo.whatsapp} cv=${footerInfo.cv} social=${footerInfo.socials}`
);
pass(
  'Footer ends with a decorative, lazy, full-bleed illustration',
  footerInfo.alt === '' &&
    footerInfo.hidden === 'true' &&
    footerInfo.loading === 'lazy' &&
    footerInfo.artWidth > 1000 &&
    footerInfo.band[0] === footerInfo.viewport &&
    footerInfo.band[1] >= 200 &&
    footerInfo.band[1] <= 400,
  `alt="${footerInfo.alt}" hidden=${footerInfo.hidden} loading=${footerInfo.loading} art=${footerInfo.artWidth}px band=${footerInfo.band.join('x')} vw=${footerInfo.viewport}`
);
pass(
  'Footer copyright carries the current year',
  footerInfo.year?.includes(String(footerInfo.currentYear)),
  footerInfo.year
);

pass('No uncaught page errors', pageErrors.length === 0, pageErrors.join(' | '));
pass('No console errors', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '));

// 10. Reduced motion stops every loop in the hero without hiding the content.
await page.setViewport({ width: 1440, height: 900 });
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await page.goto(URL, { waitUntil: 'load' });
await new Promise((r) => setTimeout(r, 800));
const motion = await page.evaluate(() => {
  const marquee = document.querySelector('#home .marquee-track');
  const sparkle = document.querySelector('#home .animate-float-diagonal, #home .animate-float-vertical');
  const cta = document.querySelector('[data-hero-cta]');
  const letters = [...document.querySelectorAll('[data-hero-letter]')];
  return {
    marquee: marquee ? getComputedStyle(marquee).animationName : 'missing',
    sparkle: sparkle ? getComputedStyle(sparkle).animationName : 'missing',
    ctaVisible: Boolean(cta) && getComputedStyle(cta).opacity === '1',
    lettersVisible: letters.length > 0 && letters.every((el) => getComputedStyle(el).opacity === '1'),
  };
});
pass(
  'Reduced motion stops hero loops',
  motion.marquee === 'none' && motion.sparkle === 'none',
  `marquee=${motion.marquee} sparkle=${motion.sparkle}`
);
pass(
  'Reduced motion keeps hero content visible',
  motion.ctaVisible && motion.lettersVisible,
  `cta=${motion.ctaVisible} letters=${motion.lettersVisible}`
);

// 11. Reduced motion keeps the journey complete: every row lit, every year readable.
const journeyStatic = await page.evaluate(() => {
  const body = document.querySelector('[data-journey-body]');
  const node = document.querySelector('[data-journey-node]');
  const year = document.querySelector('[data-journey-year]');
  const chapter = document.querySelector('[data-journey-chapter]');
  return {
    rows: document.querySelectorAll('[data-journey-item]').length,
    bodyOpacity: body ? getComputedStyle(body).opacity : 'missing',
    nodeOpacity: node ? getComputedStyle(node).opacity : 'missing',
    yearOpacity: year ? getComputedStyle(year).opacity : 'missing',
    years: [...document.querySelectorAll('[data-journey-year]')].map((el) => el.textContent.trim()),
    chapters: [...document.querySelectorAll('[data-journey-chapter]')].map((el) =>
      el.getAttribute('data-journey-chapter')
    ),
    firstChapter: chapter?.getAttribute('data-journey-chapter'),
  };
});
pass(
  'Reduced motion keeps the journey readable',
  journeyStatic.rows > 0 &&
    journeyStatic.bodyOpacity === '1' &&
    journeyStatic.nodeOpacity === '1' &&
    journeyStatic.yearOpacity === '1' &&
    journeyStatic.years.every((year) => /^\d{4}$/.test(year)) &&
    journeyStatic.chapters[0] === '2024',
  `rows=${journeyStatic.rows} opacities=${journeyStatic.bodyOpacity}/${journeyStatic.nodeOpacity}/${journeyStatic.yearOpacity} years=${journeyStatic.years.join(',')}`
);

// 12. Reduced motion leaves the statement at rest and readable, with the rule
// already drawn and every phrase already white.
const aboutStatic = await page.evaluate(() => {
  const section = document.getElementById('about');
  const statement = section?.querySelector('[data-about-text]');
  const rule = section?.querySelector('[data-about-rule]');
  const glow = section?.querySelector('[data-about-glow]');
  if (!statement || !rule) return { text: 0 };
  const style = getComputedStyle(statement);
  const raw = getComputedStyle(rule).transform;
  const colors = Array.from(
    new Set(
      Array.from(section.querySelectorAll('[data-about-phrase]')).map(
        (phrase) => getComputedStyle(phrase).color
      )
    )
  );
  return {
    text: statement.textContent.trim().length,
    opacity: style.opacity,
    transform: style.transform,
    ruleScale: raw === 'none' ? 1 : Math.round(new DOMMatrixReadOnly(raw).a * 100) / 100,
    colors: colors.join('|'),
    glow: glow ? Number(getComputedStyle(glow).opacity) : -1,
  };
});
pass(
  'Reduced motion leaves the statement at rest, the rule drawn, every phrase white',
  aboutStatic.text > 60 &&
    aboutStatic.opacity === '1' &&
    aboutStatic.transform === 'none' &&
    aboutStatic.ruleScale === 1 &&
    aboutStatic.colors === 'rgb(255, 255, 255)' &&
    aboutStatic.glow === 0,
  `${aboutStatic.text} chars, opacity=${aboutStatic.opacity}, transform=${aboutStatic.transform}, rule=${aboutStatic.ruleScale}, colors=${aboutStatic.colors}, glow=${aboutStatic.glow}`
);

await browser.close();

for (const r of results) {
  console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.note ? `  [${r.note}]` : ''}`);
}
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
