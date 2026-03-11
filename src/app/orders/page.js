"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
    HiOutlineShoppingBag,
    HiOutlineClock,
    HiOutlineTruck,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineEye,
    HiOutlineRefresh,
    HiOutlineSearch
} from "react-icons/hi"
// import OrdersSkeleton from "@/components/skeletons/OrdersSkeleton"

export default function OrdersPage() {
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setOrders([
                {
                    id: "#12345",
                    date: "2024-01-15",
                    total: 149.99,
                    status: "delivered",
                    items: [
                        { name: "Product 1", quantity: 2, price: 49.99, image: "/product1.jpg" },
                        { name: "Product 2", quantity: 1, price: 49.99, image: "/product2.jpg" }
                    ],
                    tracking: "TRK123456789"
                },
                {
                    id: "#12346",
                    date: "2024-01-10",
                    total: 79.99,
                    status: "shipped",
                    items: [
                        { name: "Product 3", quantity: 1, price: 79.99, image: "/product3.jpg" }
                    ],
                    tracking: "TRK987654321"
                },
                {
                    id: "#12347",
                    date: "2024-01-05",
                    total: 299.99,
                    status: "processing",
                    items: [
                        { name: "Product 4", quantity: 1, price: 299.99, image: "/product4.jpg" }
                    ],
                    tracking: null
                },
                {
                    id: "#12348",
                    date: "2023-12-28",
                    total: 89.99,
                    status: "cancelled",
                    items: [
                        { name: "Product 5", quantity: 1, price: 89.99, image: "/product5.jpg" }
                    ],
                    tracking: null
                }
            ])
            setIsLoading(false)
        }, 2000)
    }, [])

    const statuses = ["all", "processing", "shipped", "delivered", "cancelled"]

    const statusColors = {
        processing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500",
        shipped: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500",
        delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
        cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500"
    }

    const statusIcons = {
        processing: HiOutlineClock,
        shipped: HiOutlineTruck,
        delivered: HiOutlineCheckCircle,
        cancelled: HiOutlineXCircle
    }

    const filteredOrders = orders.filter(order => {
        const matchesStatus = selectedStatus === "all" || order.status === selectedStatus
        const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
        return matchesStatus && matchesSearch
    })

    // if (isLoading) {
    //     return <OrdersSkeleton />
    // }

    return (
        <div className="space-y-8 pb-16">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">My Orders</h1>
                <p className="text-white/90">View and track your order history</p>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    {/* Search */}
                    <div className="relative flex-1">
                        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search orders by ID or product..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {statuses.map((status) => (
                            <button
                                key={status}
                                onClick={() => setSelectedStatus(status)}
                                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${selectedStatus === status
                                        ? "bg-purple-600 text-white"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <AnimatePresence mode="wait">
                {filteredOrders.length > 0 ? (
                    <motion.div
                        key="orders"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                    >
                        {filteredOrders.map((order, index) => {
                            const StatusIcon = statusIcons[order.status]

                            return (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                                >
                                    {/* Order Header */}
                                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    Order {order.id}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusColors[order.status]}`}>
                                                    <StatusIcon className="h-4 w-4" />
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Placed on {new Date(order.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                ${order.total.toFixed(2)}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {order.items.length} item(s)
                                            </p>
                                        </div>
                                    </div>

                                    {/* Order Items Preview */}
                                    <div className="flex gap-4 overflow-x-auto pb-4 mb-4">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex-shrink-0 text-center">
                                                <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                    x{item.quantity}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Actions */}
                                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                                        <Link
                                            href={`/orders/${order.id}`}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <HiOutlineEye className="h-4 w-4" />
                                            View Details
                                        </Link>

                                        {order.tracking && (
                                            <Link
                                                href={`/tracking/${order.tracking}`}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                                            >
                                                <HiOutlineTruck className="h-4 w-4" />
                                                Track Package
                                            </Link>
                                        )}

                                        {order.status === "delivered" && (
                                            <button className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                                                <HiOutlineRefresh className="h-4 w-4" />
                                                Buy Again
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                ) : (
                    <motion.div
                        key="no-orders"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <HiOutlineShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No orders found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {searchQuery || selectedStatus !== "all"
                                ? "Try adjusting your filters"
                                : "You haven't placed any orders yet"}
                        </p>
                        <Link
                            href="/products"
                            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                        >
                            Start Shopping
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}