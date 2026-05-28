// app/checkout/page.js
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { API } from "@/services/api"
import Cookies from "js-cookie"
import { clearCart } from "@/store/cartSlice"
import { showSuccess, showError, showConfirm } from "@/utils/sweetalert"
import Link from "next/link"
import { FiShoppingBag, FiShield } from "react-icons/fi"

export default function Checkout() {
    const router = useRouter()
    const dispatch = useDispatch()
    const items = useSelector(state => state.cart.items)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const token = Cookies.get('auth_token')
        if (!token) {
            router.push('/login')
            return
        }
        setIsLoading(false)
    }, [])

    const totalAmount = items.reduce((acc, i) => acc + i.price * i.quantity, 0)

    const handlePlaceOrder = async () => {
        const result = await showConfirm('Confirm Order', 'Are you sure you want to place this order?')
        if (!result.isConfirmed) return

        setIsProcessing(true)
        try {
            const response = await API.createOrder()
            await API.clearCart()
            dispatch(clearCart())

            await showSuccess('Order Placed!', `Your order #${response.data.order_id} has been placed successfully!`)
            router.push(`/orders/${response.data.order_id}`)
        } catch (error) {
            console.error("Error placing order:", error)
            showError('Order Failed', error.response?.data?.message || "Failed to place order")
        } finally {
            setIsProcessing(false)
        }
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-10">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <FiShoppingBag className="h-24 w-24 mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-6">Add items to your cart before checking out.</p>
                <Link href="/products" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Browse Products
                </Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <FiShoppingBag className="h-5 w-5" />
                            Order Items
                        </h2>
                        <div className="space-y-3">
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between items-center py-3 border-b last:border-0">
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold">TSh {(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <FiShield className="h-5 w-5" />
                            Payment Method
                        </h2>
                        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="radio" name="payment" checked readOnly className="h-4 w-4 text-blue-600" />
                                <span className="font-medium">Cash on Delivery</span>
                            </label>
                            <p className="text-sm text-gray-500 mt-2 ml-7">Pay when you receive your order</p>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 sticky top-20">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between border-b pb-3">
                                <span className="text-gray-600">Total Amount</span>
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                    TSh {totalAmount.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={isProcessing}
                            className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isProcessing ? "Processing..." : "Place Order"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}