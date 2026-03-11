"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
    HiOutlineRefresh,
    HiOutlineClock,
    HiOutlineShieldCheck,
    HiOutlineCash,
    HiOutlineCheckCircle,
    HiOutlineXCircle
} from "react-icons/hi"

export default function ReturnsPage() {
    const [returnStep, setReturnStep] = useState(1)

    const returnPolicy = {
        window: "30 days",
        condition: "Unused, in original packaging",
        refundMethod: "Original payment method",
        processingTime: "5-7 business days"
    }

    const steps = [
        {
            number: 1,
            title: "Initiate Return",
            description: "Log into your account and select the item you wish to return"
        },
        {
            number: 2,
            title: "Print Label",
            description: "Print the prepaid return shipping label"
        },
        {
            number: 3,
            title: "Pack Item",
            description: "Securely pack the item in its original packaging"
        },
        {
            number: 4,
            title: "Ship Back",
            description: "Drop off the package at any authorized shipping location"
        }
    ]

    const excludedItems = [
        "Gift cards",
        "Personalized items",
        "Perishable goods",
        "Intimate apparel",
        "Software downloads"
    ]

    return (
        <div className="space-y-12 pb-16">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-900 dark:to-orange-900">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 px-6 py-16 text-center"
                >
                    <h1 className="text-4xl font-bold text-white mb-4">Returns & Exchanges</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Easy returns within 30 days. Your satisfaction is our priority.
                    </p>
                </motion.div>
            </section>

            {/* Policy Overview */}
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { icon: HiOutlineRefresh, label: "Return Window", value: returnPolicy.window },
                    { icon: HiOutlineShieldCheck, label: "Condition", value: returnPolicy.condition },
                    { icon: HiOutlineCash, label: "Refund Method", value: returnPolicy.refundMethod },
                    { icon: HiOutlineClock, label: "Processing", value: returnPolicy.processingTime }
                ].map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-900 rounded-2xl p-6 text-center shadow-lg"
                    >
                        <item.icon className="h-8 w-8 text-red-600 mx-auto mb-4" />
                        <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.label}</h3>
                        <p className="font-semibold text-gray-900 dark:text-white">{item.value}</p>
                    </motion.div>
                ))}
            </section>

            {/* Return Process */}
            <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                    How to Return an Item
                </h2>
                <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 -translate-y-1/2 hidden lg:block" />

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 relative">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative text-center"
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 relative z-10 ${returnStep > step.number
                                        ? "bg-green-600 text-white"
                                        : returnStep === step.number
                                            ? "bg-red-600 text-white ring-4 ring-red-100 dark:ring-red-900"
                                            : "bg-gray-200 dark:bg-gray-800 text-gray-500"
                                    }`}>
                                    {returnStep > step.number ? <HiOutlineCheckCircle className="h-6 w-6" /> : step.number}
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Return Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-8"
                >
                    <button
                        onClick={() => setReturnStep(prev => prev < 4 ? prev + 1 : 1)}
                        className="px-8 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors"
                    >
                        Start a Return
                    </button>
                </motion.div>
            </section>

            {/* Excluded Items */}
            <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg"
                >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <HiOutlineXCircle className="h-6 w-6 text-red-600" />
                        Non-Returnable Items
                    </h2>
                    <ul className="space-y-3">
                        {excludedItems.map((item, index) => (
                            <li key={index} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg"
                >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <HiOutlineCheckCircle className="h-6 w-6 text-green-600" />
                        Return Tips
                    </h2>
                    <ul className="space-y-3">
                        <li className="text-gray-600 dark:text-gray-400">
                            • Include all original accessories and packaging
                        </li>
                        <li className="text-gray-600 dark:text-gray-400">
                            • Remove any personal data from electronics
                        </li>
                        <li className="text-gray-600 dark:text-gray-400">
                            • Keep your tracking number for reference
                        </li>
                        <li className="text-gray-600 dark:text-gray-400">
                            • Returns without receipt may be rejected
                        </li>
                    </ul>
                </motion.div>
            </section>

            {/* FAQ Section */}
            <section className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    Common Return Questions
                </h2>
                <div className="max-w-3xl mx-auto space-y-4">
                    {[
                        {
                            q: "When will I get my refund?",
                            a: "Refunds are processed within 5-7 business days after we receive your return."
                        },
                        {
                            q: "Can I exchange an item instead?",
                            a: "Yes, you can exchange items by initiating a return and placing a new order."
                        },
                        {
                            q: "Who pays for return shipping?",
                            a: "We provide free return shipping for defective items. For other returns, shipping costs may apply."
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
            </section>
        </div>
    )
}