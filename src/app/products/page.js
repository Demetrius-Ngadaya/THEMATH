// app/products/page.js
"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { PublicAPI } from "@/services/publicApi"
import ProductGrid from "@/components/ProductGrid"
import { motion } from "framer-motion"
import { Input, Select, SelectItem, Button, Card, CardBody, Spinner, Chip } from "@nextui-org/react"
import { FiSearch, FiX, FiFilter } from "react-icons/fi"

export default function Products() {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [categories, setCategories] = useState([])
    const [pagination, setPagination] = useState(null)
    const [searchInput, setSearchInput] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("")
    const [showFilters, setShowFilters] = useState(false)

    const searchParams = useSearchParams()
    const router = useRouter()

    // Get initial values from URL
    const searchQuery = searchParams.get('search') || ""
    const categoryId = searchParams.get('category_id') || ""

    useEffect(() => {
        setSearchInput(searchQuery)
        setSelectedCategory(categoryId)
    }, [searchQuery, categoryId])

    useEffect(() => {
        fetchCategories()
    }, [])

    useEffect(() => {
        fetchProducts()
    }, [searchQuery, categoryId])

    const fetchCategories = async () => {
        try {
            const response = await PublicAPI.getCategories()
            // Handle different response formats
            let categoriesData = []
            if (response.data && Array.isArray(response.data)) {
                categoriesData = response.data
            } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
                categoriesData = response.data.data
            } else if (Array.isArray(response)) {
                categoriesData = response
            }
            setCategories(categoriesData)
        } catch (error) {
            console.error("Error fetching categories:", error)
            setCategories([])
        }
    }

    const fetchProducts = async () => {
        setIsLoading(true)
        try {
            const params = {}
            if (searchQuery) params.search = searchQuery
            if (categoryId) params.category_id = categoryId

            const response = await PublicAPI.getProducts(params)

            const productData = response.data?.data || response.data || []
            setProducts(Array.isArray(productData) ? productData : [])

            if (response.data?.meta) {
                setPagination(response.data.meta)
            } else if (response.meta) {
                setPagination(response.meta)
            }
        } catch (error) {
            console.error("Error fetching products:", error)
            setProducts([])
        } finally {
            setIsLoading(false)
        }
    }

    const handleSearch = () => {
        const params = new URLSearchParams()
        if (searchInput) params.set('search', searchInput)
        if (selectedCategory) params.set('category_id', selectedCategory)
        router.push(`/products?${params.toString()}`)
    }

    const handleClearFilters = () => {
        setSearchInput("")
        setSelectedCategory("")
        router.push('/products')
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    // Safely create categories list - ensure categories is an array
    const categoriesList = [
        { id: "", name: "All Categories" },
        ...(Array.isArray(categories) ? categories.map(cat => ({ id: cat.id, name: cat.name })) : [])
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Our Products</h1>
                    <p className="text-center text-blue-100 max-w-2xl mx-auto">
                        Discover our collection of quality products at competitive prices
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Filters - Desktop */}
                    <div className="hidden lg:block">
                        <div className="sticky top-24">
                            <Card>
                                <CardBody className="p-6">
                                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                        <FiFilter className="h-5 w-5" />
                                        Filters
                                    </h3>

                                    {/* Search Input */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Search Products
                                        </label>
                                        <Input
                                            placeholder="Search by name..."
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            startContent={<FiSearch className="text-gray-400" />}
                                            endContent={
                                                searchInput && (
                                                    <button
                                                        onClick={() => setSearchInput("")}
                                                        className="focus:outline-none"
                                                        type="button"
                                                    >
                                                        <FiX className="text-gray-400 hover:text-gray-600" />
                                                    </button>
                                                )
                                            }
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Category Filter */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category
                                        </label>
                                        <Select
                                            selectedKeys={selectedCategory ? [selectedCategory] : []}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            placeholder="Select category"
                                            className="w-full"
                                        >
                                            {categoriesList.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    </div>

                                    {/* Filter Actions */}
                                    <div className="space-y-2">
                                        <Button
                                            color="primary"
                                            className="w-full"
                                            startContent={<FiSearch />}
                                            onPress={handleSearch}
                                        >
                                            Search 
                                        </Button>
                                        {(searchInput || selectedCategory) && (
                                            <Button
                                                variant="light"
                                                className="w-full"
                                                onPress={handleClearFilters}
                                            >
                                                Clear Filters
                                            </Button>
                                        )}
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </div>

                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden mb-4">
                        <Button
                            color="primary"
                            variant="flat"
                            startContent={<FiFilter />}
                            onPress={() => setShowFilters(!showFilters)}
                            className="w-full"
                        >
                            {showFilters ? "Hide Filters" : "Show Filters"}
                        </Button>
                    </div>

                    {/* Mobile Filters */}
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden mb-6"
                        >
                            <Card>
                                <CardBody className="p-6">
                                    <h3 className="font-semibold text-lg mb-4">Filters</h3>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Search Products
                                        </label>
                                        <Input
                                            placeholder="Search by name..."
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            startContent={<FiSearch className="text-gray-400" />}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category
                                        </label>
                                        <Select
                                            selectedKeys={selectedCategory ? [selectedCategory] : []}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            placeholder="Select category"
                                        >
                                            {categoriesList.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            color="primary"
                                            className="flex-1"
                                            onPress={handleSearch}
                                        >
                                            Apply
                                        </Button>
                                        {(searchInput || selectedCategory) && (
                                            <Button
                                                variant="light"
                                                className="flex-1"
                                                onPress={handleClearFilters}
                                            >
                                                Clear
                                            </Button>
                                        )}
                                    </div>
                                </CardBody>
                            </Card>
                        </motion.div>
                    )}

                    {/* Products Grid */}
                    <div className="lg:col-span-3">
                        {/* Results Summary */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                {!isLoading && products.length > 0 && (
                                    <p className="text-gray-600">
                                        Showing {products.length} products
                                        {(searchQuery || selectedCategory) && (
                                            <span className="text-gray-500 text-sm ml-2">
                                                (filtered)
                                            </span>
                                        )}
                                    </p>
                                )}
                            </div>
                            {(searchQuery || selectedCategory) && (
                                <Button
                                    size="sm"
                                    variant="light"
                                    onPress={handleClearFilters}
                                    className="text-gray-500"
                                >
                                    Clear all filters
                                </Button>
                            )}
                        </div>

                        {/* Active Filters */}
                        {(searchQuery || selectedCategory) && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {searchQuery && (
                                    <Chip
                                        onClose={() => {
                                            setSearchInput("")
                                            handleClearFilters()
                                        }}
                                        variant="flat"
                                        color="primary"
                                        size="sm"
                                    >
                                        Search: {searchQuery}
                                    </Chip>
                                )}
                                {selectedCategory && (
                                    <Chip
                                        onClose={() => {
                                            setSelectedCategory("")
                                            handleClearFilters()
                                        }}
                                        variant="flat"
                                        color="primary"
                                        size="sm"
                                    >
                                        Category: {categories.find(c => c.id == selectedCategory)?.name || selectedCategory}
                                    </Chip>
                                )}
                            </div>
                        )}

                        {/* Products Display */}
                        {isLoading ? (
                            <div className="flex justify-center items-center py-12">
                                <Spinner size="lg" color="primary" />
                            </div>
                        ) : products.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12 bg-white rounded-lg shadow-sm"
                            >
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiSearch className="h-12 w-12 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                                <p className="text-gray-500 mb-4">
                                    {searchQuery || selectedCategory
                                        ? "Try adjusting your search or filter criteria"
                                        : "Check back later for new products"}
                                </p>
                                {(searchQuery || selectedCategory) && (
                                    <Button color="primary" variant="flat" onPress={handleClearFilters}>
                                        Clear all filters
                                    </Button>
                                )}
                            </motion.div>
                        ) : (
                            <ProductGrid products={products} isLoading={isLoading} />
                        )}

                        {/* Pagination */}
                        {pagination && pagination.last_page > 1 && (
                            <div className="flex justify-center gap-2 mt-8">
                                <Button
                                    size="sm"
                                    variant="flat"
                                    isDisabled={pagination.current_page === 1}
                                    onPress={() => {
                                        const params = new URLSearchParams(searchParams)
                                        params.set('page', pagination.current_page - 1)
                                        router.push(`/products?${params.toString()}`)
                                    }}
                                >
                                    Previous
                                </Button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                                        let pageNum
                                        if (pagination.last_page <= 5) {
                                            pageNum = i + 1
                                        } else if (pagination.current_page <= 3) {
                                            pageNum = i + 1
                                        } else if (pagination.current_page >= pagination.last_page - 2) {
                                            pageNum = pagination.last_page - 4 + i
                                        } else {
                                            pageNum = pagination.current_page - 2 + i
                                        }

                                        if (pageNum < 1 || pageNum > pagination.last_page) return null

                                        return (
                                            <Button
                                                key={pageNum}
                                                size="sm"
                                                variant={pagination.current_page === pageNum ? "solid" : "flat"}
                                                color={pagination.current_page === pageNum ? "primary" : "default"}
                                                isIconOnly
                                                onPress={() => {
                                                    const params = new URLSearchParams(searchParams)
                                                    params.set('page', pageNum)
                                                    router.push(`/products?${params.toString()}`)
                                                }}
                                            >
                                                {pageNum}
                                            </Button>
                                        )
                                    })}
                                </div>
                                <Button
                                    size="sm"
                                    variant="flat"
                                    isDisabled={pagination.current_page === pagination.last_page}
                                    onPress={() => {
                                        const params = new URLSearchParams(searchParams)
                                        params.set('page', pagination.current_page + 1)
                                        router.push(`/products?${params.toString()}`)
                                    }}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}