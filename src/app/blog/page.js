"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { HiOutlineClock, HiOutlineUser, HiOutlineTag } from "react-icons/hi"

export default function BlogPage() {
    const [selectedCategory, setSelectedCategory] = useState("all")

    const categories = ["all", "Shopping Tips", "Product Reviews", "Industry News", "Style Guide", "Technology"]

    const posts = [
        {
            id: 1,
            slug: "10-shopping-tips-for-2024",
            title: "10 Essential Shopping Tips for 2024",
            excerpt: "Discover the best strategies to save money and find the best deals this year.",
            author: "Sarah Johnson",
            date: "2024-01-15",
            readTime: "5 min read",
            category: "Shopping Tips",
            image: "/blog1.jpg",
            featured: true
        },
        {
            id: 2,
            slug: "top-gadgets-review",
            title: "Top 10 Gadgets You Need in 2024",
            excerpt: "We review the most innovative tech products hitting the market this year.",
            author: "Mike Chen",
            date: "2024-01-10",
            readTime: "8 min read",
            category: "Product Reviews",
            image: "/blog2.jpg"
        },
        {
            id: 3,
            slug: "sustainable-fashion",
            title: "The Rise of Sustainable Fashion",
            excerpt: "How eco-friendly clothing is changing the fashion industry.",
            author: "Emma Green",
            date: "2024-01-05",
            readTime: "6 min read",
            category: "Style Guide",
            image: "/blog3.jpg"
        },
        {
            id: 4,
            slug: "ai-in-ecommerce",
            title: "How AI is Transforming E-commerce",
            excerpt: "Exploring the role of artificial intelligence in online shopping.",
            author: "Alex Rivera",
            date: "2024-01-01",
            readTime: "7 min read",
            category: "Technology",
            image: "/blog4.jpg"
        }
    ]

    const featuredPost = posts.find(post => post.featured)
    const recentPosts = posts.filter(post => !post.featured)
    const filteredPosts = selectedCategory === "all"
        ? recentPosts
        : recentPosts.filter(post => post.category === selectedCategory)

    return (
        <div className="space-y-12 pb-16">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-900 dark:to-red-900">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 px-6 py-16 text-center"
                >
                    <h1 className="text-4xl font-bold text-white mb-4">Our Blog</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Insights, tips, and stories from the ShopHub team
                    </p>
                </motion.div>
            </section>

            {/* Featured Post */}
            {featuredPost && (
                <section>
                    <Link href={`/blog/${featuredPost.slug}`}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative h-96 rounded-2xl overflow-hidden group cursor-pointer"
                        >
                            <Image
                                src={featuredPost.image}
                                alt={featuredPost.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <span className="inline-block px-3 py-1 bg-orange-600 text-white text-sm rounded-full mb-4">
                                    Featured
                                </span>
                                <h2 className="text-3xl font-bold text-white mb-2">{featuredPost.title}</h2>
                                <p className="text-white/90 mb-4 max-w-2xl">{featuredPost.excerpt}</p>
                                <div className="flex items-center gap-4 text-white/80 text-sm">
                                    <span className="flex items-center">
                                        <HiOutlineUser className="h-4 w-4 mr-1" />
                                        {featuredPost.author}
                                    </span>
                                    <span className="flex items-center">
                                        <HiOutlineClock className="h-4 w-4 mr-1" />
                                        {featuredPost.readTime}
                                    </span>
                                    <span className="flex items-center">
                                        <HiOutlineTag className="h-4 w-4 mr-1" />
                                        {featuredPost.category}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                </section>
            )}

            {/* Categories */}
            <section>
                <div className="flex flex-wrap gap-2 justify-center">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full transition-all ${selectedCategory === category
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                }`}
                        >
                            {category === "all" ? "All Posts" : category}
                        </button>
                    ))}
                </div>
            </section>

            {/* Blog Grid */}
            <section>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPosts.map((post, index) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group"
                        >
                            <Link href={`/blog/${post.slug}`}>
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        <span className="flex items-center">
                                            <HiOutlineUser className="h-4 w-4 mr-1" />
                                            {post.author}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center">
                                            <HiOutlineClock className="h-4 w-4 mr-1" />
                                            {post.readTime}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-blue-600 font-semibold">Read More →</span>
                                        <span className="text-xs text-gray-500">{post.date}</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.article>
                    ))}
                </div>
            </section>

            {/* Newsletter */}
            <section className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Subscribe to Our Newsletter</h2>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                    Get the latest posts delivered right to your inbox
                </p>
                <form className="max-w-md mx-auto flex gap-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <button className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                        Subscribe
                    </button>
                </form>
            </section>
        </div>
    )
}