// app/contact/page.js
import ContactPageContent from "./ContactPageContent"

export const metadata = {
    title: "Contact Us",
    description: "Get in touch with EMCC - phone, email, WhatsApp, address, and business hours.",
    alternates: {
        canonical: "/contact",
    },
}

export default function ContactPage() {
    return <ContactPageContent />
}
