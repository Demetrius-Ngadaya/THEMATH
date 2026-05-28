// app/categories/page.js
"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { PublicAPI } from "@/services/publicApi"
import { Spinner, Chip, Button } from "@nextui-org/react"
import {
    HiOutlineComputerDesktop,
    HiOutlineDevicePhoneMobile,
    HiOutlineHome,
    HiOutlineHeart,
    HiOutlineBookOpen,
    HiOutlineShoppingBag,
    HiOutlineWrenchScrewdriver,
    HiOutlineCamera,
    HiOutlineSparkles,
    HiOutlineCube,
    HiOutlineLightBulb,
    HiOutlineMusicNote,
    HiOutlineGift,
    HiOutlineTruck,
    HiOutlineClock
} from "react-icons/hi2"

// Fallback icons for categories without specific icons
const getCategoryIcon = (categoryName) => {
    const iconMap = {
        'Electronics': HiOutlineComputerDesktop,
        'Fashion': HiOutlineShoppingBag,
        'Home & Living': HiOutlineHome,
        'Health & Beauty': HiOutlineHeart,
        'Books & Media': HiOutlineBookOpen,
        'Sports & Outdoors': HiOutlineWrenchScrewdriver,
        'Mobile & Accessories': HiOutlineDevicePhoneMobile,
        'Cameras & Photo': HiOutlineCamera,
    }
    return iconMap[categoryName] || HiOutlineSparkles
}

const getCategoryColor = (categoryName) => {
    const colorMap = {
        'Electronics': "from-blue-500 to-blue-600",
        'Fashion': "from-pink-500 to-pink-600",
        'Home & Living': "from-green-500 to-green-600",
        'Health & Beauty': "from-red-500 to-red-600",
        'Books & Media': "from-yellow-500 to-yellow-600",
        'Sports & Outdoors': "from-orange-500 to-orange-600",
        'Mobile & Accessories': "from-purple-500 to-purple-600",
        'Cameras & Photo': "from-indigo-500 to-indigo-600",
    }
    return colorMap[categoryName] || "from-gray-500 to-gray-600"
}

