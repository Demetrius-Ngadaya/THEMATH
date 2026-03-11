"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    HiOutlineBriefcase,
    HiOutlineLocationMarker,
    HiOutlineClock,
    HiOutlineCurrencyDollar,
    HiOutlineSearch,
    HiOutlineFilter
} from "react-icons/hi"

export default function CareersPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedDepartment, setSelectedDepartment] = useState("all")
    const [selectedLocation, setSelectedLocation] = useState("all")
    const [selectedJob, setSelectedJob] = useState(null)

    const departments = ["all", "Engineering", "Marketing", "Sales", "Customer Support", "Operations", "Design"]
    const locations = ["all", "New York", "San Francisco", "London", "Remote", "Tokyo", "Singapore"]

    const jobs = [
        {
            id: 1,
            title: "Senior Frontend Developer",
            department: "Engineering",
            location: "San Francisco",
            type: "Full-time",
            experience: "5+ years",
            salary: "$120k - $160k",
            description: "We're looking for an experienced Frontend Developer to join our team...",
            requirements: [
                "5+ years of experience with React",
                "Strong TypeScript skills",
                "Experience with Next.js",
                "Understanding of UI/UX principles"
            ]
        },
        {
            id: 2,
            title: "Product Manager",
            department: "Marketing",
            location: "New York",
            type: "Full-time",
            experience: "3+ years",
            salary: "$90k - $130k",
            description: "Lead product development and strategy for our e-commerce platform...",
            requirements: [
                "3+ years of product management experience",
                "Strong analytical skills",
                "Experience in e-commerce",
                "Excellent communication skills"
            ]
        },
        {
            id: 3,
            title: "Customer Support Specialist",
            department: "Customer Support",
            location: "Remote",
            type: "Full-time",
            experience: "1+ years",
            salary: "$40k - $55k",
            description: "Help our customers with inquiries and provide exceptional support...",
            requirements: [
                "1+ years of customer service experience",
                "Excellent written and verbal communication",
                "Problem-solving skills",
                "Familiarity with CRM tools"
            ]
        },
        {
            id: 4,
            title: "UX/UI Designer",
            department: "Design",
            location: "London",
            type: "Full-time",
            experience: "3+ years",
            salary: "£50k - £70k",
            description: "Create beautiful and intuitive interfaces for our platform...",
            requirements: [
                "3+ years of UX/UI design experience",
                "Proficiency in Figma",
                "Portfolio of relevant work",
                "Understanding of user-centered design"
            ]
        },
        {
            id: 5,
            title: "Sales Representative",
            department: "Sales",
            location: "Tokyo",
            type: "Full-time",
            experience: "2+ years",
            salary: "¥6M - ¥8M",
            description: "Drive sales and build relationships with clients in the Japanese market...",
            requirements: [
                "2+ years of sales experience",
                "Fluent in Japanese and English",
                "Strong negotiation skills",
                "Experience in B2B sales"
            ]
        }
    ]

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesDepartment = selectedDepartment === "all" || job.department === selectedDepartment
        const matchesLocation = selectedLocation === "all" || job.location === selectedLocation
        return matchesSearch && matchesDepartment && matchesLocation
    })

    const benefits = [
        {
            title: "Health Insurance",
            description: "Comprehensive medical, dental, and vision coverage",
            icon: "🏥"
        },
        {
            title: "Remote Work",
            description: "Flexible work arrangements and remote options",
            icon: "🏠"
        },
        {
            title: "Stock Options",
            description: "Equity packages for all full-time employees",
            icon: "📈"
        },
        {
            title: "Learning Budget",
            description: "$2,000/year for courses and conferences",
            icon: "📚"
        },
        {
            title: "Gym Membership",
            description: "Fitness reimbursement program",
            icon: "💪"
        },
        {
            title: "Parental Leave",
            description: "16 weeks paid leave for new parents",
            icon: "👶"
        }
    ]

    return (
        <div className="space-y-12 pb-16">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-900 dark:to-purple-900">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 px-6 py-16 text-center"
                >
                    <h1 className="text-4xl font-bold text-white mb-4">Join Our Team</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
                        Help us build the future of e-commerce. We're looking for passionate people to join our mission.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                    >
                        View Open Positions
                    </motion.button>
                </motion.div>
            </section>

            {/* Benefits Section */}
            <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Why Join Us?</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                        >
                            <div className="text-4xl mb-4">{benefit.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{benefit.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Job Listings */}
            <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Open Positions</h2>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg mb-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        {/* Search */}
                        <div className="relative">
                            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Department Filter */}
                        <select
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        >
                            {departments.map(dept => (
                                <option key={dept} value={dept}>
                                    {dept === "all" ? "All Departments" : dept}
                                </option>
                            ))}
                        </select>

                        {/* Location Filter */}
                        <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        >
                            {locations.map(loc => (
                                <option key={loc} value={loc}>
                                    {loc === "all" ? "All Locations" : loc}
                                </option>
                            ))}
                        </select>

                        {/* Results Count */}
                        <div className="flex items-center justify-end text-gray-600 dark:text-gray-400">
                            <HiOutlineFilter className="h-5 w-5 mr-2" />
                            <span>{filteredJobs.length} positions found</span>
                        </div>
                    </div>
                </div>

                {/* Jobs Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {filteredJobs.map((job, index) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                            onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{job.title}</h3>
                                    <div className="flex flex-wrap gap-4 mb-4">
                                        <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                            <HiOutlineBriefcase className="h-4 w-4 mr-1" />
                                            {job.department}
                                        </span>
                                        <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                            <HiOutlineLocationMarker className="h-4 w-4 mr-1" />
                                            {job.location}
                                        </span>
                                        <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                            <HiOutlineClock className="h-4 w-4 mr-1" />
                                            {job.type}
                                        </span>
                                        <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                            <HiOutlineCurrencyDollar className="h-4 w-4 mr-1" />
                                            {job.salary}
                                        </span>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        // Handle apply
                                    }}
                                >
                                    Apply Now
                                </motion.button>
                            </div>

                            <AnimatePresence>
                                {selectedJob === job.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800"
                                    >
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">{job.description}</p>

                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Requirements</h4>
                                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                                            {job.requirements.map((req, i) => (
                                                <li key={i}>{req}</li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8"
                >
                    <h2 className="text-2xl font-bold text-white mb-4">Don't see the right position?</h2>
                    <p className="text-white/90 mb-6">
                        Send us your resume and we'll keep you in mind for future opportunities.
                    </p>
                    <button className="px-6 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                        Send Resume
                    </button>
                </motion.div>
            </section>
        </div>
    )
}