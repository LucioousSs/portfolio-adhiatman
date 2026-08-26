CREATE DATABASE IF NOT EXISTS portfolio_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE portfolio_db;

-- New installations: create tables with base64 image storage
CREATE TABLE IF NOT EXISTS projects (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  title          VARCHAR(255) NOT NULL,
  description    TEXT NOT NULL,
  tags           VARCHAR(255) NOT NULL DEFAULT '',
  demo_url       VARCHAR(255) DEFAULT NULL,
  github_url     VARCHAR(255) DEFAULT NULL,
  thumbnail_data MEDIUMTEXT DEFAULT NULL,
  collage_data   MEDIUMTEXT DEFAULT NULL,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Migration: if upgrading from file-based to base64, run this:
-- ALTER TABLE projects DROP COLUMN thumbnail_url;
-- ALTER TABLE projects DROP COLUMN collage_images;
-- ALTER TABLE projects ADD COLUMN thumbnail_data MEDIUMTEXT DEFAULT NULL AFTER github_url;
-- ALTER TABLE projects ADD COLUMN collage_data MEDIUMTEXT DEFAULT NULL AFTER thumbnail_data;

CREATE TABLE IF NOT EXISTS experiences (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  role        VARCHAR(255) NOT NULL,
  event_name  VARCHAR(255) NOT NULL,
  year        VARCHAR(10) NOT NULL,
  description TEXT NOT NULL,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO experiences (role, event_name, year, description, sort_order)
VALUES
  ('Consumption & Spiritual Staff', 'Apolo', '2026', 'Bertanggung jawab dalam koordinasi konsumsi dan kebutuhan spiritual selama kegiatan Apolo berlangsung, memastikan seluruh peserta mendapatkan layanan yang memadai.', 1),
  ('Public Relations Coordinator', 'Gebyar Teknologi Informasi', '2026', 'Memimpin tim Humas dalam koordinasi media partner, press release, dan dokumentasi event. Mengelola komunikasi eksternal dan memastikan citra positif acara tersampaikan ke publik.', 2),
  ('Public Relations Coordinator', 'IT Family Gathering', '2025', 'Mengkoordinasikan kegiatan public relations untuk IT Family Gathering, termasuk penyusunan materi publikasi, koordinasi media, dan dokumentasi acara.', 3),
  ('Equipments Coordinator', 'Gebyar Teknologi Informasi', '2025', 'Mengatur dan mengelola seluruh kebutuhan peralatan teknis untuk Gebyar TI, mulai dari perencanaan hingga pelaksanaan, memastikan kelancaran operasional acara.', 4);