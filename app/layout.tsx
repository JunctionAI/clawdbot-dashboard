import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Clawdbot SaaS - Your AI Assistant, Always On',
  description: 'AI assistant that remembers everything and works 24/7. Like ChatGPT, but it actually knows who you are.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
