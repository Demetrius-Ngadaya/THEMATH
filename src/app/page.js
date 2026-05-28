"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { HiOutlineShoppingBag, HiOutlineStar, HiOutlineTruck, HiOutlineShieldCheck } from "react-icons/hi"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ProductGrid from "@/components/ProductGrid"
import { PublicAPI } from "@/services/publicApi"
import { getImageUrl } from "@/utils/imageHelper"
import axios from "axios"

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [heroSliders, setHeroSliders] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [nextSlide, setNextSlide] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const features = [
    { icon: HiOutlineTruck, title: "Delivery", description: "All regions in Tanzania" },
    { icon: HiOutlineShieldCheck, title: "Secure Payment", description: "100% secure transactions" },
    { icon: HiOutlineStar, title: "Premium Quality", description: "Best products and services guaranteed" },
    { icon: HiOutlineShoppingBag, title: "Easy Returns", description: "30-day return policy" },
  ]

  // Fetch all dynamic data
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true)
      try {
        // Fetch hero sliders
        const slidersResponse = await axios.get('https://backendapi.emcc-lab.com/api/hero-sliders')
        setHeroSliders(slidersResponse.data)

        // Fetch team members
        const teamResponse = await axios.get('https://backendapi.emcc-lab.com/api/team-members')
        setTeamMembers(teamResponse.data)

        // Fetch products
        const productsResponse = await PublicAPI.getProducts({ page: 1 })
        let products = []
        if (productsResponse.data.data) {
          products = productsResponse.data.data
        } else if (Array.isArray(productsResponse.data)) {
          products = productsResponse.data
        }
        setFeaturedProducts(products.slice(0, 8))

        // Fetch categories
        const categoriesResponse = await PublicAPI.getCategories()
        let categoriesData = []
        if (categoriesResponse.data.data) {
          categoriesData = categoriesResponse.data.data
        } else if (Array.isArray(categoriesResponse.data)) {
          categoriesData = categoriesResponse.data
        }
        setCategories(categoriesData)

      } catch (error) {
        console.error("Error fetching data:", error)
        // Set fallback data
        setHeroSliders([])
        setTeamMembers([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllData()
  }, [])

  // Crossfade transition effect for hero slider
  useEffect(() => {
    if (heroSliders.length === 0) return

    const timer = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true)
        const next = (currentSlide + 1) % heroSliders.length
        setNextSlide(next)

        setTimeout(() => {
          setCurrentSlide(next)
          setIsTransitioning(false)
        }, 1000)
      }
    }, 5000)
    return () => clearInterval(timer)
  }, [currentSlide, isTransitioning, heroSliders.length])

  const handlePrevSlide = () => {
    if (isTransitioning || heroSliders.length === 0) return
    setIsTransitioning(true)
    const prev = (currentSlide - 1 + heroSliders.length) % heroSliders.length
    setNextSlide(prev)

    setTimeout(() => {
      setCurrentSlide(prev)
      setIsTransitioning(false)
    }, 1000)
  }

  const handleNextSlide = () => {
    if (isTransitioning || heroSliders.length === 0) return
    setIsTransitioning(true)
    const next = (currentSlide + 1) % heroSliders.length
    setNextSlide(next)

    setTimeout(() => {
      setCurrentSlide(next)
      setIsTransitioning(false)
    }, 1000)
  }

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide || heroSliders.length === 0) return
    setIsTransitioning(true)
    setNextSlide(index)

    setTimeout(() => {
      setCurrentSlide(index)
      setIsTransitioning(false)
    }, 1000)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section with Dynamic Sliders */}
      {heroSliders.length > 0 && (
        <section className="relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative w-full overflow-hidden rounded-3xl shadow-2xl">
              <div className="relative w-full" style={{ aspectRatio: "16/9", maxHeight: "70vh" }}>
                {/* Current Image */}
                <div className="absolute inset-0">
                  <Image
                    src={getImageUrl(heroSliders[currentSlide]?.image)}
                    alt={heroSliders[currentSlide]?.title || "Hero Slide"}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                    style={{ objectPosition: "center 30%" }}
                  />
                </div>

                {/* Transitioning Image */}
                {heroSliders[nextSlide] && (
                  <div
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isTransitioning ? "opacity-100" : "opacity-0 pointer-events-none"
                      }`}
                  >
                    <Image
                      src={getImageUrl(heroSliders[nextSlide].image)}
                      alt={heroSliders[nextSlide].title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                      style={{ objectPosition: "center 30%" }}
                    />
                  </div>
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

                {/* Slide Content */}
                <motion.div
                  key={currentSlide}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12 z-10"
                >
                  <div className="mx-auto max-w-4xl text-center">
                    {/* <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl drop-shadow-lg">
                      {heroSliders[currentSlide]?.title}
                    </h1> */}
                    <p className="mt-2 text-base text-white/90 sm:text-lg lg:text-xl drop-shadow">
                      {heroSliders[currentSlide]?.subtitle}
                    </p>
                    {heroSliders[currentSlide]?.button_text && (
                      <Link
                        href={heroSliders[currentSlide]?.button_link || "/products"}
                        className="mt-6 inline-block rounded-full border border-white/60 bg-transparent px-6 py-2.5 text-sm font-semibold text-white shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/10 sm:px-8 sm:py-3 sm:text-base"
                      >
                        {heroSliders[currentSlide]?.button_text}
                      </Link>
                    )}
                  </div>
                </motion.div>

                {/* Navigation Buttons */}
                <button
                  onClick={handlePrevSlide}
                  disabled={isTransitioning}
                  className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/50 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed sm:left-6 sm:p-3"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
                <button
                  onClick={handleNextSlide}
                  disabled={isTransitioning}
                  className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/50 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed sm:right-6 sm:p-3"
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-6">
                  {heroSliders.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      disabled={isTransitioning}
                      className={`h-2 rounded-full transition-all duration-300 ${currentSlide === index
                          ? "w-8 bg-white sm:w-10"
                          : "w-2 bg-white/50 hover:bg-white/80"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 container mx-auto px-4 sm:px-6 lg:px-8">
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
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Products</h2>
          <Link href="/products" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold flex items-center gap-1 group">
            View All
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        <ProductGrid products={featuredProducts} isLoading={isLoading} />
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <Link key={category.id} href={`/products?category_id=${category.id}`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="group cursor-pointer"
                >
                  <div className="mb-3 aspect-square overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-800">
                    {category.image ? (
                      <img
                        src={getImageUrl(category.image)}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-blue-400 to-purple-400 opacity-75 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                  <h3 className="text-center font-medium text-gray-900 dark:text-white">{category.name}</h3>
                </motion.div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">No categories found</div>
          )}
        </div>
      </section>

      {/* Meet Our Team Section - Dynamic */}
      {teamMembers.length > 0 && (
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 py-6 dark:from-gray-900 dark:to-gray-800 sm:py-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Meet Our Team</h2>
              <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-400">
                Passionate experts combining scientific precision with creative excellence
              </p>
              <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
            </motion.div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="group relative flex flex-col items-center rounded-3xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl dark:bg-gray-800"
                >
                  <div className="relative mb-4 h-40 w-40 overflow-hidden rounded-full border-4 border-blue-500 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:border-purple-500">
                    <img
                      src={getImageUrl(member.image)}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                    <p className="mt-1 text-sm font-medium text-blue-600 dark:text-blue-400">{member.role}</p>
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{member.bio}</p>

                    {(member.facebook_url || member.twitter_url || member.linkedin_url) && (
                      <div className="mt-4 flex items-center justify-center gap-3">
                        {member.facebook_url && (
                          <a href={member.facebook_url} target="_blank" rel="noopener noreferrer"
                            className="rounded-full bg-gray-100 p-2 text-gray-600 transition-all hover:bg-blue-600 hover:text-white dark:bg-gray-700 dark:text-gray-400">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                            </svg>
                          </a>
                        )}
                        {member.twitter_url && (
                          <a href={member.twitter_url} target="_blank" rel="noopener noreferrer"
                            className="rounded-full bg-gray-100 p-2 text-gray-600 transition-all hover:bg-blue-600 hover:text-white dark:bg-gray-700 dark:text-gray-400">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                            </svg>
                          </a>
                        )}
                        {member.linkedin_url && (
                          <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer"
                            className="rounded-full bg-gray-100 p-2 text-gray-600 transition-all hover:bg-blue-600 hover:text-white dark:bg-gray-700 dark:text-gray-400">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      </div>
  )
}