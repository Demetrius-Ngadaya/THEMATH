"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import Cookies from "js-cookie"
import {
    FiHome, FiPackage, FiFileText, FiShoppingBag, FiUsers, FiTag, FiLogOut,
    FiBarChart2, FiMenu, FiChevronLeft, FiChevronRight,
    FiBell, FiSettings, FiHelpCircle, FiSearch,
    FiUser, FiMail, FiPhone,
    FiUserCheck, FiImage, FiSun, FiMoon
} from "react-icons/fi"
import {
    Avatar,
    Badge,
    Tooltip,
    Spinner,
    Divider,
    Input,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button
} from "@nextui-org/react"
import { motion, AnimatePresence } from "framer-motion"

export default function AdminLayout({ children }) {
    const router = useRouter()
    const pathname = usePathname()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [adminUser, setAdminUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [notifications, setNotifications] = useState([
        { id: 1, title: "New order received", time: "5 min ago", read: false },
        { id: 2, title: "Product out of stock", time: "1 hour ago", read: false },
        { id: 3, title: "Payment received", time: "2 hours ago", read: true },
    ])

    // Check if current path is login page
    const isLoginPage = pathname === '/admin/login'

    useEffect(() => {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('admin-theme')
        if (savedTheme === 'dark') {
            setIsDarkMode(true)
            document.documentElement.classList.add('dark')
        }
    }, [])

    useEffect(() => {
        // Skip auth check for login page
        if (isLoginPage) {
            setIsLoading(false)
            return
        }

        const token = Cookies.get('admin_token')
        const user = Cookies.get('admin_user')

        if (!token) {
            router.push('/admin/login')
            return
        }

        if (user) {
            setAdminUser(JSON.parse(user))
        }

        setIsLoading(false)

        // Handle window resize
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileOpen(false)
            }
        }

        window.addEventListener('resize', handleResize)

        // Prevent body scroll when mobile sidebar is open
        if (isMobileOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            window.removeEventListener('resize', handleResize)
            document.body.style.overflow = 'unset'
        }
    }, [router, isMobileOpen, isLoginPage])

    const handleLogout = () => {
        Cookies.remove('admin_token')
        Cookies.remove('admin_user')
        router.push('/admin/login')
    }

    const toggleSidebar = () => {
        if (window.innerWidth < 1024) {
            setIsMobileOpen(!isMobileOpen)
        } else {
            setIsSidebarOpen(!isSidebarOpen)
        }
    }

    const closeMobileSidebar = () => {
        setIsMobileOpen(false)
    }

    const toggleTheme = () => {
        const newMode = !isDarkMode
        setIsDarkMode(newMode)
        if (newMode) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('admin-theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('admin-theme', 'light')
        }
    }

    const markNotificationAsRead = (id) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        )
    }

    // Navigation items without descriptions
    const navItems = [
        { href: "/admin/dashboard", label: "Dashboard", icon: FiHome, color: "blue" },
        { href: "/admin/about-hero-sliders", label: "About Hero Sliders", icon: FiImage, color: "indigo" },
        { href: "/admin/about-content", label: "About Content", icon: FiFileText, color: "purple" },
        { href: "/admin/about-services", label: "About Services", icon: FiFileText, color: "green" },
        { href: "/admin/stem-products", label: "STEM Products", icon: FiPackage, color: "orange" },
        { href: "/admin/orders", label: "Orders", icon: FiShoppingBag, color: "purple" },
        { href: "/admin/products", label: "Products", icon: FiPackage, color: "green" },
        { href: "/admin/services", label: "Services", icon: FiFileText, color: "indigo" },
        { href: "/admin/research", label: "Research", icon: FiFileText, color: "indigo" },
        { href: "/admin/users", label: "Users", icon: FiUsers, color: "orange" },
        { href: "/admin/team-members", label: "Team Members", icon: FiUserCheck, color: "pink" },
        { href: "/admin/hero-sliders", label: "Hero Sliders", icon: FiImage, color: "yellow" },
        { href: "/admin/categories", label: "Categories", icon: FiTag, color: "pink" },
        { href: "/admin/reports", label: "Reports", icon: FiBarChart2, color: "red" },
    ]

    const unreadCount = notifications.filter(n => !n.read).length

    // If it's login page, render only children without layout
    if (isLoginPage) {
        return <>{children}</>
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <Spinner size="lg" color="primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeMobileSidebar}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: window.innerWidth < 1024
                        ? (isMobileOpen ? 280 : 0)
                        : (isSidebarOpen ? 280 : 80)
                }}
                className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-hidden transition-all duration-300 ease-in-out`}
                style={{ width: window.innerWidth < 1024 ? (isMobileOpen ? 280 : 0) : (isSidebarOpen ? 280 : 80) }}
            >
                <div className="flex flex-col h-full">
                    {/* Logo Area - Using Company Logo */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                        <AnimatePresence mode="wait">
                            {(window.innerWidth >= 1024 ? isSidebarOpen : isMobileOpen) && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-10 h-10 relative">
                                        <Image
                                            src="/math.png"
                                            alt="Company Logo"
                                            width={40}
                                            height={40}
                                            className="rounded-xl object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h1 className="font-bold text-gray-800 dark:text-white text-lg">Admin Panel</h1>
                                        {/* <p className="text-xs text-gray-500 dark:text-gray-400">Management System</p> */}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden lg:block"
                        >
                            {isSidebarOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
                        </button>
                    </div>

                    {/* Navigation Items - No Descriptions */}
                    <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
                        <div className="px-3 space-y-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href
                                const Icon = item.icon

                                return (
                                    <Link key={item.href} href={item.href} onClick={closeMobileSidebar}>
                                        <motion.div
                                            whileHover={{ x: 5 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`relative group mb-1`}
                                        >
                                            <div className={`
                                                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                                                ${isActive
                                                    ? `bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 text-white shadow-md`
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }
                                            `}>
                                                <Icon size={20} className={isActive ? 'text-white' : ''} />
                                                <AnimatePresence mode="wait">
                                                    {(window.innerWidth >= 1024 ? isSidebarOpen : isMobileOpen) && (
                                                        <motion.span
                                                            initial={{ opacity: 0, width: 0 }}
                                                            animate={{ opacity: 1, width: 'auto' }}
                                                            exit={{ opacity: 0, width: 0 }}
                                                            className="font-medium whitespace-nowrap"
                                                        >
                                                            {item.label}
                                                        </motion.span>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            {/* Tooltip for collapsed state */}
                                            {!isSidebarOpen && window.innerWidth >= 1024 && (
                                                <div className="fixed left-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                                    <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap ml-2 shadow-lg">
                                                        {item.label}
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    {/* Bottom Section - Removed Settings and Help */}
                    <div className="border-t border-gray-100 dark:border-gray-800 p-4">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 text-red-600"
                        >
                            <FiLogOut size={20} />
                            <AnimatePresence mode="wait">
                                {(window.innerWidth >= 1024 ? isSidebarOpen : isMobileOpen) && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: 0 }}
                                        className="font-medium"
                                    >
                                        Logout
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <div
                className={`transition-all duration-300 ease-in-out min-h-screen`}
                style={{
                    marginLeft: window.innerWidth < 1024
                        ? 0
                        : (isSidebarOpen ? 280 : 80)
                }}
            >
                {/* Independent Admin TopNav */}
                <nav className="sticky top-0 z-30 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            {/* Left section - Mobile menu button & Breadcrumb */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={toggleSidebar}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:hidden"
                                >
                                    <FiMenu size={24} className="text-gray-600 dark:text-gray-400" />
                                </button>

                                {/* Breadcrumb */}
                                <div className="hidden md:block">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Link href="/admin/dashboard" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                                            Home
                                        </Link>
                                        <span className="text-gray-400 dark:text-gray-600">/</span>
                                        <span className="text-gray-900 dark:text-white font-medium">
                                            {navItems.find(item => item.href === pathname)?.label || 'Dashboard'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Center - Search Bar */}
                            <div className="hidden md:block flex-1 max-w-md mx-8">
                                <Input
                                    placeholder="Search orders, products, users..."
                                    startContent={<FiSearch className="text-gray-400" />}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full"
                                    size="sm"
                                    radius="lg"
                                    classNames={{
                                        input: "text-sm",
                                        inputWrapper: "bg-gray-50 dark:bg-gray-800 border-none"
                                    }}
                                />
                            </div>

                            {/* Right section - Actions */}
                            <div className="flex items-center gap-2">
                                {/* Dark/Light Mode Toggle Button */}
                                <Tooltip content={isDarkMode ? "Light Mode" : "Dark Mode"}>
                                    <Button
                                        isIconOnly
                                        variant="light"
                                        onPress={toggleTheme}
                                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        {isDarkMode ? <FiSun size={20} className="text-yellow-500" /> : <FiMoon size={20} className="text-gray-600" />}
                                    </Button>
                                </Tooltip>

                                {/* Notifications */}
                                <Dropdown placement="bottom-end">
                                    <DropdownTrigger>
                                        <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                            <Badge content={unreadCount} color="danger" size="sm" placement="top-right">
                                                <FiBell size={20} className="text-gray-600 dark:text-gray-400" />
                                            </Badge>
                                        </button>
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="Notifications" className="w-80">
                                        <DropdownItem key="header" className="h-12 font-semibold" isReadOnly>
                                            <div className="flex justify-between items-center">
                                                <span>Notifications</span>
                                                <span className="text-xs text-blue-600 cursor-pointer">Mark all as read</span>
                                            </div>
                                        </DropdownItem>
                                        {notifications.map((notif) => (
                                            <DropdownItem
                                                key={notif.id}
                                                className={!notif.read ? "bg-blue-50 dark:bg-blue-900/20" : ""}
                                                onPress={() => markNotificationAsRead(notif.id)}
                                            >
                                                <div>
                                                    <p className="font-medium text-sm">{notif.title}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                                </div>
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>

                                {/* User Menu */}
                                <Dropdown placement="bottom-end">
                                    <DropdownTrigger>
                                        <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                                    {adminUser?.name || 'Admin User'}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {adminUser?.role === 'admin' ? 'Administrator' : 'Staff'}
                                                </p>
                                            </div>
                                            <Avatar
                                                name={adminUser?.name?.charAt(0) || 'A'}
                                                className="bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                                                size="sm"
                                            />
                                        </button>
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="User Menu">
                                        <DropdownItem key="profile" startContent={<FiUser size={16} />}>
                                            Profile
                                        </DropdownItem>
                                        <DropdownItem key="email" startContent={<FiMail size={16} />}>
                                            Messages
                                        </DropdownItem>
                                        <DropdownItem key="phone" startContent={<FiPhone size={16} />}>
                                            Support
                                        </DropdownItem>
                                        <DropdownItem key="logout" color="danger" startContent={<FiLogOut size={16} />} onPress={handleLogout}>
                                            Logout
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Page Content - Full width */}
                <main className="min-h-[calc(100vh-64px)]">
                    {children}
                </main>
            </div>
        </div>
    )
}