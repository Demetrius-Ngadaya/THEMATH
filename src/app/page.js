// app/page.js
import HomeContent from "./HomeContent"

export const metadata = {
    title: "Home",
    description:
        "Shop science, technology, and STEM products at EMCC. Browse our catalogue, services, research publications, and latest deals.",
    alternates: {
        canonical: "/",
    },
}

export default function Home() {
    return <HomeContent />
}
