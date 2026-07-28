"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardBody, Button, Input, Select, SelectItem, Spinner, Chip, Pagination } from "@nextui-org/react"
import { FiSearch, FiDownload, FiExternalLink, FiCalendar, FiUser, FiTag } from "react-icons/fi"
import { motion } from "framer-motion"
import Link from "next/link"

export default function ResearchPage() {
    const [papers, setPapers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('')
    const [categories, setCategories] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        fetchCategories()
    }, [])

    useEffect(() => {
        fetchPapers()
    }, [search, category, page])

    const fetchPapers = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get('https://backendapi.emcc-lab.com/api/research/papers', {
                params: { search, category, page, per_page: 12 }
            })
            setPapers(response.data.data)
            setTotalPages(response.data.last_page || 1)
        } catch (error) {
            console.error("Error fetching papers:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://backendapi.emcc-lab.com/api/research/categories')
            setCategories(response.data)
        } catch (error) {
            console.error("Error fetching categories:", error)
        }
    }

    const handleDownload = async (id) => {
        try {
            window.open(`https://backendapi.emcc-lab.com/api/research/papers/${id}/download`, '_blank')
        } catch (error) {
            console.error("Error downloading paper:", error)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        Research Publications
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Explore our collection of research papers, academic publications, and technical documents
                    </p>
                </motion.div>

                {/* Filters */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <Input
                            placeholder="Search by title, author or description..."
                            startContent={<FiSearch className="text-gray-400" />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1"
                            size="lg"
                        />
                        <Select
                            placeholder="All Categories"
                            selectedKeys={category ? [category] : []}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full md:w-64"
                            size="lg"
                        >
                            <SelectItem key="">All Categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat}>{cat}</SelectItem>
                            ))}
                        </Select>
                    </div>
                </div>

                {/* Papers Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner size="lg" color="primary" />
                    </div>
                ) : papers.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No research papers found</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {papers.map((paper, index) => (
                                <motion.div
                                    key={paper.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="h-full hover:shadow-xl transition-shadow">
                                        <CardBody className="p-6">
                                            <div className="mb-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <Chip size="sm" variant="flat" startContent={<FiTag />}>
                                                        {paper.category || 'Uncategorized'}
                                                    </Chip>
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                                                    {paper.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                                    {paper.description}
                                                </p>
                                            </div>

                                            <div className="space-y-2 mb-4">
                                                {paper.author && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <FiUser className="flex-shrink-0" />
                                                        <span>{paper.author}</span>
                                                    </div>
                                                )}
                                                {paper.publication_date && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <FiCalendar className="flex-shrink-0" />
                                                        <span>{new Date(paper.publication_date).toLocaleDateString()}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex gap-2 mt-auto pt-4 border-t">
                                                {paper.paper_link && (
                                                    <Button
                                                        as="a"
                                                        href={paper.paper_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        color="primary"
                                                        variant="flat"
                                                        startContent={<FiExternalLink />}
                                                        className="flex-1"
                                                        size="sm"
                                                    >
                                                        View Online
                                                    </Button>
                                                )}
                                                {paper.pdf_file && (
                                                    <Button
                                                        color="success"
                                                        variant="flat"
                                                        startContent={<FiDownload />}
                                                        className="flex-1"
                                                        size="sm"
                                                        onPress={() => handleDownload(paper.id)}
                                                    >
                                                        Download PDF
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="flex justify-between items-center mt-3 pt-2 text-xs text-gray-400 border-t">
                                                <span>{paper.view_count || 0} views</span>
                                                <span>{paper.download_count || 0} downloads</span>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-8">
                                <Pagination
                                    total={totalPages}
                                    page={page}
                                    onChange={setPage}
                                    color="primary"
                                    size="lg"
                                    showControls
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}