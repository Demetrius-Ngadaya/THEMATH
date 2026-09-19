// app/categories/page.js
import CategoriesPageContent from "./CategoriesPageContent"

export const metadata = {
    title: "Categories",
    description: "Browse all product categories available at EMCC.",
    alternates: {
        canonical: "/categories",
    },
}

export default function CategoriesPage() {
    return <CategoriesPageContent />
}
