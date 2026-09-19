// src/contexts/LanguageContext.js
"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import translations from "@/i18n/translations"

const LanguageContext = createContext(null)
const STORAGE_KEY = "site_language" // 'en' | 'sw'

export function LanguageProvider({ children }) {
    const [language, setLanguageState] = useState("en")

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved === "en" || saved === "sw") {
            setLanguageState(saved)
        }
    }, [])

    const setLanguage = useCallback((lang) => {
        setLanguageState(lang)
        localStorage.setItem(STORAGE_KEY, lang)
    }, [])

    // Dot-notation lookup, e.g. t('nav.products'). Falls back to English,
    // then to the raw key, so a missing translation never breaks the UI -
    // it just shows in English (or the key) instead of crashing.
    const t = useCallback(
        (key) => {
            const lookup = (dict) =>
                key.split(".").reduce((obj, part) => (obj && obj[part] !== undefined ? obj[part] : undefined), dict)

            return lookup(translations[language]) ?? lookup(translations.en) ?? key
        },
        [language]
    )

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider")
    }
    return context
}
