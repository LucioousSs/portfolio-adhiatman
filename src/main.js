import './styles/main.css';
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource-variable/archivo/wdth.css';

import { applyDocumentMeta, onLangChange } from './lib/i18n.js';
import { resetMotion, refreshMotion } from './lib/motion.js';
import { projectModal } from './components/ProjectModal.js';
import { Navbar } from './components/Navbar.js';
import { Hero } from './components/Hero.js';
import { Work } from './components/Work.js';
import { About } from './components/About.js';
import { Journey } from './components/Journey.js';
import { TechStack } from './components/TechStack.js';
import { Contact } from './components/Contact.js';
import { Footer } from './components/Footer.js';

const sections = [
  new Navbar(),
  new Hero(),
  new Work(),
  new About(),
  new Journey(),
  new TechStack(),
  new Contact(),
  new Footer(),
];

class App {
  constructor() {
    this.root = document.getElementById('app');
  }

  mount() {
    this.root.innerHTML = sections.map((section) => section.render()).join('');
    sections.forEach((section) => section.init?.());
  }
}

function start() {
  const app = new App();

  projectModal.mount();
  applyDocumentMeta();
  app.mount();

  onLangChange(() => {
    // Full re-render keeps the content model simple: every string is read once,
    // from the active dictionary. Motion is reset first so triggers do not stack.
    const scrollY = window.scrollY;
    projectModal.close();
    resetMotion();
    applyDocumentMeta();
    app.mount();
    window.scrollTo({ top: scrollY, behavior: 'instant' });
    refreshMotion();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
