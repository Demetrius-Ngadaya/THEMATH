// src/components/LanguageSwitcher.js
"use client"

import { useLanguage } from "@/contexts/LanguageContext"

export default function LanguageSwitcher({ className = "" }) {
    const { language, setLanguage } = useLanguage()

    return (
        <div className={`flex items-center rounded-full border border-gray-200 dark:border-gray-700 p-0.5 text-xs font-medium ${className}`}>
            <button
                onClick={() => setLanguage("en")}
                className={`px-2.5 py-1 rounded-full transition-colors ${
                    language === "en"
                        ? "bg-blue-600 text-white"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
                aria-label="Switch to English"
            >
                EN
            </button>
            <button
                onClick={() => setLanguage("sw")}
                className={`px-2.5 py-1 rounded-full transition-colors ${
                    language === "sw"
                        ? "bg-blue-600 text-white"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
                aria-label="Badili kwa Kiswahili"
            >
                SW
            </button>
        </div>
    )
}
