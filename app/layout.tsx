import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';
import { ErrorBoundary } from '@/components/ui/ErrorState';

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
        {/* Security headers will be added by middleware */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <ToastProvider>
          <ErrorBoundary
            fallback={
              <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 mb-4 text-red-500">
                    <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h1 className="text-xl font-semibold text-white mb-2">Something went wrong</h1>
                  <p className="text-gray-400 mb-4">We&apos;re sorry, but something unexpected happened.</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Refresh Page
                  </button>
                </div>
              </div>
            }
          >
            {children}
          </ErrorBoundary>
        </ToastProvider>
        
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
