import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync } from 'node:fs';

const CHROME = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
].filter(Boolean).find((c) => existsSync(c));

const OUT = process.env.SHOT_DIR ?? 'C:\\Users\\ASUS\\AppData\\Local\\Temp\\opencode\\shots';
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-first-run', '--no-default-browser-check'],
});

const page = await browser.newPage();
const url = process.env.SMOKE_URL ?? 'http://localhost:4173/portfolio-adhiatman/';

const viewports = [
  { name: 'desktop-1440x900', width: 1440, height: 900 },
  { name: 'tablet-768x1024', width: 768, height: 1024 },
  { name: 'mobile-360x740', width: 360, height: 740 },
];

for (const vp of viewports) {
  await page.setViewport({ width: vp.width, height: vp.height });
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2600));
  await page.screenshot({ path: `${OUT}\\hero-${vp.name}.png` });
  console.log(`hero-${vp.name}.png`);
}

// Contact section: where the CV button and location now live.
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'load' });
await new Promise((r) => setTimeout(r, 800));
await page.evaluate(() => {
  document.documentElement.style.scrollBehavior = 'auto';
  document.getElementById('contact')?.scrollIntoView();
});
await new Promise((r) => setTimeout(r, 2600));
await page.screenshot({ path: `${OUT}\\contact-desktop.png` });
console.log('contact-desktop.png');

// About section: tagline lead line.
await page.evaluate(() => document.getElementById('about')?.scrollIntoView());
await new Promise((r) => setTimeout(r, 2600));
await page.screenshot({ path: `${OUT}\\about-desktop.png` });
console.log('about-desktop.png');

// Work section: three featured projects and the quiet GitHub link.
for (const vp of [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 360, height: 740 },
]) {
  await page.setViewport({ width: vp.width, height: vp.height });
  await page.goto(url, { waitUntil: 'load' });
  await new Promise((r) => setTimeout(r, 700));
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    document.getElementById('work')?.scrollIntoView();
  });
  await new Promise((r) => setTimeout(r, 2200));
  const section = await page.$('#work');
  await section.screenshot({ path: `${OUT}\\work-${vp.name}.png` });
  console.log(`work-${vp.name}.png`);
}

// Journey section: the chronological rework, plus proof the year index sticks.
await page.setViewport({ width: 1440, height: 1000 });
await page.goto(url, { waitUntil: 'load' });
await new Promise((r) => setTimeout(r, 700));
await page.evaluate(() => {
  document.documentElement.style.scrollBehavior = 'auto';
  document.getElementById('journey')?.scrollIntoView();
});
await new Promise((r) => setTimeout(r, 2200));
await page.screenshot({ path: `${OUT}\\journey-desktop-1.png` });

// The year index must hold its place while the section is on screen.
const sticky = await page.evaluate(() => {
  const link = document.querySelector('[data-journey-index]');
  if (!link) return 'index hidden';
  window.scrollBy(0, 520);
  const start = Math.round(link.getBoundingClientRect().top);
  window.scrollBy(0, 260);
  const held = Math.round(link.getBoundingClientRect().top);
  window.scrollBy(0, -780);
  return `start=${start} after+260px=${held} ${Math.abs(held - start) <= 2 ? 'HELD' : 'MOVED'}`;
});
console.log(`sticky index: ${sticky}`);

await page.evaluate(() => window.scrollBy(0, 780));
await new Promise((r) => setTimeout(r, 1400));
await page.screenshot({ path: `${OUT}\\journey-desktop-2.png` });
console.log('journey-desktop-1.png / journey-desktop-2.png');

// An expanded row must hold all of its text: this is what the flip cards broke on.
await page.evaluate(() => document.querySelectorAll('[data-journey-toggle]')[1]?.click());
await new Promise((r) => setTimeout(r, 700));
await page.evaluate(() =>
  document.querySelectorAll('[data-journey-detail]')[1]?.scrollIntoView({ block: 'center' })
);
await new Promise((r) => setTimeout(r, 500));
await page.screenshot({ path: `${OUT}\\journey-detail.png` });
const detailFit = await page.evaluate(() => {
  const panel = document.querySelectorAll('[data-journey-detail]')[1];
  const paragraph = panel?.querySelector('p');
  return { panel: Math.round(panel?.getBoundingClientRect().height ?? 0), text: paragraph?.scrollHeight ?? 0 };
});
console.log(
  `journey detail: panel=${detailFit.panel}px text=${detailFit.text}px ${
    detailFit.text <= detailFit.panel + 1 ? 'FITS' : 'CLIPPED'
  }`
);

