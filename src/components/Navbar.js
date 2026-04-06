"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { useSelector } from "react-redux"
import {
    HiOutlineShoppingCart,
    HiOutlineHeart,
    HiOutlineUser,
    // HiOutlineSearch,
    HiOutlineSun,
    HiOutlineMoon,
    HiMenu,
    HiX,
    HiOutlineChevronDown
} from "react-icons/hi"
import MegaMenu from "./MegaMenu"
// import SearchBar from "./SearchBar"

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    // const [showSearch, setShowSearch] = useState(false)
    const { theme, setTheme } = useTheme()
    const pathname = usePathname()

    const cartItems = useSelector((state) => state.cart.items)
    const wishlistItems = useSelector((state) => state.wishlist.items)
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/products", label: "Products" },
        { href: "/deals", label: "Deals" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
    ]

    return (
        <>
            <nav
                className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled
                        ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg shadow-lg"
                        : "bg-transparent"
                    }`}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-3">
                            <motion.div
                                whileHover={{
                                    scale: 1.1,
                                    rotate: 360,
                                    transition: { duration: 0.5 }
                                }}
                                className="relative h-12 w-12"
                            >
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-800 to-purple-50 animate-pulse opacity-20" /> {/* Glow effect */}
                                <Image
                                    src="/math.png"
                                    alt="Sci-Math Creation Logo"
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover ring-2 ring-white dark:ring-gray-800 shadow-xl"
                                    priority
                                />
                            </motion.div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                                    Sci-Math Creation
                                </span>
                                {/* <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Your trusted partner
                                </span> */}
                            </div>
                        </Link>
                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex lg:items-center lg:space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${pathname === link.href
                                            ? "text-blue-600 dark:text-blue-400"
                                            : "text-gray-700 dark:text-gray-300"
                                        }`}
                                >
                                    {link.label}
                                    {pathname === link.href && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Right Icons */}
                        <div className="flex items-center space-x-4">
                            {/* Search Toggle */}
                            {/* <button
                                onClick={() => setShowSearch(!showSearch)}
                                className="rounded-full p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                            >
                                <HiOutlineSearch className="h-5 w-5" />
                            </button> */}

                            {/* Theme Toggle */}
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="rounded-full p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.div
                                        key={theme}
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 20, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {theme === "dark" ? (
                                            <HiOutlineSun className="h-5 w-5" />
                                        ) : (
                                            <HiOutlineMoon className="h-5 w-5" />
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </button>

                            {/* Wishlist */}
                            <Link
                                href="/wishlist"
                                className="relative rounded-full p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                            >
                                <HiOutlineHeart className="h-5 w-5" />
                                {wishlistItems.length > 0 && (
                                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                        {wishlistItems.length}
                                    </span>
                                )}
                            </Link>

                            {/* Cart */}
                            <Link
                                href="/cart"
                                className="relative rounded-full p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                            >
                                <HiOutlineShoppingCart className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-xs text-white"
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </Link>

                            {/* User Menu */}
                            <Link
                                href="/login"
                                className="hidden rounded-full p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors sm:block"
                            >
                                <HiOutlineUser className="h-5 w-5" />
                            </Link>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="rounded-full p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors lg:hidden"
                            >
                                {isOpen ? <HiX className="h-5 w-5" /> : <HiMenu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Mega Menu */}
                    <MegaMenu />
                </div>
            </nav>

            {/* Search Overlay */}
            <AnimatePresence>
                {showSearch && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-x-0 top-20 z-40 bg-white/95 backdrop-blur-lg dark:bg-gray-950/95 shadow-lg"
                    >
                        <div className="container mx-auto px-4 py-6">
                            <SearchBar onClose={() => setShowSearch(false)} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "tween" }}
                        className="fixed inset-y-0 right-0 z-40 w-64 bg-white shadow-xl dark:bg-gray-900 lg:hidden"
                    >
                        <div className="flex h-full flex-col p-6">
                            <div className="flex-1 space-y-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`block text-lg font-medium ${pathname === link.href
                                                ? "text-blue-600 dark:text-blue-400"
                                                : "text-gray-700 dark:text-gray-300"
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
                                >
                                    <HiOutlineUser className="h-5 w-5" />
                                    <span>Sign In</span>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
