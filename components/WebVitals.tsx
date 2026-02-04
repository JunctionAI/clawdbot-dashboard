'use client';

import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';

// Web Vitals reporting for Core Web Vitals monitoring
// Tracks: LCP, FID, CLS, FCP, TTFB, INP

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Web Vitals] ${metric.name}:`, metric.value, metric.rating);
    }

    // Send to analytics in production
    // You can replace this with your analytics provider
    if (process.env.NODE_ENV === 'production') {
      const body = JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        id: metric.id,
        delta: metric.delta,
        navigationType: metric.navigationType,
      });

      // Use sendBeacon for reliable delivery
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/vitals', body);
      } else {
        fetch('/api/vitals', {
          body,
          method: 'POST',
          keepalive: true,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    }
  });

  return null;
}

// Performance optimization tips based on Core Web Vitals
export const PERFORMANCE_TIPS = {
  LCP: {
    name: 'Largest Contentful Paint',
    target: '< 2.5s',
    tips: [
      'Optimize and compress images',
      'Use next/image for automatic optimization',
      'Preload critical resources',
      'Remove render-blocking resources',
      'Use a CDN for faster content delivery',
    ],
  },
  FID: {
    name: 'First Input Delay',
    target: '< 100ms',
    tips: [
      'Break up Long Tasks',
      'Use web workers for heavy computation',
      'Reduce JavaScript execution time',
      'Use code splitting',
    ],
  },
  CLS: {
    name: 'Cumulative Layout Shift',
    target: '< 0.1',
    tips: [
      'Always include size attributes on images/videos',
      'Reserve space for dynamic content',
      'Avoid inserting content above existing content',
      'Use CSS aspect-ratio for responsive elements',
    ],
  },
  INP: {
    name: 'Interaction to Next Paint',
    target: '< 200ms',
    tips: [
      'Optimize event handlers',
      'Use CSS contain for isolated components',
      'Debounce expensive operations',
      'Use React.memo for expensive components',
    ],
  },
  TTFB: {
    name: 'Time to First Byte',
    target: '< 800ms',
    tips: [
      'Use edge functions/CDN',
      'Optimize server response time',
      'Use HTTP/2 or HTTP/3',
      'Enable compression',
    ],
  },
  FCP: {
    name: 'First Contentful Paint',
    target: '< 1.8s',
    tips: [
      'Eliminate render-blocking resources',
      'Inline critical CSS',
      'Preload important resources',
      'Use font-display: swap',
    ],
  },
};
