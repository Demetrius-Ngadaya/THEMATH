// app/product/[id]/page.js
import ProductDetailContent from "./ProductDetailContent"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://emcc-lab.com"
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://backendapi.emcc-lab.com/api"
const STORAGE_BASE = process.env.NEXT_PUBLIC_STORAGE_URL || "https://backendapi.emcc-lab.com/storage"

async function getProduct(id) {
    try {
        const res = await fetch(`${API_BASE}/products/${id}`, { next: { revalidate: 300 } })
        if (!res.ok) return null
        return res.json()
    } catch {
        return null
    }
}

function imageUrl(path) {
    if (!path) return undefined
    if (path.startsWith("http")) return path
    const clean = path.replace(/^\/?storage\//, "").replace(/^\//, "")
    return `${STORAGE_BASE}/${clean}`
}

export async function generateMetadata({ params }) {
    const { id } = await params
    const product = await getProduct(id)

    if (!product) {
        return { title: "Product Not Found" }
    }

    const description = product.description
        ? product.description.slice(0, 160)
        : `${product.name} - available now at EMCC.`
    const image = imageUrl(product.images?.[0]?.path)

    return {
        title: product.name,
        description,
        alternates: {
            canonical: `/product/${id}`,
        },
        openGraph: {
            title: product.name,
            description,
            url: `${SITE_URL}/product/${id}`,
            type: "website",
            ...(image && { images: [{ url: image, alt: product.name }] }),
        },
        twitter: {
            card: "summary_large_image",
            title: product.name,
            description,
            ...(image && { images: [image] }),
        },
    }
}

export default async function ProductDetailPage({ params }) {
    const { id } = await params
    const product = await getProduct(id)

    const productJsonLd = product
        ? {
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.name,
              description: product.description || undefined,
              image: imageUrl(product.images?.[0]?.path),
              offers: {
                  "@type": "Offer",
                  price: product.price,
                  priceCurrency: "TZS",
                  availability:
                      product.stock > 0
                          ? "https://schema.org/InStock"
                          : "https://schema.org/OutOfStock",
                  url: `${SITE_URL}/product/${id}`,
              },
          }
        : null

    return (
        <>
            {productJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
                />
            )}
            <ProductDetailContent />
        </>
    )
}
