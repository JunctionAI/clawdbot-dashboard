import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { HomepageJsonLd } from '@/components/JsonLd';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Clawdbot - Your Personal AI Agent',
    template: '%s | Clawdbot',
  },
  description: 'Enterprise-grade AI assistant that remembers everything. Automate tasks, manage communications, and boost productivity.',
  keywords: ['AI assistant', 'automation', 'productivity', 'AI agent', 'personal AI'],
  authors: [{ name: 'Clawdbot Team' }],
  creator: 'Clawdbot',
  publisher: 'Clawdbot',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Clawdbot',
    title: 'Clawdbot - Your Personal AI Agent',
    description: 'Enterprise-grade AI assistant that remembers everything.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Clawdbot - Your Personal AI Agent',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clawdbot - Your Personal AI Agent',
    description: 'Enterprise-grade AI assistant that remembers everything.',
    images: ['/twitter-image.png'],
    creator: '@clawdbot',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://js.stripe.com" />
        {/* Structured data for SEO */}
        <HomepageJsonLd />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <Providers>
          {children}
        </Providers>
        
        {/* Skip to content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-lg"
        >
          Skip to content
        </a>
      </body>
    </html>
  );
}