// Icon wrapper component to avoid React.createElement issues
const CategoryIcon = ({ categoryName, className }) => {
    const IconComponent = getCategoryIcon(categoryName)
    return <IconComponent className={className} />
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [viewMode, setViewMode] = useState("grid")
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        setIsLoading(true)
        try {
            const response = await PublicAPI.getCategories()

            // Handle different response formats
            let categoriesData = []
            if (response.data && Array.isArray(response.data)) {
                categoriesData = response.data
            } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
                categoriesData = response.data.data
            } else if (Array.isArray(response)) {
                categoriesData = response
            }

            setCategories(categoriesData)
        } catch (error) {
            console.error("Error fetching categories:", error)
            setCategories([])
        } finally {
            setIsLoading(false)
        }
    }

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null
        if (imagePath.startsWith('http')) return imagePath
        return `${process.env.NEXT_PUBLIC_API_URL || 'https://backendapi.emcc-lab.com/'}/storage/${imagePath}`
    }

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const featuredCategories = filteredCategories.slice(0, 4)

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Spinner size="lg" color="primary" />
            </div>
        )
    }

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
                    <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
                        Browse thousands of products across our curated categories
                    </p>

                    {/* Search Input */}
                    <div className="max-w-md mx-auto">
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                    </div>
                </motion.div>
            </section>

            {filteredCategories.length === 0 ? (
                <div className="text-center py-12">
                    <HiOutlineSparkles className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No categories found</h3>
                    <p className="text-gray-500">Try adjusting your search</p>
                </div>
            ) : (
                <>
                    {/* Featured Categories */}
                    {featuredCategories.length > 0 && (
                        <section>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Featured Categories</h2>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {featuredCategories.map((category, index) => {
                                    const imageUrl = getImageUrl(category.image)
                                    const gradientColor = getCategoryColor(category.name)

                                    return (
                                        <motion.div
                                            key={category.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ y: -5 }}
                                            className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer"
                                        >
                                            <Link href={`/products?category_id=${category.id}`}>
                                                {imageUrl ? (
                                                    <Image
                                                        src={imageUrl}
                                                        alt={category.name}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className={`w-full h-full bg-gradient-to-r ${gradientColor} flex items-center justify-center`}>
                                                        <CategoryIcon categoryName={category.name} className="h-16 w-16 text-white/50" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                                    <CategoryIcon categoryName={category.name} className="h-8 w-8 text-white mb-2" />
                                                    <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                                                    <p className="text-white/80 text-sm">{category.products_count || 0} products</p>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </section>
                    )}

                    {/* All Categories */}
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">All Categories</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === "grid"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === "list"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {viewMode === "grid" ? (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {filteredCategories.map((category, index) => {
                                    const imageUrl = getImageUrl(category.image)
                                    const gradientColor = getCategoryColor(category.name)

                                    return (
                                        <motion.div
                                            key={category.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group"
                                        >
                                            <Link href={`/products?category_id=${category.id}`}>
                                                <div className="relative h-40 overflow-hidden">
                                                    {imageUrl ? (
                                                        <Image
                                                            src={imageUrl}
                                                            alt={category.name}
                                                            fill
                                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className={`w-full h-full bg-gradient-to-r ${gradientColor} flex items-center justify-center`}>
                                                            <CategoryIcon categoryName={category.name} className="h-12 w-12 text-white/50" />
                                                        </div>
                                                    )}
                                                    <div className="absolute top-2 right-2">
                                                        <Chip size="sm" variant="flat" className="bg-white/90 dark:bg-gray-800/90">
                                                            {category.products_count || 0} items
                                                        </Chip>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                        {category.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                                        {category.description || `Explore our collection of ${category.name.toLowerCase()} products`}
                                                    </p>
                                                    <Button
                                                        as="span"
                                                        color="primary"
                                                        variant="flat"
                                                        size="sm"
                                                        className="mt-3 w-full"
                                                    >
                                                        Browse Category →
                                                    </Button>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredCategories.map((category, index) => {
                                    const imageUrl = getImageUrl(category.image)
                                    const gradientColor = getCategoryColor(category.name)

                                    return (
                                        <motion.div
                                            key={category.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
                                        >
                                            <Link href={`/products?category_id=${category.id}`} className="block">
                                                <div className="flex items-center gap-6 p-4">
                                                    <div className="flex-shrink-0">
                                                        {imageUrl ? (
                                                            <div className="relative w-20 h-20 rounded-xl overflow-hidden">
                                                                <Image
                                                                    src={imageUrl}
                                                                    alt={category.name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className={`w-20 h-20 rounded-xl bg-gradient-to-r ${gradientColor} flex items-center justify-center`}>
                                                                <CategoryIcon categoryName={category.name} className="h-8 w-8 text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                                {category.name}
                                                            </h3>
                                                            <Chip size="sm" variant="flat">
                                                                {category.products_count || 0} products
                                                            </Chip>
                                                        </div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {category.description || `Browse all ${category.name.toLowerCase()} products at best prices`}
                                                        </p>
                                                    </div>
                                                    <div className="text-blue-600 group-hover:translate-x-2 transition-transform">
                                                        →
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        )}
                    </section>
                </>
            )}

            {/* Popular Searches */}
            <section className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    Popular Categories
                </h2>
                <div className="flex flex-wrap gap-3 justify-center">
                    {categories.slice(0, 12).map((category, index) => (
                        <Link
                            key={category.id}
                            href={`/products?category_id=${category.id}`}
                        >
                            <motion.span
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-full text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md transition-all cursor-pointer"
                            >
                                <CategoryIcon categoryName={category.name} className="h-4 w-4" />
                                {category.name}
                            </motion.span>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    )
}