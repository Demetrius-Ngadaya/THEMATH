"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineLocationMarker,
    HiOutlineHeart,
    HiOutlineShoppingBag,
    HiOutlineUser,
    HiOutlineCreditCard
} from "react-icons/hi"
import {
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaYoutube
} from "react-icons/fa"

export default function Footer() {
    const currentYear = new Date().getFullYear()

    const footerLinks = {
        shop: [
            { label: "Products", href: "/products" },
            { label: "Categories", href: "/categories" },
            { label: "Deals", href: "/deals" },
            { label: "New Arrivals", href: "/new-arrivals" },
            { label: "Best Sellers", href: "/best-sellers" },
        ],
        account: [
            { label: "My Account", href: "/account" },
            { label: "Orders", href: "/orders" },
            { label: "Wishlist", href: "/wishlist" },
            { label: "Cart", href: "/cart" },
        ],
        support: [
            { label: "Help Center", href: "/help" },
            { label: "FAQs", href: "/faqs" },
            { label: "Shipping Info", href: "/shipping" },
            { label: "Returns", href: "/returns" },
            { label: "Contact Us", href: "/contact" },
        ],
        company: [
            { label: "About Us", href: "/about" },
            { label: "Careers", href: "/careers" },
            { label: "Blog", href: "/blog" },
            { label: "Press", href: "/press" },
            { label: "Affiliates", href: "/affiliates" },
        ],
    }

    const socialLinks = [
        { icon: FaFacebook, href: "https://facebook.com", label: "Facebook" },
        { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
        { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
        { icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
    ]

    const paymentIcons = [
        { icon: HiOutlineCreditCard, label: "Visa" },
        { icon: HiOutlineCreditCard, label: "Mastercard" },
        { icon: HiOutlineCreditCard, label: "PayPal" },
        { icon: HiOutlineCreditCard, label: "Apple Pay" },
    ]

    return (
        <footer className="mt-16 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 py-12">
                {/* Newsletter Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center text-white"
                >
                    <h3 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h3>
                    <p className="mb-6 text-white/90">
                        Get the latest updates on new products and upcoming sales
                    </p>
                    <form className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 rounded-full px-6 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        <button
                            type="submit"
                            className="rounded-full bg-white px-8 py-3 font-semibold text-gray-900 hover:bg-gray-100 transition-all hover:scale-105"
                        >
                            Subscribe
                        </button>
                    </form>
                </motion.div>

                {/* Links Grid */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Shop */}
                    <div>
                        <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                            Shop
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
                            Account
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
                            Support
                        </h4>
                        <ul className="space-y-2">
                            {footerLinks.support.map((link) => (
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

                    {/* Company */}
                    <div>
                        <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                            Company
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
                    <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                        <HiOutlineMail className="h-5 w-5" />
                        <span>support@Sci-Math Creation.com</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                        <HiOutlinePhone className="h-5 w-5" />
                        <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                        <HiOutlineLocationMarker className="h-5 w-5" />
                        <span>123 Commerce St, City, Country</span>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 flex flex-col items-center justify-between border-t border-gray-200 pt-8 dark:border-gray-800 sm:flex-row">
                    {/* Copyright */}
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        © {currentYear} Sci-Math Creation. All rights reserved.
                    </p>

                    {/* Social Links */}
                    <div className="mt-4 flex space-x-4 sm:mt-0">
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

                    {/* Payment Icons */}
                    <div className="mt-4 flex space-x-2 sm:mt-0">
                        {paymentIcons.map((payment, index) => (
                            <div
                                key={index}
                                className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800"
                                title={payment.label}
                            >
                                <payment.icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}