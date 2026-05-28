"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { HiOutlineArrowLeft, HiOutlinePackage, HiOutlineClock, HiOutlineCheckCircle, HiOutlineTruck, HiOutlineXCircle } from "react-icons/hi"
import { API } from "@/services/api"
import Cookies from "js-cookie"

export default function OrderDetailPage() {
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
            if (error.response?.status === 403 || error.response?.status === 404) {
                router.push('/orders')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            case 'paid': return 'bg-green-100 text-green-800'
            // case 'shipped': return 'bg-blue-100 text-blue-800'
            case 'completed': return 'bg-green-100 text-green-800'
            case 'cancelled': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
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

    if (!order) return null

    return (
        <div className="container mx-auto px-4 py-10">
            <Link href="/orders" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
                <HiOutlineArrowLeft className="h-4 w-4" />
                Back to Orders
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Order Details</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Order Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Status */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-4">Order Status</h2>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            <span className="capitalize">{order.status}</span>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {order.items?.map((item, index) => (
                                <motion.div
                                    key={item.product_id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex justify-between items-center py-3 border-b last:border-0"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        TSh {item.total?.toLocaleString()}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div>
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 sticky top-20">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span>TSh {order.subtotal?.toLocaleString()}</span>
                            </div>
                            {/* <div className="flex justify-between">
                                <span className="text-gray-600">Tax (18%)</span>
                                <span>TSh {order.tax?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span>{order.shipping === 0 ? 'Free' : `TSh ${order.shipping?.toLocaleString()}`}</span>
                            </div> */}
                            {/* <div className="border-t pt-3 mt-3">
                                <div className="flex justify-between text-xl font-bold">
                                    <span>Total</span>
                                    <span>TSh {order.grand_total?.toLocaleString()}</span>
                                </div>
                            </div> */}
                        </div>

                        <div className="mt-6 pt-6 border-t">
                            <p className="text-sm text-gray-500">Order Date</p>
                            <p className="font-medium">
                                {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}