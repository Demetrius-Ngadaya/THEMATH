"use client"

import { motion } from "framer-motion"
import { HiOutlineStar } from "react-icons/hi"

export default function ProductGrid({ products, isLoading }) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-xl mb-4" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => (
                <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="group relative rounded-2xl bg-white dark:bg-gray-900 shadow-lg overflow-hidden"
                >
                    {product.discount && (
                        <div className="absolute top-4 right-4 z-10">
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                -{product.discount}%
                            </span>
                        </div>
                    )}
                    <div className="aspect-square bg-gray-200 dark:bg-gray-800 group-hover:scale-105 transition-transform duration-300" />
                    <div className="p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{product.name}</h3>
                        <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <HiOutlineStar
                                    key={i}
                                    className={`h-4 w-4 Tsh{
                                        i < Math.floor(product.rating)
                                            ? "text-yellow-400 fill-current"
                                            : "text-gray-300 dark:text-gray-600"
                                    }`}
                                />
                            ))}
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                                ({product.rating})
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                ${product.price}
                            </span>
                            {product.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                    ${product.originalPrice}
                                </span>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
