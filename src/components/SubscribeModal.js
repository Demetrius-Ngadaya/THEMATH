"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HiOutlineX, HiOutlineMail } from "react-icons/hi"
import axios from "axios"
import { API_BASE_URL } from "@/utils/apiConfig"
import { showSuccess, showError } from "@/utils/sweetalert"
import { useLanguage } from "@/contexts/LanguageContext"

export default function SubscribeModal({ isOpen, onClose }) {
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { t } = useLanguage()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const response = await axios.post(`${API_BASE_URL}/subscribe`, {
                email,
                phone: phone || undefined,
            })
            showSuccess("Subscribed!", response.data.message)
            setEmail("")
            setPhone("")
            onClose()
        } catch (error) {
            showError("Error", error.response?.data?.message || "Failed to subscribe. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5 flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-white">{t("subscribe.title")}</h3>
                                <p className="text-white/90 text-sm mt-1">
                                    {t("subscribe.subtitle")}
                                </p>
                            </div>
                            <button onClick={onClose} className="text-white/90 hover:text-white">
                                <HiOutlineX className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t("common.email")} *
                                </label>
                                <div className="relative">
                                    <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={t("subscribe.emailPlaceholder")}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t("common.phone")} ({t("common.optional")})
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder={t("subscribe.phonePlaceholder")}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    {t("subscribe.phoneHint")}
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
                            >
                                {isSubmitting ? `${t("common.loading")}` : t("subscribe.button")}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
