"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { motion } from "framer-motion"
import SubscribeModal from "./SubscribeModal"
import { useLanguage } from "@/contexts/LanguageContext"
import {
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineLocationMarker,
    HiOutlineHeart,
    HiOutlineShoppingBag,
    HiOutlineUser,
    HiOutlineCreditCard,
    HiOutlineExternalLink
} from "react-icons/hi"
import {
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaYoutube,
    FaLinkedin,
    FaTiktok
} from "react-icons/fa"

import { API_BASE_URL as API_BASE } from "@/utils/apiConfig"
const STAFF_WEBMAIL_URL = "https://server14.tanzaniaservers.com/roundcube"

export default function Footer() {
    const currentYear = new Date().getFullYear()
    const [settings, setSettings] = useState(null)
    const [isSubscribeOpen, setIsSubscribeOpen] = useState(false)
    const { t } = useLanguage()

    useEffect(() => {
        axios
            .get(`${API_BASE}/settings`)
            .then((res) => setSettings(res.data))
            .catch(() => setSettings(null))
    }, [])

    const footerLinks = {
        shop: [
            { label: t("nav.products"), href: "/products" },
            { label: t("nav.categories"), href: "/categories" },
            { label: t("nav.deals"), href: "/deals" },
            { label: t("footer.newArrivals"), href: "/new-arrivals" },
            // { label: "Best Sellers", href: "/best-sellers" },
        ],
        account: [
            // { label: "My Account", href: "/account" },
            // { label: "Orders", href: "/orders" },
            { label: t("footer.wishlist"), href: "/wishlist" },
            { label: t("footer.cart"), href: "/cart" },
        ],
        support: [
            // { label: "Help Center", href: "/help" },
            // { label: "FAQs", href: "/faqs" },
            // { label: "Shipping Info", href: "/shipping" },
            // { label: "Returns", href: "/returns" },
            { label: t("footer.contactUs"), href: "/contact" },
            { label: t("footer.subscribe"), action: "subscribe" },
        ],
        company: [
            { label: t("footer.aboutUs"), href: "/about" },
            { label: t("footer.privacyPolicy"), href: "/privacy-policy" },
            { label: t("footer.termsOfService"), href: "/terms-of-service" },
            // { label: "Careers", href: "/careers" },
            // { label: "Blog", href: "/blog" },
            // { label: "Press", href: "/press" },
            // { label: "Affiliates", href: "/affiliates" },
        ],
    }

    const socialLinks = [
        settings?.facebook_url && { icon: FaFacebook, href: settings.facebook_url, label: "Facebook" },
        settings?.twitter_url && { icon: FaTwitter, href: settings.twitter_url, label: "Twitter" },
        settings?.instagram_url && { icon: FaInstagram, href: settings.instagram_url, label: "Instagram" },
        settings?.linkedin_url && { icon: FaLinkedin, href: settings.linkedin_url, label: "LinkedIn" },
        settings?.youtube_url && { icon: FaYoutube, href: settings.youtube_url, label: "YouTube" },
        settings?.tiktok_url && { icon: FaTiktok, href: settings.tiktok_url, label: "TikTok" },
    ].filter(Boolean)

    const paymentIcons = [
        { icon: HiOutlineCreditCard, label: "Visa" },
        { icon: HiOutlineCreditCard, label: "Mastercard" },
        { icon: HiOutlineCreditCard, label: "PayPal" },
        { icon: HiOutlineCreditCard, label: "Apple Pay" },
    ]

    return (
        <footer className="mt-16 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 py-12">
                {/* Links Grid */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Shop */}
                    <div>
                        <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                            {t("footer.shop")}
                        </h4>
                        <ul className="space-y-2">
                            {footerLinks.shop.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                            {t("footer.account")}
                        </h4>
                        <ul className="space-y-2">
                            {footerLinks.account.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                            {t("footer.support")}
                        </h4>
                        <ul className="space-y-2">
                            {footerLinks.support.map((link) => (
                                <li key={link.href || link.action}>
                                    {link.action === "subscribe" ? (
                                        <button
                                            onClick={() => setIsSubscribeOpen(true)}
                                            className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                                        >
                                            {link.label}
                                        </button>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                            {t("footer.company")}
                        </h4>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="mt-12 grid grid-cols-1 gap-4 border-t border-gray-200 pt-8 dark:border-gray-800 sm:grid-cols-3">
                    <a href={`mailto:${settings?.email || ""}`} className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                        <HiOutlineMail className="h-5 w-5" />
                        <span>{settings?.email || "\u00A0"}</span>
                    </a>
                    <a href={`tel:${settings?.phone || ""}`} className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                        <HiOutlinePhone className="h-5 w-5" />
                        <span>{settings?.phone || "\u00A0"}</span>
                    </a>
                    <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                        <HiOutlineLocationMarker className="h-5 w-5" />
                        <span>{settings?.address || "\u00A0"}</span>
                    </div>
                </div>

                {/* Staff */}
                <div className="mt-4 flex flex-col items-center gap-2 border-t border-gray-200 pt-4 dark:border-gray-800 sm:flex-row sm:justify-center sm:gap-6">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{t("footer.staff")}</span>
                    <a
                        href={STAFF_WEBMAIL_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                        {t("footer.staffEmail")} <HiOutlineExternalLink className="h-4 w-4" />
                    </a>
                    <Link
                        href="/admin/login"
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                        {t("footer.staffLogin")}
                    </Link>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 flex flex-col items-center justify-between border-t border-gray-200 pt-8 dark:border-gray-800 sm:flex-row">
                    {/* Copyright */}
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        © {currentYear} Sci-Math Creation. {t("footer.rightsReserved")}
                    </p>

                    {/* Payment Icons */}
                    <div className="mt-4 flex space-x-2 sm:mt-0">
                        {socialLinks.map((social) => (
                            <motion.a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                aria-label={social.label}
                            >
                                <social.icon className="h-5 w-5" />
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>
            <SubscribeModal isOpen={isSubscribeOpen} onClose={() => setIsSubscribeOpen(false)} />
        </footer>
    )
}
