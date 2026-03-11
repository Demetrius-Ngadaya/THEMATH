"use client"

import { motion } from "framer-motion"
import {
    HiOutlineTruck,
    HiOutlineGlobeAlt,
    HiOutlineClock,
    HiOutlineCurrencyDollar,
    HiOutlineCheckCircle,
    HiOutlineLocationMarker
} from "react-icons/hi"

export default function ShippingPage() {
    const shippingMethods = [
        {
            name: "Standard Shipping",
            delivery: "3-5 business days",
            cost: "$4.99",
            free: "Free on orders over $50",
            icon: HiOutlineTruck
        },
        {
            name: "Express Shipping",
            delivery: "1-2 business days",
            cost: "$12.99",
            free: "Free on orders over $100",
            icon: HiOutlineClock
        },
        {
            name: "International Shipping",
            delivery: "7-14 business days",
            cost: "Varies by location",
            free: "Free on orders over $200",
            icon: HiOutlineGlobeAlt
        }
    ]

    const trackingSteps = [
        "Order Placed",
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered"
    ]

    return (
        <div className="space-y-12 pb-16">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-900 dark:to-cyan-900">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 px-6 py-16 text-center"
                >
                    <h1 className="text-4xl font-bold text-white mb-4">Shipping Information</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Fast, reliable shipping to over 100 countries worldwide
                    </p>
                </motion.div>
            </section>

            {/* Shipping Methods */}
            <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                    Shipping Methods
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {shippingMethods.map((method, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                        >
                            <method.icon className="h-12 w-12 text-blue-600 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {method.name}
                            </h3>
                            <div className="space-y-2 mb-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Delivery: {method.delivery}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Cost: {method.cost}
                                </p>
                            </div>
                            <p className="text-sm text-green-600 font-semibold">{method.free}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Tracking Timeline */}
            <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                    Tracking Your Order
                </h2>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
                    <div className="relative">
                        {/* Progress Bar */}
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 -translate-y-1/2 hidden md:block" />

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                            {trackingSteps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative text-center"
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 relative z-10 ${index < 3
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 dark:bg-gray-800 text-gray-500"
                                        }`}>
                                        {index < 3 ? <HiOutlineCheckCircle className="h-5 w-5" /> : index + 1}
                                    </div>
                                    <p className={`text-sm font-medium ${index < 3
                                            ? "text-blue-600"
                                            : "text-gray-500"
                                        }`}>
                                        {step}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* International Shipping */}
            <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg"
                >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <HiOutlineGlobeAlt className="h-6 w-6 text-blue-600" />
                        International Shipping
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        We ship to over 100 countries worldwide. International orders may be subject to customs fees and import duties.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <HiOutlineCheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">Tracked Shipping</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    All international orders include tracking
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <HiOutlineCheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">Insurance Included</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Your package is insured up to $200
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg"
                >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <HiOutlineLocationMarker className="h-6 w-6 text-blue-600" />
                        Shipping Restrictions
                    </h2>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                            P.O. Box addresses require additional verification
                        </li>
                        <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                            Some items may have shipping restrictions
                        </li>
                        <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                            Military APO/FPO addresses are supported
                        </li>
                    </ul>
                </motion.div>
            </section>

            {/* Shipping FAQ */}
            <section className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    Shipping FAQs
                </h2>
                <div className="max-w-3xl mx-auto space-y-4">
                    {[
                        {
                            q: "Can I change my shipping address after placing an order?",
                            a: "Contact us within 1 hour of placing your order to change the address."
                        },
                        {
                            q: "Do you offer same-day delivery?",
                            a: "Same-day delivery is available in select cities for orders placed before 12 PM."
                        },
                        {
                            q: "What happens if my package is lost?",
                            a: "We'll investigate and either reship your order or issue a full refund."
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