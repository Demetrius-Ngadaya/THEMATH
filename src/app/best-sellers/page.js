"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { HiOutlineStar, HiOutlineFire, HiOutlineTrendingUp } from "react-icons/hi"
import ProductGrid from "@/components/ProductGrid"

export default function BestSellersPage() {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [timeRange, setTimeRange] = useState("month")

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setProducts([
                { id: 1, name: "Best Seller 1", price: 99.99, image: "/product1.jpg", rating: 4.9, reviews: 1234, category: "Electronics", sales: 15000 },
                { id: 2, name: "Best Seller 2", price: 149.99, image: "/product2.jpg", rating: 4.8, reviews: 982, category: "Fashion", sales: 12000 },
                { id: 3, name: "Best Seller 3", price: 79.99, image: "/product3.jpg", rating: 4.7, reviews: 2156, category: "Home", sales: 18000 },
                { id: 4, name: "Best Seller 4", price: 199.99, image: "/product4.jpg", rating: 4.9, reviews: 3456, category: "Electronics", sales: 22000 },
                { id: 5, name: "Best Seller 5", price: 49.99, image: "/product5.jpg", rating: 4.6, reviews: 876, category: "Beauty", sales: 9000 },
                { id: 6, name: "Best Seller 6", price: 89.99, image: "/product6.jpg", rating: 4.8, reviews: 1543, category: "Sports", sales: 13000 },
            ])
            setIsLoading(false)
        }, 1000)
    }, [])

    const categories = [
        "all",
        "Electronics",
        "Fashion",
        "Home",
        "Beauty",
        "Sports"
    ]

    const timeRanges = [
        { value: "week", label: "This Week" },
        { value: "month", label: "This Month" },
        { value: "year", label: "This Year" },
        { value: "all", label: "All Time" }
    ]

    // Top 3 products
    const topProducts = products.slice(0, 3)

    return (
        <div className="space-y-12 pb-16">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-900 dark:to-red-900">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 px-6 py-16 text-center"
                >
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="inline-block mb-4"
                    >
                        <HiOutlineFire className="h-16 w-16 text-white mx-auto" />
                    </motion.div>
                    <h1 className="text-4xl font-bold text-white mb-4">Best Sellers</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Discover the products everyone loves
                    </p>
                </motion.div>
            </section>

            {/* Top 3 Best Sellers */}
            <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                    Top 3 Best Sellers
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {topProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl text-center"
                        >
                            {/* Rank Badge */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-600"
                                    }`}>
                                    #{index + 1}
                                </div>
                            </div>

                            {/* Product Image */}
                            <div className="relative h-40 w-40 mx-auto mb-4 mt-4">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover rounded-xl"
                                />
                            </div>

                            {/* Product Info */}
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {product.name}
                            </h3>

                            <div className="flex items-center justify-center gap-1 mb-2">
                                <HiOutlineStar className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold text-gray-900 dark:text-white">{product.rating}</span>
                                <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                            </div>

                            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                ${product.price}
                            </div>

                            <div className="flex items-center justify-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                <HiOutlineTrendingUp className="h-4 w-4 text-green-600" />
                                <span>{product.sales.toLocaleString()} sold</span>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="mt-4 w-full py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 transition-colors"
                            >
                                Add to Cart
                            </motion.button>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Filters */}
            <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2">
                        <HiOutlineFire className="h-5 w-5 text-orange-500" />
                        <span className="font-semibold text-gray-900 dark:text-white">Filter Best Sellers:</span>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat === "all" ? "All Categories" : cat}
                                </option>
                            ))}
                        </select>

                        {/* Time Range Filter */}
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                        >
                            {timeRanges.map(range => (
                                <option key={range.value} value={range.value}>{range.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            {/* All Best Sellers */}
            <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    All Best Sellers
                </h2>
                <ProductGrid products={products} isLoading={isLoading} />
            </section>

            {/* Why They're Best Sellers */}
            <section className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                    Why These Are Best Sellers
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {[
                        {
                            title: "Top Rated",
                            description: "Highly rated by thousands of customers",
                            icon: "⭐"
                        },
                        {
                            title: "Proven Quality",
                            description: "Tested and trusted by our community",
                            icon: "✅"
                        },
                        {
                            title: "Best Value",
                            description: "Excellent quality at great prices",
                            icon: "💎"
                        }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center text-white"
                        >
                            <div className="text-4xl mb-3">{item.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                            <p className="text-white/90">{item.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    )
}