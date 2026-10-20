import { asset } from '../lib/media.js';

/**
 * Profile content.
 */
export const profile = {
  name: 'Adhiatman',
  fullName: 'I Putu Adhiatman',
  role: {
    id: 'UI/UX Designer & Frontend Developer',
    en: 'UI/UX Designer & Frontend Developer',
  },
  location: {
    id: 'Denpasar, Bali, Indonesia',
    en: 'Denpasar, Bali, Indonesia',
  },
  email: 'putuadhi133@gmail.com',
  whatsapp: '6289635263050',
  whatsappDisplay: '+62 896-3526-3050',
  photo: asset('/images/profile.png'),
  cv: asset('/cv/putu-adhiatman-cv.pdf'),
  socials: [
    { key: 'github', label: 'GitHub', url: 'https://github.com/LucioousSs' },
    { key: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/adhiatman' },
    { key: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/adhiatmn/' },
  ],
};
