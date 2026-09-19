// Single source of truth for API and storage base URLs.
// Everything in the app should import from here instead of reading
// process.env.NEXT_PUBLIC_API_URL / NEXT_PUBLIC_STORAGE_URL directly -
// that's what caused the "/api/api/..." and "/api/storage/..." bugs:
// different files each built the URL their own slightly-different way.
//
// Configure via .env.local:
//   NEXT_PUBLIC_API_URL=http://localhost:8000/api
//   NEXT_PUBLIC_STORAGE_URL=http://localhost:8000/storage

const stripTrailingSlash = (url) => url.replace(/\/+$/, '')

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backendapi.emcc-lab.com/api'
const RAW_STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || 'https://backendapi.emcc-lab.com/storage'

// Always ends with /api, never doubled - e.g. "http://localhost:8000/api"
export const API_BASE_URL = stripTrailingSlash(RAW_API_URL)

// The site root with no /api and no /storage - e.g. "http://localhost:8000"
// Useful when you need the bare host (rarely - prefer API_BASE_URL or
// STORAGE_BASE_URL directly).
export const SITE_ROOT_URL = stripTrailingSlash(RAW_API_URL).replace(/\/api$/, '')

// Always ends with /storage, never doubled - e.g. "http://localhost:8000/storage"
export const STORAGE_BASE_URL = stripTrailingSlash(RAW_STORAGE_URL)
