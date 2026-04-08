"use client"

import { useState } from "react"
import { motion } from "framer-motion"
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
    HiOutlinePhone
} from "react-icons/hi"
import { FaDatabase, FaRegLightbulb } from "react-icons/fa"

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
}

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const cardHover = {
    hover: {
        scale: 1.05,
        transition: { duration: 0.3 }
    }
}

export default function ServicesPage() {
    const [activeCategory, setActiveCategory] = useState("all")
    const [searchTerm, setSearchTerm] = useState("")

    // Service Categories Data
    const categories = [
        { id: "all", name: "All Services", icon: HiOutlineChartBar },
        { id: "cross-sectional", name: "Cross-Sectional", icon: HiOutlineChartBar },
        { id: "time-series", name: "Time Series", icon: HiOutlineClock },
        { id: "panel", name: "Panel Data", icon: FaDatabase },
        { id: "machine-learning", name: "Machine Learning", icon: HiOutlineChip },
        { id: "qualitative", name: "Qualitative", icon: HiOutlineDocumentText },
        { id: "me", name: "M&E", icon: HiOutlineSearch },
        { id: "software", name: "Software", icon: HiOutlineDownload },
        { id: "process", name: "Process", icon: HiOutlineSearch },
        { id: "training", name: "Training", icon: HiOutlineAcademicCap },
        { id: "papers", name: "Research Papers", icon: HiOutlineLink }
    ]

    // Cross-Sectional Data Analysis Models
    const crossSectionalModels = [
        "Linear Models", "Limited Dependent Variable Models", "Count Data Models",
        "Censored and Truncated Models", "Instrumental Variable Models", "Robust and Generalized Models",
        "Dimension Reduction Techniques", "Classification and Grouping Techniques", "Mean Comparison Techniques",
        "Non-Parametric Methods", "Structural Equation Modeling", "Survival analysis model",
        "Biostatistics & Epidemiology methods", "Quality control methods", "Multivariate analysis"
    ]

    // Time Series Models
    const timeSeriesModels = [
        "Classical (Deterministic & Decomposition Models)", "Univariate Stochastic Models (Box–Jenkins)",
        "Exponential Smoothing Methods", "Multivariate Time Series Models", "Volatility Models (Financial Time Series)",
        "State Space & Structural Models", "Frequency Domain Models", "Nonlinear Time Series Models",
        "Long Memory Models", "Bayesian Time Series Models", "Intervention & Transfer Function Models",
        "Cointegration Models"
    ]

    // Panel Data Models
    const panelModels = [
        "Basic Panel Data Models (Pooled)", "Model Selection Tests", "Dynamic Panel Data Models (GMM)",
        "Panel Models with Limited Dependent Variables", "Panel Cointegration Models (Long-run relationships)",
        "Error Correction Models (Panel ECM)", "Heterogeneous Panel Models (ARDL)", "Panel Time Series Models (VAR)",
        "Spatial Panel Models", "Nonlinear Panel Models", "Quantile Panel Models", "Robust and Corrected Models"
    ]

    // Machine Learning Models
    const mlModels = [
        "Supervised Learning Models", "Unsupervised Learning Models", "Semi-Supervised Learning Models",
        "Reinforcement Learning Models", "Neural Networks (Deep Learning)", "Probabilistic & Graphical Models",
        "Other Important Models"
    ]

    // Qualitative Techniques
    const qualitativeTechniques = [
        "Thematic Analysis", "Content Analysis", "Narrative Analysis", "Discourse Analysis",
        "Grounded Theory Analysis", "Interpretative Phenomenological Analysis (IPA)",
        "Ethnographic Analysis", "Case Study Analysis"
    ]

    // M&E Methods
    const meMethods = [
        "Logical Framework Analysis (LogFrame)", "Results-Based Monitoring and Evaluation (RBM)",
        "Theory of Change (ToC) Analysis", "Indicator Performance Tracking", "Before–After (Pre–Post) Evaluation",
        "Difference-in-Differences (DiD) Impact Evaluation", "Propensity Score Matching (PSM)",
        "Regression Discontinuity Design (RDD)", "Randomized Controlled Trials (RCT) Evaluation",
        "Cost–Benefit Analysis (CBA)", "Cost-Effectiveness Analysis (CEA)", "Outcome Mapping and Impact Assessment"
    ]

    // Software Tools
    const softwareTools = [
        "SPSS", "Stata", "R", "Python (NumPy, Pandas, SciPy)", "SAS", "EViews", "SmartPLS-SEM", "MATLAB",
        "Minitab", "Gretl", "JMP", "Excel", "Tableau", "Power BI", "DEAP", "Genstat", "Statistica", "QGIS",
        "Panel check", "SQL", "Hadoop", "AMOS", "NVivo", "ATLAS.ti", "MAXQDA"
    ]

    // Analysis Process Steps
    const processSteps = [
        "Initial Consultation & Requirement Gathering", "Concept Note Development (Research Clients)",
        "Research Design & Proposal Support", "Data Collection Support", "Data Cleaning & Preparation",
        "Exploratory Data Analysis (EDA)", "Statistical / Advanced Analysis",
        "Data Visualization & Dashboard Development", "Interpretation of Results",
        "Report Writing / Thesis Writing", "Plagiarism & Grammar checker", "Reference style manager",
        "Review & Quality Assurance", "Final Submission", "Post-Delivery Support"
    ]

    // Training Programs
    const trainingPrograms = [
        "Research Methods Training", "Quantitative Data Analysis Training", "Statistical Software Training",
        "Qualitative Data Analysis Training", "Machine Learning & Advanced Analytics",
        "Data Visualization & Dashboard Training", "Academic Writing Support Training",
        "Survey Design & Data Collection Tools", "Data Management & Cleaning", "Econometrics Data Analysis",
        "Monitoring & Evaluation Consultation", "Professional & Business Consultancy Training"
    ]

    // Sample Research Papers
    const researchPapers = [
        { title: "Machine Learning Applications in Healthcare Analytics", link: "#", year: "2024" },
        { title: "Time Series Forecasting for Economic Indicators", link: "#", year: "2023" },
        { title: "Panel Data Analysis of Climate Change Impacts", link: "#", year: "2023" },
        { title: "Qualitative Analysis of Consumer Behavior", link: "#", year: "2022" },
        { title: "Impact Evaluation of Educational Programs using RCT", link: "#", year: "2022" }
    ]

    const getCategoryContent = () => {
        switch (activeCategory) {
            case "cross-sectional":
                return { title: "Cross-Sectional Data Analysis Models", items: crossSectionalModels, icon: HiOutlineChartBar, isPapers: false }
            case "time-series":
                return { title: "Time Series Data Analysis Models", items: timeSeriesModels, icon: HiOutlineClock, isPapers: false }
            case "panel":
                return { title: "Panel Data Analysis Models", items: panelModels, icon: FaDatabase, isPapers: false }
            case "machine-learning":
                return { title: "Machine Learning Models", items: mlModels, icon: HiOutlineChip, isPapers: false }
            case "qualitative":
                return { title: "Qualitative Data Analysis Techniques", items: qualitativeTechniques, icon: HiOutlineDocumentText, isPapers: false }
            case "me":
                return { title: "Monitoring & Evaluation Methods", items: meMethods, icon: HiOutlineSearch, isPapers: false }
            case "software":
                return { title: "Data Analysis Software", items: softwareTools, icon: HiOutlineDownload, isPapers: false }
            case "process":
                return { title: "Data Analysis Process", items: processSteps, icon: HiOutlineSearch, isPapers: false }
            case "training":
                return { title: "Training Programs", items: trainingPrograms, icon: HiOutlineAcademicCap, isPapers: false }
            case "papers":
                return { title: "Research Papers", items: researchPapers, icon: HiOutlineLink, isPapers: true }
            default:
                return null
        }
    }

    const content = getCategoryContent()

    let filteredItems = null
    if (content && !content.isPapers && searchTerm) {
        filteredItems = content.items.filter(item =>
            item.toLowerCase().includes(searchTerm.toLowerCase())
        )
    } else if (content && !content.isPapers) {
        filteredItems = content.items
    } else if (content && content.isPapers) {
        filteredItems = content.items
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900">
                <div className="absolute inset-0 bg-black/20"></div>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="relative z-10 px-4 py-20 text-center"
                >
                    <motion.div variants={fadeInUp}>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Data Analysis Services
                        </h1>
                        <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
                            Professional statistical consulting, advanced analytics, and research support
                            for academic, business, and organizational success
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                        >
                            Get Started
                        </motion.button>
                    </motion.div>
                </motion.div>
            </section>

            {/* Category Navigation */}
            <section className="sticky top-0 z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md">
                <div className="container mx-auto px-4 py-4 overflow-x-auto">
                    <div className="flex gap-3 md:gap-4 justify-center min-w-max">
                        {categories.map((category) => {
                            const Icon = category.icon
                            return (
                                <motion.button
                                    key={category.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setActiveCategory(category.id)
                                        setSearchTerm("")
                                    }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${activeCategory === category.id
                                            ? "bg-blue-600 text-white shadow-lg"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="hidden sm:inline">{category.name}</span>
                                </motion.button>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="container mx-auto px-4 py-12">
                {activeCategory === "all" ? (
                    // Show all categories in grid
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="space-y-16"
                    >
                        {/* Cross-Sectional */}
                        <ServiceSection title="Cross-Sectional Data Analysis" items={crossSectionalModels} icon={HiOutlineChartBar} color="blue" />

                        {/* Time Series */}
                        <ServiceSection title="Time Series Data Analysis" items={timeSeriesModels} icon={HiOutlineClock} color="green" />

                        {/* Panel Data */}
                        <ServiceSection title="Panel Data Analysis" items={panelModels} icon={FaDatabase} color="purple" />

                        {/* Machine Learning */}
                        <ServiceSection title="Machine Learning Models" items={mlModels} icon={HiOutlineChip} color="red" />

                        {/* Qualitative */}
                        <ServiceSection title="Qualitative Analysis" items={qualitativeTechniques} icon={HiOutlineDocumentText} color="yellow" />

                        {/* M&E */}
                        <ServiceSection title="M&E Methods" items={meMethods} icon={HiOutlineSearch} color="indigo" />

                        {/* Software */}
                        <SoftwareSection tools={softwareTools} />

                        {/* Process */}
                        <ProcessSection steps={processSteps} />

                        {/* Training */}
                        <TrainingSection programs={trainingPrograms} />

                        {/* Research Papers */}
                        <PapersSection papers={researchPapers} />
                    </motion.div>
                ) : content && (
                    <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                {content.title}
                            </h2>
                            {!content.isPapers && (
                                <div className="relative w-full md:w-96">
                                    <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="text"
                                        placeholder="Search services..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            )}
                        </div>

                        {content.isPapers ? (
                            <div className="grid gap-4">
                                {filteredItems && filteredItems.map((paper, idx) => (
                                    <motion.a
                                        key={idx}
                                        href={paper.link}
                                        variants={fadeInUp}
                                        whileHover={{ x: 10 }}
                                        className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all"
                                    >
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">{paper.title}</h3>
                                            <p className="text-sm text-gray-500">{paper.year}</p>
                                        </div>
                                        <HiOutlineChevronRight className="h-5 w-5 text-gray-400" />
                                    </motion.a>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredItems && filteredItems.map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        variants={fadeInUp}
                                        whileHover="hover"
                                        className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-xl transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {searchTerm && filteredItems && filteredItems.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No services found matching "{searchTerm}"</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </section>

            {/* Contact Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900 mt-16">
                <div className="container mx-auto px-4 py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center text-white"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Project?</h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            Contact us today for a free consultation and let's bring your data to life
                        </p>
                        <div className="flex flex-col md:flex-row justify-center gap-4">
                            <motion.a
                                href="mailto:contact@example.com"
                                whileHover={{ scale: 1.05 }}
                                className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
                            >
                                <HiOutlineMail className="h-5 w-5" />
                                Email Us
                            </motion.a>
                            <motion.a
                                href="tel:+255123456789"
                                whileHover={{ scale: 1.05 }}
                                className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all"
                            >
                                <HiOutlinePhone className="h-5 w-5" />
                                Call Us
                            </motion.a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}

// Helper Components
function ServiceSection({ title, items, icon: Icon, color }) {
    const colorClasses = {
        blue: "from-blue-500 to-blue-600",
        green: "from-green-500 to-green-600",
        purple: "from-purple-500 to-purple-600",
        red: "from-red-500 to-red-600",
        yellow: "from-yellow-500 to-yellow-600",
        indigo: "from-indigo-500 to-indigo-600"
    }

    return (
        <motion.div
            variants={fadeInUp}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
            <div className={`bg-gradient-to-r ${colorClasses[color]} p-6`}>
                <div className="flex items-center gap-3">
                    <Icon className="h-8 w-8 text-white" />
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                </div>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {items.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.02 }}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <HiOutlineChevronRight className="h-4 w-4 text-blue-600" />
                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

function SoftwareSection({ tools }) {
    return (
        <motion.div variants={fadeInUp} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-6">
                <div className="flex items-center gap-3">
                    <HiOutlineDownload className="h-8 w-8 text-white" />
                    <h2 className="text-2xl font-bold text-white">Data Analysis Software</h2>
                </div>
            </div>
            <div className="p-6">
                <div className="flex flex-wrap gap-3">
                    {tools.map((tool, idx) => (
                        <motion.span
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.01 }}
                            whileHover={{ scale: 1.05 }}
                            className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                        >
                            {tool}
                        </motion.span>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

function ProcessSection({ steps }) {
    return (
        <motion.div variants={fadeInUp} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6">
                <div className="flex items-center gap-3">
                    <HiOutlineSearch className="h-8 w-8 text-white" />
                    <h2 className="text-2xl font-bold text-white">Data Analysis Process</h2>
                </div>
            </div>
            <div className="p-6">
                <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
                    <div className="space-y-6">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="relative pl-10"
                            >
                                <div className="absolute left-0 top-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {idx + 1}
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                    <p className="text-gray-800 dark:text-gray-200">{step}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

function TrainingSection({ programs }) {
    return (
        <motion.div variants={fadeInUp} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                <div className="flex items-center gap-3">
                    <HiOutlineAcademicCap className="h-8 w-8 text-white" />
                    <h2 className="text-2xl font-bold text-white">Training Programs</h2>
                </div>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {programs.map((program, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
                        >
                            <FaRegLightbulb className="h-5 w-5 text-purple-600" />
                            <span className="text-gray-800 dark:text-gray-200">{program}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

function PapersSection({ papers }) {
    return (
        <motion.div variants={fadeInUp} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6">
                <div className="flex items-center gap-3">
                    <HiOutlineLink className="h-8 w-8 text-white" />
                    <h2 className="text-2xl font-bold text-white">Research Papers</h2>
                </div>
            </div>
            <div className="p-6">
                <div className="grid gap-4">
                    {papers.map((paper, idx) => (
                        <motion.a
                            key={idx}
                            href={paper.link}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ x: 10 }}
                            className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all"
                        >
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">{paper.title}</h3>
                                <p className="text-sm text-gray-500">{paper.year}</p>
                            </div>
                            <HiOutlineChevronRight className="h-5 w-5 text-gray-400" />
                        </motion.a>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}