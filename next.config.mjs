// Image/storage hosts are derived from the same .env.local vars everything
// else now uses (NEXT_PUBLIC_API_URL / NEXT_PUBLIC_STORAGE_URL), so switching
// between local dev and production only requires changing .env.local - no
// edits needed here.

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backendapi.emcc-lab.com/api'
const RAW_STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || 'https://backendapi.emcc-lab.com/storage'

function parseOrigin(urlString) {
  try {
    const url = new URL(urlString)
    return {
      protocol: url.protocol.replace(':', ''),
      hostname: url.hostname,
      port: url.port || undefined,
    }
  } catch {
    return null
  }
}

const apiOrigin = parseOrigin(RAW_API_URL)
const storageOrigin = parseOrigin(RAW_STORAGE_URL)

// Always also allow the production host as a fallback, regardless of what
// .env.local points at locally, so images from production data still load
// (e.g. when testing locally against a database that references production
// file paths).
const PROD_HOSTNAME = 'backendapi.emcc-lab.com'

function buildRemotePatterns() {
  const patterns = []
  const seen = new Set()

  const add = (origin, pathname) => {
    if (!origin) return
    const key = `${origin.protocol}|${origin.hostname}|${origin.port || ''}|${pathname}`
    if (seen.has(key)) return
    seen.add(key)
    patterns.push({ protocol: origin.protocol, hostname: origin.hostname, port: origin.port, pathname })
  }

  // From .env.local (covers local dev - e.g. http://localhost:8000)
  add(storageOrigin, '/storage/**')
  add(apiOrigin, '/api/storage/**')

  // Production fallback (covers the live site regardless of local .env.local)
  add({ protocol: 'https', hostname: PROD_HOSTNAME }, '/storage/**')
  add({ protocol: 'https', hostname: PROD_HOSTNAME }, '/api/storage/**')

  return patterns
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: buildRemotePatterns(),
  },
  trailingSlash: false,
  // Proxies relative /storage/* requests to wherever NEXT_PUBLIC_STORAGE_URL
  // points - only relevant if something in the app ever requests a relative
  // /storage/... path instead of the absolute URL getImageUrl() builds.
  async rewrites() {
    const storageBase = RAW_STORAGE_URL.replace(/\/storage\/?$/, '')
    return [
      {
        source: '/storage/:path*',
        destination: `${storageBase}/storage/:path*`,
      },
      {
        source: '/api/storage/:path*',
        destination: `${storageBase}/api/storage/:path*`,
      },
    ];
  },
};

export default nextConfig;
