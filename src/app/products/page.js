import ProductsContent from './ProductsContent'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: "Shop Products",
    description: "Browse our full catalogue of science, technology, and STEM products at EMCC.",
    alternates: {
        canonical: "/products",
    },
}

export default function ProductsPage() {
    return <ProductsContent />
}