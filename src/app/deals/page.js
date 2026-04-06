"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { HiOutlineClock, HiOutlineFire, HiOutlineTag } from "react-icons/hi"
import ProductGrid from "@/components/ProductGrid"
import CountdownTimer from "@/components/CountdownTimer"

export default function DealsPage() {
    const [deals, setDeals] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setDeals([
                { id: 1, name: "Product 1", price: 42000, originalPrice: 50000, discount: 50, image: "/product1.jpg", rating: 4.5 },
                { id: 2, name: "Product 2", price: 45000, originalPrice: 55000, discount: 50, image: "/product2.jpg", rating: 4.8 },
                { id: 3, name: "Product 3", price: 24000, originalPrice: 30000, discount: 50, image: "/product3.jpg", rating: 4.2 },
                { id: 4, name: "Product 4", price: 31000, originalPrice: 37000, discount: 50, image: "/product4.jpg", rating: 4.9 },
            ])
            setIsLoading(false)
        }, 1000)
    }, [])

    const flashDeals = [
        { id: 1, name: "Flash Deal 1", price: 33000, originalPrice: 40000, discount: 66, endsIn: 3600 },
        { id: 2, name: "Flash Deal 2", price: 41000, originalPrice: 45000, discount: 67, endsIn: 7200 },
        { id: 3, name: "Flash Deal 3", price: 20000, originalPrice: 25000, discount: 67, endsIn: 10800 },
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
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="inline-block mb-4"
                    >
                        <HiOutlineFire className="h-16 w-16 text-white mx-auto" />
                    </motion.div>
                    <h1 className="text-4xl font-bold text-white mb-4">Hot Deals & Offers</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Don't miss out on our biggest savings! Limited time offers on top products.
                    </p>
                </motion.div>
            </section>

            {/* Flash Deals */}
            <section>
                <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Flash Deals</h2>
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <HiOutlineClock className="h-5 w-5" />
                        <span className="font-semibold">Ending Soon</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {flashDeals.map((deal, index) => (
                        <motion.div
                            key={deal.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-lg"
                        >
                            <div className="absolute top-4 right-4 z-10">
                                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                    -{deal.discount}%
                                </span>
                            </div>
                            <div className="p-4">
                                <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-xl mb-4" />
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{deal.name}</h3>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">${deal.price}</span>
                                    <span className="text-sm text-gray-500 line-through">${deal.originalPrice}</span>
                                </div>
                                <CountdownTimer initialSeconds={deal.endsIn} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* All Deals */}
            <section>
                <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">All Deals</h2>
                <ProductGrid products={deals} isLoading={isLoading} />
            </section>
        </div>
    )
}
