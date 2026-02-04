/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://empathetic-dream-production-3f64.up.railway.app',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://clawdbot.ai',
  },

  // Performance: Enable experimental features for better Core Web Vitals
  experimental: {
    // Optimize package imports for smaller bundles
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.clawdbot.ai',
      },
    ],
  },

  // Compression
  compress: true,

  // Headers for security and caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Security headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      // Cache static assets aggressively
      {
        source: '/(.*)\\.(ico|png|svg|jpg|jpeg|gif|webp|avif|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache JS/CSS with revalidation
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      // Redirect www to non-www (configure in hosting for production)
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.clawdbot.ai',
          },
        ],
        destination: 'https://clawdbot.ai/:path*',
        permanent: true,
      },
      // Common redirects
      {
        source: '/pricing',
        destination: '/checkout',
        permanent: true,
      },
      {
        source: '/plans',
        destination: '/checkout',
        permanent: true,
      },
      {
        source: '/subscribe',
        destination: '/checkout',
        permanent: true,
      },
    ];
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Handle browser-only modules on server
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Production optimizations only
    if (!dev && !isServer) {
      // Minimize bundles - only for client
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }
    return config;
  },

  // Powered by header (disable for security)
  poweredByHeader: false,

  // Generate ETags for caching
  generateEtags: true,

  // Build output
  output: 'standalone',
};

module.exports = nextConfig;
