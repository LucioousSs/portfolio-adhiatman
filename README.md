# Portfolio — Adhiatman

Personal portfolio website with admin dashboard for managing projects and experiences.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla JavaScript (ES Modules), HTML5, Tailwind CSS (CDN) |
| Backend | PHP Native, MySQL (PDO) |
| Font | Plus Jakarta Sans |
| Design System | Bold Modern Monochrome |

## Features

### Frontend
- **Hero Section** — Kinetic typography "DIGITAL DESIGNER" with 3D shadow, cutout photo, sparkles, marquee
- **About Me Section** — Word-by-word bio reveal, cursor-reactive parallax, magnetic skill badges, expanding line timeline, flip card event experience, grain texture overlay
- **Tech Stack** — Full-width marquee banners (Technologies & Tools)
- **Projects** — Horizontal carousel, hover image slideshow, click-to-modal with full image slider (arrows, dots, thumbnails, keyboard nav)
- **Contact** — Email/WhatsApp toggle form, social media links (Instagram, GitHub, LinkedIn)
- **Responsive** — Mobile-first, 320px to 1440px+

### Admin Dashboard
- Tab Projects / Experiences with CRUD
- Project upload with thumbnail + collage images
- Experience management (role, event, year, description)
- Edit with existing image preview, delete with confirmation

### Backend API
- RESTful PHP endpoints for Projects & Experiences
- Image upload with validation (type, size)
- CORS headers for cross-origin requests

## Project Structure

```
Portfolio/
├── index.html                    # Entry point
├── admin/
│   ├── index.html                # Simple upload form
│   ├── dashboard.html            # Full CRUD dashboard
│   ├── dashboard.js              # Dashboard logic
│   └── admin.js                  # Simple upload logic
├── api/
│   ├── config.php                # PDO MySQL config
│   ├── get_projects.php          # GET all projects
│   ├── upload_project.php        # POST upload project
│   ├── update_project.php        # POST edit project
│   ├── delete_project.php        # DELETE project
│   ├── get_experiences.php       # GET all experiences
│   ├── add_experience.php        # POST add experience
│   ├── update_experience.php     # POST edit experience
│   ├── delete_experience.php     # DELETE experience
│   ├── .htaccess                 # Apache PHP limits
│   └── .user.ini                 # PHP limits override
├── assets/
│   ├── css/styles.css            # Custom animations
│   └── images/                   # Profile photo, favicon
├── database/
│   └── schema.sql                # MySQL schema + seed data
├── uploads/                      # User uploaded images (gitignored)
└── src/
    ├── main.js                   # App bootstrap
    ├── components/               # UI components (OOP)
    │   ├── Navbar.js
    │   ├── HeroSection.js
    │   ├── AboutSection.js
    │   ├── TechStackSection.js
    │   ├── ProjectsSection.js
    │   ├── ProjectModal.js
    │   ├── ContactSection.js
    │   └── Footer.js
    ├── models/                   # Data models
    │   ├── Project.js
    │   └── Skill.js
    ├── services/                 # API service layer
    │   ├── ProjectService.js
    │   └── ExperienceService.js
    └── data/                     # Static/fallback data
        ├── aboutData.js
        ├── projectsData.js
        └── skillsData.js
```

## Getting Started

### Prerequisites
- PHP 7.4+
- MySQL 5.7+ / MariaDB 10.3+
- Local server (Laragon, XAMPP, etc.)

### Installation
1. Clone or download this repository
2. Import `database/schema.sql` into MySQL
3. Edit `api/config.php` with your DB credentials
4. If using Laragon, restart for `.user.ini` to take effect
5. Open `http://localhost/Portfolio/`

### Admin Dashboard
Open `http://localhost/Portfolio/admin/dashboard.html`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `api/get_projects.php` | Get all projects |
| POST | `api/upload_project.php` | Upload new project (multipart) |
| POST | `api/update_project.php` | Update project |
| DELETE | `api/delete_project.php?id=X` | Delete project |
| GET | `api/get_experiences.php` | Get all experiences |
| POST | `api/add_experience.php` | Add experience |
| POST | `api/update_experience.php` | Update experience |
| DELETE | `api/delete_experience.php?id=X` | Delete experience |

## Design System

| Role | Tailwind Class | Hex |
|------|---------------|-----|
| Background | `bg-zinc-950` | #09090B |
| Cards | `bg-zinc-900` | #18181B |
| Borders | `border-zinc-800` | #27272A |
| Text Primary | `text-white` | #FFFFFF |
| Text Muted | `text-zinc-400` | #A1A1AA |
| CTA Button | `bg-zinc-50 text-black` | #FAFAFA |

## Browser Support
- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+

Requires ES Modules support (no IE11).

## License
MIT

## User View
<img width="1920" height="954" alt="image" src="https://github.com/user-attachments/assets/0414d968-8ca6-4ae9-b62e-8b2d73f8fa79" />

<img width="1919" height="958" alt="image" src="https://github.com/user-attachments/assets/c85c152e-0b58-435a-9f89-02ae1a930632" />

<img width="1917" height="894" alt="image" src="https://github.com/user-attachments/assets/7a3ffd07-8834-4fc2-b2c5-40c16a6383b4" />

<img width="1920" height="883" alt="image" src="https://github.com/user-attachments/assets/b1dc98d1-db5d-49b8-b989-eef5c7afdc78" />

<img width="1920" height="883" alt="image" src="https://github.com/user-attachments/assets/09bd390f-3255-40b8-8209-8b953a83ce4b" />

## Admin View
<img width="1919" height="953" alt="image" src="https://github.com/user-attachments/assets/1f7ae226-6d71-4e1d-bf08-6b94a1e070b7" />

<img width="1920" height="949" alt="image" src="https://github.com/user-attachments/assets/ba0c94a7-572b-4952-b1dc-e97ce3cc007f" />



