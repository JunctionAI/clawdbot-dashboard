import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from '@/components/ui/Toast'

export const metadata: Metadata = {
  title: 'Clawdbot SaaS - Your AI Assistant, Always On',
  description: 'AI assistant that remembers everything and works 24/7. Like ChatGPT, but it actually knows who you are.',
  keywords: ['AI', 'assistant', 'automation', 'productivity', 'SaaS'],
  authors: [{ name: 'Clawdbot Team' }],
  openGraph: {
    title: 'Clawdbot SaaS - Your AI Assistant, Always On',
    description: 'AI assistant that remembers everything and works 24/7.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
