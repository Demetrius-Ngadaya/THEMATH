"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { HiOutlineSparkles, HiOutlineClock, HiOutlineFilter } from "react-icons/hi"
import ProductGrid from "@/components/ProductGrid"

export default function NewArrivalsPage() {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedTimeframe, setSelectedTimeframe] = useState("all")
    const [selectedCategory, setSelectedCategory] = useState("all")

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setProducts([
                { id: 1, name: "New Product 1", price: 89.99, image: "/product1.jpg", rating: 4.5, date: "2024-01-15", category: "Electronics" },
                { id: 2, name: "New Product 2", price: 129.99, image: "/product2.jpg", rating: 4.8, date: "2024-01-14", category: "Fashion" },
                { id: 3, name: "New Product 3", price: 59.99, image: "/product3.jpg", rating: 4.2, date: "2024-01-13", category: "Home" },
                { id: 4, name: "New Product 4", price: 199.99, image: "/product4.jpg", rating: 4.9, date: "2024-01-12", category: "Electronics" },
                { id: 5, name: "New Product 5", price: 49.99, image: "/product5.jpg", rating: 4.3, date: "2024-01-11", category: "Beauty" },
                { id: 6, name: "New Product 6", price: 79.99, image: "/product6.jpg", rating: 4.6, date: "2024-01-10", category: "Sports" },
            ])
            setIsLoading(false)
        }, 1000)
    }, [])

    const timeframes = [
        { value: "all", label: "All Time" },
        { value: "today", label: "Today" },
        { value: "week", label: "This Week" },
        { value: "month", label: "This Month" }
    ]

    const categories = [
        "all",
        "Electronics",
        "Fashion",
        "Home",
        "Beauty",
        "Sports"
    ]

    return (
        <div className="space-y-8 pb-16">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-900 dark:to-emerald-900">
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
                        <HiOutlineSparkles className="h-16 w-16 text-white mx-auto" />
                    </motion.div>
                    <h1 className="text-4xl font-bold text-white mb-4">New Arrivals</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Be the first to shop our latest products
                    </p>
                </motion.div>
            </section>

            {/* Filters */}
            <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2">
                        <HiOutlineFilter className="h-5 w-5 text-gray-500" />
                        <span className="font-semibold text-gray-900 dark:text-white">Filters:</span>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {/* Timeframe Filter */}
                        <select
                            value={selectedTimeframe}
                            onChange={(e) => setSelectedTimeframe(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                        >
                            {timeframes.map(tf => (
                                <option key={tf.value} value={tf.value}>{tf.label}</option>
                            ))}
                        </select>

                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat === "all" ? "All Categories" : cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Results Count */}
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <HiOutlineClock className="h-5 w-5" />
                        <span>{products.length} new items</span>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <ProductGrid products={products} isLoading={isLoading} />

            {/* Newsletter */}
            <section className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Get Notified</h2>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                    Be the first to know about new arrivals and exclusive launches
                </p>
                <form className="max-w-md mx-auto flex gap-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <button className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                        Subscribe
                    </button>
                </form>
            </section>
        </div>
    )
}