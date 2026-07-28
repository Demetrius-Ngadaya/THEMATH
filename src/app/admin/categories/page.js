"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import {
    Card,
    CardBody,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Spinner,
    Button,
    Input,
    Pagination,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Divider
} from "@nextui-org/react"
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiUpload, FiEye } from "react-icons/fi"
import { showSuccess, showError, showConfirm } from "@/utils/sweetalert"
import { getImageUrl, validateImage } from "@/utils/imageHelper"

export default function AdminCategories() {
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const [editingCategory, setEditingCategory] = useState(null)
    const [viewingCategory, setViewingCategory] = useState(null)
    const [formData, setFormData] = useState({ name: '', image: null })
    const [imagePreview, setImagePreview] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure()

    useEffect(() => {
        fetchCategories()
    }, [search, page, perPage])

    const fetchCategories = async () => {
        setIsLoading(true)
        try {
            const token = Cookies.get('admin_token')
            const response = await axios.get('https://backendapi.emcc-lab.com//api/admin/categories', {
                params: { search, page, per_page: perPage },
                headers: { Authorization: `Bearer ${token}` }
            })
            console.log('Categories fetched:', response.data)
            setCategories(response.data.data || response.data)
            setTotalPages(response.data.last_page || 1)
        } catch (error) {
            console.error("Error fetching categories:", error)
            showError('Error', 'Failed to fetch categories')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const token = Cookies.get('admin_token')
            const submitData = new FormData()

            submitData.append('name', formData.name)

            if (formData.image) {
                submitData.append('image', formData.image)
            }

            if (editingCategory) {
                // For update, Laravel needs POST with _method PUT for file uploads
                submitData.append('_method', 'PUT')
                await axios.post(`https://backendapi.emcc-lab.com//api/admin/categories/${editingCategory.id}`,
                    submitData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                )
                showSuccess('Updated', 'Category updated successfully')
            } else {
                await axios.post('https://backendapi.emcc-lab.com//api/admin/categories',
                    submitData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                )
                showSuccess('Created', 'Category created successfully')
            }

            onClose()
            resetForm()
            fetchCategories()
        } catch (error) {
            console.error("Error saving category:", error)
            showError('Error', error.response?.data?.error || 'Failed to save category')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (categoryId, categoryName) => {
        const result = await showConfirm('Delete Category', `Delete category "${categoryName}"? This will also delete all products in this category.`)
        if (result.isConfirmed) {
            try {
                const token = Cookies.get('admin_token')
                await axios.delete(`https://backendapi.emcc-lab.com//api/admin/categories/${categoryId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                showSuccess('Deleted', 'Category deleted successfully')
                fetchCategories()
            } catch (error) {
                showError('Error', error.response?.data?.message || 'Failed to delete category')
            }
        }
    }

    const handleEdit = (category) => {
        setEditingCategory(category)
        setFormData({ name: category.name, image: null })
        if (category.image) {
            setImagePreview(getImageUrl(category.image))
        } else {
            setImagePreview(null)
        }
        onOpen()
    }

    const handleView = (category) => {
        setViewingCategory(category)
        onViewOpen()
    }

    const handleAdd = () => {
        resetForm()
        onOpen()
    }

    const resetForm = () => {
        setEditingCategory(null)
        setFormData({ name: '', image: null })
        setImagePreview(null)
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const validationError = validateImage(file)
            if (validationError) {
                showError('Error', validationError)
                return
            }

            setFormData({ ...formData, image: file })
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    // COMMENTED OUT - Full page loading spinner removed for faster load
    // if (isLoading) {
    //     return (
    //         <div className="flex justify-center items-center h-96">
    //             <Spinner size="lg" color="primary" />
    //         </div>
    //     )
    // }

    return (
        <div>
            <div className="flex justify-between items-center mb-4 mt-4 px-4">
                <div>
                    {/* <h1 className="text-2xl font-bold text-gray-800">Categories Management</h1> */}
                    <p className="text-gray-500 mt-1">Manage your product categories</p>
                </div>
                <div className="flex gap-3">
                    <Input
                        placeholder="Search categories..."
                        startContent={<FiSearch className="text-gray-400" />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-64"
                        size="sm"
                    />
                    <Button
                        color="primary"
                        startContent={<FiPlus />}
                        onPress={handleAdd}
                    >
                        Add Category
                    </Button>
                </div>
            </div>

            <Card>
                <CardBody>
                    <div className="overflow-x-auto">
                        <Table aria-label="Categories table">
                            <TableHeader>
                                <TableColumn>#</TableColumn>
                                <TableColumn>IMAGE</TableColumn>
                                <TableColumn>NAME</TableColumn>
                                <TableColumn>SLUG</TableColumn>
                                <TableColumn>PRODUCTS</TableColumn>
                                <TableColumn>CREATED</TableColumn>
                                <TableColumn>ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody
                                isLoading={isLoading}
                                loadingContent={<Spinner label="Loading categories..." />}
                                emptyContent="No categories found"
                            >
                                {categories.map((category, index) => (
                                    <TableRow key={category.id}>
                                        <TableCell>{((page - 1) * perPage) + index + 1}</TableCell>
                                        <TableCell>
                                            {category.image ? (
                                                <img
                                                    src={getImageUrl(category.image)}
                                                    alt={category.name}
                                                    className="w-12 h-12 object-cover rounded-lg"
                                                    onError={(e) => {
                                                        e.target.src = '/placeholder.jpg'
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <FiUpload className="text-gray-400" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-medium">{category.name}</span>
                                        </TableCell>
                                        <TableCell>
                                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">{category.slug}</code>
                                        </TableCell>
                                        <TableCell>
                                            <Chip size="sm" color="primary" variant="flat">
                                                {category.products_count || 0} products
                                            </Chip>
                                        </TableCell>
                                        <TableCell>{new Date(category.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="light"
                                                    isIconOnly
                                                    onPress={() => handleView(category)}
                                                    title="View Details"
                                                >
                                                    <FiEye className="h-4 w-4 text-blue-600" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="light"
                                                    isIconOnly
                                                    onPress={() => handleEdit(category)}
                                                    title="Edit Category"
                                                >
                                                    <FiEdit2 className="h-4 w-4 text-green-600" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="light"
                                                    isIconOnly
                                                    onPress={() => handleDelete(category.id, category.name)}
                                                    title="Delete Category"
                                                >
                                                    <FiTrash2 className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Controller */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t mt-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Rows per page:</span>
                                <select
                                    className="border rounded-md px-2 py-1 text-sm"
                                    value={perPage}
                                    onChange={(e) => {
                                        setPerPage(Number(e.target.value))
                                        setPage(1)
                                    }}
                                >
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>

                            <Pagination
                                total={totalPages}
                                page={page}
                                onChange={setPage}
                                color="primary"
                                showControls
                                size="md"
                            />

                            <div className="text-sm text-gray-600">
                                Page {page} of {totalPages}
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Category Modal with Image Upload */}
            <Modal isOpen={isOpen} onClose={() => {
                resetForm()
                onClose()
            }} size="md">
                <ModalContent>
                    <ModalHeader>{editingCategory ? 'Edit Category' : 'Add New Category'}</ModalHeader>
                    <ModalBody>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Category Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Electronics, Clothing, Books"
                                required
                                isRequired
                            />

                            {/* Image Upload Section */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Category Image</label>
                                <div className="flex items-center gap-4">
                                    {imagePreview && (
                                        <div className="relative">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-20 h-20 object-cover rounded-lg border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData({ ...formData, image: null })
                                                    setImagePreview(null)
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                                            >
                                                <FiTrash2 size={12} />
                                            </button>
                                        </div>
                                    )}
                                    <label className="cursor-pointer">
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-primary transition-colors text-center">
                                            <FiUpload className="mx-auto h-8 w-8 text-gray-400" />
                                            <span className="text-sm text-gray-500 mt-1 block">
                                                {imagePreview ? 'Change Image' : 'Upload Image'}
                                            </span>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Recommended: Square image, max 2MB (JPG, PNG, GIF)</p>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button variant="flat" onPress={() => {
                                    resetForm()
                                    onClose()
                                }}>
                                    Cancel
                                </Button>
                                <Button color="primary" type="submit" isLoading={isSubmitting}>
                                    {editingCategory ? 'Update Category' : 'Create Category'}
                                </Button>
                            </div>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* View Category Modal */}
            <Modal isOpen={isViewOpen} onClose={onViewClose} size="lg">
                <ModalContent>
                    <ModalHeader className="border-b">
                        <h2 className="text-xl font-bold">Category Details</h2>
                    </ModalHeader>
                    <ModalBody>
                        {viewingCategory && (
                            <div className="space-y-6">
                                {/* Category Image */}
                                <div className="flex justify-center">
                                    {viewingCategory.image ? (
                                        <img
                                            src={getImageUrl(viewingCategory.image)}
                                            alt={viewingCategory.name}
                                            className="w-48 h-48 object-cover rounded-lg shadow-lg"
                                            onError={(e) => {
                                                console.error('Image load error:', e.target.src)
                                                e.target.src = '/placeholder.jpg'
                                            }}
                                        />
                                    ) : (
                                        <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <FiUpload className="text-gray-400 text-4xl" />
                                        </div>
                                    )}
                                </div>

                                <Divider />

                                {/* Category Information */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Category Name</p>
                                        <p className="font-semibold text-lg">{viewingCategory.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Slug</p>
                                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">{viewingCategory.slug}</code>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total Products</p>
                                        <Chip size="sm" color="primary" variant="flat">
                                            {viewingCategory.products_count || 0} products
                                        </Chip>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Created Date</p>
                                        <p className="text-sm">{new Date(viewingCategory.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Created Time</p>
                                        <p className="text-sm">{new Date(viewingCategory.created_at).toLocaleTimeString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Last Updated</p>
                                        <p className="text-sm">{new Date(viewingCategory.updated_at).toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Products in this category - if needed */}
                                {viewingCategory.products_count > 0 && (
                                    <>
                                        <Divider />
                                        <div>
                                            <p className="text-sm text-gray-500 mb-2">Category Summary</p>
                                            <p className="text-sm">
                                                This category contains <strong>{viewingCategory.products_count}</strong> products.
                                                You can view and manage these products in the Products section.
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onPress={onViewClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}