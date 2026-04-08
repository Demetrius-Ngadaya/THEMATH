"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { HiOutlineUsers, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineStar } from "react-icons/hi"

export default function AboutPage() {
    const stats = [
        { icon: HiOutlineUsers, value: "1M+", label: "Happy Customers" },
        { icon: HiOutlineTruck, value: "50K+", label: "Orders Delivered" },
        { icon: HiOutlineShieldCheck, value: "100%", label: "Secure Payments" },
        { icon: HiOutlineStar, value: "4.8", label: "Average Rating" },
    ]

    const team = [
        { name: "Mrisho", role: "CEO & Founder", image: "/team1.jpg" },
        { name: "Mrisho", role: "CEO", image: "/team2.jpg" },
        { name: "Mrisho", role: "CEO", image: "/team3.jpg" },
        { name: "Mrisho", role: "CEO", image: "/team4.jpg" },
    ]

    return (
        <div className="space-y-16 pb-16">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 px-6 py-16 text-center"
                >
                    <h1 className="text-4xl font-bold text-white mb-4">About Sci-Math Creation</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Data analysis,Reseacher.......... destination for quality products and exceptional shopping experience.
                    </p>
                </motion.div>
            </section>

            {/* Story Section */}
            <section className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Founded in 2024, Sci-Math Creation began with a simple mission: to make quality products accessible to everyone.
                        What started as a small offline store has grown into a trusted marketplace serving customers within the Tanzania.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                        We believe in providing not just products, but experiences. Every item in our collection is carefully
                        curated to ensure it meets our high standards of quality and value.
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative h-96 rounded-2xl overflow-hidden"
                >
                    <Image
                        src="/about-story.jpg"
                        alt="Our Story"
                        fill
                        className="object-cover"
                    />
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-center p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-lg"
                    >
                        <stat.icon className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                        <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                    </motion.div>
                ))}
            </section>

            {/* Mission & Values */}
            <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-8 rounded-2xl bg-blue-50 dark:bg-blue-900/20"
                >
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Founded in 2024, Sci-Math Creation began with a simple mission: to make quality products accessible to everyone.
                        What started as a small offline store has grown into a trusted marketplace serving customers within the Tanzania.
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-8 rounded-2xl bg-purple-50 dark:bg-purple-900/20"
                >
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Values</h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                        <li>• Customer First Approach</li>
                        <li>• Quality & Authenticity</li>
                        <li>• Innovation & Technology</li>
                        <li>• Sustainability</li>
                        <li>• Community Support</li>
                    </ul>
                </motion.div>
            </section>

            {/* Team Section */}
            <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Meet Our Team</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {team.map((member, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div className="relative h-48 w-48 mx-auto mb-4 rounded-full overflow-hidden">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    )
}