import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SWV Meubel Portaal',
    short_name: 'SWV Meubel',
    description: 'Studenten, coördinatoren en lidbedrijven van SWV Meubel — uren, planning, documenten.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#FBF8F3',
    theme_color: '#EC6806',
    categories: ['education', 'productivity'],
    lang: 'nl-NL',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
    ],
  };
}
