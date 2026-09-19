// app/about/page.js
import AboutPageContent from "./AboutPageContent"

export const metadata = {
    title: "About Us",
    description: "Learn about EMCC - our mission, team, and work in science, technology, and STEM education.",
    alternates: {
        canonical: "/about",
    },
}

export default function AboutPage() {
    return <AboutPageContent />
}
