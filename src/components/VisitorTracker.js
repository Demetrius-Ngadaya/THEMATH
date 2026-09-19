"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import axios from "axios"
import { API_BASE_URL } from "@/utils/apiConfig"

const SESSION_KEY = "visitor_session_id"
const CONSENT_KEY = "cookie_consent" // 'accepted' | 'declined'
const HEARTBEAT_INTERVAL_MS = 60000 // 1 minute

function hasDeclinedConsent() {
    if (typeof window === "undefined") return false
    return localStorage.getItem(CONSENT_KEY) === "declined"
}

function getOrCreateSessionId() {
    if (typeof window === "undefined") return null
    let id = localStorage.getItem(SESSION_KEY)
    if (!id) {
        id = "vis_" + Date.now() + "_" + Math.random().toString(36).slice(2, 12)
        localStorage.setItem(SESSION_KEY, id)
    }
    return id
}

export default function VisitorTracker() {
    const pathname = usePathname()
    const sessionIdRef = useRef(null)
    // Re-render when the person makes a cookie choice, so declining stops
    // tracking immediately without needing a page reload.
    const [consentDeclined, setConsentDeclined] = useState(hasDeclinedConsent())

    useEffect(() => {
        const handleConsentChange = () => setConsentDeclined(hasDeclinedConsent())
        window.addEventListener("cookie-consent-changed", handleConsentChange)
        return () => window.removeEventListener("cookie-consent-changed", handleConsentChange)
    }, [])

    // Never track admin activity as a "visitor", and stop entirely if the
    // visitor has declined analytics cookies.
    const isAdminRoute = pathname && pathname.startsWith("/admin")
    const shouldTrack = !isAdminRoute && !consentDeclined

    useEffect(() => {
        if (!shouldTrack) return
        sessionIdRef.current = getOrCreateSessionId()
    }, [shouldTrack])

    // Log a page view whenever the route changes.
    useEffect(() => {
        if (!shouldTrack || !sessionIdRef.current) return
        axios
            .post(`${API_BASE_URL}/track`, {
                session_id: sessionIdRef.current,
                page_url: pathname,
            })
            .catch(() => {}) // tracking must never surface an error to the visitor
    }, [pathname, shouldTrack])

    // Periodic heartbeat so "currently online" stays accurate while a tab
    // is open, even if the visitor isn't navigating between pages.
    useEffect(() => {
        if (!shouldTrack) return

        const interval = setInterval(() => {
            const id = sessionIdRef.current || getOrCreateSessionId()
            if (!id) return
            axios.post(`${API_BASE_URL}/heartbeat`, { session_id: id }).catch(() => {})
        }, HEARTBEAT_INTERVAL_MS)

        return () => clearInterval(interval)
    }, [shouldTrack])

    return null
}
