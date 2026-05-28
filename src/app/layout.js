// app/layout.js
"use client"

import { usePathname } from "next/navigation"
import { Providers } from './providers'
import { NextUIProviders } from '@/providers/NextUIProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }) {
  const pathname = usePathname()

  // Check if current route is admin or auth pages (login/register)
  const isAdminRoute = pathname?.startsWith('/admin')
  const isAuthRoute = pathname === '/login' || pathname === '/register'

  // For admin routes and auth routes, don't show Navbar/Footer
  const shouldShowLayout = !isAdminRoute && !isAuthRoute

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextUIProviders>
          <Providers>
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
              </div>
            ) : (
              // Admin and Auth routes - No Navbar/Footer, full width
              <>{children}</>
            )}
          </Providers>
        </NextUIProviders>
      </body>
    </html>
  )
}