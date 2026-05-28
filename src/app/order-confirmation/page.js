// app/order-confirmation/[id]/page.js
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { HiOutlineCheckCircle, HiOutlinePackage, HiOutlineClock, HiOutlineTruck } from "react-icons/hi"
import { API } from "@/services/api"
import Cookies from "js-cookie"

export default function OrderConfirmationPage() {
    const { id } = useParams()
    const router = useRouter()
    const [order, setOrder] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const token = Cookies.get('auth_token')
        if (!token) {
            router.push('/login')
            return
        }
        fetchOrder()
    }, [id])

    const fetchOrder = async () => {
        try {
            const response = await API.getOrder(id)
            setOrder(response.data)
        } catch (error) {
            console.error("Error fetching order:", error)
            router.push('/products')
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="animate-pulse">Loading...</div>
            </div>
        )
    }

    if (!order) return null

    return (
        <div className="container mx-auto px-4 py-20">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto text-center"
            >
                {/* Success Icon */}
                <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                        <HiOutlineCheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Order Confirmed!
                </h1>
                <p className="text-gray-500 mb-4">
                    Thank you for your purchase. Your order has been received.
                </p>
                <p className="text-sm text-gray-400 mb-8">
                    Order #{order.id}
                </p>

                {/* Order Summary */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 text-left mb-8">
                    <h2 className="font-semibold mb-4">Order Summary</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Order Status:</span>
                            <span className="capitalize font-medium text-green-600">{order.status}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Total Amount:</span>
                            <span className="font-bold text-gray-900 dark:text-white">
                                TSh {order.grand_total?.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Payment Method:</span>
                            <span className="font-medium">Cash on Delivery</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-600">Order Date:</span>
                            <span>{new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {/* Order Items Preview */}
                {order.items && order.items.length > 0 && (
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 text-left mb-8">
                        <h2 className="font-semibold mb-4">Items Ordered</h2>
                        <div className="space-y-3">
                            {order.items.map((item) => (
                                <div key={item.product_id} className="flex justify-between py-2 border-b last:border-0">
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold">TSh {item.total?.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                    <Link href="/orders">
                        <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                            View My Orders
                        </button>
                    </Link>
                    <Link href="/products">
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Continue Shopping
                        </button>
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}