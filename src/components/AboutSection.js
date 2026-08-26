import { bioData, educationData, organizationData } from '../data/aboutData.js';
import { skillsData } from '../data/skillsData.js';
import { Skill } from '../models/Skill.js';
import { ExperienceService } from '../services/ExperienceService.js';

export class AboutSection {
  constructor() {
    this.bio = bioData;
    this.softSkills = skillsData.soft.map((s) => new Skill(s, 'soft'));
    this.education = educationData;
    this.organizations = organizationData;
    this.experiences = [];

    this._onBioMouseMove = this._onBioMouseMove.bind(this);
    this._bioObserver = null;
  }

  async init() {
    this.experiences = await ExperienceService.fetchAll();
    this._renderFlipCards();
    this._initBioObserver();
    this._initExpandingLine();
    this._initBioParallax();
    this._initMagneticBadges();
    this._initFlipCards();
  }

  _renderFlipCards() {
    const grid = document.getElementById('flip-grid');
    if (!grid) return;
    grid.innerHTML = this.experiences.map((exp) => this._flipCard(exp)).join('');
    this._initFlipCards();
  }

  _flipCard(exp) {
    return `
      <div class="flip-card">
        <div class="flip-inner">
          <div class="flip-front">
            <p class="text-white font-bold text-sm leading-snug">${exp.role}</p>
            <p class="text-zinc-400 text-xs mt-1">${exp.event}</p>
            <span class="absolute top-3 right-3 text-[10px] text-zinc-500 bg-zinc-800 rounded-full px-2 py-0.5">${exp.year}</span>
            <span class="absolute bottom-3 right-3 text-[9px] text-zinc-600 tracking-wider uppercase">Click to flip</span>
          </div>
          <div class="flip-back">
            <p class="text-zinc-300 text-xs leading-relaxed">${exp.description || 'No description available.'}</p>
            <span class="absolute bottom-3 right-3 text-[9px] text-zinc-600 tracking-wider uppercase">Click to flip back</span>
          </div>
        </div>
      </div>`;
  }

