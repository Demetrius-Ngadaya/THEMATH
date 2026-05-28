// app/wishlist/page.js
"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FiHeart, FiShoppingBag, FiTrash2, FiLoader, FiEye } from "react-icons/fi"
import { FaHeart } from "react-icons/fa"
import { setWishlist, removeFromWishlist } from "@/store/wishlistSlice"
import { addToCart } from "@/store/cartSlice"
import { showSuccess, showError, showConfirm } from "@/utils/sweetalert"
import Cookies from "js-cookie"
import { API } from "@/services/api"
import { PublicAPI } from "@/services/publicApi"
import { getImageUrl } from "@/utils/imageHelper"

export default function Wishlist() {
    const dispatch = useDispatch()
    const router = useRouter()
    const wishlistItems = useSelector(state => state.wishlist.items)
    const [items, setItems] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isMoving, setIsMoving] = useState(false)
    const [addingToCart, setAddingToCart] = useState(null)
    const [productImages, setProductImages] = useState({})

    useEffect(() => {
        const token = Cookies.get('auth_token')
        if (!token) {
            router.push('/login')
            return
        }
        loadWishlistWithImages()
    }, [wishlistItems])

    const loadWishlistWithImages = async () => {
        setIsLoading(true)
        try {
            // Load wishlist items with their images
            const itemsWithImages = await Promise.all(
                wishlistItems.map(async (item) => {
                    let imageUrl = null
                    try {
                        const response = await PublicAPI.getProduct(item.id)
                        const product = response.data
                        if (product.images && product.images.length > 0) {
                            imageUrl = product.images[0].path
                        }
                        return {
                            ...item,
                            image: imageUrl,
                            description: product.description,
                            category: product.category
                        }
                    } catch (error) {
                        console.error(`Error fetching product ${item.id}:`, error)
                        return item
                    }
                })
            )
            setItems(itemsWithImages)
        } catch (error) {
            console.error("Error loading wishlist:", error)
            setItems(wishlistItems)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRemoveFromWishlist = async (productId, productName) => {
        const result = await showConfirm('Remove from Wishlist', `Remove "${productName}" from your wishlist?`)
        if (result.isConfirmed) {
            const updatedItems = items.filter(item => item.id !== productId)
            setItems(updatedItems)
            dispatch(removeFromWishlist(productId))
            showSuccess('Removed', `${productName} removed from wishlist`)
        }
    }

    const handleAddToCart = async (product) => {
        const token = Cookies.get('auth_token')
        if (!token) {
            router.push('/login')
            return
        }

        setAddingToCart(product.id)
        try {
            await API.addToCart({
                product_id: product.id,
                quantity: 1
            })
            dispatch(addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image
            }))
            showSuccess('Added to Cart', `${product.name} added to cart!`)

            // Optional: Remove from wishlist after adding to cart
            // You can uncomment this if you want to remove items from wishlist when added to cart
            // setTimeout(() => {
            //     handleRemoveFromWishlist(product.id, product.name)
            // }, 1500)
        } catch (error) {
            console.error("Error adding to cart:", error)
            showError('Error', error.response?.data?.message || "Failed to add to cart")
        } finally {
            setAddingToCart(null)
        }
    }

    const handleMoveAllToCart = async () => {
        if (items.length === 0) return

        const result = await showConfirm('Move All to Cart', `Move all ${items.length} items to cart?`)
        if (!result.isConfirmed) return

        setIsMoving(true)
        let successCount = 0
        for (const item of items) {
            try {
                await API.addToCart({
                    product_id: item.id,
                    quantity: 1
                })
                dispatch(addToCart({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: 1,
                    image: item.image
                }))
                successCount++
            } catch (error) {
                console.error(`Error adding ${item.name} to cart:`, error)
            }
        }

        if (successCount === items.length) {
            // Clear wishlist if all items moved successfully
            items.forEach(item => {
                dispatch(removeFromWishlist(item.id))
            })
            setItems([])
            showSuccess('Added to Cart', `${successCount} items moved to cart!`)
        } else {
            showSuccess('Added to Cart', `${successCount} of ${items.length} items added to cart`)
        }
        setIsMoving(false)
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <FiLoader className="h-12 w-12 animate-spin mx-auto text-blue-600" />
                <p className="text-gray-500 mt-4">Loading your wishlist...</p>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <FiHeart className="h-24 w-24 mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h2>
                <p className="text-gray-500 mb-6">Save your favorite items here to buy them later.</p>
                <Link href="/products" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Browse Products
                </Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
                    <p className="text-gray-500 mt-1">{items.length} items saved</p>
                </div>
                <button
                    onClick={handleMoveAllToCart}
                    disabled={isMoving}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {isMoving ? <FiLoader className="h-5 w-5 animate-spin" /> : <FiShoppingBag className="h-5 w-5" />}
                    {isMoving ? 'Moving...' : 'Move All to Cart'}
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item, index) => {
                    const imageUrl = item.image ? getImageUrl(item.image) : null
                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`group relative bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-xl transition-all overflow-hidden ${addingToCart === item.id ? 'opacity-50 pointer-events-none' : ''
                                }`}
                        >
                            {/* Adding to Cart Overlay */}
                            {addingToCart === item.id && (
                                <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center rounded-xl">
                                    <div className="bg-white rounded-lg p-4 flex flex-col items-center gap-2">
                                        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span className="text-sm font-semibold">Adding to Cart...</span>
                                    </div>
                                </div>
                            )}

                            <Link href={`/products/${item.id}`}>
                                <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center overflow-hidden">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.src = '/placeholder.jpg'
                                            }}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <FiHeart className="h-12 w-12 mb-2" />
                                            <span className="text-sm">No Image</span>
                                        </div>
                                    )}

                                    {/* Quick View Overlay */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                                            <FiEye className="h-4 w-4" />
                                            Quick View
                                        </span>
                                    </div>
                                </div>
                            </Link>

                            <div className="p-4">
                                <Link href={`/products/${item.id}`}>
                                    <h3 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 transition-colors line-clamp-2 min-h-[48px]">
                                        {item.name}
                                    </h3>
                                </Link>

                                {item.category && (
                                    <p className="text-sm text-gray-500 mt-1">{item.category.name}</p>
                                )}

                                <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-2">
                                    TSh {item.price?.toLocaleString()}
                                </p>

                                {item.description && (
                                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                                        {item.description}
                                    </p>
                                )}

                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        disabled={addingToCart === item.id}
                                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        {addingToCart === item.id ? (
                                            <FiLoader className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <FiShoppingBag className="h-4 w-4" />
                                        )}
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={() => handleRemoveFromWishlist(item.id, item.name)}
                                        className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                                        title="Remove from wishlist"
                                    >
                                        <FiTrash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Heart Icon */}
                            <div className="absolute top-2 right-2">
                                <FaHeart className="h-5 w-5 text-red-500 drop-shadow-sm" />
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}