// app/privacy-policy/page.js

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://backendapi.emcc-lab.com/api"

export const metadata = {
    title: "Privacy Policy",
    description: "How EMCC collects, uses, and protects your personal information.",
    alternates: { canonical: "/privacy-policy" },
}

async function getSiteSettings() {
    try {
        const res = await fetch(`${API_BASE}/settings`, { next: { revalidate: 3600 } })
        if (!res.ok) return null
        return res.json()
    } catch {
        return null
    }
}

export default async function PrivacyPolicyPage() {
    const settings = await getSiteSettings()
    const companyName = settings?.company_name || "EMCC"
    const contactEmail = settings?.email || "info@emcc-lab.com"
    const contactAddress = settings?.address

    return (
        <div className="max-w-3xl mx-auto px-4 py-12 prose prose-gray dark:prose-invert">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Privacy Policy</h1>
            <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</p>

            <p>
                {companyName} ("we", "us", "our") operates this website. This page explains what
                information we collect when you use our site, why we collect it, and the choices
                you have.
            </p>

            <h2>Information We Collect</h2>
            <ul>
                <li>
                    <strong>Account information:</strong> when you register, we collect your name, email
                    address, and phone number.
                </li>
                <li>
                    <strong>Order information:</strong> when you place an order, we collect the products
                    ordered, delivery details, and payment status (we do not store your card or mobile
                    money credentials ourselves - payments are processed by our payment provider).
                </li>
                <li>
                    <strong>Contact form and chat messages:</strong> anything you submit through our
                    contact form or chat widget, including your name, email, phone number (if given),
                    and message content.
                </li>
                <li>
                    <strong>Newsletter subscription:</strong> if you subscribe for updates, we store your
                    email and, if you provide one, your phone number, so we can notify you about new
                    products, deals, and services.
                </li>
                <li>
                    <strong>Reviews:</strong> if you leave a product review, your name and review content
                    are shown publicly on that product's page.
                </li>
                <li>
                    <strong>Usage and analytics data:</strong> we automatically collect the pages you
                    visit, the approximate location your visit came from (city/country level, derived
                    from your IP address - we do not collect precise GPS location), your browser's
                    user agent, and visit timestamps. This helps us understand how visitors use the
                    site and improve it.
                </li>
            </ul>

            <h2>Cookies and Similar Technologies</h2>
            <p>
                We use a small amount of browser storage (cookies and local storage) for:
            </p>
            <ul>
                <li>Keeping you signed in (session/authentication tokens)</li>
                <li>Remembering items in your cart and wishlist</li>
                <li>Recognizing repeat visits for analytics purposes (a randomly generated ID, not tied
                    to your identity unless you're also logged in)</li>
                <li>Remembering your cookie consent choice</li>
            </ul>
            <p>
                You can decline non-essential cookies via the cookie banner shown on your first visit,
                or clear your browser's cookies/local storage at any time. Declining analytics cookies
                does not affect your ability to browse, shop, or contact us.
            </p>

            <h2>How We Use Your Information</h2>
            <ul>
                <li>To process and fulfill your orders, and keep you updated on their status</li>
                <li>To respond to your contact form submissions and chat messages</li>
                <li>To send the update notifications you've subscribed to</li>
                <li>To improve our website and product offerings based on how visitors use the site</li>
                <li>To detect and prevent fraud or abuse of our services</li>
            </ul>

            <h2>Sharing Your Information</h2>
            <p>
                We do not sell your personal information. We share information only with:
            </p>
            <ul>
                <li>Payment processors, to complete your transactions</li>
                <li>SMS and email delivery providers, to send order and notification messages</li>
                <li>Service providers who help us operate the site (e.g. hosting), under confidentiality
                    obligations</li>
                <li>Authorities, if required by law</li>
            </ul>

            <h2>Your Choices</h2>
            <ul>
                <li>You can update your account details or request account deletion by contacting us</li>
                <li>You can unsubscribe from update notifications at any time via the link/option
                    provided in those messages, or by contacting us</li>
                <li>You can decline analytics cookies via the cookie banner</li>
            </ul>

            <h2>Data Retention</h2>
            <p>
                We retain your information for as long as your account is active or as needed to
                provide services, comply with legal obligations, resolve disputes, and enforce our
                agreements.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
                We may update this Privacy Policy from time to time. The "Last updated" date at the
                top of this page reflects the most recent changes.
            </p>

            <h2>Contact Us</h2>
            <p>
                If you have questions about this Privacy Policy or how we handle your information,
                contact us at{" "}
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                {contactAddress && <> or at {contactAddress}</>}.
            </p>
        </div>
    )
}
