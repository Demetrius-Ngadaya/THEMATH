// src/app/deals/page.js
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { HiOutlineClock, HiOutlineFire, HiOutlineTag, HiOutlineShoppingCart } from "react-icons/hi"
import ProductGrid from "@/components/ProductGrid"
import CountdownTimer from "@/components/CountdownTimer"
import { PublicAPI } from "@/services/publicApi"
import { API } from "@/services/api"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getImageUrl } from "@/utils/imageHelper"
import { showSuccess, showError } from "@/utils/sweetalert"
import Cookies from "js-cookie"

export default function DealsPage() {
    const [deals, setDeals] = useState([])
    const [flashDeals, setFlashDeals] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [addingToCart, setAddingToCart] = useState(null)
    const router = useRouter()

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        setIsLoading(true)
        try {
            const response = await PublicAPI.getProducts({ page: 1, per_page: 20 })
            let products = []
            if (response.data.data) {
                products = response.data.data
            } else if (Array.isArray(response.data)) {
                products = response.data
            }

            // Process products: original price stays the same, strikethrough is original + 5%
            const processedDeals = products.map(product => ({
                ...product,
                originalPrice: product.price,
                price: product.price,
                strikethroughPrice: Math.round(product.price * 1.05),
                discount: 5,
                rating: 4.5,
                reviews: Math.floor(Math.random() * 100) + 10
            }))

            setDeals(processedDeals)

            // Set first 3 products as flash deals with random timers
            const flashDealsData = processedDeals.slice(0, 3).map((deal, index) => ({
                ...deal,
                endsIn: 3600 + (index * 3600)
            }))
            setFlashDeals(flashDealsData)

        } catch (error) {
            console.error("Error fetching products:", error)
            // Fallback data
            const fallbackProducts = [
                { id: 1, name: "Product 1", price: 42000, strikethroughPrice: 44100, originalPrice: 42000, discount: 5, image: "/product1.jpg", rating: 4.5, reviews: 45 },
                { id: 2, name: "Product 2", price: 45000, strikethroughPrice: 47250, originalPrice: 45000, discount: 5, image: "/product2.jpg", rating: 4.8, reviews: 89 },
                { id: 3, name: "Product 3", price: 30000, strikethroughPrice: 31500, originalPrice: 30000, discount: 5, image: "/product3.jpg", rating: 4.2, reviews: 23 },
                { id: 4, name: "Product 4", price: 37000, strikethroughPrice: 38850, originalPrice: 37000, discount: 5, image: "/product4.jpg", rating: 4.9, reviews: 67 },
            ]
            setDeals(fallbackProducts)
            setFlashDeals(fallbackProducts.slice(0, 3).map((deal, index) => ({
                ...deal,
                endsIn: 3600 + (index * 3600)
            })))
        } finally {
            setIsLoading(false)
        }
    }

    const addToCartAndRedirect = async (product) => {
        const token = Cookies.get('auth_token')

        if (!token) {
            // Store intended product and redirect to login
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

            // Redirect to cart immediately
            router.push('/cart')
        } catch (error) {
            console.error("Error adding to cart:", error)
            showError('Error', error.response?.data?.message || 'Failed to add to cart')
            setAddingToCart(null)
        }
    }

    const handleCardClick = (product) => {
        addToCartAndRedirect(product)
    }

    if (isLoading) {
        return (
            <div className="space-y-12 pb-16">
                <div className="animate-pulse">
                    <div className="h-64 bg-gray-200 rounded-3xl mb-8"></div>
                    <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-80 bg-gray-200 rounded-2xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

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
                        Get 5% OFF on all products! Click any product to add to cart instantly.
                    </p>
                </motion.div>
            </section>

            {/* Flash Deals */}
            {flashDeals.length > 0 && (
                <section className="container mx-auto px-4">
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Flash Deals</h2>
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                            <HiOutlineClock className="h-5 w-5" />
                            <span className="font-semibold">Ending Soon</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {flashDeals.map((deal, index) => (
                            <motion.div
                                key={deal.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all cursor-pointer ${addingToCart === deal.id ? 'opacity-50 pointer-events-none' : ''
                                    }`}
                                onClick={() => handleCardClick(deal)}
                            >
                                <div className="absolute top-4 right-4 z-10">
                                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                        -{deal.discount}%
                                    </span>
                                </div>
                                {addingToCart === deal.id && (
                                    <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center rounded-2xl">
                                        <div className="bg-white rounded-lg p-4 flex flex-col items-center gap-2">
                                            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span className="text-sm font-semibold">Adding to Cart...</span>
                                        </div>
                                    </div>
                                )}
                                <div className="p-4">
                                    <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                                        {deal.images?.[0] ? (
                                            <img
                                                src={getImageUrl(deal.images[0].path)}
                                                alt={deal.name}
                                                className="object-cover rounded-xl w-full h-full group-hover:scale-110 transition-transform duration-300"
                                                onError={(e) => {
                                                    console.error('Image failed to load:', getImageUrl(deal.images[0].path));
                                                    e.target.src = '/placeholder.jpg';
                                                }}
                                            />
                                        ) : (
                                            <span className="text-white text-sm">Product</span>
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{deal.name}</h3>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                                            TSh {deal.price?.toLocaleString()}
                                        </span>
                                        {deal.strikethroughPrice && (
                                            <span className="text-sm text-gray-500 line-through">
                                                TSh {deal.strikethroughPrice?.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                    <CountdownTimer initialSeconds={deal.endsIn} />

                                    <div className="mt-4 text-center text-sm text-blue-600 dark:text-blue-400 font-semibold">
                                        Click to add to cart →
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* All Deals */}
            <section className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">All Deals (5% OFF)</h2>
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <HiOutlineTag className="h-5 w-5" />
                        <span className="font-semibold">Click Any Product</span>
                    </div>
                </div>
                <ProductGrid
                    products={deals}
                    isLoading={isLoading}
                    onProductClick={handleCardClick}
                    addingToCart={addingToCart}
                />
            </section>
        </div>
    )
}