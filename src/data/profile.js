/**
 * Profile content.
 *
 * TODO(verify): the LinkedIn profile URL was still a placeholder in the old code
 * (`https://linkedin.com`), so it is intentionally omitted rather than shipped as
 * a dead link. Add it back to `socials` once the real URL is known.
 */
export const profile = {
  name: 'Adhiatman',
  fullName: 'I Putu Adhiatman',
  role: {
    id: 'UI/UX Designer & Frontend Developer',
    en: 'UI/UX Designer & Frontend Developer',
  },
  tagline: {
    id: 'Merancang antarmuka yang enak dipakai, lalu membangunnya sendiri.',
    en: 'I design interfaces that feel good to use, then build them myself.',
  },
  location: {
    id: 'Denpasar, Bali, Indonesia',
    en: 'Denpasar, Bali, Indonesia',
  },
  email: 'putuadhi133@gmail.com',
  whatsapp: '6289635263050',
  whatsappDisplay: '+62 896-3526-3050',
  photo: '/images/profile.png',
  // TODO(verify): drop the CV PDF at public/cv/putu-adhiatman-cv.pdf.
  cv: '/cv/putu-adhiatman-cv.pdf',
  socials: [
    { key: 'github', label: 'GitHub', url: 'https://github.com/LucioousSs' },
    { key: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/adhiatmn/' },
  ],
};
