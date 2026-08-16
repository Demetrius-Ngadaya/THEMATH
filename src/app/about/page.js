"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import {
    FaChartBar,
    FaLightbulb,
    FaUsers,
    FaGlobe,
    FaRocket,
    FaGraduationCap,
    FaBriefcase,
    FaCog,
    FaArrowRight,
    FaQuoteRight,
    FaChevronLeft,
    FaChevronRight,
    FaSpinner,
    FaTimes,
    FaExpand
} from "react-icons/fa"
import axios from "@/services/api"
import AboutPageSkeleton from "@/components/skeletons/AboutPageSkeleton"

// Icon mapping
const iconMap = {
    FaChartBar: FaChartBar,
    FaLightbulb: FaLightbulb,
    FaUsers: FaUsers,
    FaGlobe: FaGlobe,
    FaRocket: FaRocket,
    FaGraduationCap: FaGraduationCap,
    FaBriefcase: FaBriefcase,
    FaCog: FaCog
}

// Helper function to get image URL
const getImageUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    if (path.startsWith('data:')) return path
    return `https://backendapi.emcc-lab.com${path}`
}

export default function AboutPage() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [sliders, setSliders] = useState([])
    const [aboutContent, setAboutContent] = useState({})
    const [services, setServices] = useState([])
    const [stemProducts, setStemProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)
    const [selectedSlide, setSelectedSlide] = useState(null)

    useEffect(() => {
        fetchAllContent()
    }, [])

    const fetchAllContent = async () => {
        try {
            setIsLoading(true)
            setError(null)

            const [slidersRes, contentRes, servicesRes, productsRes] = await Promise.all([
                axios.get('/about-hero-sliders?active=true'),
                axios.get('/about-content'),
                axios.get('/about-services?active=true'),
                axios.get('/stem-products?active=true')
            ])

            setSliders(slidersRes.data.data)
            setServices(servicesRes.data.data)
            setStemProducts(productsRes.data.data)

            const contentMap = {}
            contentRes.data.data.forEach(item => {
                contentMap[item.section] = item
            })
            setAboutContent(contentMap)

        } catch (err) {
            console.error('Error fetching content:', err)
            setError('Failed to load content. Please try again later.')
        } finally {
            setIsLoading(false)
        }
    }

    // Auto-slide effect with crossfade
    useEffect(() => {
        if (sliders.length === 0) return

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % sliders.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [sliders.length])

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % sliders.length)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length)
    }

    const openImageModal = (slide, index) => {
        setSelectedSlide(slide)
        setSelectedImage(getImageUrl(slide.image))
    }

    const closeImageModal = () => {
        setSelectedImage(null)
        setSelectedSlide(null)
    }

    // Show skeleton while loading
    if (isLoading) {
        return <AboutPageSkeleton />
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Something went wrong</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={fetchAllContent}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    // Use seeded data if no data from API
    const displaySliders = sliders.length > 0 ? sliders : [
        { id: 1, title: 'Data Analytics Excellence', description: 'Transforming data into knowledge' },
        { id: 2, title: 'Research Innovation', description: 'Empowering evidence-based decisions' },
        { id: 3, title: 'STEM Lifestyle', description: 'Inspiring curiosity and creativity' }
    ]

    const displayServices = services.length > 0 ? services : [
        { id: 1, name: 'Data Analytics', description: 'Transform raw data into actionable insights', icon: 'FaChartBar', color: 'blue' },
        { id: 2, name: 'Research Consulting', description: 'Comprehensive research support from design to implementation', icon: 'FaLightbulb', color: 'blue' },
        { id: 3, name: 'Statistical Training', description: 'Empower your team with cutting-edge statistical knowledge', icon: 'FaUsers', color: 'blue' },
        { id: 4, name: 'Evidence-Based Solutions', description: 'Drive sustainable growth through data-driven decisions', icon: 'FaGlobe', color: 'blue' }
    ]

    const displayProducts = stemProducts.length > 0 ? stemProducts : [
        { id: 1, name: 'Premium Apparel', description: 'Wear your passion for science with our high-quality STEM-inspired clothing', icon: 'FaRocket', color: 'blue' },
        { id: 2, name: 'Educational Products', description: 'Tools and resources that make learning STEM subjects engaging and fun', icon: 'FaGraduationCap', color: 'blue' },
        { id: 3, name: 'Accessories', description: 'Everyday items that celebrate the beauty of mathematics and technology', icon: 'FaBriefcase', color: 'blue' },
        { id: 4, name: 'Innovation Design', description: 'Where science meets creativity in premium lifestyle products', icon: 'FaCog', color: 'blue' }
    ]

    const about = aboutContent.about
    const vision = aboutContent.vision
    const mission = aboutContent.mission
    const motto = aboutContent.motto

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">

            {/* Hero Section with Sliding Images - Crossfade without white flash */}
            <section className="relative h-screen overflow-hidden">
                <div className="absolute inset-0">
                    {displaySliders.map((slide, index) => {
                        const imageUrl = getImageUrl(slide.image)
                        return (
                            <motion.div
                                key={slide.id}
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: index === currentSlide ? 1 : 0
                                }}
                                transition={{
                                    duration: 1.5,
                                    ease: "easeInOut"
                                }}
                                className="absolute inset-0"
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url(${imageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80'})`
                                    }}
                                >
                                    {/* Removed the blue overlay */}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Slide Navigation */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
                    {displaySliders.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
                                }`}
                        />
                    ))}
                </div>

                {/* Slide Controls */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all"
                >
                    <FaChevronLeft className="h-6 w-6" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all"
                >
                    <FaChevronRight className="h-6 w-6" />
                </button>

                {/* Hero Content - Now at the bottom */}
                <div className="absolute bottom-32 left-0 right-0 z-10 px-6">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-center text-white max-w-4xl mx-auto"
                    >
                        <h1 className="text-2xl md:text-3xl lg:text-6xl font-bold mb-4 leading-tight drop-shadow-lg">
                            {displaySliders[currentSlide]?.title || 'About EMCC'}
                        </h1>
                        <button
                            onClick={() => openImageModal(displaySliders[currentSlide], currentSlide)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full font-semibold transition-all border border-white/30"
                        >
                            <FaExpand className="h-4 w-4" />
                            View Details
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Image Detail Modal */}
            <AnimatePresence>
                {selectedImage && selectedSlide && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                        onClick={closeImageModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-4xl w-full max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={closeImageModal}
                                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all"
                            >
                                <FaTimes className="h-6 w-6" />
                            </button>
                            <div className="relative w-full h-[60vh]">
                                <img
                                    src={selectedImage}
                                    alt={selectedSlide.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {selectedSlide.title}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {selectedSlide.description}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* About EMCC Content */}
            {about && (
                <section className="py-5 bg-white-50 dark:bg-gray-900">
                    <div className="max-w-10xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl"
                        >
                            <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6">
                                {about.additional_data?.title || 'About EMCC'}
                            </h2>
                            <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                                {about.content.split('\n').map((paragraph, index) => (
                                    <p key={index} className="text-lg">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Vision & Mission */}
            {(vision || mission) && (
                <section className="py-5">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {vision && (
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-10 shadow-xl border border-blue-100 dark:border-gray-700"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg">
                                            <FaGlobe className="h-6 w-6" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {vision.additional_data?.title || 'Vision'}
                                        </h2>
                                    </div>
                                    <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {vision.content.split('\n').map((paragraph, index) => (
                                            <p key={index}>{paragraph}</p>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {mission && (
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-10 shadow-xl border border-blue-100 dark:border-gray-700"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg">
                                            <FaRocket className="h-6 w-6" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {mission.additional_data?.title || 'Mission'}
                                        </h2>
                                    </div>
                                    <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {mission.content.split('\n').map((paragraph, index) => (
                                            <p key={index}>{paragraph}</p>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Core Motto */}
            {motto && (
                <section className="relative py-10 overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700">
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
                    <div className="relative max-w-7xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center text-white mb-12"
                        >
                            <span className="text-sm font-semibold text-blue-200 uppercase tracking-wider">
                                {motto.additional_data?.title || 'Core Motto'}
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold mt-2">
                                {motto.additional_data?.subtitle || 'What Drives Us'}
                            </h2>
                        </motion.div>

                        <div className="grid  gap-6">
                            {motto.content.split('\n').map((sentence, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-blue-400/20 rounded-xl group-hover:scale-110 transition-transform">
                                            <FaQuoteRight className="h-6 w-6 text-blue-200" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-white leading-relaxed">
                                                {sentence}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Services */}
            <section className="py-10 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-5"
                    >
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Expertise</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">Our Services</h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                        {displayServices.map((item, index) => {
                            const IconComponent = iconMap[item.icon] || FaChartBar
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden relative">
                                        <div className={`absolute inset-0 bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                                        <div className="relative">
                                            <div className={`inline-flex p-3 bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 rounded-xl text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                                <IconComponent className="h-5 w-5" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.name}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* STEM Products */}
            <section className="py-5">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Lifestyle</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">STEM Products</h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {displayProducts.map((item, index) => {
                            const IconComponent = iconMap[item.icon] || FaRocket
                            const imageUrl = getImageUrl(item.image)

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group"
                                >
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl py-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400">
                                        {imageUrl ? (
                                            <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                                <img
                                                    src={imageUrl}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none'
                                                        const parent = e.target.parentElement
                                                        const placeholder = document.createElement('div')
                                                        placeholder.className = 'w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30'
                                                        placeholder.innerHTML = `<svg class="h-12 w-12 text-blue-400 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`
                                                        parent.appendChild(placeholder)
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-full h-40 mb-4 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
                                                <IconComponent className="h-12 w-12 text-blue-400 dark:text-blue-500" />
                                            </div>
                                        )}
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.name}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                                        {item.price && (
                                            <p className="mt-2 text-lg font-bold text-blue-600 dark:text-blue-400">
                                                Tsh {item.price}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
                <div className="relative max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold">
                            Let's Work Together
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white">
                            Ready to <span className="text-blue-200">Transform</span> Your Data?
                        </h2>
                        <p className="text-xl text-white/90 max-w-2xl mx-auto">
                            Join thousands of organizations that trust EMCC for their data analytics and research needs.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <motion.a
                                href="/services2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-2 px-10 py-4 bg-white text-blue-600 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all"
                            >
                                Get Started
                                <FaArrowRight />
                            </motion.a>
                            <motion.a
                                href="/contact"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-2 px-10 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold hover:bg-white/10 transition-all"
                            >
                                Contact Us
                            </motion.a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}