"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { HiOutlinePhone, HiOutlineX, HiOutlineMail, HiOutlineChatAlt } from "react-icons/hi"
import { FaWhatsapp } from "react-icons/fa"

import { API_BASE_URL as API_BASE } from "@/utils/apiConfig"

// Env vars are only the fallback now — the admin-managed settings from the
// database (same source the footer and contact page use) take priority.
const ENV_PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE || "+255 717 275 661"
const ENV_WHATSAPP = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || ENV_PHONE.replace(/[^0-9]/g, "")
const ENV_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@scimathcreation.com"

export default function ContactWidget() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [settings, setSettings] = useState(null)

    useEffect(() => {
        axios
            .get(`${API_BASE}/settings`)
            .then((res) => setSettings(res.data))
            .catch(() => setSettings(null))
    }, [])

    const PHONE_DISPLAY = settings?.phone || ENV_PHONE
    const PHONE_TEL = PHONE_DISPLAY.replace(/[\s\-()]/g, "")
    const WHATSAPP_NUMBER = (settings?.whatsapp || ENV_WHATSAPP).replace(/[^0-9]/g, "")
    const EMAIL = settings?.email || ENV_EMAIL

    const isAdminRoute = pathname && pathname.startsWith("/admin")
    if (isAdminRoute) {
        return null
    }

    const options = [
        {
            key: "call",
            label: "Call us",
            sublabel: PHONE_DISPLAY,
            icon: HiOutlinePhone,
            href: `tel:${PHONE_TEL}`,
            color: "bg-blue-500",
        },
        {
            key: "whatsapp",
            label: "WhatsApp",
            sublabel: "Chat with us",
            icon: FaWhatsapp,
            href: `https://wa.me/${WHATSAPP_NUMBER}`,
            color: "bg-green-500",
            external: true,
        },
        {
            key: "sms",
            label: "SMS",
            sublabel: "Send a text",
            icon: HiOutlineChatAlt,
            href: `sms:${PHONE_TEL}`,
            color: "bg-purple-500",
        },
        {
            key: "email",
            label: "Email",
            sublabel: EMAIL,
            icon: HiOutlineMail,
            href: `mailto:${EMAIL}`,
            color: "bg-orange-500",
        },
    ]

    return (
        <div className="fixed bottom-6 left-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-teal-600 to-green-600 px-4 py-3 flex justify-between items-center">
                            <span className="text-white font-semibold">Get in touch</span>
                            <button onClick={() => setIsOpen(false)} className="text-white/90 hover:text-white">
                                <HiOutlineX className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-2">
                            {options.map((opt) => (
                                <a
                                    key={opt.key}
                                    href={opt.href}
                                    target={opt.external ? "_blank" : undefined}
                                    rel={opt.external ? "noopener noreferrer" : undefined}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <span className={`${opt.color} text-white rounded-full p-2.5 flex items-center justify-center`}>
                                        <opt.icon className="h-5 w-5" />
                                    </span>
                                    <span className="flex flex-col">
                                        <span className="font-medium text-gray-900 dark:text-white text-sm">{opt.label}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{opt.sublabel}</span>
                                    </span>
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative">
                {/* Pulsing attention rings, hidden once opened */}
                {!isOpen && (
                    <>
                        <span className="absolute inset-0 rounded-full bg-green-500 opacity-75 animate-ping" />
                        <span className="absolute inset-0 rounded-full bg-green-500 opacity-40 animate-pulse" />
                    </>
                )}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen((v) => !v)}
                    className="relative bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-full p-4 shadow-xl"
                >
                    {isOpen ? <HiOutlineX className="h-6 w-6" /> : <HiOutlinePhone className="h-6 w-6" />}
                </motion.button>
            </div>
        </div>
    )
}
