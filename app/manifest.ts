import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Clawdbot - Your Personal AI Agent',
    short_name: 'Clawdbot',
    description: 'Enterprise-grade AI assistant that remembers everything. Automate tasks, manage communications, and boost productivity.',
    start_url: '/',
    display: 'standalone',
    background_color: '#111827',
    theme_color: '#8b5cf6',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['productivity', 'utilities', 'business'],
    lang: 'en',
  };
}
