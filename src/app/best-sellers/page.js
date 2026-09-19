// app/best-sellers/page.js
import BestSellersPageContent from "./BestSellersPageContent"

export const metadata = {
    title: "Best Sellers",
    description: "Discover our most popular products at EMCC.",
    alternates: {
        canonical: "/best-sellers",
    },
}

export default function BestSellersPage() {
    return <BestSellersPageContent />
}
