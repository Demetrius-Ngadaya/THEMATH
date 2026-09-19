// app/services/page.js
import ServicesPageContent from "./ServicesPageContent"

export const metadata = {
    title: "Services",
    description: "Explore the range of scientific, technical, and STEM-related services offered by EMCC.",
    alternates: {
        canonical: "/services",
    },
}

export default function ServicesPage() {
    return <ServicesPageContent />
}
