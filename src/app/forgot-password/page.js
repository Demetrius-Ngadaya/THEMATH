"use client"

import { useState } from "react"
import Link from "next/link"
import axios from "axios"
import { motion } from "framer-motion"
import { FiMail, FiArrowLeft } from "react-icons/fi"
import { API_BASE_URL } from "@/utils/apiConfig"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError("")
        setMessage("")
        try {
            const response = await axios.post(`${API_BASE_URL}/forgot-password`, { email })
            setMessage(response.data.message)
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8"
            >
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Forgot your password?</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Enter your email and we'll send you a link to reset it.
                </p>

                {message ? (
                    <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-4 rounded-lg text-sm">
                        {message}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {error && <p className="text-sm text-red-600">{error}</p>}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
                        >
                            {isSubmitting ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center">
                    <Link href="/login" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600">
                        <FiArrowLeft className="h-4 w-4" /> Back to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
