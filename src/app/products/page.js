"use client"

import { Suspense, lazy } from "react"
import { Spinner } from "@nextui-org/react"

// Lazy load the products component to disable SSR for the part that uses useSearchParams
const ProductsContent = lazy(() => import('./ProductsContent'))

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center h-96">
                <Spinner size="lg" color="primary" />
            </div>
        }>
            <ProductsContent />
        </Suspense>
    )
}