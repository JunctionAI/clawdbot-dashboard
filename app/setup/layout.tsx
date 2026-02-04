import { SessionProvider } from '@/lib/auth/SessionProvider';

export const metadata = {
  title: 'Setup - Clawdbot',
  description: 'Set up your Clawdbot AI assistant in under a minute',
};

export default function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
