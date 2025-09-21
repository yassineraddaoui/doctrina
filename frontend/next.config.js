/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: (process.env.API_URL || 'http://localhost:8081/api/auth') + '/:path*', // Resolves to http://localhost:8081/api/auth/:path*
      },
    ];
  },
};

module.exports = nextConfig;