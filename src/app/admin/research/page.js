// app/admin/research/page.js
"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import {
    Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Chip, Spinner, Button, Input, Select, SelectItem, Pagination, Modal, ModalContent,
    ModalHeader, ModalBody, ModalFooter, Textarea, Tooltip, Divider
} from "@nextui-org/react"
import {
    FiPlus, FiEdit2, FiTrash2, FiSearch, FiLink, FiFile, FiUser, FiTag,
    FiCalendar, FiEye, FiDownload, FiExternalLink, FiClock
} from "react-icons/fi"
import { showSuccess, showError, showConfirm } from "@/utils/sweetalert"

export default function AdminResearch() {
    const [papers, setPapers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [perPage, setPerPage] = useState(15)
    const [showModal, setShowModal] = useState(false)
    const [showViewModal, setShowViewModal] = useState(false)
    const [viewingPaper, setViewingPaper] = useState(null)
    const [editingPaper, setEditingPaper] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        paper_link: '',
        author: '',
        publication_date: '',
        category: '',
        is_active: '1'
    })

    useEffect(() => {
        fetchPapers()
    }, [search, page, perPage])

    const fetchPapers = async () => {
        setIsLoading(true)
        try {
            const token = Cookies.get('admin_token')
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'https://backendapi.emcc-lab.com'}/api/admin/research-papers`, {
                params: { search, page, per_page: perPage },
                headers: { Authorization: `Bearer ${token}` }
            })
            setPapers(response.data.data)
            setTotalPages(response.data.last_page || 1)
            setTotalItems(response.data.total || 0)
        } catch (error) {
            console.error("Error fetching research papers:", error)
            showError('Error', error.response?.data?.error || 'Failed to fetch research papers')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.title.trim()) {
            showError('Error', 'Title is required')
            return
        }
        if (!formData.description.trim()) {
            showError('Error', 'Description is required')
            return
        }

        setIsSubmitting(true)
        try {
            const token = Cookies.get('admin_token')
            const formDataToSend = new FormData()

            formDataToSend.append('title', formData.title)
            formDataToSend.append('description', formData.description)

            if (formData.paper_link) formDataToSend.append('paper_link', formData.paper_link)
            if (formData.author) formDataToSend.append('author', formData.author)
            if (formData.publication_date) formDataToSend.append('publication_date', formData.publication_date)
            if (formData.category) formDataToSend.append('category', formData.category)
            formDataToSend.append('is_active', formData.is_active)

            if (selectedFile) {
                formDataToSend.append('pdf_file', selectedFile)
            }

            const url = `${process.env.NEXT_PUBLIC_API_URL || 'https://backendapi.emcc-lab.com'}/api/admin/research-papers`

            if (editingPaper) {
                formDataToSend.append('_method', 'PUT')
                await axios.post(`${url}/${editingPaper.id}`, formDataToSend, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                })
                showSuccess('Success', 'Research paper updated successfully')
            } else {
                await axios.post(url, formDataToSend, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                })
                showSuccess('Success', 'Research paper created successfully')
            }

            setShowModal(false)
            resetForm()
            fetchPapers()
        } catch (error) {
            console.error("Error saving research paper:", error)
            const errorMsg = error.response?.data?.error || 'Failed to save research paper'
            showError('Error', errorMsg)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id, title) => {
        const result = await showConfirm('Delete Paper', `Delete "${title}"? This action cannot be undone.`)
        if (result.isConfirmed) {
            try {
                const token = Cookies.get('admin_token')
                await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'https://backendapi.emcc-lab.com'}/api/admin/research-papers/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                showSuccess('Success', 'Research paper deleted successfully')
                fetchPapers()
            } catch (error) {
                showError('Error', 'Failed to delete research paper')
            }
        }
    }

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            paper_link: '',
            author: '',
            publication_date: '',
            category: '',
            is_active: '1'
        })
        setSelectedFile(null)
        setEditingPaper(null)
    }

    const handleEdit = (paper) => {
        setEditingPaper(paper)
        setFormData({
            title: paper.title,
            description: paper.description,
            paper_link: paper.paper_link || '',
            author: paper.author || '',
            publication_date: paper.publication_date || '',
            category: paper.category || '',
            is_active: paper.is_active ? '1' : '0'
        })
        setShowModal(true)
    }

    const handleView = (paper) => {
        setViewingPaper(paper)
        setShowViewModal(true)
    }

    const formatDate = (date) => {
        if (!date) return 'N/A'
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className="p-4 md:p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0 mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Research Papers</h1>
                        <p className="text-gray-500 mt-1">Manage academic research papers and publications</p>
                    </div>
                    <Button
                        color="primary"
                        size="lg"
                        startContent={<FiPlus />}
                        onPress={() => setShowModal(true)}
                    >
                        Add Research Paper
                    </Button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex-shrink-0 mb-4">
                <Input
                    placeholder="Search by title, author or description..."
                    startContent={<FiSearch className="text-gray-400" />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-md"
                    size="lg"
                />
            </div>

            {/* Table Card */}
            <Card className="flex-1 flex flex-col min-h-0">
                <CardBody className="p-0 flex flex-col min-h-0">
                    <div className="flex-1 overflow-auto min-h-0">
                        <div className="min-w-[1000px] h-full">
                            <Table removeWrapper classNames={{ wrapper: "p-0" }}>
                                <TableHeader>
                                    <TableColumn className="w-[70px]">#</TableColumn>
                                    <TableColumn className="min-w-[250px]">TITLE</TableColumn>
                                    <TableColumn className="min-w-[150px]">AUTHOR</TableColumn>
                                    <TableColumn className="min-w-[120px]">CATEGORY</TableColumn>
                                    <TableColumn className="w-[100px]">STATUS</TableColumn>
                                    <TableColumn className="w-[80px]">VIEWS</TableColumn>
                                    <TableColumn className="w-[100px]">DOWNLOADS</TableColumn>
                                    <TableColumn className="w-[130px]">ACTIONS</TableColumn>
                                </TableHeader>
                                <TableBody
                                    isLoading={isLoading}
                                    loadingContent={<Spinner label="Loading..." />}
                                    emptyContent="No research papers found"
                                >
                                    {papers.map((paper, index) => (
                                        <TableRow key={paper.id}>
                                            <TableCell>{((page - 1) * perPage) + index + 1}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium text-gray-800">{paper.title}</p>
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{paper.description}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <FiUser className="text-gray-400 text-xs" />
                                                    <span className="text-sm">{paper.author || 'N/A'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {paper.category && (
                                                    <Chip size="sm" variant="flat" startContent={<FiTag className="text-xs" />}>
                                                        {paper.category}
                                                    </Chip>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Chip color={paper.is_active ? "success" : "danger"} size="sm">
                                                    {paper.is_active ? 'Active' : 'Inactive'}
                                                </Chip>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm">{paper.view_count || 0}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm">{paper.download_count || 0}</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Tooltip content="View Details">
                                                        <Button size="sm" isIconOnly variant="light" onPress={() => handleView(paper)}>
                                                            <FiEye className="text-green-600" />
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip content="Edit">
                                                        <Button size="sm" isIconOnly variant="light" onPress={() => handleEdit(paper)}>
                                                            <FiEdit2 className="text-blue-600" />
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip content="Delete">
                                                        <Button size="sm" isIconOnly variant="light" onPress={() => handleDelete(paper.id, paper.title)}>
                                                            <FiTrash2 className="text-red-600" />
                                                        </Button>
                                                    </Tooltip>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 0 && totalItems > 0 && (
                        <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t">
                            <div className="text-sm text-gray-500">
                                Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, totalItems)} of {totalItems} papers
                            </div>
                            <div className="flex gap-4">
                                <Select
                                    size="sm"
                                    selectedKeys={[perPage.toString()]}
                                    onChange={(e) => setPerPage(Number(e.target.value))}
                                    className="w-28"
                                >
                                    <SelectItem key="10">10 / page</SelectItem>
                                    <SelectItem key="15">15 / page</SelectItem>
                                    <SelectItem key="20">20 / page</SelectItem>
                                    <SelectItem key="50">50 / page</SelectItem>
                                </Select>
                                <Pagination total={totalPages} page={page} onChange={setPage} color="primary" showControls />
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Create/Edit Modal - All in one card */}
            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false)
                    resetForm()
                }}
                size="2xl"
                scrollBehavior="inside"
                placement="center"
                classNames={{
                    base: "max-h-[90vh]",
                    body: "p-0"
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 border-b pb-4">
                                <h2 className="text-2xl font-bold">
                                    {editingPaper ? 'Edit Research Paper' : 'Add New Research Paper'}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {editingPaper ? 'Update the research paper details' : 'Fill in the research paper information'}
                                </p>
                            </ModalHeader>

                            <form onSubmit={handleSubmit}>
                                <ModalBody>
                                    <div className="p-6 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input
                                                label="Title"
                                                placeholder="Enter research paper title"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                isRequired
                                                isClearable
                                                startContent={<FiFile className="text-gray-400" />}
                                                classNames={{
                                                    label: "after:content-['*'] after:text-red-500 after:ml-0.5"
                                                }}
                                            />
                                            <Input
                                                label="Author"
                                                placeholder="Author name"
                                                value={formData.author}
                                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                                startContent={<FiUser className="text-gray-400" />}
                                            />
                                        </div>

                                        <Textarea
                                            label="Description"
                                            placeholder="Enter paper description..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            isRequired
                                            minRows={3}
                                            maxRows={5}
                                            classNames={{
                                                label: "after:content-['*'] after:text-red-500 after:ml-0.5"
                                            }}
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input
                                                label="Category"
                                                placeholder="Research category"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                startContent={<FiTag className="text-gray-400" />}
                                            />
                                            <Input
                                                label="Paper Link (URL)"
                                                type="url"
                                                placeholder="https://..."
                                                value={formData.paper_link}
                                                onChange={(e) => setFormData({ ...formData, paper_link: e.target.value })}
                                                startContent={<FiLink className="text-gray-400" />}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input
                                                label="Publication Date"
                                                type="date"
                                                value={formData.publication_date}
                                                onChange={(e) => setFormData({ ...formData, publication_date: e.target.value })}
                                                startContent={<FiCalendar className="text-gray-400" />}
                                            />
                                            <Select
                                                label="Status"
                                                selectedKeys={[formData.is_active]}
                                                onChange={(e) => setFormData({ ...formData, is_active: e.target.value })}
                                            >
                                                <SelectItem key="1">Active (Visible to public)</SelectItem>
                                                <SelectItem key="0">Inactive (Hidden from public)</SelectItem>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                PDF File
                                            </label>
                                            <Input
                                                type="file"
                                                accept=".pdf"
                                                onChange={(e) => setSelectedFile(e.target.files[0])}
                                                className="cursor-pointer"
                                            />
                                            {editingPaper?.pdf_file && (
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Current PDF: {editingPaper.pdf_file.split('/').pop()}
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-400 mt-1">
                                                Upload PDF file (Max 10MB). Only upload if you want to add or update the PDF.
                                            </p>
                                            
                                        </div>
                                        
                                    </div>
                                </ModalBody>

                                <ModalFooter className="border-t pt-4">
                                    <Button variant="flat" onPress={onClose} size="lg">
                                        Cancel
                                    </Button>
                                    <Button color="primary" type="submit" isLoading={isSubmitting} size="lg">
                                        {editingPaper ? 'Update Paper' : 'Create Paper'}
                                    </Button>
                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* View Details Modal */}
            <Modal
                isOpen={showViewModal}
                onClose={() => setShowViewModal(false)}
                size="2xl"
                scrollBehavior="inside"
                placement="center"
                classNames={{
                    base: "max-h-[90vh]",
                    body: "p-0"
                }}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 border-b pb-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Paper Details</h2>
                            <Chip color={viewingPaper?.is_active ? "success" : "danger"} size="sm">
                                {viewingPaper?.is_active ? 'Active' : 'Inactive'}
                            </Chip>
                        </div>
                        <p className="text-sm text-gray-500">View complete research paper information</p>
                    </ModalHeader>
                    <ModalBody>
                        {viewingPaper && (
                            <div className="p-6 space-y-6">
                                {/* Title Section */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{viewingPaper.title}</h3>
                                    <Divider />
                                </div>

                                {/* Meta Information Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {viewingPaper.author && (
                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                            <FiUser className="text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500">Author</p>
                                                <p className="font-medium text-gray-800">{viewingPaper.author}</p>
                                            </div>
                                        </div>
                                    )}

                                    {viewingPaper.category && (
                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                            <FiTag className="text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500">Category</p>
                                                <p className="font-medium text-gray-800">{viewingPaper.category}</p>
                                            </div>
                                        </div>
                                    )}

                                    {viewingPaper.publication_date && (
                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                            <FiCalendar className="text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500">Publication Date</p>
                                                <p className="font-medium text-gray-800">{formatDate(viewingPaper.publication_date)}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                        <FiClock className="text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500">Created</p>
                                            <p className="font-medium text-gray-800">{formatDate(viewingPaper.created_at)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Description Section */}
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">Abstract / Description</h4>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                            {viewingPaper.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Stats Section */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                        <FiEye className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-blue-600">{viewingPaper.view_count || 0}</p>
                                        <p className="text-xs text-gray-500">Total Views</p>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                        <FiDownload className="w-5 h-5 text-green-600 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-green-600">{viewingPaper.download_count || 0}</p>
                                        <p className="text-xs text-gray-500">Total Downloads</p>
                                    </div>
                                </div>

                                {/* Links Section */}
                                {(viewingPaper.paper_link || viewingPaper.pdf_file) && (
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-2">Resources</h4>
                                        <div className="space-y-2">
                                            {viewingPaper.paper_link && (
                                                <Button
                                                    as="a"
                                                    href={viewingPaper.paper_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    color="primary"
                                                    variant="flat"
                                                    startContent={<FiExternalLink />}
                                                    className="w-full justify-start"
                                                >
                                                    View Online Paper
                                                </Button>
                                            )}
                                            {viewingPaper.pdf_file && (
                                                <Button
                                                    color="success"
                                                    variant="flat"
                                                    startContent={<FiDownload />}
                                                    className="w-full justify-start"
                                                    onPress={() => {
                                                        window.open(`${process.env.NEXT_PUBLIC_API_URL || 'https://backendapi.emcc-lab.com'}/api/research/papers/${viewingPaper.id}/download`, '_blank')
                                                    }}
                                                >
                                                    Download PDF Document
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter className="border-t pt-4">
                        {viewingPaper && (
                            <Button
                                color="primary"
                                variant="flat"
                                onPress={() => {
                                    setShowViewModal(false)
                                    handleEdit(viewingPaper)
                                }}
                            >
                                Edit Paper
                            </Button>
                        )}
                        <Button variant="flat" onPress={() => setShowViewModal(false)}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}