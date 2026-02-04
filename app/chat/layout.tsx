import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat with Ally | Clawdbot',
  description: 'Your personal AI assistant - chat with Ally to manage emails, calendar, and more.',
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
