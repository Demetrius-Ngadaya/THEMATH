"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { HiOutlineDownload, HiOutlineCalendar, HiOutlineNewspaper } from "react-icons/hi"

export default function PressPage() {
    const [selectedYear, setSelectedYear] = useState("all")

    const years = ["all", "2024", "2023", "2022"]

    const pressReleases = [
        {
            id: 1,
            title: "Sci-Math Creation Raises $50M in Series B Funding",
            date: "2024-01-15",
            summary: "Leading e-commerce platform secures funding to expand into new markets.",
            link: "/press/releases/funding-2024"
        },
        {
            id: 2,
            title: "Sci-Math Creation Launches AI-Powered Recommendation Engine",
            date: "2023-12-10",
            summary: "New feature helps customers discover products tailored to their preferences.",
            link: "/press/releases/ai-launch"
        },
        {
            id: 3,
            title: "Sci-Math Creation Expands to European Market",
            date: "2023-11-05",
            summary: "Opening new headquarters in London and Berlin.",
            link: "/press/releases/europe-expansion"
        }
    ]

    const mediaKit = {
        logos: [
            { name: "Logo - Dark", file: "/logos/logo-dark.png" },
            { name: "Logo - Light", file: "/logos/logo-light.png" },
            { name: "Icon - Color", file: "/logos/icon-color.png" },
            { name: "Icon - Black", file: "/logos/icon-black.png" }
        ],
        brandColors: ["#3B82F6", "#8B5CF6", "#10B981"],
        brandGuidelines: "/docs/brand-guidelines.pdf"
    }

    const filteredReleases = selectedYear === "all"
        ? pressReleases
        : pressReleases.filter(release => release.date.startsWith(selectedYear))

    return (
        <div className="space-y-12 pb-16">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-900 dark:to-cyan-900">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 px-6 py-16 text-center"
                >
                    <h1 className="text-4xl font-bold text-white mb-4">Press Center</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Latest news, updates, and resources for media professionals
                    </p>
                </motion.div>
            </section>

            {/* Press Releases */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Press Releases</h2>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                        {years.map(year => (
                            <option key={year} value={year}>
                                {year === "all" ? "All Years" : year}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-4">
                    {filteredReleases.map((release, index) => (
                        <motion.div
                            key={release.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                        <HiOutlineCalendar className="h-4 w-4" />
                                        <span>{new Date(release.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        {release.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">{release.summary}</p>
                                </div>
                                <motion.a
                                    href={release.link}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="mt-4 md:mt-0 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
                                >
                                    Read More
                                </motion.a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Media Kit */}
            <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Media Kit</h2>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Logos */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg"
                    >
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Logos</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {mediaKit.logos.map((logo, index) => (
                                <div key={index} className="text-center">
                                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-2">
                                        <div className="h-16 flex items-center justify-center">
                                            <HiOutlineNewspaper className="h-12 w-12 text-gray-400" />
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{logo.name}</p>
                                    <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center justify-center gap-1">
                                        <HiOutlineDownload className="h-4 w-4" />
                                        Download
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Brand Assets */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg"
                    >
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Brand Assets</h3>

                        <div className="space-y-6">
                            {/* Colors */}
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Brand Colors</h4>
                                <div className="flex gap-4">
                                    {mediaKit.brandColors.map((color, index) => (
                                        <div key={index} className="text-center">
                                            <div
                                                className="w-16 h-16 rounded-lg mb-2"
                                                style={{ backgroundColor: color }}
                                            />
                                            <span className="text-xs text-gray-600 dark:text-gray-400">{color}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Guidelines */}
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Brand Guidelines</h4>
                                <a
                                    href={mediaKit.brandGuidelines}
                                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <HiOutlineNewspaper className="h-6 w-6 text-gray-500" />
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">Brand Guidelines PDF</p>
                                            <p className="text-sm text-gray-500">2.5 MB</p>
                                        </div>
                                    </div>
                                    <HiOutlineDownload className="h-5 w-5 text-gray-500" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Media Contact */}
            <section className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Media Contact</h2>
                <p className="text-white/90 mb-6">
                    For press inquiries, please contact our media relations team
                </p>
                <div className="space-y-2 text-white/80">
                    <p>press@Sci-Math Creation.com</p>
                    <p>+1 (555) 123-4567</p>
                </div>
            </section>
        </div>
    )
}