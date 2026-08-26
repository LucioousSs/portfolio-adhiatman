import { projectsData } from '../data/projectsData.js';

export class ProjectService {
  static getBaseUrl() {
    return window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');
  }

  static async fetchProjects() {
    const url = ProjectService.getBaseUrl() + 'api/get_projects.php';

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        return data.map((row) => {
          let collage = [];
          if (row.collage_images) {
            try {
              const parsed = JSON.parse(row.collage_images);
              collage = Array.isArray(parsed) ? parsed : [];
            } catch {
              collage = [];
            }
          }
          return {
            title:       row.title,
            description: row.description,
            tags:        row.tags ? row.tags.split(',').map((t) => t.trim()) : [],
            demo:        row.demo_url || '#',
            repo:        row.github_url || '#',
            image:       row.thumbnail_url,
            collage:     collage,
          };
        });
      }

      return projectsData;
    } catch (err) {
      console.warn('[ProjectService] API failed, using fallback:', err.message);
      return projectsData;
    }
  }
}