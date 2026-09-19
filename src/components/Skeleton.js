"use client"

// Reusable skeleton building blocks. Use these instead of a full-page
// spinner so each section of a page can show its own placeholder shape
// while its data loads, rather than blocking the whole page.

export function SkeletonBlock({ className = "" }) {
    return <div className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg ${className}`} />
}

export function SkeletonText({ lines = 1, className = "" }) {
    return (
        <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded h-4"
                    style={{ width: i === lines - 1 && lines > 1 ? "70%" : "100%" }}
                />
            ))}
        </div>
    )
}

export function SkeletonCard() {
    return (
        <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
            <SkeletonBlock className="w-full aspect-square" />
            <div className="p-4 space-y-3">
                <SkeletonText lines={2} />
                <SkeletonBlock className="h-5 w-1/3" />
            </div>
        </div>
    )
}

export function SkeletonCardGrid({ count = 8, columns = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" }) {
    return (
        <div className={`grid ${columns} gap-4 sm:gap-6`}>
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    )
}

export function SkeletonCircleCard() {
    return (
        <div className="flex flex-col items-center gap-3">
            <SkeletonBlock className="w-24 h-24 rounded-full" />
            <SkeletonBlock className="h-4 w-20" />
        </div>
    )
}

export function SkeletonHero() {
    return (
        <div className="relative w-full aspect-[16/7] rounded-3xl overflow-hidden">
            <SkeletonBlock className="w-full h-full !rounded-3xl" />
        </div>
    )
}
