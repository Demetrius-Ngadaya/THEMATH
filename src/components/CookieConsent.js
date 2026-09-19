"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

const CONSENT_KEY = "cookie_consent" // 'accepted' | 'declined'

export default function CookieConsent() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const existing = localStorage.getItem(CONSENT_KEY)
        if (!existing) {
            setVisible(true)
        }
    }, [])

    const choose = (value) => {
        localStorage.setItem(CONSENT_KEY, value)
        // Let other parts of the app (e.g. the visitor tracker) react to
        // the choice immediately, without needing a page reload.
        window.dispatchEvent(new Event("cookie-consent-changed"))
        setVisible(false)
    }

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-0 left-0 right-0 z-[200] bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-2xl"
                >
                    <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center gap-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex-1">
                            We use cookies to keep you signed in, remember your cart, and understand how
                            visitors use our site. See our{" "}
                            <Link href="/privacy-policy" className="underline hover:text-blue-600">
                                Privacy Policy
                            </Link>{" "}
                            for details.
                        </p>
                        <div className="flex gap-2 shrink-0">
                            <button
                                onClick={() => choose("declined")}
                                className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Decline
                            </button>
                            <button
                                onClick={() => choose("accepted")}
                                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                            >
                                Accept
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
