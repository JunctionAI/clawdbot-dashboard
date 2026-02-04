import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Dashboard - Clawdbot',
  description: 'Manage your Clawdbot AI assistant. View usage, agents, integrations, and workspace settings.',
  path: '/dashboard',
  noIndex: true, // Dashboard is private
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
