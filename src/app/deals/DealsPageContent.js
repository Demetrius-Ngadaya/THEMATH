// app/deals/DealsPageContent.js
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { HiOutlineClock, HiOutlineFire, HiOutlineTag } from "react-icons/hi"
import CountdownTimer from "@/components/CountdownTimer"
import { API } from "@/services/api"
import { API_BASE_URL } from "@/utils/apiConfig"
import axios from "axios"
import { useRouter } from "next/navigation"
import { getImageUrl } from "@/utils/imageHelper"
import { showSuccess, showError } from "@/utils/sweetalert"
import Cookies from "js-cookie"
import { useLanguage } from "@/contexts/LanguageContext"

const secondsUntil = (isoDate) => {
    if (!isoDate) return null
    const diff = Math.floor((new Date(isoDate).getTime() - Date.now()) / 1000)
    return diff > 0 ? diff : 0
}

export default function DealsPageContent() {
    const [deals, setDeals] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [addingToCart, setAddingToCart] = useState(null)
    const router = useRouter()
    const { t } = useLanguage()

    useEffect(() => {
        fetchDeals()
    }, [])

    const fetchDeals = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${API_BASE_URL}/deals`)
            setDeals(Array.isArray(response.data) ? response.data : [])
        } catch (error) {
            console.error("Error fetching deals:", error)
            setDeals([])
        } finally {
            setIsLoading(false)
        }
    }

    const addToCartAndRedirect = async (deal) => {
        const token = Cookies.get('auth_token')
        const product = deal.product

        if (!token) {
            localStorage.setItem('intendedProduct', JSON.stringify({ id: product.id, quantity: 1 }))
            localStorage.setItem('redirectAfterLogin', '/cart')
            showError('Please Login', 'You need to login first to add items to cart')
            router.push('/login')
            return
        }

        setAddingToCart(deal.id)
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

    // Deals with an end date, soonest first, shown in the "Flash Deals" strip.
    const flashDeals = deals
        .filter((d) => d.ends_at)
        .sort((a, b) => new Date(a.ends_at) - new Date(b.ends_at))
        .slice(0, 3)

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
                    <h1 className="text-4xl font-bold text-white mb-4">{t("deals.title")}</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        {deals.length > 0
                            ? t("deals.clickHint")
                            : t("deals.noActiveDealsHero")}
                    </p>
                </motion.div>
            </section>

            {deals.length === 0 && !isLoading && (
                <div className="text-center py-16">
                    <p className="text-gray-500 text-lg">{t("deals.noActiveDeals")}</p>
                </div>
            )}

            {/* Flash Deals (deals with an end date) */}
            {flashDeals.length > 0 && (
                <section className="container mx-auto px-4">
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t("deals.flashDeals")}</h2>
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                            <HiOutlineClock className="h-5 w-5" />
                            <span className="font-semibold">{t("deals.endingSoon")}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {flashDeals.map((deal, index) => (
                            <DealCard
                                key={deal.id}
                                deal={deal}
                                index={index}
                                addingToCart={addingToCart}
                                onClick={() => addToCartAndRedirect(deal)}
                                t={t}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* All Deals */}
            {deals.length > 0 && (
                <section className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t("deals.allDeals")}</h2>
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                            <HiOutlineTag className="h-5 w-5" />
                            <span className="font-semibold">{t("deals.clickAnyProduct")}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {deals.map((deal, index) => (
                            <DealCard
                                key={deal.id}
                                deal={deal}
                                index={index}
                                addingToCart={addingToCart}
                                onClick={() => addToCartAndRedirect(deal)}
                                t={t}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}

function DealCard({ deal, index, addingToCart, onClick, t }) {
    const product = deal.product
    if (!product) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all cursor-pointer ${addingToCart === deal.id ? 'opacity-50 pointer-events-none' : ''}`}
            onClick={onClick}
        >
            <div className="absolute top-4 right-4 z-10">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{deal.discount_percentage}%
                </span>
            </div>
            {addingToCart === deal.id && (
                <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center rounded-2xl">
                    <div className="bg-white rounded-lg p-4 flex flex-col items-center gap-2">
                        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-sm font-semibold">{t("home.addingToCart")}</span>
                    </div>
                </div>
            )}
            <div className="p-4">
                <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                    {product.images?.[0] ? (
                        <img
                            src={getImageUrl(product.images[0].path)}
                            alt={product.name}
                            className="object-cover rounded-xl w-full h-full group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => { e.target.src = '/placeholder.jpg' }}
                        />
                    ) : (
                        <span className="text-white text-sm">{t("cart.productFallback")}</span>
                    )}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{product.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                        TSh {deal.discount_price?.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                        TSh {product.price?.toLocaleString()}
                    </span>
                </div>
                {deal.ends_at && (
                    <CountdownTimer initialSeconds={secondsUntil(deal.ends_at)} />
                )}
                <div className="mt-4 text-center text-sm text-blue-600 dark:text-blue-400 font-semibold">
                    {t("deals.clickToAddToCart")} →
                </div>
            </div>
        </motion.div>
    )
}
