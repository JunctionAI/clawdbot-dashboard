'use client';

import { useEffect } from 'react';
import { ToastProvider } from '@/components/ui/Toast';
import { ErrorBoundary } from '@/components/ui/ErrorState';
import { NotificationProvider } from '@/lib/notifications/context';
import { ToastContainer } from '@/components/notifications/ToastContainer';
import { AuthProvider } from '@/lib/auth/provider';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Register service worker for push notifications
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  return (
    <AuthProvider>
      <ToastProvider>
        <NotificationProvider>
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
          <ToastContainer />
          </ErrorBoundary>
        </NotificationProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
