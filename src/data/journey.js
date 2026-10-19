// Periods are numbers, not strings, so the year chapters are derived from data
// instead of typed twice. `end: null` means the entry is still running.
export const journey = {
  education: [
    {
      start: 2024,
      end: null,
      title: {
        id: 'S1 Teknologi Informasi',
        en: 'Bachelor of Information Technology',
      },
      org: 'ITB STIKOM Bali',
    },
  ],
  organization: [
    {
      start: 2026,
      end: 2027,
      title: {
        id: 'Kepala Divisi Media & Hubungan Masyarakat',
        en: 'Head of Media & Public Relations Division',
      },
      org: 'Himpunan Mahasiswa TI, ITB STIKOM Bali',
    },
    {
      start: 2025,
      end: 2026,
      title: {
        id: 'Anggota Komite Hubungan Masyarakat',
        en: 'Public Relations Committee Member',
      },
      org: 'Himpunan Mahasiswa TI, ITB STIKOM Bali',
    },
  ],
  experience: [
    {
      year: 2026,
      role: { id: 'Staf Konsumsi & Kerohanian', en: 'Consumption & Spiritual Staff' },
      event: 'Apolo',
      description: {
        id: 'Mengoordinasikan konsumsi dan kebutuhan kerohanian peserta selama Apolo berlangsung, memastikan setiap peserta terlayani dengan baik.',
        en: 'Coordinated catering and spiritual needs throughout Apolo, making sure every participant was looked after.',
      },
    },
    {
      year: 2026,
      role: { id: 'Koordinator Hubungan Masyarakat', en: 'Public Relations Coordinator' },
      event: 'Gebyar Teknologi Informasi',
      description: {
        id: 'Memimpin tim humas dalam koordinasi media partner, press release, dan dokumentasi acara, memastikan citra positif acara tersampaikan ke publik.',
        en: 'Led the public relations team in media partner coordination, press releases, and event documentation, making sure the event reached the public well.',
      },
    },
    {
      year: 2025,
      role: { id: 'Koordinator Hubungan Masyarakat', en: 'Public Relations Coordinator' },
      event: 'IT Family Gathering',
      description: {
        id: 'Mengoordinasikan kegiatan humas IT Family Gathering, termasuk penyusunan materi publikasi, koordinasi media, dan dokumentasi acara.',
        en: 'Coordinated public relations for the IT Family Gathering, including publication material, media coordination, and event documentation.',
      },
    },
    {
      year: 2025,
      role: { id: 'Koordinator Peralatan', en: 'Equipments Coordinator' },
      event: 'Gebyar Teknologi Informasi',
      description: {
        id: 'Mengatur dan mengelola seluruh kebutuhan peralatan teknis Gebyar TI, dari perencanaan sampai pelaksanaan, agar operasional acara berjalan lancar.',
        en: 'Planned and managed all technical equipment for Gebyar TI, from planning through execution, keeping the event running smoothly.',
      },
    },
  ],
};
