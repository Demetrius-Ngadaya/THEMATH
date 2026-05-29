// app/products/page.js
"use client"

import dynamic from 'next/dynamic'
import { Spinner } from "@nextui-org/react"

// Dynamically import the products component with SSR disabled
const ProductsContent = dynamic(
    () => import('./ProductsContent'),
    {
        ssr: false,
        loading: () => (
            <div className="flex justify-center items-center h-96">
                <Spinner size="lg" color="primary" />
            </div>
        )
    }
)

export default function ProductsPage() {
    return <ProductsContent />
}