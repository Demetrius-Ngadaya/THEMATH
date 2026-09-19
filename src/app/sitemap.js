// app/sitemap.js
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://emcc-lab.com"
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://backendapi.emcc-lab.com/api"

async function safeFetch(path) {
    try {
        const res = await fetch(`${API_BASE}${path}`, { next: { revalidate: 3600 } })
        if (!res.ok) return []
        const data = await res.json()
        return Array.isArray(data) ? data : (data.data || [])
    } catch {
        return []
    }
}

export default async function sitemap() {
    const staticPages = [
        "",
        "/products",
        "/categories",
        "/services",
        "/deals",
        "/research",
        "/about",
        "/contact",
        "/faqs",
        "/best-sellers",
        "/privacy-policy",
        "/terms-of-service",
    ].map((path) => ({
        url: `${SITE_URL}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "daily" : "weekly",
        priority: path === "" ? 1 : 0.8,
    }))

    const [products] = await Promise.all([
        safeFetch("/products?per_page=1000"),
    ])

    const productPages = products.map((p) => ({
        url: `${SITE_URL}/product/${p.id}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
    }))

    return [...staticPages, ...productPages]
}
