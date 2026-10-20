import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // The repository is https://github.com/LucioousSs/portfolio-adhiatman, so GitHub
  // Pages serves it as a project site under /portfolio-adhiatman/. Local dev and
  // preview use the same path, which keeps one source of truth for every URL.
  base: '/portfolio-adhiatman/',
  plugins: [tailwindcss()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
