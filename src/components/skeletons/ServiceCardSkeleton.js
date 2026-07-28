"use client"

export default function ServiceCardSkeleton() {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="h-2 bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="p-6">
                <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 mb-4 animate-pulse" />
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg mb-2 w-3/4 animate-pulse" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4 w-full animate-pulse" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4 w-1/2 animate-pulse" />
                <div className="flex justify-between items-center">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-20 animate-pulse" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-24 animate-pulse" />
                </div>
            </div>
        </div>
    )
}