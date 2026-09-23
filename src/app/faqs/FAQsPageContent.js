"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { HiOutlineChevronDown, HiOutlineSearch } from "react-icons/hi"

import { API_BASE_URL as API_BASE } from "@/utils/apiConfig"
import { useLanguage } from "@/contexts/LanguageContext"

export default function FAQsPageContent() {
    const [searchQuery, setSearchQuery] = useState("")
    const [openFaq, setOpenFaq] = useState(null)
    const [faqs, setFaqs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { t } = useLanguage()

    useEffect(() => {
        axios
            .get(`${API_BASE}/faqs`)
            .then((res) => setFaqs(res.data || []))
            .catch((err) => console.error("Error fetching FAQs:", err))
            .finally(() => setIsLoading(false))
    }, [])

    const filteredFaqs = faqs
        .map((category) => ({
            ...category,
            questions: category.questions.filter(
                (q) =>
                    q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    q.a.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        }))
        .filter((category) => category.questions.length > 0)

    return (
        <div className="space-y-12 pb-16">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-900 dark:to-pink-900">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 px-6 py-16 text-center"
                >
                    <h1 className="text-4xl font-bold text-white mb-4">{t("faqs.title")}</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
                        {t("faqs.subtitle")}
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t("faqs.searchPlaceholder")}
                            className="w-full px-6 py-4 pr-12 rounded-full bg-white/20 backdrop-blur-sm text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        <HiOutlineSearch className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-white/70" />
                    </div>
                </motion.div>
            </section>

            {/* Loading / Empty states */}
            {isLoading && (
                <p className="text-center text-gray-500">{t("faqs.loading")}</p>
            )}
            {!isLoading && filteredFaqs.length === 0 && (
                <p className="text-center text-gray-500">{t("faqs.noFaqsFound")}</p>
            )}

            {/* FAQs by Category */}
            <section className="space-y-8">
                {filteredFaqs.map((category, categoryIndex) => (
                    <motion.div
                        key={category.category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: categoryIndex * 0.1 }}
                        className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            {category.category}
                        </h2>
                        <div className="space-y-4">
                            {category.questions.map((faq, faqIndex) => (
                                <motion.div
                                    key={faq.id ?? faqIndex}
                                    className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden"
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === `${categoryIndex}-${faqIndex}` ? null : `${categoryIndex}-${faqIndex}`)}
                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <span className="font-medium text-gray-900 dark:text-white">{faq.q}</span>
                                        <motion.div
                                            animate={{ rotate: openFaq === `${categoryIndex}-${faqIndex}` ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <HiOutlineChevronDown className="h-5 w-5 text-gray-500" />
                                        </motion.div>
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === `${categoryIndex}-${faqIndex}` && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="border-t border-gray-200 dark:border-gray-800"
                                            >
                                                <div className="p-4 text-gray-600 dark:text-gray-400">
                                                    {faq.a}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </section>

            {/* Still Need Help */}
            <section className="text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8"
                >
                    <h2 className="text-2xl font-bold text-white mb-4">{t("faqs.stillNeedHelp")}</h2>
                    <p className="text-white/90 mb-6">
                        {t("faqs.stillNeedHelpSubtitle")}
                    </p>
                    <div className="flex gap-4 justify-center">
                        <a
                            href="/contact"
                            className="px-6 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                        >
                            {t("footer.contactUs")}
                        </a>
                        <a
                            href="/help"
                            className="px-6 py-3 bg-white/20 text-white rounded-full font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm"
                        >
                            {t("faqs.visitHelpCenter")}
                        </a>
                    </div>
                </motion.div>
            </section>
        </div>
    )
}
