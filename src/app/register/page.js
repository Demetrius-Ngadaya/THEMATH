// app/register/page.js
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { API } from "@/services/api"
import Cookies from "js-cookie"
import { useDispatch } from "react-redux"
import { setUser } from "@/store/authSlice"
import { addToCart } from "@/store/cartSlice"
import { FiUser, FiMail, FiLock, FiPhone, FiAlertCircle, FiUserPlus } from "react-icons/fi"
import { motion } from "framer-motion"

export default function Register() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [detailedError, setDetailedError] = useState(null)
    const router = useRouter()
    const dispatch = useDispatch()

    const password = watch("password")

    const submit = async (data) => {
        setIsLoading(true)
        setError(null)
        setDetailedError(null)

        try {
            const formattedData = {
                name: data.name,
                email: data.email,
                phone_number: data.phone_number || null,
                password: data.password,
                password_confirmation: data.password_confirmation,
            }

            const response = await API.register(formattedData)
            const { user, token } = response.data

            Cookies.set('auth_token', token, { expires: 7 })
            Cookies.set('user', JSON.stringify(user), { expires: 7 })

            dispatch(setUser(user))

            // Check for intended product or redirect URL
            const intendedProduct = localStorage.getItem('intendedProduct')
            const redirectUrl = localStorage.getItem('redirectAfterLogin')

            if (intendedProduct) {
                const product = JSON.parse(intendedProduct)
                localStorage.removeItem('intendedProduct')
                localStorage.removeItem('redirectAfterLogin')

                try {
                    await API.addToCart({
                        product_id: product.id,
                        quantity: 1
                    })
                    dispatch(addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: 1
                    }))
                    router.push('/cart')
                } catch (error) {
                    console.error("Error adding intended product:", error)
                    router.push('/cart')
                }
            } else if (redirectUrl) {
                localStorage.removeItem('redirectAfterLogin')
                router.push(redirectUrl)
            } else {
                router.push('/cart')
            }
        } catch (error) {
            console.error("Registration error:", error)

            let errorMessage = "Registration failed. Please try again."
            let errorDetails = null

            if (error.response?.data) {
                if (error.response.data.message) {
                    errorMessage = error.response.data.message
                }
                if (error.response.data.errors) {
                    errorDetails = error.response.data.errors
                    errorMessage = Object.values(errorDetails).flat().join(', ')
                }
            } else if (error.request) {
                errorMessage = "No response from server. Please check if the backend is running."
            } else if (error.message) {
                errorMessage = error.message
            }

            setError(errorMessage)
            setDetailedError(errorDetails)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                            >
                                <FiUserPlus className="w-10 h-10 text-white" />
                            </motion.div>
                            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
                            <p className="text-gray-500 mt-2">Join our community today</p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg"
                            >
                                <div className="flex items-start gap-2 text-red-600">
                                    <FiAlertCircle className="flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{error}</p>
                                        {detailedError && (
                                            <pre className="mt-2 text-xs text-red-700 overflow-auto max-h-32">
                                                {JSON.stringify(detailedError, null, 2)}
                                            </pre>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <form className="space-y-4" onSubmit={handleSubmit(submit)}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiUser className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        {...register("name", { required: "Name is required" })}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Hamis Mrisho "
                                    />
                                </div>
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiMail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number <span className="text-gray-400 text-xs"></span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiPhone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        {...register("phone_number")}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="+225712345678"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: {
                                                value: 6,
                                                message: "Password must be at least 6 characters"
                                            }
                                        })}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="••••••"
                                    />
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        {...register("password_confirmation", {
                                            required: "Please confirm your password",
                                            validate: value => value === password || "Passwords do not match"
                                        })}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="••••••"
                                    />
                                </div>
                                {errors.password_confirmation && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password_confirmation.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        <FiUserPlus className="h-5 w-5" />
                                        Create account
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{" "}
                                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}