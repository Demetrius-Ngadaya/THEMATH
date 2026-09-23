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

// Build the Content-Security-Policy from the same env-derived origins, so
// it automatically tracks whichever backend this build points at rather
// than needing to be hand-edited when switching environments.
function buildConnectSrc() {
  const origins = new Set(["'self'"])
  if (apiOrigin) origins.add(`${apiOrigin.protocol}://${apiOrigin.hostname}${apiOrigin.port ? ':' + apiOrigin.port : ''}`)
  if (storageOrigin) origins.add(`${storageOrigin.protocol}://${storageOrigin.hostname}${storageOrigin.port ? ':' + storageOrigin.port : ''}`)
  origins.add(`https://${PROD_HOSTNAME}`)
  return Array.from(origins).join(' ')
}

function buildCsp() {
  const directives = {
    'default-src': ["'self'"],
    // Next.js's own hydration/runtime scripts currently require
    // 'unsafe-inline'/'unsafe-eval' without a deeper nonce-based setup.
    // This is a common, pragmatic starting point - a stricter nonce-based
    // policy is possible later as a follow-up if you want to tighten this
    // further.
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:'],
    'font-src': ["'self'", 'data:'],
    'connect-src': [buildConnectSrc()],
    // The embedded Google Map on the contact page.
    'frame-src': ["'self'", 'https://maps.google.com', 'https://www.google.com'],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'frame-ancestors': ["'self'"],
  }

  return Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ')
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Next.js's image optimizer refuses to fetch from hosts that resolve
    // to a private/internal IP (127.0.0.1, 192.168.x.x, etc.) as a
    // built-in anti-SSRF guard - this trips on "localhost" in local dev
    // no matter what remotePatterns says, since that check happens
    // separately. Production points at a real public domain and is
    // unaffected, so optimization stays fully on there; only local dev
    // bypasses the optimizer (images still load fine, just unoptimized).
    unoptimized: process.env.NODE_ENV !== 'production',
    formats: ['image/avif', 'image/webp'],
    remotePatterns: buildRemotePatterns(),
  },
  trailingSlash: false,
  // Security headers - the ones that actually matter most for protecting
  // visitors' browsers live here, since this is what serves the HTML/JS
  // that runs in them. If something stops working after this ships,
  // check the browser console for a CSP violation message - it names
  // exactly what got blocked, which is the fastest way to know what to
  // add to the policy above.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), camera=(), microphone=(), payment=(), usb=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'Content-Security-Policy', value: buildCsp() },
        ],
      },
    ]
  },
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
