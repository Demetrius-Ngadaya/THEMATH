"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    HiOutlineChartBar,
    HiOutlineClock,
    HiOutlineChip,
    HiOutlineDocumentText,
    HiOutlineAcademicCap,
    HiOutlineLink,
    HiOutlineChevronRight,
    HiOutlineSearch,
    HiOutlineDownload,
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineStar,
    HiOutlineUsers,
    HiOutlineBriefcase,
    HiOutlineTrendingUp,
    HiOutlineCheckCircle
} from "react-icons/hi"
import { FaDatabase, FaRegLightbulb, FaRocket, FaShieldAlt } from "react-icons/fa"

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
}

export default function ServicesPage() {
    const [selectedService, setSelectedService] = useState(null)
    const [viewMode, setViewMode] = useState("grid") // grid or list

    // Service Data with enriched information
    const services = [
        {
            id: "cross-sectional",
            name: "Cross-Sectional Analysis",
            icon: HiOutlineChartBar,
            color: "blue",
            description: "Analyze data collected at a single point in time to identify patterns and relationships.",
            metrics: { methods: 15, clients: 120, experience: "8+ years" },
            models: [
                "Linear Models", "Limited Dependent Variable Models", "Count Data Models",
                "Censored and Truncated Models", "Instrumental Variable Models", "Structural Equation Modeling",
                "Survival Analysis", "Biostatistics & Epidemiology", "Multivariate Analysis"
            ],
            popular: true
        },
        {
            id: "time-series",
            name: "Time Series Analysis",
            icon: HiOutlineClock,
            color: "green",
            description: "Forecast future trends and understand temporal patterns in your data.",
            metrics: { methods: 12, clients: 85, experience: "10+ years" },
            models: [
                "Box-Jenkins (ARIMA)", "Exponential Smoothing", "Multivariate Time Series",
                "Volatility Models (GARCH)", "State Space Models", "Frequency Domain Analysis",
                "Nonlinear Time Series", "Bayesian Time Series", "Cointegration Models"
            ],
            popular: true
        },
        {
            id: "panel",
            name: "Panel Data Analysis",
            icon: FaDatabase,
            color: "purple",
            description: "Combine cross-sectional and time-series data for robust insights.",
            metrics: { methods: 10, clients: 64, experience: "7+ years" },
            models: [
                "Fixed/Random Effects", "Dynamic Panel GMM", "Panel Cointegration",
                "Error Correction Models", "Heterogeneous Panel ARDL", "Spatial Panel Models",
                "Nonlinear Panel Models", "Quantile Panel Models"
            ],
            popular: false
        },
        {
            id: "machine-learning",
            name: "Machine Learning",
            icon: HiOutlineChip,
            color: "red",
            description: "Leverage AI to uncover hidden patterns and make predictions.",
            metrics: { methods: 8, clients: 95, experience: "5+ years" },
            models: [
                "Supervised Learning", "Unsupervised Learning", "Deep Learning (Neural Networks)",
                "Reinforcement Learning", "Probabilistic Models", "Ensemble Methods",
                "Natural Language Processing", "Computer Vision"
            ],
            popular: true
        },
        {
            id: "qualitative",
            name: "Qualitative Analysis",
            icon: HiOutlineDocumentText,
            color: "yellow",
            description: "Extract meaning from text, interviews, and unstructured data.",
            metrics: { methods: 8, clients: 73, experience: "9+ years" },
            models: [
                "Thematic Analysis", "Content Analysis", "Narrative Analysis",
                "Discourse Analysis", "Grounded Theory", "IPA",
                "Ethnographic Analysis", "Case Study Analysis"
            ],
            popular: false
        },
        {
            id: "me",
            name: "M&E Services",
            icon: HiOutlineSearch,
            color: "indigo",
            description: "Measure impact and improve program effectiveness.",
            metrics: { methods: 12, clients: 48, experience: "6+ years" },
            models: [
                "Logical Framework", "Theory of Change", "Impact Evaluation (DiD, PSM, RDD)",
                "RCT Analysis", "Cost-Benefit Analysis", "Outcome Mapping",
                "Indicator Tracking", "Results-Based Monitoring"
            ],
            popular: true
        },
        {
            id: "software",
            name: "Software Training",
            icon: HiOutlineDownload,
            color: "gray",
            description: "Master industry-standard tools for data analysis.",
            metrics: { tools: 25, trained: 500, courses: 15 },
            models: [
                "SPSS", "Stata", "R/Python", "SAS", "EViews", "SmartPLS",
                "MATLAB", "Tableau/Power BI", "NVivo", "Excel Advanced"
            ],
            popular: false
        },
        {
            id: "training",
            name: "Training Programs",
            icon: HiOutlineAcademicCap,
            color: "pink",
            description: "Build capacity with customized workshops and courses.",
            metrics: { programs: 12, participants: 850, satisfaction: "98%" },
            models: [
                "Research Methods", "Quantitative Analysis", "Statistical Software",
                "Qualitative Analysis", "Machine Learning", "Data Visualization",
                "Academic Writing", "M&E Training"
            ],
            popular: false
        }
    ]

    const processSteps = [
        { step: "01", title: "Consultation", desc: "Understand your research goals and data challenges", duration: "1-2 days" },
        { step: "02", title: "Planning", desc: "Develop methodology and analysis framework", duration: "2-3 days" },
        { step: "03", title: "Data Prep", desc: "Clean, validate, and prepare your data", duration: "3-5 days" },
        { step: "04", title: "Analysis", desc: "Execute statistical/models and interpret results", duration: "5-10 days" },
        { step: "05", title: "Reporting", desc: "Create visualizations and comprehensive reports", duration: "3-5 days" },
        { step: "06", title: "Review", desc: "Quality assurance and final delivery", duration: "2-3 days" }
    ]

    const stats = [
        { value: "150+", label: "Projects Completed", icon: HiOutlineBriefcase },
        { value: "98%", label: "Client Satisfaction", icon: HiOutlineStar },
        { value: "12+", label: "Years Experience", icon: HiOutlineTrendingUp },
        { value: "500+", label: "Researchers Trained", icon: HiOutlineUsers }
    ]

    const selectedServiceData = services.find(s => s.id === selectedService)

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Hero Section - Minimalist */}
            <section className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-transparent to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
                            Data Analysis
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Services</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-8">
                            Expert statistical consulting and research support for academic, corporate, and organizational success
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                            >
                                <FaRocket className="h-5 w-5" />
                                Start Your Project with us + (255) 717 275 661
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, idx) => {
                            const Icon = stat.icon
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="text-center text-white"
                                >
                                    <Icon className="h-8 w-8 mx-auto mb-2 opacity-80" />
                                    <div className="text-3xl font-bold">{stat.value}</div>
                                    <div className="text-sm opacity-80">{stat.label}</div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Services Grid Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* View Toggle */}
                    <div className="flex justify-between items-center mb-8">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white"
                        >
                            Our Expertise
                        </motion.h2>
                        <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === "grid" ? "bg-white dark:bg-slate-700 shadow-sm" : "text-slate-600 dark:text-slate-400"}`}
                            >
                                Grid
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === "list" ? "bg-white dark:bg-slate-700 shadow-sm" : "text-slate-600 dark:text-slate-400"}`}
                            >
                                List
                            </button>
                        </div>
                    </div>

                    {/* Services Display */}
                    {viewMode === "grid" ? (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {services.map((service) => {
                                const Icon = service.icon
                                const colorClasses = {
                                    blue: "from-blue-500 to-blue-600",
                                    green: "from-green-500 to-green-600",
                                    purple: "from-purple-500 to-purple-600",
                                    red: "from-red-500 to-red-600",
                                    yellow: "from-yellow-500 to-yellow-600",
                                    indigo: "from-indigo-500 to-indigo-600",
                                    gray: "from-gray-500 to-gray-600",
                                    pink: "from-pink-500 to-pink-600"
                                }
                                return (
                                    <motion.div
                                        key={service.id}
                                        variants={itemVariants}
                                        whileHover={{ y: -8 }}
                                        onClick={() => setSelectedService(service.id)}
                                        className="group cursor-pointer"
                                    >
                                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-slate-200 dark:border-slate-700 h-full">
                                            <div className={`h-2 bg-gradient-to-r ${colorClasses[service.color]}`} />
                                            <div className="p-6">
                                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${colorClasses[service.color]} bg-opacity-10 flex items-center justify-center mb-4`}>
                                                    <Icon className="h-6 w-6 text-white" />
                                                </div>
                                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                                    {service.name}
                                                    {service.popular && (
                                                        <span className="ml-2 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
                                                            Popular
                                                        </span>
                                                    )}
                                                </h3>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                                                    {service.description}
                                                </p>
                                                <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                                                    <span>{service.metrics.methods || service.metrics.tools} methods</span>
                                                    <span className="flex items-center gap-1">
                                                        Learn more
                                                        <HiOutlineChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </motion.div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            className="space-y-4"
                        >
                            {services.map((service) => {
                                const Icon = service.icon
                                const colorClasses = {
                                    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
                                    green: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
                                    purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
                                    red: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
                                    yellow: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
                                    indigo: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
                                    gray: "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400",
                                    pink: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400"
                                }
                                return (
                                    <motion.div
                                        key={service.id}
                                        variants={itemVariants}
                                        onClick={() => setSelectedService(service.id)}
                                        className="bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-all p-4 cursor-pointer border border-slate-200 dark:border-slate-700"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg ${colorClasses[service.color]}`}>
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-900 dark:text-white">{service.name}</h3>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">{service.description}</p>
                                                </div>
                                            </div>
                                            <HiOutlineChevronRight className="h-5 w-5 text-slate-400" />
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Service Detail Modal/Drawer */}
            <AnimatePresence>
                {selectedService && selectedServiceData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
                    >
                        <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedService(null)} />
                        <motion.div
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 25 }}
                            className="relative bg-white dark:bg-slate-800 rounded-t-2xl sm:rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-white dark:bg-slate-800 p-6 border-b border-slate-200 dark:border-slate-700">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <selectedServiceData.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedServiceData.name}</h2>
                                    </div>
                                    <button
                                        onClick={() => setSelectedService(null)}
                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 space-y-6">
                                <p className="text-slate-600 dark:text-slate-300">{selectedServiceData.description}</p>

                                <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                    {Object.entries(selectedServiceData.metrics).map(([key, value]) => (
                                        <div key={key} className="text-center">
                                            <div className="text-xl font-bold text-slate-900 dark:text-white">{value}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">{key}</div>
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Key Methods & Models</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedServiceData.models.map((model, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm">
                                                {model}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                                        Call us + (255) 717 275 661
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Process Section - Timeline Style */}
            <section className="py-16 bg-white dark:bg-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">How It Works</h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Our streamlined process ensures timely delivery and exceptional quality
                        </p>
                    </motion.div>

                    <div className="relative">
                        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 hidden md:block" />
                        <div className="space-y-8">
                            {processSteps.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`relative flex flex-col md:flex-row ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-4 md:gap-8`}
                                >
                                    <div className="flex-1 md:text-right">
                                        <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
                                            <h3 className="font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{step.desc}</p>
                                            <span className="text-xs text-blue-600 dark:text-blue-400 mt-2 inline-block">{step.duration}</span>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 flex items-center justify-center">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm z-10">
                                            {step.step}
                                        </div>
                                    </div>
                                    <div className="flex-1 md:text-left" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-16 bg-slate-50 dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">Why Choose Us</h2>
                        <p className="text-slate-600 dark:text-slate-400">What sets our data analysis services apart</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: HiOutlineCheckCircle, title: "Expert Team", desc: "PhD-level statisticians and data scientists" },
                            { icon: HiOutlineClock, title: "Fast Turnaround", desc: "Most projects completed within 2 weeks" },
                            { icon: FaShieldAlt, title: "Confidential", desc: "100% data privacy guaranteed" },
                            { icon: HiOutlineStar, title: "Quality Assured", desc: "Multi-level review process" }
                        ].map((item, idx) => {
                            const Icon = item.icon
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm"
                                >
                                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                                        <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                    >
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Transform Your Data?</h2>
                        <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                            Get a free consultation and quote for your project within 24 hours
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <motion.a
                                whileHover={{ scale: 1.05 }}
                            href="info@themath.com"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-lg transition-all"
                            >
                                <HiOutlineMail className="h-5 w-5" />
                                info@themath.com
                            </motion.a>
                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                href="tel:+255123456789"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
                            >
                                <HiOutlinePhone className="h-5 w-5" />
                                +255 123 456 789
                            </motion.a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}