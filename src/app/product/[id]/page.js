// app/products/[id]/page.js
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import Image from "next/image"
import Link from "next/link"
import { FiShoppingBag, FiZap, FiHeart } from "react-icons/fi"
import { FaHeart } from "react-icons/fa"
import { PublicAPI } from "@/services/publicApi"
import { API } from "@/services/api"
import { addToCart } from "@/store/cartSlice"
import { addToWishlist, removeFromWishlist } from "@/store/wishlistSlice"  // Fixed import names
import Cookies from "js-cookie"
import { showSuccess, showError } from "@/utils/sweetalert"

export default function ProductPage() {
    const { id } = useParams()
    const router = useRouter()
    const dispatch = useDispatch()
    const wishlistItems = useSelector(state => state.wishlist.items)
    const [product, setProduct] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const [isAddingToCart, setIsAddingToCart] = useState(false)

    useEffect(() => {
        if (id) {
            fetchProduct()
        }
    }, [id])

    const fetchProduct = async () => {
        try {
            const response = await PublicAPI.getProduct(id)
            setProduct(response.data)
        } catch (error) {
            console.error("Error fetching product:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const isInWishlist = () => {
        return wishlistItems.some(item => item.id === parseInt(id))
    }

    andleAddToWishlis
    const handleAddToCart = async () => {
        const token = Cookies.get('auth_token')
        if (!token) {
            localStorage.setItem('redirectAfterLogin', `/products/${id}`)
            router.push('/login')
            return
        }

        setIsAddingToCart(true)
        try {
            await API.addToCart({
                product_id: product.id,
                quantity: quantity
            })
            dispatch(addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity
            }))
            showSuccess('Added to Cart', `${product.name} added to cart!`)
        } catch (error) {
            console.error("Error adding to cart:", error)
            showError('Error', error.response?.data?.message || "Failed to add to cart")
        } finally {
            setIsAddingToCart(false)
        }
    }

    const handleBuyNow = async () => {
        const token = Cookies.get('auth_token')
        if (!token) {
            localStorage.setItem('redirectAfterLogin', `/products/${id}`)
            router.push('/login')
            return
        }

        setIsAddingToCart(true)
        try {
            await API.addToCart({
                product_id: product.id,
                quantity: quantity
            })
            dispatch(addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity
            }))
            router.push('/cart')
        } catch (error) {
            console.error("Error in buy now:", error)
            showError('Error', error.response?.data?.message || "Failed to process")
        } finally {
            setIsAddingToCart(false)
        }
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-10">
                <div className="animate-pulse">
                    <div className="h-96 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold">Product not found</h2>
                <Link href="/products" className="text-blue-600 mt-4 inline-block">
                    Back to Products
                </Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Product Image */}
                <div className="relative aspect-square bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-white">
                        {product.images?.[0] ? (
                            <Image
                                src={`https://backendapi.emcc-lab.com//storage/${product.images[0].path}`}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <span className="text-lg">Product Image</span>
                        )}
                    </div>
                </div>

                {/* Product Info */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {product.name}
                    </h1>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-gray-500">(24 reviews)</span>
                    </div>

                    <p className="text-3xl font-bold text-blue-600 mb-4">
                        TSh {product.price?.toLocaleString()}
                    </p>

                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {product.description || "No description available."}
                    </p>

                    <div className="mb-6">
                        <p className="text-sm text-gray-500 mb-2">Availability:</p>
                        {product.stock > 0 ? (
                            <p className="text-green-600 font-semibold">In Stock ({product.stock} available)</p>
                        ) : (
                            <p className="text-red-600 font-semibold">Out of Stock</p>
                        )}
                    </div>

                    {product.stock > 0 && (
                        <>
                            <div className="flex items-center gap-4 mb-6">
                                <label className="font-medium">Quantity:</label>
                                <div className="flex items-center border rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-3 py-2 border-r hover:bg-gray-100"
                                    >
                                        -
                                    </button>
                                    <span className="px-4 py-2">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="px-3 py-2 border-l hover:bg-gray-100"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isAddingToCart}
                                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <FiShoppingBag className="h-5 w-5" />
                                    {isAddingToCart ? "Adding..." : "Add to Cart"}
                                </button>

                                <button
                                    onClick={handleBuyNow}
                                    disabled={isAddingToCart}
                                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <FiZap className="h-5 w-5" />
                                    Buy Now
                                </button>

                                <button
                                    onClick={handleAddToWishlist}
                                    className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    title={isInWishlist() ? "Remove from wishlist" : "Add to wishlist"}
                                >
                                    {isInWishlist() ? (
                                        <FaHeart className="h-5 w-5 text-red-500" />
                                    ) : (
                                        <FiHeart className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </>
                    )}

                    <Link href="/products">
                        <button className="w-full mt-3 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                            Continue Shopping
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}