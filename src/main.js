import { Navbar } from './components/Navbar.js';
import { HeroSection } from './components/HeroSection.js';
import { TechStackSection } from './components/TechStackSection.js';
import { AboutSection } from './components/AboutSection.js';
import { ProjectsSection } from './components/ProjectsSection.js';
import { ProjectModal } from './components/ProjectModal.js';
import { ContactSection } from './components/ContactSection.js';
import { Footer } from './components/Footer.js';

class App {
  constructor() {
    this.app = document.getElementById('app');
    const modal = new ProjectModal();
    this.components = [
      new Navbar(),
      new HeroSection(),
      new AboutSection(),
      new TechStackSection(),
      new ProjectsSection(modal),
      new ContactSection(),
      new Footer(),
    ];
  }

  async render() {
    this.app.innerHTML = this.components
      .map((component) => component.render())
      .join('');

    for (const component of this.components) {
      if (typeof component.init === 'function') {
        await component.init();
      }
    }
  }

  init() {
    this.render().then(() => {
      this.initRevealObserver();
    });
  }

  initRevealObserver() {
    const elements = this.app.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || elements.length === 0) {
      elements.forEach((el) => el.classList.add('show'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          } else {
            entry.target.classList.remove('show');
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach((el) => observer.observe(el));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
