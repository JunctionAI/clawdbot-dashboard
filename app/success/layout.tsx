import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Welcome to Clawdbot! - Subscription Active',
  description: 'Your subscription is active. Get started with your AI assistant.',
  path: '/success',
  noIndex: true, // Success page should not be indexed
});

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
