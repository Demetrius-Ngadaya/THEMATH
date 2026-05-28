// src/components/ProductCard.js
"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import { HiOutlineHeart, HiHeart, HiOutlineShoppingCart, HiOutlineStar, HiOutlineLightningBolt } from "react-icons/hi"
import { addToCart } from "@/store/cartSlice"
import { addToWishlist, removeFromWishlist } from "@/store/wishlistSlice"
import { API } from "@/services/api"
import Cookies from "js-cookie"
import { showSuccess, showError } from "@/utils/sweetalert"
import { getImageUrl } from "@/utils/imageHelper"

export default function ProductCard({ product }) {
    const [isHovered, setIsHovered] = useState(false)
    const [isImageLoaded, setIsImageLoaded] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const dispatch = useDispatch()
    const router = useRouter()
    const wishlistItems = useSelector((state) => state.wishlist?.items || [])
    const isInWishlist = wishlistItems.some((item) => item.id === product.id)

    const checkAuthAndRedirect = () => {
        const token = Cookies.get('auth_token')
        if (!token) {
            localStorage.setItem('intendedProduct', JSON.stringify(product))
            localStorage.setItem('redirectAfterLogin', '/cart')
            router.push('/login')
            return false
        }
        return true
    }

    const handleProductClick = (e) => {
        if (e.target.closest('button')) return
        if (checkAuthAndRedirect()) {
            handleAddToCartAndRedirect()
        }
    }

    const handleAddToCartAndRedirect = async () => {
        setIsProcessing(true)
        try {
            await API.addToCart({
                product_id: product.id,
                quantity: 1
            })
            dispatch(addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            }))
            router.push('/cart')
        } catch (error) {
            console.error("Error adding to cart:", error)
            showError('Error', error.response?.data?.message || "Failed to add to cart")
            setIsProcessing(false)
        }
    }

    const handleAddToCart = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!checkAuthAndRedirect()) return

        setIsProcessing(true)
        try {
            await API.addToCart({
                product_id: product.id,
                quantity: 1
            })
            dispatch(addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            }))
            showSuccess('Added to Cart', `${product.name} added to cart!`)
        } catch (error) {
            console.error("Error adding to cart:", error)
            showError('Error', error.response?.data?.message || "Failed to add to cart")
        } finally {
            setIsProcessing(false)
        }
    }

    const handleBuyNow = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!checkAuthAndRedirect()) return

        setIsProcessing(true)
        try {
            await API.addToCart({
                product_id: product.id,
                quantity: 1
            })
            dispatch(addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            }))
            router.push('/cart')
        } catch (error) {
            console.error("Error in buy now:", error)
            showError('Error', error.response?.data?.message || "Failed to process")
        } finally {
            setIsProcessing(false)
        }
    }

    const handleWishlistToggle = (e) => {
        e.preventDefault()
        e.stopPropagation()

        const token = Cookies.get('auth_token')
        if (!token) {
            localStorage.setItem('redirectAfterLogin', '/wishlist')
            router.push('/login')
            return
        }

        if (isInWishlist) {
            dispatch(removeFromWishlist(product.id))
            showSuccess('Removed', `${product.name} removed from wishlist`)
        } else {
            dispatch(addToWishlist({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images?.[0]?.path || '/placeholder.jpg'
            }))
            showSuccess('Added', `${product.name} added to wishlist`)
        }
    }

    const imageUrl = getImageUrl(product.images?.[0]?.path || product.image)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={handleProductClick}
            className="group relative rounded-2xl bg-white p-4 shadow-lg dark:bg-gray-900 transition-all duration-300 hover:shadow-xl cursor-pointer"
        >
            <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                {!isImageLoaded && (
                    <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700" />
                )}
                <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className={`object-cover transition-transform duration-500 group-hover:scale-110 ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
                    onLoadingComplete={() => setIsImageLoaded(true)}
                />

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    className="absolute right-2 top-2 flex flex-col gap-2"
                >
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleWishlistToggle}
                        disabled={isProcessing}
                        className="rounded-full bg-white p-2 shadow-lg dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                        {isInWishlist ? (
                            <HiHeart className="h-5 w-5 text-red-500" />
                        ) : (
                            <HiOutlineHeart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        )}
                    </motion.button>
                </motion.div>

                {product.discount && (
                    <div className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                        -{product.discount}%
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {product.name}
                </h3>
{/* 
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <HiOutlineStar
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(product.rating || 4.5)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300 dark:text-gray-600"
                                }`}
                        />
                    ))}
                    <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                        ({product.reviews || 0})
                    </span>
                </div> */}

                <div className="flex items-center justify-between">
                    <div>
                        {product.strikethroughPrice ? (
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                    Tsh {product.price?.toLocaleString()}
                                </span>
                                <span className="text-sm text-gray-500 line-through dark:text-gray-400">
                                    Tsh {product.strikethroughPrice?.toLocaleString()}
                                </span>
                            </div>
                        ) : (
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                Tsh {product.price?.toLocaleString()}
                            </span>
                        )}
                    </div>

                    <div className="flex gap-1">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleAddToCart}
                            disabled={isProcessing}
                            className="rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                            title="Add to Cart"
                        >
                            <HiOutlineShoppingCart className="h-5 w-5" />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleBuyNow}
                            disabled={isProcessing}
                            className="rounded-full bg-green-600 p-2 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                            title="Buy Now"
                        >
                            <HiOutlineLightningBolt className="h-5 w-5" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}