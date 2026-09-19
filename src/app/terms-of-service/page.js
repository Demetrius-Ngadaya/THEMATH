// app/terms-of-service/page.js

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://backendapi.emcc-lab.com/api"

export const metadata = {
    title: "Terms of Service",
    description: "The terms and conditions for using EMCC's website and services.",
    alternates: { canonical: "/terms-of-service" },
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

export default async function TermsOfServicePage() {
    const settings = await getSiteSettings()
    const companyName = settings?.company_name || "EMCC"
    const contactEmail = settings?.email || "info@emcc-lab.com"

    return (
        <div className="max-w-3xl mx-auto px-4 py-12 prose prose-gray dark:prose-invert">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Terms of Service</h1>
            <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</p>

            <p>
                These Terms of Service ("Terms") govern your use of {companyName}'s website and the
                purchase of products and services through it. By using our site, you agree to these
                Terms. If you do not agree, please do not use our site.
            </p>

            <h2>1. Using Our Site</h2>
            <p>
                You must be able to form a legally binding contract to place an order with us. You
                agree to provide accurate information when creating an account or placing an order,
                and to keep your account credentials confidential. You're responsible for activity
                that happens under your account.
            </p>

            <h2>2. Products and Pricing</h2>
            <p>
                We make reasonable efforts to display accurate product information, pricing, and
                availability. However, errors may occur - if we discover a pricing or listing error
                after you've placed an order, we'll contact you before proceeding, and you may cancel
                the order if you're not satisfied with the correction. Prices are subject to change
                without notice, except for orders already placed.
            </p>

            <h2>3. Orders and Payment</h2>
            <p>
                Placing an order is an offer to purchase, which we may accept or decline (for example,
                if a product is out of stock or we suspect fraudulent activity). Payment must be
                completed through one of our supported payment methods before an order is processed.
                Coupon codes are subject to their own terms (validity period, minimum order amount,
                usage limits) as shown at the time you apply them.
            </p>

            <h2>4. Delivery</h2>
            <p>
                Delivery timeframes, where provided, are estimates and not guarantees. We are not
                responsible for delays caused by circumstances outside our reasonable control.
            </p>

            <h2>5. Returns and Cancellations</h2>
            <p>
                If you receive a damaged, defective, or incorrect item, contact us as soon as possible
                so we can make it right. Please reach out before returning any item, since return
                eligibility can depend on the product and its condition.
            </p>

            <h2>6. Account Termination</h2>
            <p>
                We may suspend or terminate your account if we believe you've violated these Terms,
                engaged in fraudulent activity, or misused our site.
            </p>

            <h2>7. Intellectual Property</h2>
            <p>
                All content on this site - including text, images, logos, and design - belongs to{" "}
                {companyName} or its licensors, and may not be copied, reproduced, or used without
                permission, except as necessary to use the site normally (e.g. browsing, printing an
                order confirmation for your own records).
            </p>

            <h2>8. Reviews and User Content</h2>
            <p>
                If you submit a product review or other content, you grant us permission to display it
                on our site. You're responsible for what you submit - don't post anything false,
                abusive, or that infringes someone else's rights. We may remove content that violates
                these Terms.
            </p>

            <h2>9. Limitation of Liability</h2>
            <p>
                To the fullest extent permitted by law, {companyName} is not liable for indirect,
                incidental, or consequential damages arising from your use of the site or purchase of
                products, beyond the value of the relevant order.
            </p>

            <h2>10. Changes to These Terms</h2>
            <p>
                We may update these Terms from time to time. Continued use of the site after changes
                take effect means you accept the updated Terms.
            </p>

            <h2>11. Governing Law</h2>
            <p>
                These Terms are governed by the laws of the United Republic of Tanzania.
            </p>

            <h2>12. Contact Us</h2>
            <p>
                Questions about these Terms? Contact us at{" "}
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
            </p>
        </div>
    )
}
