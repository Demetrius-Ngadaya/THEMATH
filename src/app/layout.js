// app/layout.js
import { Inter } from "next/font/google"
import LayoutShell from "./LayoutShell"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://emcc-lab.com"

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "EMCC - Science, Technology & STEM Products",
    template: "%s | EMCC",
  },
  description:
    "EMCC offers science, technology, and STEM products and services, research publications, and educational resources.",
  keywords: ["EMCC", "STEM", "science products", "technology", "research", "Tanzania"],
  authors: [{ name: "EMCC" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "EMCC",
    title: "EMCC - Science, Technology & STEM Products",
    description:
      "EMCC offers science, technology, and STEM products and services, research publications, and educational resources.",
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "EMCC - Science, Technology & STEM Products",
    description:
      "EMCC offers science, technology, and STEM products and services, research publications, and educational resources.",
  },
  icons: {
    icon: "/favicon.ico",
  },
  // Paste your real verification codes here once you register with each
  // service (Google Search Console, Bing Webmaster Tools). Leaving a key
  // out entirely (rather than an empty string) is safe - Next.js just
  // omits that meta tag.
  verification: {
    // google: "your-google-site-verification-code",
    // other: { "msvalidate.01": "your-bing-verification-code" },
  },
}

// Server-side fetch of the same site settings the footer/contact page use,
// so the Organization/LocalBusiness structured data always matches what's
// actually shown on the site - no separate place to keep in sync.
async function getSiteSettings() {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://backendapi.emcc-lab.com/api"
    const res = await fetch(`${apiBase}/settings`, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function RootLayout({ children }) {
  const settings = await getSiteSettings()

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EMCC",
    url: SITE_URL,
    ...(settings?.email && { email: settings.email }),
    ...(settings?.phone && { telephone: settings.phone }),
    ...(settings?.address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.address,
      },
    }),
    sameAs: [
      settings?.facebook_url,
      settings?.twitter_url,
      settings?.instagram_url,
      settings?.linkedin_url,
      settings?.youtube_url,
    ].filter(Boolean),
  }

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "EMCC",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/products?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  )
}
