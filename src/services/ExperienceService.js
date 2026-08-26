import { experienceData } from '../data/aboutData.js';

export class ExperienceService {
  static getBaseUrl() {
    return window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');
  }

  static async fetchAll() {
    const url = ExperienceService.getBaseUrl() + 'api/get_experiences.php';

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        return data.map((row) => ({
          id:          row.id,
          role:        row.role,
          event:       row.event_name,
          year:        row.year,
          description: row.description,
          sortOrder:   row.sort_order,
        }));
      }

      return experienceData;
    } catch (err) {
      console.warn('[ExperienceService] API failed, using fallback:', err.message);
      return experienceData;
    }
  }

  static async add(data) {
    const url = ExperienceService.getBaseUrl() + 'api/add_experience.php';
    const fd  = new FormData();
    fd.append('role', data.role);
    fd.append('event_name', data.event);
    fd.append('year', data.year);
    fd.append('description', data.description || '');
    fd.append('sort_order', data.sortOrder || 0);

    const res = await fetch(url, { method: 'POST', body: fd });
    return res.json();
  }

  static async update(id, data) {
    const url = ExperienceService.getBaseUrl() + 'api/update_experience.php';
    const fd  = new FormData();
    fd.append('id', id);
    fd.append('role', data.role);
    fd.append('event_name', data.event);
    fd.append('year', data.year);
    fd.append('description', data.description || '');
    fd.append('sort_order', data.sortOrder || 0);

    const res = await fetch(url, { method: 'POST', body: fd });
    return res.json();
  }

  static async remove(id) {
    const url = ExperienceService.getBaseUrl() + 'api/delete_experience.php?id=' + id;
    const res = await fetch(url, { method: 'DELETE' });
    return res.json();
  }
}
