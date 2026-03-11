"use client"

import { Provider } from "react-redux"
import { store } from "@/store/store"
import { ThemeProvider } from "next-themes"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }) {
  const pathname = usePathname()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${inter.className} bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-black transition-colors duration-300`}>
        <Provider store={store}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <AnimatePresence mode="wait">
                <motion.main
                  key={pathname}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex-grow pt-20"
                >
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    {children}
                  </div>
                </motion.main>
              </AnimatePresence>
              <Footer />
            </div>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  )
}