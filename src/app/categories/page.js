"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
    HiOutlineComputerDesktop,
    HiOutlineDevicePhoneMobile,
    HiOutlineHome,
    HiOutlineHeart,
    HiOutlineBookOpen,
    HiOutlineShoppingBag,
    HiOutlineWrenchScrewdriver,
    HiOutlineCamera
} from "react-icons/hi2"

export default function CategoriesPage() {
    const [viewMode, setViewMode] = useState("grid")

    const categories = [
        {
            id: 1,
            name: "Electronics",
            icon: HiOutlineComputerDesktop,
            image: "/category-electronics.jpg",
            itemCount: 1543,
            subcategories: ["Smartphones", "Laptops", "Tablets", "Accessories"],
            color: "from-blue-500 to-blue-600"
        },
        {
            id: 2,
            name: "Fashion",
            icon: HiOutlineShoppingBag,
            image: "/category-fashion.jpg",
            itemCount: 2891,
            subcategories: ["Men's Wear", "Women's Wear", "Kids' Wear", "Footwear"],
            color: "from-pink-500 to-pink-600"
        },
        {
            id: 3,
            name: "Home & Living",
            icon: HiOutlineHome,
            image: "/category-home.jpg",
            itemCount: 1256,
            subcategories: ["Furniture", "Decor", "Kitchen", "Bedding"],
            color: "from-green-500 to-green-600"
        },
        {
            id: 4,
            name: "Health & Beauty",
            icon: HiOutlineHeart,
            image: "/category-beauty.jpg",
            itemCount: 987,
            subcategories: ["Skincare", "Makeup", "Hair Care", "Fragrances"],
            color: "from-red-500 to-red-600"
        },
        {
            id: 5,
            name: "Books & Media",
            icon: HiOutlineBookOpen,
            image: "/category-books.jpg",
            itemCount: 3421,
            subcategories: ["Fiction", "Non-Fiction", "Textbooks", "E-books"],
            color: "from-yellow-500 to-yellow-600"
        },
        {
            id: 6,
            name: "Sports & Outdoors",
            icon: HiOutlineWrenchScrewdriver,
            image: "/category-sports.jpg",
            itemCount: 876,
            subcategories: ["Exercise Equipment", "Camping", "Team Sports", "Fitness"],
            color: "from-orange-500 to-orange-600"
        },
        {
            id: 7,
            name: "Mobile & Accessories",
            icon: HiOutlineDevicePhoneMobile,
            image: "/category-mobile.jpg",
            itemCount: 654,
            subcategories: ["Phones", "Cases", "Chargers", "Screen Protectors"],
            color: "from-purple-500 to-purple-600"
        },
        {
            id: 8,
            name: "Cameras & Photo",
            icon: HiOutlineCamera,
            image: "/category-camera.jpg",
            itemCount: 432,
            subcategories: ["DSLR", "Mirrorless", "Lenses", "Accessories"],
            color: "from-indigo-500 to-indigo-600"
        }
    ]

    const featuredCategories = categories.slice(0, 4)

    return (
        <div className="space-y-12 pb-16">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-900 dark:to-pink-900">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 px-6 py-16 text-center"
                >
                    <h1 className="text-4xl font-bold text-white mb-4">Shop by Category</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Browse thousands of products across our curated categories
                    </p>
                </motion.div>
            </section>

            {/* Featured Categories */}
            <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Featured Categories</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {featuredCategories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer"
                        >
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <category.icon className="h-8 w-8 text-white mb-2" />
                                <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                                <p className="text-white/80 text-sm">{category.itemCount} products</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* All Categories */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">All Categories</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-lg ${viewMode === "grid"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                }`}
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-lg ${viewMode === "list"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                }`}
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                                        <category.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <span className="text-sm text-gray-500">{category.itemCount} items</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    {category.name}
                                </h3>
                                <div className="space-y-1 mb-4">
                                    {category.subcategories.map((sub, idx) => (
                                        <Link
                                            key={idx}
                                            href={`/categories/${sub.toLowerCase().replace(/\s+/g, '-')}`}
                                            className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
                                        >
                                            {sub}
                                        </Link>
                                    ))}
                                </div>
                                <Link
                                    href={`/categories/${category.name.toLowerCase()}`}
                                    className="text-blue-600 font-semibold text-sm group-hover:underline"
                                >
                                    Browse All →
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center flex-shrink-0`}>
                                        <category.icon className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                {category.name}
                                            </h3>
                                            <span className="text-sm text-gray-500">{category.itemCount} items</span>
                                        </div>
                                        <div className="flex flex-wrap gap-4">
                                            {category.subcategories.map((sub, idx) => (
                                                <Link
                                                    key={idx}
                                                    href={`/categories/${sub.toLowerCase().replace(/\s+/g, '-')}`}
                                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
                                                >
                                                    {sub}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* Popular Searches */}
            <section className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    Popular Searches
                </h2>
                <div className="flex flex-wrap gap-3 justify-center">
                    {["Smartphones", "Laptops", "Dresses", "Shoes", "Furniture", "Books", "Headphones", "Watches"].map((term, index) => (
                        <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="px-4 py-2 bg-white dark:bg-gray-900 rounded-full text-gray-700 dark:text-gray-300 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                        >
                            {term}
                        </motion.span>
                    ))}
                </div>
            </section>
        </div>
    )
}