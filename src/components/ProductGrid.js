// src/components/ProductGrid.js
"use client"

import { motion } from "framer-motion"
import { HiOutlineStar, HiOutlineShoppingCart } from "react-icons/hi"
import { getImageUrl } from "@/utils/imageHelper"

export default function ProductGrid({ products, isLoading, onProductClick, addingToCart }) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 rounded-2xl h-64 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        )
    }

    if (!products || products.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
                <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer ${addingToCart === product.id ? 'opacity-50 pointer-events-none' : ''
                        }`}
                    onClick={() => onProductClick && onProductClick(product)}
                >
                    {/* Loading Overlay */}
                    {addingToCart === product.id && (
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

                        {/* Discount Badge */}
                        {product.discount && (
                            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                                -{product.discount}%
                            </div>
                        )}
                    </div>

                    <div className="p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                            {product.name}
                        </h3>

                        {/* Rating */}
                        {product.rating && (
                            <div className="flex items-center gap-1 mb-2">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <HiOutlineStar
                                            key={i}
                                            className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-gray-500">({product.reviews || 0})</span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl font-bold text-red-600 dark:text-red-400">
                                TSh {product.price?.toLocaleString()}
                            </span>
                            {product.strikethroughPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                    TSh {product.strikethroughPrice?.toLocaleString()}
                                </span>
                            )}
                        </div>

                        {/* Add to Cart Hint */}
                        <div className="mt-2 text-center text-sm text-blue-600 dark:text-blue-400 font-semibold">
                            Click to add to cart →
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}