"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { HiOutlineShoppingBag, HiOutlineStar, HiOutlineTruck, HiOutlineShieldCheck } from "react-icons/hi"
import ProductGrid from "@/components/ProductGrid"
import MegaMenu from "@/components/MegaMenu"

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFeaturedProducts([
        { id: 1, name: "Product 1", price: 42000, image: "/product1.jpg", rating: 4.5 },
        { id: 2, name: "Product 2", price: 35000, image: "/product2.jpg", rating: 4.8 },
        { id: 3, name: "Product 3", price: 29000, image: "/product3.jpg", rating: 4.2 },
        { id: 4, name: "Product 4", price: 51000, image: "/product4.jpg", rating: 4.9 },
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  const features = [
    { icon: HiOutlineTruck, title: "Delivery", description: "All regions in Tanzania" },
    { icon: HiOutlineShieldCheck, title: "Secure Payment", description: "100% secure transactions" },
    { icon: HiOutlineStar, title: "Premium Quality", description: "Best products guaranteed" },
    { icon: HiOutlineShoppingBag, title: "Easy Returns", description: "30-day return policy" },
  ]

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 px-6 py-16 sm:px-12 sm:py-24 lg:py-32"
        >
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold tracking-tight text-white sm:text-3xl lg:text-3xl"
            >
              Unique Apparel and Accessories Inspired by Science and the Mathematics
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-xl text-white/90"
            >
              Leverage symbols,formulas, and elements from these disciplines to offer a distinctive bland of style,intellect and creativity.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-10 flex gap-4"
            >
              <Link
                href="/products"
                className="rounded-full bg-white px-8 py-3 text-base font-semibold text-gray-900 shadow-sm hover:bg-gray-100 transition-all hover:scale-105"
              >
                Shop Now
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Animated background elements */}
        {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: Math.random() * 300 + 50,
                height: Math.random() * 300 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div> */}
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="group rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-900 hover:shadow-xl transition-all"
          >
            <div className="mb-4 inline-block rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-900 dark:text-blue-300 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
          </motion.div>
        ))}
      </section>

      {/* Featured Products */}
      <section>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Products</h2>
          <Link
            href="/products"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold flex items-center gap-1 group"
          >
            View All
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        <ProductGrid products={featuredProducts} isLoading={isLoading} />
      </section>

      {/* Categories Grid */}
      <section>
        <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {["Clothes", "Shoes", "Watches", "Sports", "Cups", "Phone cases"].map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group cursor-pointer"
            >
              <div className="mb-3 aspect-square overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-800">
                <div className="h-full w-full bg-gradient-to-br from-blue-400 to-purple-400 opacity-75 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-center font-medium text-gray-900 dark:text-white">{category}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="rounded-3xl bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-900 dark:to-pink-900 p-8 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Stay Updated</h2>
          <p className="mt-4 text-lg text-white/90">
            Subscribe to our newsletter and get 10% off your first purchase
          </p>
          <form className="mt-8 flex flex-col gap-4 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-full px-6 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="rounded-full bg-white px-8 py-3 font-semibold text-gray-900 hover:bg-gray-100 transition-all hover:scale-105"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </section>
    </div>
  )
}
