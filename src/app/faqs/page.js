// app/faqs/page.js
import FAQsPageContent from "./FAQsPageContent"

export const metadata = {
    title: "FAQs",
    description: "Frequently asked questions about EMCC's products, services, orders, and shipping.",
    alternates: {
        canonical: "/faqs",
    },
}

export default function FAQsPage() {
    return <FAQsPageContent />
}
