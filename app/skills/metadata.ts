import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const skillsMetadata: Metadata = generateMetadata({
  title: 'AI Skills & Integrations - Clawdbot',
  description: 'Explore Clawdbot skills: Gmail integration, calendar sync, web browsing, browser automation, code execution, and more. Extend your AI assistant capabilities.',
  path: '/skills',
});
