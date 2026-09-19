// app/LayoutShell.js
"use client"

import { usePathname } from "next/navigation"
import { Providers } from './providers'
import { NextUIProviders } from '@/providers/NextUIProvider'
import { LanguageProvider } from '@/contexts/LanguageContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ChatWidget from '@/components/ChatWidget'
import ContactWidget from '@/components/ContactWidget'
import VisitorTracker from '@/components/VisitorTracker'
import CookieConsent from '@/components/CookieConsent'

export default function LayoutShell({ children }) {
    const pathname = usePathname()

    // Check if current route is admin or auth pages (login/register)
    const isAdminRoute = pathname?.startsWith('/admin')
    const isAuthRoute = pathname === '/login' || pathname === '/register' ||
        pathname === '/forgot-password' || pathname === '/reset-password'

    // For admin routes and auth routes, don't show Navbar/Footer
    const shouldShowLayout = !isAdminRoute && !isAuthRoute

    return (
        <NextUIProviders>
            <Providers>
                <LanguageProvider>
                    {shouldShowLayout ? (
                        // Frontend routes - With Navbar/Footer and container
                        <div className="flex flex-col min-h-screen">
                            <Navbar />
                            <main className="flex-grow pt-20">
                                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                                    {children}
                                </div>
                            </main>
                            <Footer />
                            <ChatWidget />
                            <ContactWidget />
                        </div>
                    ) : (
                        // Admin and Auth routes - No Navbar/Footer, full width
                        <>{children}</>
                    )}
                    <VisitorTracker />
                    {!isAdminRoute && <CookieConsent />}
                </LanguageProvider>
            </Providers>
        </NextUIProviders>
    )
}