  _initBioObserver() {
    const words = document.querySelectorAll('#bio-parallax .bio-word');
    if (!words.length) return;

    this._bioObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.dataset.idx, 10);
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, idx * 40);
            this._bioObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    words.forEach((w) => this._bioObserver.observe(w));
  }

  _initExpandingLine() {
    const track = document.querySelector('.timeline-track');
    const progress = document.getElementById('timeline-progress');
    const items = document.querySelectorAll('.tl-item');
    if (!track || !progress || !items.length) return;

    const onScroll = () => {
      const trackRect = track.getBoundingClientRect();
      const wh = window.innerHeight;
      const trigger = wh * 0.75;

      let lastVisibleBottom = 0;
      let allVisible = true;

      items.forEach((item) => {
        const node = item.querySelector('.tl-node');
        const nodeRect = node.getBoundingClientRect();
        if (nodeRect.top < trigger) {
          item.classList.add('visible');
          lastVisibleBottom = nodeRect.top - trackRect.top + nodeRect.height;
        } else {
          allVisible = false;
        }
      });

      if (allVisible) {
        progress.style.transform = 'scaleY(1)';
      } else if (lastVisibleBottom > 0) {
        const trackH = trackRect.height;
        const scale = Math.min(0.95, lastVisibleBottom / trackH);
        progress.style.transform = `scaleY(${scale})`;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  _initBioParallax() {
    const container = document.getElementById('bio-parallax');
    if (!container) return;
    container.addEventListener('mousemove', this._onBioMouseMove);
    container.addEventListener('mouseleave', () => {
      const words = container.querySelectorAll('.bio-word');
      words.forEach((w) => { w.style.transform = ''; });
    });
  }

  _onBioMouseMove(e) {
    const container = document.getElementById('bio-parallax');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const mx = e.clientX - rect.left - rect.width / 2;
    const words = container.querySelectorAll('.bio-word');
    words.forEach((w) => {
      const depth = parseFloat(w.dataset.depth) || 0.15;
      const x = Math.max(-12, Math.min(12, mx * depth * 0.04));
      w.style.transform = `translateX(${x}px)`;
    });
  }

  _initMagneticBadges() {
    document.querySelectorAll('[data-magnetic]').forEach((badge) => {
      badge.addEventListener('mouseenter', () => {
        badge.classList.add('magnetic-active');
      });
      badge.addEventListener('mouseleave', () => {
        badge.classList.remove('magnetic-active');
        badge.style.transform = '';
      });
      badge.addEventListener('mousemove', (e) => {
        const rect = badge.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        badge.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });
    });
  }

  _initFlipCards() {
    document.querySelectorAll('.flip-card').forEach((card) => {
      if (card.dataset.initialized) return;
      card.dataset.initialized = 'true';
      card.addEventListener('click', () => card.classList.toggle('flipped'));
    });
  }

  renderExpandingTimeline(list) {
    return list
      .map(
        (item, i) => `
          <div class="tl-item" data-idx="${i}">
            <div class="tl-node"></div>
            <div class="tl-content">
              <span class="tl-year">${item.period}</span>
              <p class="tl-title">${item.title}</p>
              ${item.org ? `<p class="tl-org">${item.org}</p>` : ''}
            </div>
          </div>`
      )
      .join('');
  }

  render() {
    const mainWords = this.bio.main.split(/\s+/);
    const supportWords = this.bio.support.split(/\s+/);
    let idx = 0;

    const renderWords = (words) =>
      words
        .map((w) => {
          const i = idx++;
          const depth = (0.05 + Math.random() * 0.25).toFixed(2);
          return `<span class="bio-word" data-depth="${depth}" data-idx="${i}">${w}</span>`;
        })
        .join(' ');

    const timelineItems = [...this.education, ...this.organizations];

    return `
      <section id="about" class="about-section relative overflow-hidden pt-32 sm:pt-32 pb-20 sm:pb-28 scroll-mt-24">

        <!-- Grain overlay -->
        <svg class="grain-overlay" aria-hidden="true">
          <filter id="grain-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain-filter)" />
        </svg>

        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <!-- Kinetic Title -->
          <h2 class="about-title text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-12 text-white">
            <span>A</span><span>B</span><span>O</span><span>U</span><span>T</span>
            <span class="about-title-space">&nbsp;</span>
            <span>M</span><span>E</span>
          </h2>

          <!-- Bio — word-by-word reveal + cursor-reactive parallax -->
          <div id="bio-parallax" class="max-w-3xl mb-16">
            <p class="text-lg md:text-xl leading-relaxed text-zinc-300 mb-4">
              ${renderWords(mainWords)}
            </p>
            <p class="text-base md:text-lg leading-relaxed text-zinc-400">
              ${renderWords(supportWords)}
            </p>
          </div>

          <!-- Soft Skills — magnetic badges -->
          <div class="mb-16">
            <h3 class="uppercase tracking-widest text-zinc-500 text-xs font-semibold mb-5">Soft Skills</h3>
            <div class="flex flex-wrap gap-3">
              ${this.softSkills
                .map((skill) => `<span class="magnetic-badge" data-magnetic>${skill.name}</span>`)
                .join('')}
            </div>
          </div>

          <!-- Education & Organization — expanding line timeline -->
          <div class="mb-16">
            <h3 class="uppercase tracking-widest text-zinc-500 text-xs font-semibold mb-8">Education & Organization</h3>
            <div class="timeline-expanding">
              <div class="timeline-track">
                <div class="timeline-progress" id="timeline-progress"></div>
              </div>
              <div class="timeline-items">
                ${this.renderExpandingTimeline(timelineItems)}
              </div>
            </div>
          </div>

          <!-- Event Experience — flip cards -->
          <div>
            <h3 class="uppercase tracking-widest text-zinc-500 text-xs font-semibold mb-6">Event Experience</h3>
            <div id="flip-grid" class="flip-grid">
              <div class="text-zinc-500 text-sm col-span-full text-center py-8">Loading experiences...</div>
            </div>
          </div>

        </div>
      </section>
    `;
  }
}
