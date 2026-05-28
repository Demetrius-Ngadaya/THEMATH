// app/cart/page.js - Updated version with image fetching and clickable recommended products
"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    FiTrash2,
    FiPlus,
    FiMinus,
    FiShoppingBag,
    FiHeart,
    FiLoader,
    FiShoppingCart
} from "react-icons/fi"
import { FaHeart } from "react-icons/fa"
import { API } from "@/services/api"
import { PublicAPI } from "@/services/publicApi"
import { setCart, updateQuantity, removeItem, clearCart } from "@/store/cartSlice"
import { addToWishlist, removeFromWishlist } from "@/store/wishlistSlice"
import { showSuccess, showError, showConfirm } from "@/utils/sweetalert"
import { getImageUrl } from "@/utils/imageHelper"
import Cookies from "js-cookie"

export default function Cart() {
    const dispatch = useDispatch()
    const router = useRouter()
    const reduxItems = useSelector(state => state.cart.items)
    const wishlistItems = useSelector(state => state.wishlist.items)
    const [items, setItems] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [recommendedProducts, setRecommendedProducts] = useState([])
    const [isUpdating, setIsUpdating] = useState(false)
    const [addingToCart, setAddingToCart] = useState(null)

    useEffect(() => {
        fetchCart()
        fetchRecommendedProducts()
    }, [])

    const fetchCart = async () => {
        setIsLoading(true)
        try {
            const response = await API.getCart()
            const cartData = response.data

            if (cartData.items && cartData.items.length > 0) {
                const formattedItems = await Promise.all(cartData.items.map(async (item) => {
                    let imageUrl = null
                    try {
                        const productResponse = await PublicAPI.getProduct(item.product_id)
                        const product = productResponse.data
                        if (product.images && product.images.length > 0) {
                            imageUrl = product.images[0].path
                        }
                    } catch (error) {
                        console.error(`Error fetching product ${item.product_id}:`, error)
                    }

                    return {
                        id: item.product_id,
                        product_id: item.product_id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        subtotal: item.subtotal,
                        image: imageUrl
                    }
                }))
                setItems(formattedItems)
                dispatch(setCart(formattedItems))
            } else {
                setItems([])
            }
        } catch (error) {
            console.error("Error fetching cart:", error)
            setItems([])
        } finally {
            setIsLoading(false)
        }
    }

    const fetchRecommendedProducts = async () => {
        try {
            const response = await PublicAPI.getProducts({ page: 1, per_page: 8 })
            let products = []
            if (response.data.data) {
                products = response.data.data
            } else if (Array.isArray(response.data)) {
                products = response.data
            }
            // Filter out products that are already in cart
            const filteredProducts = products.filter(product =>
                !items.some(cartItem => cartItem.product_id === product.id)
            )
            setRecommendedProducts(filteredProducts.slice(0, 4))
        } catch (error) {
            console.error("Error fetching recommendations:", error)
        }
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
            // Refresh cart
            await fetchCart()
            // Refresh recommendations
            await fetchRecommendedProducts()
        } catch (error) {
            console.error("Error adding to cart:", error)
            showError('Error', error.response?.data?.message || 'Failed to add to cart')
        } finally {
            setAddingToCart(null)
        }
    }

    const handleUpdateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return

        setIsUpdating(true)
        try {
            await API.updateCartItem(productId, newQuantity)
            dispatch(updateQuantity({ productId, quantity: newQuantity }))
            await fetchCart()
            showSuccess('Updated', 'Quantity updated successfully')
        } catch (error) {
            console.error("Error updating quantity:", error)
            showError('Error', error.response?.data?.message || "Failed to update quantity")
        } finally {
            setIsUpdating(false)
        }
    }

    const handleRemoveItem = async (productId, productName) => {
        const result = await showConfirm('Remove Item', `Remove ${productName} from cart?`)
        if (result.isConfirmed) {
            try {
                await API.removeFromCart(productId)
                dispatch(removeItem(productId))
                await fetchCart()
                await fetchRecommendedProducts()
                showSuccess('Removed', `${productName} removed from cart`)
            } catch (error) {
                console.error("Error removing item:", error)
                showError('Error', "Failed to remove item")
            }
        }
    }

    const handleClearCart = async () => {
        const result = await showConfirm('Clear Cart', 'Are you sure you want to clear your entire cart?')
        if (result.isConfirmed) {
            try {
                await API.clearCart()
                dispatch(clearCart())
                setItems([])
                showSuccess('Cleared', 'Cart cleared successfully')
                await fetchRecommendedProducts()
            } catch (error) {
                console.error("Error clearing cart:", error)
                showError('Error', "Failed to clear cart")
            }
        }
    }

    const handleAddToWishlist = (product) => {
        try {
            const wishlistItem = {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images?.[0]?.path || '/placeholder.jpg'
            }

            const isInWishlist = wishlistItems.some(item => item.id === product.id)
            if (isInWishlist) {
                dispatch(removeFromWishlist(product.id))
                showSuccess('Removed', `${product.name} removed from wishlist`)
            } else {
                dispatch(addToWishlist(wishlistItem))
                showSuccess('Added', `${product.name} added to wishlist`)
            }
        } catch (error) {
            console.error("Error updating wishlist:", error)
            showError('Error', 'Failed to update wishlist')
        }
    }

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item.id === productId)
    }

    const handleCheckout = () => {
        router.push('/checkout')
    }

    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0)

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-10">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Shopping Cart</h1>

            {items.length === 0 ? (
                <div className="text-center py-20">
                    <FiShoppingBag className="h-24 w-24 mx-auto text-gray-400 mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
                    <Link href="/products" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden">
                            <div className="divide-y divide-gray-200 dark:divide-gray-800">
                                <AnimatePresence mode="popLayout">
                                    {items.map((item) => {
                                        const imageUrl = item.image ? getImageUrl(item.image) : null
                                        return (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                <div className="flex gap-4">
                                                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                                                        {imageUrl ? (
                                                            <img
                                                                src={imageUrl}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none'
                                                                    if (e.target.nextSibling) {
                                                                        e.target.nextSibling.style.display = 'flex'
                                                                    }
                                                                }}
                                                            />
                                                        ) : null}
                                                        <span className={`text-white text-xs ${imageUrl ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
                                                            No Image
                                                        </span>
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                                                                <p className="text-sm text-gray-500 mt-1">TSh {item.price.toLocaleString()}</p>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleAddToWishlist({ id: item.id, name: item.name, price: item.price })}
                                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                                    title="Add to wishlist"
                                                                >
                                                                    {isInWishlist(item.id) ? <FaHeart className="h-5 w-5 text-red-500" /> : <FiHeart className="h-5 w-5" />}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRemoveItem(item.product_id || item.id, item.name)}
                                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                                    title="Remove item"
                                                                >
                                                                    <FiTrash2 className="h-5 w-5" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3 mt-3">
                                                            <button
                                                                onClick={() => handleUpdateQuantity(item.product_id || item.id, item.quantity - 1)}
                                                                disabled={isUpdating}
                                                                className="p-1 rounded-lg border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 disabled:opacity-50"
                                                            >
                                                                <FiMinus className="h-4 w-4" />
                                                            </button>
                                                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                                                            <button
                                                                onClick={() => handleUpdateQuantity(item.product_id || item.id, item.quantity + 1)}
                                                                disabled={isUpdating}
                                                                className="p-1 rounded-lg border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 disabled:opacity-50"
                                                            >
                                                                <FiPlus className="h-4 w-4" />
                                                            </button>
                                                            {isUpdating && <FiLoader className="h-4 w-4 animate-spin text-blue-500" />}
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <p className="font-semibold text-gray-900 dark:text-white">
                                                            TSh {(item.price * item.quantity).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </AnimatePresence>
                            </div>

                            <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-between">
                                <button onClick={handleClearCart} className="text-red-500 hover:text-red-700 text-sm font-medium">Clear Cart</button>
                                <Link href="/products">
                                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                        Continue Shopping →
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 sticky top-20">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Subtotal</span>
                                    <span>TSh {totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Shipping</span>
                                    <span>Calculated at checkout</span>
                                </div>
                                <div className="border-t pt-3 mt-3">
                                    <div className="flex justify-between text-gray-900 dark:text-white font-semibold text-lg">
                                        <span>Total</span>
                                        <span>TSh {totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Recommended Products Section - Click to Add to Cart */}
            {recommendedProducts.length > 0 && items.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">You May Also Like</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recommendedProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -5 }}
                                className={`bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-xl transition-all overflow-hidden cursor-pointer ${addingToCart === product.id ? 'opacity-50 pointer-events-none' : ''
                                    }`}
                                onClick={() => addToCartAndRedirect(product)}
                            >
                                {addingToCart === product.id && (
                                    <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center rounded-xl">
                                        <div className="bg-white rounded-lg p-3 flex items-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span className="text-sm font-semibold">Adding...</span>
                                        </div>
                                    </div>
                                )}
                                <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center overflow-hidden">
                                    {product.images?.[0] ? (
                                        <img
                                            src={getImageUrl(product.images[0].path)}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <span className="text-white text-sm">Product</span>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 min-h-[48px]">
                                        {product.name}
                                    </h3>
                                    <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-2">
                                        TSh {product.price?.toLocaleString()}
                                    </p>
                                    <div className="mt-3 flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                addToCartAndRedirect(product)
                                            }}
                                            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <FiShoppingCart className="h-4 w-4" />
                                            Add to Cart
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleAddToWishlist(product)
                                            }}
                                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            {isInWishlist(product.id) ? (
                                                <FaHeart className="h-4 w-4 text-red-500" />
                                            ) : (
                                                <FiHeart className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}