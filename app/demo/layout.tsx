import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Try Ally Demo | Clawdbot',
  description: 'Experience Ally, your AI assistant with memory, without signing up. See example conversations and interact with a limited demo.',
  openGraph: {
    title: 'Try Ally Demo - AI That Remembers You',
    description: 'No signup required. Experience an AI assistant that actually remembers your conversations.',
  },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