// Journey on a phone: the index is hidden, so only the spine remains.
await page.setViewport({ width: 360, height: 740 });
await page.goto(url, { waitUntil: 'load' });
await page.evaluate(() => {
  document.documentElement.style.scrollBehavior = 'auto';
  document.getElementById('journey')?.scrollIntoView();
});
await new Promise((r) => setTimeout(r, 1800));
await page.screenshot({ path: `${OUT}\\journey-mobile-1.png` });
await page.evaluate(() => window.scrollBy(0, 520));
await new Promise((r) => setTimeout(r, 1200));
await page.screenshot({ path: `${OUT}\\journey-mobile-2.png` });
console.log('journey-mobile-1.png / journey-mobile-2.png');

// The expanded row on a phone, where the flip cards used to overflow worst.
await page.evaluate(() => {
  const btn = document.querySelectorAll('[data-journey-toggle]')[1];
  btn?.click();
  btn?.scrollIntoView({ block: 'center' });
});
await new Promise((r) => setTimeout(r, 900));
await page.screenshot({ path: `${OUT}\\journey-mobile-detail.png` });
console.log('journey-mobile-detail.png');

// Same section in English: the derived labels and the running entry must travel with the toggle.
await page.click('[data-lang="en"]');
await new Promise((r) => setTimeout(r, 900));
await page.evaluate(() => {
  document.documentElement.style.scrollBehavior = 'auto';
  document.getElementById('journey')?.scrollIntoView();
});
await new Promise((r) => setTimeout(r, 1200));
await page.screenshot({ path: `${OUT}\\journey-mobile-en.png` });
console.log('journey-mobile-en.png');
await page.click('[data-lang="id"]');
await new Promise((r) => setTimeout(r, 800));

// Tablet: still the stacked chapter layout, but a wide column.
await page.setViewport({ width: 768, height: 1024 });
await page.goto(url, { waitUntil: 'load' });
await page.evaluate(() => {
  document.documentElement.style.scrollBehavior = 'auto';
  document.getElementById('journey')?.scrollIntoView();
});
await new Promise((r) => setTimeout(r, 1600));
await page.screenshot({ path: `${OUT}\\journey-tablet.png` });
console.log('journey-tablet.png');

// Reduced motion: no scripted state at all, and the section must still read complete.
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await page.setViewport({ width: 1280, height: 900 });
await page.goto(url, { waitUntil: 'load' });
await page.evaluate(() => {
  document.documentElement.style.scrollBehavior = 'auto';
  document.getElementById('journey')?.scrollIntoView();
});
await new Promise((r) => setTimeout(r, 900));
await page.screenshot({ path: `${OUT}\\journey-reduced.png` });
const reduced = await page.evaluate(() => {
  const body = document.querySelector('[data-journey-body]');
  const year = document.querySelector('[data-journey-year]');
  return {
    body: getComputedStyle(body).opacity,
    year: getComputedStyle(year).opacity,
    transform: getComputedStyle(year).transform,
  };
});
console.log(
  `journey reduced motion: body=${reduced.body} year=${reduced.year} transform=${reduced.transform}`
);
await page.emulateMediaFeatures([]);

// Width sweep: the name must never wrap or overflow, and the hero must fit the fold.
console.log('\nwidth  overflow  h1-width  photo-w  hero-h  head/cta');
for (const width of [320, 360, 390, 414, 768, 1024, 1280, 1440, 1920]) {
  await page.setViewport({ width, height: 900 });
  await page.goto(url, { waitUntil: 'load' });
  await new Promise((r) => setTimeout(r, 1200));
  const info = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const hero = document.querySelector('#home');
    const cta = document.querySelector('[data-hero-cta]');
    const photo = document.querySelector('[data-hero-photo]');
    const photoRect = photo.getBoundingClientRect();
    return {
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      h1Width: Math.round(h1.getBoundingClientRect().width),
      heroHeight: Math.round(hero.getBoundingClientRect().height),
      vh: window.innerHeight,
      photoW: Math.round(photoRect.width),
      // Where the real head starts (transparent 22.2% of height stripped out),
      // measured from the top edge of the section. Negative means clipped.
      headTop: Math.round(photoRect.top + photoRect.height * 0.2222 - hero.getBoundingClientRect().top),
      ctaBottom: Math.round(cta.getBoundingClientRect().bottom),
    };
  });
  console.log(
    `${String(width).padEnd(6)} ${String(info.overflow).padEnd(9)} ${String(info.h1Width).padEnd(9)} ` +
      `${String(info.photoW).padEnd(8)} ${String(info.heroHeight).padEnd(5)} ` +
      `head-top=${String(info.headTop).padEnd(6)} cta-bottom=${String(info.ctaBottom).padEnd(5)} vh=${info.vh}`
  );
}

await browser.close();
console.log(`\n${OUT}`);
