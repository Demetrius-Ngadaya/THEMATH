// app/logout/page.js
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { API } from "@/services/api"
import Cookies from "js-cookie"
import { logout } from "@/store/authSlice"
import { clearCart } from "@/store/cartSlice"
import { clearWishlist } from "@/store/wishlistSlice"

export default function LogoutPage() {
    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
        const performLogout = async () => {
            try {
                // Call logout API
                await API.logout()
            } catch (error) {
                console.error("Logout API error:", error)
            } finally {
                // Clear all cookies
                Cookies.remove('auth_token')
                Cookies.remove('user')

                // Clear Redux state
                dispatch(logout())
                dispatch(clearCart())
                dispatch(clearWishlist())

                // Clear localStorage items
                localStorage.removeItem('wishlist')
                localStorage.removeItem('redirectAfterLogin')
                localStorage.removeItem('intendedAction')

                // Redirect to home page after 2 seconds
                setTimeout(() => {
                    router.push('/')
                }, 2000)
            }
        }

        performLogout()
    }, [router, dispatch])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
                <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    Logging out...
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                    You are being redirected to the home page.
                </p>
                <div className="mt-4">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                </div>
            </div>
        </div>
    )
}