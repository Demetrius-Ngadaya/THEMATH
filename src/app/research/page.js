// app/research/page.js
import ResearchPageContent from "./ResearchPageContent"

export const metadata = {
    title: "Research",
    description: "Browse research papers and publications from EMCC.",
    alternates: {
        canonical: "/research",
    },
}

export default function ResearchPage() {
    return <ResearchPageContent />
}
