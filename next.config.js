// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    // Remove output: 'export' for Vercel
    // output: 'export',  // COMMENT THIS OUT or REMOVE

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
        ],
    },

    // Ensure trailing slashes are handled
    trailingSlash: false,
}

module.exports = nextConfig