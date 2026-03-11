"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HiOutlineSearch, HiX } from "react-icons/hi"
import Link from "next/link"
import Image from "next/image"
// import { useDebounce } from "@/hooks/useDebounce"

export default function SearchBar({ onClose }) {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const searchRef = useRef(null)
    const debouncedQuery = useDebounce(query, 300)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
        if (debouncedQuery.length > 2) {
            setIsLoading(true)
            // Simulate API call
            setTimeout(() => {
                setResults([
                    { id: 1, name: "Product 1", price: 99.99, image: "/product1.jpg" },
                    { id: 2, name: "Product 2", price: 149.99, image: "/product2.jpg" },
                    { id: 3, name: "Product 3", price: 79.99, image: "/product3.jpg" },
                ])
                setIsLoading(false)
                setIsOpen(true)
            }, 500)
        } else {
            setResults([])
            setIsOpen(false)
        }
    }, [debouncedQuery])

    return (
        <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full rounded-full border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
                    autoFocus
                />
                <HiOutlineSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                {query && (
                    <button
                        onClick={() => setQuery("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <HiX className="h-5 w-5" />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 right-0 mt-2 max-h-96 overflow-auto rounded-2xl bg-white shadow-xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                    >
                        {isLoading ? (
                            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                Searching...
                            </div>
                        ) : results.length > 0 ? (
                            <div className="divide-y divide-gray-200 dark:divide-gray-800">
                                {results.map((result) => (
                                    <Link
                                        key={result.id}
                                        href={`/product/${result.id}`}
                                        onClick={() => {
                                            setIsOpen(false)
                                            onClose?.()
                                        }}
                                        className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                                            <Image
                                                src={result.image}
                                                alt={result.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 dark:text-white">
                                                {result.name}
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                ${result.price}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : debouncedQuery.length > 2 ? (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                No products found for "{debouncedQuery}"
                            </div>
                        ) : null}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}