// components/Navbar.js - Fixed for ALL screen sizes including very small devices
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { useSelector, useDispatch } from "react-redux"
import { HiOutlineShoppingCart, HiOutlineHeart, HiOutlineUser, HiOutlineSearch, HiOutlineSun, HiOutlineMoon, HiMenu, HiX, HiOutlineChevronDown, HiOutlineLogout, HiOutlineClipboardList } from "react-icons/hi"
import Cookies from "js-cookie"
import { API } from "@/services/api"
import { logout } from "@/store/authSlice"
import { clearCart } from "@/store/cartSlice"
import MegaMenu from "./MegaMenu"
import SearchBar from "./SearchBar"

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState(null)
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()
    const pathname = usePathname()
    const router = useRouter()
    const dispatch = useDispatch()
    const cartItems = useSelector((state) => state.cart.items)
    const wishlistItems = useSelector((state) => state.wishlist.items)
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const token = Cookies.get('auth_token')
        const userData = Cookies.get('user')
        setIsAuthenticated(!!token)
        if (userData) {
            setUser(JSON.parse(userData))
        }
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Close mobile menu when route changes
    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    const handleLogout = async () => {
        try {
            await API.logout()
        } catch (error) {
            console.error("Logout error:", error)
        } finally {
            Cookies.remove('auth_token')
            Cookies.remove('user')
            dispatch(logout())
            dispatch(clearCart())
            router.push('/')
            setIsOpen(false)
        }
    }

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/products", label: "Products" },
        { href: "/services2", label: "Services" },
        { href: "/research", label: "Researches" },
        { href: "/deals", label: "Deals" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
    ]

    return (
        <>
            <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg shadow-lg" : "bg-transparent"
                }`}>
                <div className="container mx-auto px-2 sm:px-4 lg:px-8">
                    <div className="flex h-14 sm:h-16 lg:h-20 items-center justify-between">
                        {/* Logo - Hide text on very small screens */}
                        <Link href="/" className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 flex-shrink-0">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 360, transition: { duration: 0.5 } }}
                                className="relative h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 flex-shrink-0"
                            >
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-800 to-purple-50 animate-pulse opacity-20" />
                                <Image src="/math.png" alt="Sci-Math Creation Logo" width={48} height={48} className="rounded-full object-cover ring-2 ring-white dark:ring-gray-800 shadow-xl" priority />
                            </motion.div>
                            {/* Hide text on very small screens, show on sm and above */}
                            <span className="hidden sm:inline-block text-xs sm:text-sm lg:text-2xl font-bold text-gray-900 dark:text-white leading-tight whitespace-nowrap">
                                Sci-Math Creation
                            </span>
                        </Link>

                        {/* Desktop Navigation - Hidden on all mobile/tablet */}
                        <div className="hidden lg:flex lg:items-center lg:space-x-6 xl:space-x-8">
                            {navLinks.map((link) => (
                                <Link key={link.href} href={link.href} className={`relative text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap ${pathname === link.href ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
                                    }`}>
                                    {link.label}
                                    {pathname === link.href && (
                                        <motion.div layoutId="navbar-indicator" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" initial={false} transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Right Icons - Always visible but hide some on very small screens */}
                        <div className="flex items-center space-x-0.5 sm:space-x-1 lg:space-x-3 xl:space-x-4">
                            {/* Search Toggle - Always visible */}
                            <button
                                onClick={() => setShowSearch(!showSearch)}
                                className="rounded-full p-1 sm:p-1.5 lg:p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                                aria-label="Search"
                            >
                                <HiOutlineSearch className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                            </button>

                            {/* Theme Toggle - Hide on very small screens, show on sm and above */}
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="rounded-full p-1 sm:p-1.5 lg:p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors hidden sm:inline-flex"
                                aria-label="Toggle theme"
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.div key={theme} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.2 }}>
                                        {theme === "dark" ? <HiOutlineSun className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" /> : <HiOutlineMoon className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />}
                                    </motion.div>
                                </AnimatePresence>
                            </button>

                            {/* Wishlist - Always visible with smaller icon on very small screens */}
                            <Link href="/wishlist" className="relative rounded-full p-1 sm:p-1.5 lg:p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">
                                <HiOutlineHeart className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                                {mounted && wishlistItems.length > 0 && (
                                    <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-4 lg:w-4 items-center justify-center rounded-full bg-red-500 text-[6px] sm:text-[8px] lg:text-xs text-white">
                                        {wishlistItems.length}
                                    </span>
                                )}
                            </Link>

                            {/* Cart - Always visible with smaller icon on very small screens */}
                            <Link href="/cart" className="relative rounded-full p-1 sm:p-1.5 lg:p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">
                                <HiOutlineShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                                {mounted && cartCount > 0 && (
                                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-4 lg:w-4 items-center justify-center rounded-full bg-blue-600 text-[6px] sm:text-[8px] lg:text-xs text-white">
                                        {cartCount}
                                    </motion.span>
                                )}
                            </Link>

                            {/* User Menu - Only show on large screens */}
                            {isAuthenticated ? (
                                <div className="relative group hidden lg:block">
                                    <button className="flex items-center gap-2 rounded-full p-1.5 sm:p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">
                                        <HiOutlineUser className="h-4 w-4 sm:h-5 sm:w-5" />
                                        <span className="text-sm font-medium hidden xl:inline">{user?.name?.split(' ')[0]}</span>
                                        <HiOutlineChevronDown className="h-4 w-4 hidden xl:block" />
                                    </button>
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        <Link href="/orders" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-t-lg">
                                            <HiOutlineClipboardList className="h-5 w-5" />
                                            My Orders
                                        </Link>
                                        <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <HiOutlineHeart className="h-5 w-5" />
                                            Wishlist
                                        </Link>
                                        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-b-lg w-full">
                                            <HiOutlineLogout className="h-5 w-5" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link href="/login" className="rounded-full p-1 sm:p-1.5 lg:p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors hidden lg:block">
                                    <HiOutlineUser className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                                </Link>
                            )}

                            {/* HAMBURGER MENU BUTTON - ALWAYS VISIBLE ON ALL SCREENS */}
                            {/* Using inline styles to ensure visibility */}
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="inline-flex items-center justify-center rounded-full p-1 sm:p-1.5 lg:p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors lg:hidden"
                                aria-label="Toggle navigation menu"
                                style={{
                                    minWidth: '28px',
                                    minHeight: '28px',
                                    display: 'inline-flex'
                                }}
                            >
                                {isOpen ? <HiX className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" /> : <HiMenu className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />}
                            </button>
                        </div>
                    </div>
                    <MegaMenu />
                </div>
            </nav>

            {/* Search Overlay */}
            <AnimatePresence>
                {showSearch && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-x-0 top-14 sm:top-16 lg:top-20 z-40 bg-white/95 backdrop-blur-lg dark:bg-gray-950/95 shadow-lg">
                        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4 lg:py-6">
                            <SearchBar onClose={() => setShowSearch(false)} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MOBILE MENU - Hamburger menu for ALL screens smaller than LG */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                        />

                        {/* Slide-in Menu - Full width on very small screens */}
                        <motion.div
                            initial={{ opacity: 0, x: "100%" }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: "100%" }}
                            transition={{ type: "tween", duration: 0.3 }}
                            className="fixed inset-y-0 right-0 z-40 w-[260px] sm:w-72 md:w-80 bg-white dark:bg-gray-900 shadow-2xl lg:hidden overflow-y-auto"
                        >
                            <div className="flex h-full flex-col">
                                {/* Mobile Header with user info */}
                                <div className="p-3 sm:p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
                                    {isAuthenticated ? (
                                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                                            <div className="h-8 w-8 sm:h-10 sm:w-10 md:h-14 md:w-14 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                                                <span className="text-sm sm:text-base md:text-xl font-semibold text-blue-600 dark:text-blue-400">
                                                    {user?.name?.charAt(0) || 'U'}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 dark:text-white truncate text-xs sm:text-sm md:text-base">{user?.name}</p>
                                                <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            href="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-xs sm:text-sm md:text-base"
                                        >
                                            <HiOutlineUser className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                                            <span className="font-medium">Sign In / Register</span>
                                        </Link>
                                    )}
                                </div>

                                {/* Navigation Links */}
                                <div className="flex-1 px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 space-y-0.5">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg text-xs sm:text-sm md:text-base font-medium transition-colors ${pathname === link.href
                                                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                }`}
                                        >
                                            {link.label}
                                            {pathname === link.href && (
                                                <span className="ml-auto">
                                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </span>
                                            )}
                                        </Link>
                                    ))}
                                </div>

                                {/* Bottom Actions */}
                                <div className="border-t border-gray-200 dark:border-gray-700 p-2 sm:p-3 md:p-4 space-y-1 sm:space-y-1.5 md:space-y-2">
                                    {isAuthenticated && (
                                        <>
                                            <Link
                                                href="/orders"
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-xs sm:text-sm md:text-base"
                                            >
                                                <HiOutlineClipboardList className="h-4 w-4 sm:h-5 sm:w-5" />
                                                <span className="font-medium">My Orders</span>
                                            </Link>
                                            <Link
                                                href="/wishlist"
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-xs sm:text-sm md:text-base"
                                            >
                                                <HiOutlineHeart className="h-4 w-4 sm:h-5 sm:w-5" />
                                                <span className="font-medium">Wishlist</span>
                                                {wishlistItems.length > 0 && (
                                                    <span className="ml-auto bg-red-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                                                        {wishlistItems.length}
                                                    </span>
                                                )}
                                            </Link>
                                        </>
                                    )}

                                    {isAuthenticated ? (
                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-2 sm:gap-3 px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-xs sm:text-sm md:text-base"
                                        >
                                            <HiOutlineLogout className="h-4 w-4 sm:h-5 sm:w-5" />
                                            <span className="font-medium">Logout</span>
                                        </button>
                                    ) : (
                                        <div className="flex flex-col gap-1 sm:gap-2">
                                            <Link
                                                href="/register"
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium text-xs sm:text-sm md:text-base"
                                            >
                                                Create Account
                                            </Link>
                                        </div>
                                    )}

                                    {/* Theme toggle in mobile menu */}
                                    <button
                                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                        className="flex w-full items-center gap-2 sm:gap-3 px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-xs sm:text-sm md:text-base"
                                    >
                                        {theme === "dark" ? <HiOutlineSun className="h-4 w-4 sm:h-5 sm:w-5" /> : <HiOutlineMoon className="h-4 w-4 sm:h-5 sm:w-5" />}
                                        <span className="font-medium">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}