import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Settings - Clawdbot',
  description: 'Configure your Clawdbot account settings, preferences, and integrations.',
  path: '/settings',
  noIndex: true, // Settings is private
});

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
