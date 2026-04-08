"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import { HiOutlineHeart, HiHeart, HiOutlineShoppingCart, HiOutlineStar } from "react-icons/hi"
import { addToCart } from "@/store/cartSlice"
// import { addToWishlist, removeFromWishlist } from "@/store/wishlistSlice"

export default function ProductCard({ product }) {
    const [isHovered, setIsHovered] = useState(false)
    const [isImageLoaded, setIsImageLoaded] = useState(false)
    const dispatch = useDispatch()

    const wishlistItems = useSelector((state) => state.wishlist.items)
    const isInWishlist = wishlistItems.some((item) => item.id === product.id)

    const handleWishlistToggle = (e) => {
        e.preventDefault()
        if (isInWishlist) {
            dispatch(removeFromWishlist(product.id))
        } else {
            dispatch(addToWishlist(product))
        }
    }

    const handleAddToCart = (e) => {
        e.preventDefault()
        dispatch(addToCart({ ...product, quantity: 1 }))
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="group relative rounded-2xl bg-white p-4 shadow-lg dark:bg-gray-900 transition-all duration-300 hover:shadow-xl"
        >
            <Link href={`/product/${product.id}`}>
                {/* Image Container */}
                <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                    {!isImageLoaded && (
                        <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700" />
                    )}
                    <Image
                        src={product.image || "/placeholder.jpg"}
                        alt={product.name}
                        fill
                        className={`object-cover transition-transform duration-500 group-hover:scale-110 ${isImageLoaded ? "opacity-100" : "opacity-0"
                            }`}
                        onLoadingComplete={() => setIsImageLoaded(true)}
                    />

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        className="absolute right-2 top-2 flex flex-col gap-2"
                    >
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleWishlistToggle}
                            className="rounded-full bg-white p-2 shadow-lg dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            {isInWishlist ? (
                                <HiHeart className="h-5 w-5 text-red-500" />
                            ) : (
                                <HiOutlineHeart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            )}
                        </motion.button>
                    </motion.div>

                    {/* Discount Badge */}
                    {product.discount && (
                        <div className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                            -{product.discount}%
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <HiOutlineStar
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(product.rating)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300 dark:text-gray-600"
                                    }`}
                            />
                        ))}
                        <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                            ({product.reviews || 0})
                        </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                        <div>
                            {product.originalPrice ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                                        Tsh {product.price}
                                    </span>
                                    <span className="text-sm text-gray-500 line-through dark:text-gray-400">
                                        Tsh {product.originalPrice}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                    Tsh {product.price}
                                </span>
                            )}
                        </div>

                        {/* Add to Cart Button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleAddToCart}
                            className="rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700 transition-colors"
                        >
                            <HiOutlineShoppingCart className="h-5 w-5" />
                        </motion.button>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}