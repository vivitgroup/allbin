/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'player.vimeo.com' },
      { protocol: 'https', hostname: 'vumbnail.com' },
      { protocol: 'https', hostname: 'i.vimeocdn.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
  },
  compress: true,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Skip TypeScript errors during build (handled by tsc separately)
  typescript: { ignoreBuildErrors: false },
  eslint:     { ignoreDuringBuilds: false },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',       value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',     value: 'camera=(), microphone=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://connect.facebook.net https://www.googletagmanager.com https://analytics.tiktok.com https://sc-static.net https://snap.licdn.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://api.anthropic.com https://www.google-analytics.com https://analytics.google.com https://analytics.tiktok.com https://tr.snapchat.com https://graph.facebook.com https://*.supabase.co wss://*.supabase.co",
              "frame-src https://www.facebook.com https://www.youtube.com https://player.vimeo.com",
              "media-src 'self' https://player.vimeo.com https://*.vimeocdn.com blob:",
            ].join('; '),
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      { source: '/admin', destination: '/dashboard', permanent: true },
      { source: '/shop',  destination: '/products',  permanent: true },
      { source: '/ar',    destination: '/',          permanent: false },
    ];
  },
};

module.exports = nextConfig;
