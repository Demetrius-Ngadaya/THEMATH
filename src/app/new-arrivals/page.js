// src/app/new-arrivals/page.js
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { HiOutlineSparkles, HiOutlineClock, HiOutlineFilter, HiOutlineSearch } from "react-icons/hi"
import { PublicAPI } from "@/services/publicApi"
import { API } from "@/services/api"
import { useRouter } from "next/navigation"
import { showSuccess, showError } from "@/utils/sweetalert"
import Cookies from "js-cookie"
import { getImageUrl } from "@/utils/imageHelper"

export default function NewArrivalsPage() {
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedTimeframe, setSelectedTimeframe] = useState("all")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [categories, setCategories] = useState([])
    const [addingToCart, setAddingToCart] = useState(null)
    const router = useRouter()

    useEffect(() => {
        fetchProducts()
        fetchCategories()
    }, [])

    useEffect(() => {
        filterProducts()
    }, [products, searchQuery, selectedTimeframe, selectedCategory])

    const fetchProducts = async () => {
        setIsLoading(true)
        try {
            const response = await PublicAPI.getProducts({ page: 1, per_page: 100 })
            let productsData = []
            if (response.data.data) {
                productsData = response.data.data
            } else if (Array.isArray(response.data)) {
                productsData = response.data
            }

            // Sort by newest first (assuming created_at or id)
            const sortedProducts = productsData.sort((a, b) => {
                const dateA = new Date(a.created_at || a.id)
                const dateB = new Date(b.created_at || b.id)
                return dateB - dateA
            })

            setProducts(sortedProducts)
            setFilteredProducts(sortedProducts)
        } catch (error) {
            console.error("Error fetching products:", error)
            setProducts([])
            setFilteredProducts([])
        } finally {
            setIsLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await PublicAPI.getCategories()
            let categoriesData = []
            if (response.data && Array.isArray(response.data)) {
                categoriesData = response.data
            } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
                categoriesData = response.data.data
            } else if (Array.isArray(response)) {
                categoriesData = response
            }
            setCategories([{ id: "all", name: "All Categories" }, ...categoriesData])
        } catch (error) {
            console.error("Error fetching categories:", error)
            setCategories([{ id: "all", name: "All Categories" }])
        }
    }

    const filterProducts = () => {
        let filtered = [...products]

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
            )
        }

        // Category filter
        if (selectedCategory && selectedCategory !== "all") {
            filtered = filtered.filter(product =>
                product.category_id == selectedCategory ||
                product.category?.id == selectedCategory ||
                product.category?.name === selectedCategory
            )
        }

        // Timeframe filter (based on created_at date)
        if (selectedTimeframe !== "all") {
            const now = new Date()
            filtered = filtered.filter(product => {
                const productDate = new Date(product.created_at)
                const diffDays = Math.floor((now - productDate) / (1000 * 60 * 60 * 24))

                switch (selectedTimeframe) {
                    case "today":
                        return diffDays === 0
                    case "week":
                        return diffDays <= 7
                    case "month":
                        return diffDays <= 30
                    default:
                        return true
                }
            })
        }

        setFilteredProducts(filtered)
    }

    const addToCartAndRedirect = async (product) => {
        const token = Cookies.get('auth_token')

        if (!token) {
            localStorage.setItem('intendedProduct', JSON.stringify({ id: product.id, quantity: 1 }))
            localStorage.setItem('redirectAfterLogin', '/cart')
            showError('Please Login', 'You need to login first to add items to cart')
            router.push('/login')
            return
        }

        setAddingToCart(product.id)
        try {
            await API.addToCart({
                product_id: product.id,
                quantity: 1
            })
            showSuccess('Added to Cart', `${product.name} has been added to your cart`)
            router.push('/cart')
        } catch (error) {
            console.error("Error adding to cart:", error)
            showError('Error', error.response?.data?.message || 'Failed to add to cart')
            setAddingToCart(null)
        }
    }

    const timeframes = [
        { value: "all", label: "All Time" },
        { value: "today", label: "Today" },
        { value: "week", label: "This Week" },
        { value: "month", label: "This Month" }
    ]

    const clearFilters = () => {
        setSearchQuery("")
        setSelectedTimeframe("all")
        setSelectedCategory("all")
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        )
    }

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
                        Be the first to shop our latest products. Click any product to add to cart instantly.
                    </p>
                </motion.div>
            </section>

            {/* Filters */}
            <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
                <div className="flex flex-col gap-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

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
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>

                            {/* Clear Filters Button */}
                            {(searchQuery || selectedTimeframe !== "all" || selectedCategory !== "all") && (
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 text-red-600 hover:text-red-700 font-semibold"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>

                        {/* Results Count */}
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <HiOutlineClock className="h-5 w-5" />
                            <span>{filteredProducts.length} new items</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl">
                    <HiOutlineSparkles className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters</p>
                    <button
                        onClick={clearFilters}
                        className="mt-4 text-green-600 hover:text-green-700 font-semibold"
                    >
                        Clear all filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer ${addingToCart === product.id ? 'opacity-50 pointer-events-none' : ''
                                }`}
                            onClick={() => addToCartAndRedirect(product)}
                        >
                            {/* Loading Overlay */}
                            {addingToCart === product.id && (
                                <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center rounded-2xl">
                                    <div className="bg-white rounded-lg p-4 flex flex-col items-center gap-2">
                                        <svg className="animate-spin h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span className="text-sm font-semibold">Adding to Cart...</span>
                                    </div>
                                </div>
                            )}

                            {/* New Badge */}
                            <div className="absolute top-3 left-3 z-10">
                                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                    New
                                </span>
                            </div>

                            <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                                {product.images?.[0] ? (
                                    <img
                                        src={getImageUrl(product.images[0].path)}
                                        alt={product.name}
                                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => {
                                            e.target.src = '/placeholder.jpg'
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                    {product.name}
                                </h3>

                                {/* Category */}
                                {product.category && (
                                    <p className="text-sm text-gray-500 mb-2">
                                        {product.category.name}
                                    </p>
                                )}

                                {/* Price */}
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                        TSh {product.price?.toLocaleString()}
                                    </span>
                                </div>

                                {/* Add to Cart Hint */}
                                <div className="mt-2 text-center text-sm text-green-600 dark:text-green-400 font-semibold">
                                    Click to add to cart →
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

        </div>
    )
}