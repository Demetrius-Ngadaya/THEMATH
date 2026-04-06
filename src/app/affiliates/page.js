"use client"

import { motion } from "framer-motion"
import Link from "next/link"  // Add this import
import { HiOutlineCash, HiOutlineChartBar, HiOutlineLink, HiOutlineUserGroup } from "react-icons/hi"
export default function AffiliatesPage() {
    const benefits = [
        {
            icon: HiOutlineCash,
            title: "High Commissions",
            description: "Earn up to 15% commission on every sale",
            value: "Up to 15%"
        },
        {
            icon: HiOutlineChartBar,
            title: "Real-time Tracking",
            description: "Monitor your earnings and performance",
            value: "24/7 Analytics"
        },
        {
            icon: HiOutlineLink,
            title: "Custom Links",
            description: "Unique tracking links for all your campaigns",
            value: "Unlimited"
        },
        {
            icon: HiOutlineUserGroup,
            title: "Dedicated Support",
            description: "Personal account manager for top affiliates",
            value: "Priority"
        }
    ]

    const tiers = [
        {
            name: "Bronze",
            commission: "5-8%",
            requirements: "0-50 sales/month",
            color: "from-amber-600 to-yellow-600"
        },
        {
            name: "Silver",
            commission: "8-12%",
            requirements: "51-200 sales/month",
            color: "from-gray-400 to-gray-500"
        },
        {
            name: "Gold",
            commission: "12-15%",
            requirements: "201+ sales/month",
            color: "from-yellow-500 to-amber-500"
        }
    ]

    return (
        <div className="space-y-12 pb-16">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-900 dark:to-emerald-900">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 px-6 py-16 text-center"
                >
                    <h1 className="text-4xl font-bold text-white mb-4">Affiliate Program</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
                        Join our affiliate program and start earning commissions today
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Become an Affiliate
                    </motion.button>
                </motion.div>
            </section>

            {/* Stats */}
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {benefits.map((benefit, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg text-center"
                    >
                        <benefit.icon className="h-8 w-8 text-green-600 mx-auto mb-4" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{benefit.value}</div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{benefit.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{benefit.description}</p>
                    </motion.div>
                ))}
            </section>

            {/* Commission Tiers */}
            <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Commission Tiers</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {tiers.map((tier, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`bg-gradient-to-br ${tier.color} rounded-2xl p-8 text-white shadow-xl`}
                        >
                            <h3 className="text-2xl font-bold mb-4">{tier.name}</h3>
                            <div className="text-4xl font-bold mb-4">{tier.commission}</div>
                            <p className="text-white/90 mb-6">{tier.requirements}</p>
                            <button className="w-full py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm">
                                Get Started
                            </button>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">How It Works</h2>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {[1, 2, 3].map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative text-center"
                        >
                            <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                {step}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {step === 1 ? "Sign Up" : step === 2 ? "Promote" : "Earn"}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {step === 1
                                    ? "Create your affiliate account in minutes"
                                    : step === 2
                                        ? "Share your unique links with your audience"
                                        : "Earn commissions on every sale you generate"}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* FAQ Preview */}
            <section className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    Frequently Asked Questions
                </h2>
                <div className="max-w-3xl mx-auto space-y-4">
                    {[
                        {
                            q: "How do I get paid?",
                            a: "We offer payments via PayPal, bank transfer, or wire transfer on a monthly basis."
                        },
                        {
                            q: "Is there a minimum payout?",
                            a: "The minimum payout is $50 for PayPal and $100 for bank transfers."
                        },
                        {
                            q: "What's the cookie duration?",
                            a: "Our cookies last for 30 days, so you earn commission on any purchases within that period."
                        }
                    ].map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-900 rounded-lg p-4"
                        >
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{faq.q}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
                        </motion.div>
                    ))}
                </div>
                <div className="text-center mt-6">
                    <Link href="/faqs" className="text-green-600 hover:text-green-700 font-semibold">
                        View All FAQs →
                    </Link>
                </div>
            </section>

            {/* CTA */}
            <section className="text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8"
                >
                    <h2 className="text-2xl font-bold text-white mb-4">Ready to Start Earning?</h2>
                    <p className="text-white/90 mb-6">
                        Join thousands of affiliates already earning with Sci-Math Creation
                    </p>
                    <button className="px-6 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                        Apply Now
                    </button>
                </motion.div>
            </section>
        </div>
    )
}