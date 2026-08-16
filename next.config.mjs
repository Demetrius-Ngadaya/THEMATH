/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: process.env.NODE_ENV === 'production' ? true : false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'backendapi.emcc-lab.com',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: 'backendapi.emcc-lab.com',
        port: '8000',
        pathname: '/storage/**',
      },
      // Add this to handle /api/storage/ paths from your error
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/api/storage/**',
      },
      {
        protocol: 'http',
        hostname: 'backendapi.emcc-lab.com',
        port: '8000',
        pathname: '/api/storage/**',
      },
    ],
  },
  trailingSlash: false,
  // Add rewrites if needed for development
  async rewrites() {
    return [
      {
        source: '/storage/:path*',
        destination: 'https://backendapi.emcc-lab.com/storage/:path*',
      },
      {
        source: '/api/storage/:path*',
        destination: 'https://backendapi.emcc-lab.com/api/storage/:path*',
      },
    ];
  },
};

export default nextConfig;