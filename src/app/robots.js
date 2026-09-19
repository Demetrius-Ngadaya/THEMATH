// app/robots.js
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://emcc-lab.com"

export default function robots() {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/admin", "/admin/", "/cart", "/checkout", "/account", "/wishlist", "/orders", "/login", "/register"],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
    }
}
