// app/deals/page.js
import DealsPageContent from "./DealsPageContent"

export const metadata = {
    title: "Flash Deals",
    description: "Current discounted products and limited-time deals at EMCC.",
    alternates: {
        canonical: "/deals",
    },
}

export default function DealsPage() {
    return <DealsPageContent />
}
