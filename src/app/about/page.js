"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineClock } from "react-icons/hi"

export default function ContactPage() {
    const [isSubmitted, setIsSubmitted] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = (data) => {
        console.log(data)
        setIsSubmitted(true)
    }

    const contactInfo = [
        { icon: HiOutlineMail, title: "Email", value: "support@Sci-Math Creation.com", link: "mailto:support@Sci-Math Creation.com" },
        { icon: HiOutlinePhone, title: "Phone", value: "+ (255) 717 275 661", link: "tel:+255 717 275 661 " },
        { icon: HiOutlineLocationMarker, title: "Address", value: "Tandale,Dar es salaam, Tanzania" },
        { icon: HiOutlineClock, title: "Business Hours", value: "Mon-Fri: 9AM - 6PM" },
    ]

    return (
        <div className="space-y-12 pb-16">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-900 dark:to-teal-900">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 px-6 py-16 text-center"
                >
                    <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </motion.div>
            </section>

            {/* Contact Info Grid */}
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {contactInfo.map((info, index) => (
                    <motion.a
                        key={index}
                        href={info.link}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all group"
                    >
                        <info.icon className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{info.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{info.value}</p>
                    </motion.a>
                ))}
            </section>

            {/* Contact Form & Map */}
            <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg"
                >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>

                    {isSubmitted ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8"
                        >
                            <div className="text-6xl mb-4">✅</div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Thank You!</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Your message has been sent successfully. We'll get back to you soon.
                            </p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Name *
                                </label>
                                <input
                                    {...register("name", { required: "Name is required" })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email *
                                </label>
                                <input
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Subject *
                                </label>
                                <input
                                    {...register("subject", { required: "Subject is required" })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {errors.subject && (
                                    <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    {...register("message", { required: "Message is required" })}
                                    rows="5"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {errors.message && (
                                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                                )}
                            </div>

                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Send Message
                            </motion.button>
                        </form>
                    )}
                </motion.div>

                {/* Map */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg"
                >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Visit Us</h2>
                    <div className="relative h-96 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
                        {/* Replace with actual map component */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-gray-500">Google map</p>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    )
}