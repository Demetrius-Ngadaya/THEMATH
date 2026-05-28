// app/orders/page.js
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    HiOutlineClock,
    HiOutlineCheckCircle,
    HiOutlineTruck,
    HiOutlineXCircle,
    HiOutlineShoppingBag
} from "react-icons/hi"
import { API } from "@/services/api"
import Cookies from "js-cookie"

export default function OrdersPage() {
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const token = Cookies.get('auth_token')
        if (!token) {
            router.push('/login')
            return
        }
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const response = await API.getOrders()
            setOrders(response.data)
        } catch (error) {
            console.error("Error fetching orders:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <HiOutlineClock className="h-5 w-5 text-yellow-500" />
            case 'paid': return <HiOutlineCheckCircle className="h-5 w-5 text-green-500" />
            // case 'shipped': return <HiOutlineTruck className="h-5 w-5 text-blue-500" />
            case 'completed': return <HiOutlineCheckCircle className="h-5 w-5 text-green-600" />
            case 'cancelled': return <HiOutlineXCircle className="h-5 w-5 text-red-500" />
            default: return <HiOutlineShoppingBag className="h-5 w-5 text-gray-500" />
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
            case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            // case 'shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
        }
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-10">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <HiOutlineShoppingBag className="h-24 w-24 mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">No orders yet</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't placed any orders yet.</p>
                <Link
                    href="/products"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Start Shopping
                </Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Orders</h1>

            <div className="space-y-6">
                {orders.map((order, index) => (
                    <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Order #{order.id}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                                    </p>
                                </div>
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    <span className="capitalize">{order.status}</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-gray-600 dark:text-gray-400">Total Amount</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            TSh {order.grand_total?.toLocaleString()}
                                        </p>
                                    </div>
                                    <Link href={`/orders/${order.id}`}>
                                        <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">
                                            View Details
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}