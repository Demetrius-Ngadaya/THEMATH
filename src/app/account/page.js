"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
    HiOutlineUser,
    HiOutlineShoppingBag,
    HiOutlineHeart,
    HiOutlineLocationMarker,
    HiOutlineCreditCard,
    HiOutlineCog,
    HiOutlineLogout
} from "react-icons/hi"

export default function AccountPage() {
    const [activeTab, setActiveTab] = useState("overview")

    const tabs = [
        { id: "overview", label: "Overview", icon: HiOutlineUser },
        { id: "orders", label: "Orders", icon: HiOutlineShoppingBag },
        { id: "wishlist", label: "Wishlist", icon: HiOutlineHeart },
        { id: "addresses", label: "Addresses", icon: HiOutlineLocationMarker },
        { id: "payment", label: "Payment Methods", icon: HiOutlineCreditCard },
        { id: "settings", label: "Settings", icon: HiOutlineCog },
    ]

    const recentOrders = [
        { id: "#12345", date: "2024-01-15", total: 149.99, status: "Delivered" },
        { id: "#12346", date: "2024-01-10", total: 79.99, status: "Shipped" },
        { id: "#12347", date: "2024-01-05", total: 299.99, status: "Processing" },
    ]

    return (
        <div className="space-y-8 pb-16">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
                <div className="flex items-center gap-6">
                    <div className="relative h-20 w-20 rounded-full overflow-hidden border-4 border-white">
                        <Image
                            src="/avatar.jpg"
                            alt="Profile"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
                        <p className="text-white/90">john.doe@example.com</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto pb-2 gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${activeTab === tab.id
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                    >
                        <tab.icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg"
            >
                {activeTab === "overview" && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Account Overview</h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">3</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Total Orders</div>
                            </div>
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">$529.97</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Total Spent</div>
                            </div>
                            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">5</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Wishlist Items</div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Orders</h3>
                            <div className="space-y-3">
                                {recentOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                    >
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">{order.id}</div>
                                            <div className="text-sm text-gray-500">{order.date}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium text-gray-900 dark:text-white">${order.total}</div>
                                            <div className={`text-sm ${order.status === "Delivered" ? "text-green-600" :
                                                    order.status === "Shipped" ? "text-blue-600" : "text-yellow-600"
                                                }`}>
                                                {order.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "orders" && (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">My Orders</h2>
                        <p className="text-gray-600 dark:text-gray-400">Orders page content...</p>
                    </div>
                )}

                {/* Add other tab contents similarly */}
            </motion.div>

            {/* Logout Button */}
            <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 transition-colors">
                <HiOutlineLogout className="h-5 w-5" />
                <span>Logout</span>
            </button>
        </div>
    )
}