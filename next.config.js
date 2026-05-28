/** @type {import('next').NextConfig} */
const nextConfig = {
    // Add static export configuration
    output: 'export',  // IMPORTANT: This creates static HTML files

    images: {
        unoptimized: true,  // Required for static export
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
                pathname: '/storage/**',
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '8000',
                pathname: '/storage/**',
            },
            {
                protocol: 'http',
                hostname: '10.195.161.62',
                port: '8000',
                pathname: '/storage/**',
            },
            // Add production backend pattern
            {
                protocol: 'https',
                hostname: 'backendapi.emcc-lab.com',
                pathname: '/storage/**',
            },
        ],
    },

    // Ensure trailing slashes for better static hosting
    trailingSlash: true,

    // Specify output directory (optional, default is 'out')
    distDir: 'out',
}

module.exports = nextConfig