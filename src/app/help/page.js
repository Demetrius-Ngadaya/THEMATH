"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
    HiOutlineSearch,
    HiOutlineQuestionMarkCircle,
    HiOutlineTruck,
    HiOutlineCreditCard,
    HiOutlineUser,
    HiOutlineShieldCheck,
    HiOutlineCog,
    HiOutlineExternalLink
} from "react-icons/hi"

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState("")

    const categories = [
        {
            icon: HiOutlineUser,
            title: "Account Management",
            description: "Login, registration, profile settings",
            articles: 12,
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: HiOutlineTruck,
            title: "Shipping & Delivery",
            description: "Tracking, delivery times, shipping costs",
            articles: 8,
            color: "from-green-500 to-green-600"
        },
        {
            icon: HiOutlineCreditCard,
            title: "Payments & Billing",
            description: "Payment methods, invoices, refunds",
            articles: 10,
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: HiOutlineShieldCheck,
            title: "Returns & Refunds",
            description: "Return policy, process, status",
            articles: 6,
            color: "from-red-500 to-red-600"
        },
        {
            icon: HiOutlineQuestionMarkCircle,
            title: "Orders",
            description: "Placing orders, modifications, cancellations",
            articles: 9,
            color: "from-orange-500 to-orange-600"
        },
        {
            icon: HiOutlineCog,
            title: "Technical Support",
            description: "Website issues, mobile app, troubleshooting",
            articles: 7,
            color: "from-gray-500 to-gray-600"
        }
    ]

    const popularArticles = [
        "How to track my order",
        "Return policy explained",
        "Payment methods accepted",
        "How to create an account",
        "Shipping times and costs",
        "Password reset guide"
    ]

    const featuredArticles = [
        {
            title: "Getting Started with ShopHub",
            excerpt: "New to ShopHub? Learn the basics of shopping on our platform.",
            readTime: "3 min read"
        },
        {
            title: "Complete Guide to Returns",
            excerpt: "Everything you need to know about returning items.",
            readTime: "5 min read"
        },
        {
            title: "Security Best Practices",
            excerpt: "Keep your account secure with these tips.",
            readTime: "4 min read"
        }
    ]

    return (
        <div className="space-y-12 pb-16">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 px-6 py-16 text-center"
                >
                    <h1 className="text-4xl font-bold text-white mb-4">Help Center</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
                        Find answers to your questions and learn how to make the most of ShopHub
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for help articles..."
                            className="w-full px-6 py-4 pr-12 rounded-full bg-white/20 backdrop-blur-sm text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        <HiOutlineSearch className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-white/70" />
                    </div>
                </motion.div>
            </section>

            {/* Quick Help Categories */}
            <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Browse by Category</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg cursor-pointer group"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <category.icon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {category.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {category.description}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">{category.articles} articles</span>
                                <HiOutlineExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Popular Articles */}
            <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Popular Topics */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-1 bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg"
                >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Popular Topics</h2>
                    <ul className="space-y-3">
                        {popularArticles.map((article, index) => (
                            <li key={index}>
                                <Link
                                    href={`/help/article/${index}`}
                                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                    <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                                    {article}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Featured Articles */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 space-y-4"
                >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Featured Articles</h2>
                    {featuredArticles.map((article, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {article.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-3">{article.excerpt}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">{article.readTime}</span>
                                <span className="text-blue-600 text-sm font-semibold">Read More →</span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Contact Support */}
            <section className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Still Need Help?</h2>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                    Can't find what you're looking for? Our support team is here to help.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link
                        href="/contact"
                        className="px-6 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Contact Support
                    </Link>
                    <Link
                        href="/faqs"
                        className="px-6 py-3 bg-white/20 text-white rounded-full font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm"
                    >
                        Browse FAQs
                    </Link>
                </div>
            </section>
        </div>
    )
}