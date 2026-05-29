// app/products/page.js
import dynamic from 'next/dynamic'
import { Spinner } from "@nextui-react"

const ProductsContent = dynamic(
    () => import('./ProductsContent'),
    {
        ssr: false,
        loading: () => (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" color="primary" />
            </div>
        )
    }
)

export default function ProductsPage() {
    return <ProductsContent />
}