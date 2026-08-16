"use client"

import { motion } from "framer-motion"

export default function AboutPageSkeleton() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">
            {/* Hero Section Skeleton */}
            <section className="relative h-screen overflow-hidden bg-gray-200 dark:bg-gray-800">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 animate-pulse"></div>

                {/* Slide Navigation Skeleton */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
                    {[1, 2, 3].map((_, index) => (
                        <div key={index} className="w-3 h-3 rounded-full bg-white/30 animate-pulse"></div>
                    ))}
                </div>

                {/* Hero Content Skeleton */}
                <div className="absolute bottom-32 left-0 right-0 z-10 px-6">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="h-16 bg-white/20 rounded-2xl mb-4 mx-auto animate-pulse max-w-2xl"></div>
                        <div className="h-12 bg-white/20 rounded-full mx-auto w-40 animate-pulse"></div>
                    </div>
                </div>
            </section>

            {/* About EMCC Skeleton */}
            <section className="py-12 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl">
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6 w-48 animate-pulse"></div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-full animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision & Mission Skeleton */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-10 shadow-xl border border-blue-100 dark:border-gray-700">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-32 animate-pulse"></div>
                                </div>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((j) => (
                                        <div key={j} className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-full animate-pulse"></div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Motto Skeleton */}
            <section className="relative py-12 overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="relative max-w-7xl mx-auto px-6">
                    <div className="text-center text-white mb-12">
                        <div className="h-6 bg-white/20 rounded-full mx-auto w-32 animate-pulse"></div>
                        <div className="h-10 bg-white/20 rounded-lg mx-auto w-64 mt-2 animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl animate-pulse"></div>
                                    <div className="flex-1">
                                        <div className="h-6 bg-white/20 rounded-lg w-full animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Skeleton */}
            <section className="py-12 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-8">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto w-24 animate-pulse"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto w-48 mt-2 animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4 animate-pulse"></div>
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-32 mb-2 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-full animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* STEM Products Skeleton */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto w-24 animate-pulse"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto w-48 mt-2 animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 animate-pulse"></div>
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-32 mb-2 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-full mb-2 animate-pulse"></div>
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-24 animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Skeleton */}
            <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700">
                <div className="relative max-w-4xl mx-auto px-6 text-center">
                    <div className="space-y-6">
                        <div className="h-8 bg-white/20 rounded-full mx-auto w-40 animate-pulse"></div>
                        <div className="h-12 bg-white/20 rounded-lg mx-auto w-96 animate-pulse"></div>
                        <div className="h-6 bg-white/20 rounded-lg mx-auto w-64 animate-pulse"></div>
                        <div className="flex flex-wrap justify-center gap-4">
                            <div className="h-14 bg-white/20 rounded-full w-40 animate-pulse"></div>
                            <div className="h-14 bg-white/20 rounded-full w-40 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}