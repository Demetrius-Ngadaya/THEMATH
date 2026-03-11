"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function CountdownTimer({ initialSeconds }) {
    const [timeLeft, setTimeLeft] = useState(initialSeconds)

    useEffect(() => {
        if (timeLeft <= 0) return

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [timeLeft])

    const hours = Math.floor(timeLeft / 3600)
    const minutes = Math.floor((timeLeft % 3600) / 60)
    const seconds = timeLeft % 60

    const formatNumber = (num) => String(num).padStart(2, "0")

    if (timeLeft <= 0) {
        return (
            <div className="text-center text-red-600 dark:text-red-400 font-semibold">
                Deal Expired!
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center gap-2 text-sm">
            <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-1"
            >
                <span className="font-mono font-bold text-gray-900 dark:text-white">
                    {formatNumber(hours)}
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">h</span>
            </motion.div>
            <span className="text-gray-400 dark:text-gray-600">:</span>
            <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-1"
            >
                <span className="font-mono font-bold text-gray-900 dark:text-white">
                    {formatNumber(minutes)}
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">m</span>
            </motion.div>
            <span className="text-gray-400 dark:text-gray-600">:</span>
            <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-1"
            >
                <span className="font-mono font-bold text-gray-900 dark:text-white">
                    {formatNumber(seconds)}
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">s</span>
            </motion.div>
        </div>
    )
}