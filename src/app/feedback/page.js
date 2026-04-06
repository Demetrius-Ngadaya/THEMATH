"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HiOutlineChevronDown, HiOutlineSearch } from "react-icons/hi"

export default function FAQsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [openFaq, setOpenFaq] = useState(null)

    const faqs = [
        {
            category: "Orders & Shipping",
            questions: [
                {
                    q: "How long does shipping take?",
                    a: "Standard shipping typically takes 3-5 business days. Express shipping is available for 1-2 business days delivery."
                },
                {
                    q: "Can I track my order?",
                    a: "Yes! Once your order ships, you'll receive a tracking number via email to monitor your delivery."
                },
                {
                    q: "Do you ship internationally?",
                    a: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location."
                }
            ]
        },
        {
            category: "Returns & Refunds",
            questions: [
                {
                    q: "What is your return policy?",
                    a: "We offer 30-day returns for unused items in original packaging. Some exclusions apply."
                },
                {
                    q: "How do I initiate a return?",
                    a: "Visit your orders page, select the item you wish to return, and follow the return instructions."
                },
                {
                    q: "When will I get my refund?",
                    a: "Refunds are processed within 5-7 business days after we receive and inspect your return."
                }
            ]
        },
        {
            category: "Payment & Pricing",
            questions: [
                {
                    q: "What payment methods do you accept?",
                    a: "We accept all major credit cards, PayPal, Apple Pay, and Google Pay."
                },
                {
                    q: "Is my payment information secure?",
                    a: "Absolutely! We use industry-standard encryption to protect your payment information."
                },
                {
                    q: "Do you offer price matching?",
                    a: "Yes, we offer price matching on identical items from select competitors."
                }
            ]
        },
        {
            category: "Account & Support",
            questions: [
                {
                    q: "How do I create an account?",
                    a: "Click the 'Sign Up' button and fill in your information. It takes less than a minute!"
                },
                {
                    q: "I forgot my password, what should I do?",
                    a: "Click 'Forgot Password' on the login page to reset your password via email."
                },
                {
                    q: "How can I contact customer support?",
                    a: "You can reach us via email, phone, or live chat during business hours."
                }
            ]
        }
    ]

    const filteredFaqs = faqs.map(category => ({
        ...category,
        questions: category.questions.filter(
            q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.questions.length > 0)

    return (
        <div className="space-y-12 pb-16">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-900 dark:to-pink-900">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 px-6 py-16 text-center"
                >
                    <h1 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
                        Find answers to common questions about our products, shipping, returns, and more.
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search FAQs..."
                            className="w-full px-6 py-4 pr-12 rounded-full bg-white/20 backdrop-blur-sm text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        <HiOutlineSearch className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-white/70" />
                    </div>
                </motion.div>
            </section>

            {/* FAQs by Category */}
            <section className="space-y-8">
                {filteredFaqs.map((category, categoryIndex) => (
                    <motion.div
                        key={categoryIndex}
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
                                    key={faqIndex}
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
                    <h2 className="text-2xl font-bold text-white mb-4">Still Need Help?</h2>
                    <p className="text-white/90 mb-6">
                        Can't find the answer you're looking for? Our support team is here to help.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <a
                            href="/contact"
                            className="px-6 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Contact Us
                        </a>
                        <a
                            href="/help"
                            className="px-6 py-3 bg-white/20 text-white rounded-full font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm"
                        >
                            Visit Help Center
                        </a>
                    </div>
                </motion.div>
            </section>
        </div>
    )
}
