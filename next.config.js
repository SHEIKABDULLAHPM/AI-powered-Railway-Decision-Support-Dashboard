/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE || '/api',
  },
  async rewrites() {
    return [
      // Allow API base URL override for production ML services
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_BASE 
          ? `${process.env.NEXT_PUBLIC_API_BASE}/:path*` 
          : '/api/:path*',
      },
    ];
  },
}

module.exports = nextConfig