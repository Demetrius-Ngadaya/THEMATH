"use client"

import { useState, useEffect, useRef } from "react"
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Button, Input, Modal, ModalContent, ModalHeader, ModalBody,
    ModalFooter, useDisclosure, Switch, Spinner, Textarea,
    Tooltip, Image
} from "@nextui-org/react"
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiSearch } from "react-icons/fi"
import API, { axiosInstance } from "@/services/api"
import { toast } from "react-hot-toast"

export default function AdminStemProductsPage() {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [editingProduct, setEditingProduct] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        icon: "FaRocket",
        color: "blue",
        price: "",
        is_active: true,
        sort_order: 0
    })
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState("")
    const fileInputRef = useRef(null)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            setIsLoading(true)
            const response = await API.get('/stem-products')
            if (response.data.success) {
                setProducts(response.data.data)
            }
        } catch (error) {
            console.error('Error fetching products:', error)
            toast.error('Failed to load products')
        } finally {
            setIsLoading(false)
        }
    }

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product)
            setFormData({
                name: product.name,
                description: product.description,
                icon: product.icon || "FaRocket",
                color: product.color || "blue",
                price: product.price || "",
                is_active: product.is_active,
                sort_order: product.sort_order || 0
            })
            setImagePreview(product.image || "")
        } else {
            setEditingProduct(null)
            setFormData({
                name: "",
                description: "",
                icon: "FaRocket",
                color: "blue",
                price: "",
                is_active: true,
                sort_order: 0
            })
            setImagePreview("")
        }
        setImageFile(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        onOpen()
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        console.log('Selected file:', file)

        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file')
                e.target.value = ''
                return
            }

            if (file.size > 2 * 1024 * 1024) {
                toast.error('Image size must be less than 2MB')
                e.target.value = ''
                return
            }

            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        } else {
            setImageFile(null)
            setImagePreview("")
        }
    }

    const removeImage = () => {
        setImageFile(null)
        setImagePreview("")
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleSubmit = async () => {
        if (isSubmitting) return

        try {
            setIsSubmitting(true)

            const data = new FormData()
            data.append('name', formData.name)
            data.append('description', formData.description)
            data.append('icon', formData.icon)
            data.append('color', formData.color)
            data.append('price', String(formData.price || 0))
            data.append('is_active', formData.is_active ? '1' : '0')
            data.append('sort_order', String(formData.sort_order || 0))

            if (imageFile && imageFile instanceof File) {
                console.log('Appending image file:', imageFile.name, imageFile.size)
                data.append('image', imageFile)
            }

            let url = '/admin/stem-products'

            if (editingProduct) {
                data.append('_method', 'PUT')
                url = `/admin/stem-products/${editingProduct.id}`
            }

            // Log FormData contents
            for (let pair of data.entries()) {
                console.log(pair[0], pair[1]);
            }

            // Use axiosInstance for file uploads
            const response = await axiosInstance.post(url, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (response.data.success) {
                toast.success(editingProduct ? 'Product updated successfully' : 'Product created successfully')
                onClose()
                fetchProducts()
            }

        } catch (error) {
            console.error('Error saving product:', error)
            console.error('Error response:', error.response?.data)

            if (error.response?.data?.errors) {
                const errors = error.response.data.errors
                const errorMessages = Object.values(errors).flat().join('\n')
                toast.error(`Validation failed: ${errorMessages}`)
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message)
            } else {
                toast.error('Failed to save product')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await API.delete(`/admin/stem-products/${id}`)
                toast.success('Product deleted successfully')
                fetchProducts()
            } catch (error) {
                console.error('Error deleting product:', error)
                toast.error('Failed to delete product')
            }
        }
    }

    const handleToggleStatus = async (id) => {
        try {
            await API.post(`/admin/stem-products/${id}/toggle-status`)
            toast.success('Product status updated')
            fetchProducts()
        } catch (error) {
            console.error('Error toggling status:', error)
            toast.error('Failed to update status')
        }
    }

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const iconOptions = ["FaRocket", "FaGraduationCap", "FaBriefcase", "FaCog", "FaChartBar", "FaLightbulb", "FaUsers", "FaGlobe"]
    const colorOptions = ["blue", "green", "purple", "red", "yellow", "indigo", "gray", "pink"]

    // Helper function to get image URL
    const getImageUrl = (path) => {
        if (!path) return null
        if (path.startsWith('http')) return path
        return `https://backendapi.emcc-lab.com${path}`
    }

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">STEM Products</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage STEM products displayed on About page</p>
                </div>
                <Button
                    color="primary"
                    startContent={<FiPlus />}
                    onPress={() => handleOpenModal()}
                    className="shadow-lg"
                >
                    Add Product
                </Button>
            </div>

            <div className="mb-6">
                <Input
                    placeholder="Search products..."
                    startContent={<FiSearch className="text-gray-400" />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-md"
                />
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
                <Table aria-label="Products table" removeWrapper>
                    <TableHeader>
                        <TableColumn>Image</TableColumn>
                        <TableColumn>Name</TableColumn>
                        <TableColumn>Price</TableColumn>
                        <TableColumn>Status</TableColumn>
                        <TableColumn align="center">Actions</TableColumn>
                    </TableHeader>
                    <TableBody
                        isLoading={isLoading}
                        loadingContent={<Spinner label="Loading..." />}
                        emptyContent="No products found"
                    >
                        {filteredProducts.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    {product.image ? (
                                        <Image
                                            src={getImageUrl(product.image)}
                                            alt={product.name}
                                            width={50}
                                            height={40}
                                            className="rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-500">No image</div>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>${product.price}</TableCell>
                                <TableCell>
                                    <Switch
                                        isSelected={product.is_active}
                                        onValueChange={() => handleToggleStatus(product.id)}
                                        size="sm"
                                        color="success"
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 justify-center">
                                        <Tooltip content="Edit">
                                            <Button isIconOnly size="sm" variant="light" onPress={() => handleOpenModal(product)}>
                                                <FiEdit2 className="text-blue-500" />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip content={product.is_active ? "Deactivate" : "Activate"}>
                                            <Button isIconOnly size="sm" variant="light" onPress={() => handleToggleStatus(product.id)}>
                                                {product.is_active ? <FiEye className="text-green-500" /> : <FiEyeOff className="text-gray-500" />}
                                            </Button>
                                        </Tooltip>
                                        <Tooltip content="Delete">
                                            <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleDelete(product.id)}>
                                                <FiTrash2 className="text-red-500" />
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
                <ModalContent>
                    <ModalHeader>{editingProduct ? 'Edit Product' : 'Add New Product'}</ModalHeader>
                    <ModalBody>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Name *
                                </label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter product name"
                                    isRequired
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description *
                                </label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Enter product description"
                                    minRows={3}
                                    isRequired
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Icon
                                    </label>
                                    <select
                                        value={formData.icon}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    >
                                        {iconOptions.map((icon) => (
                                            <option key={icon} value={icon}>{icon}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Color
                                    </label>
                                    <select
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    >
                                        {colorOptions.map((color) => (
                                            <option key={color} value={color}>{color}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Price
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Sort Order
                                    </label>
                                    <Input
                                        type="number"
                                        value={formData.sort_order}
                                        onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Image (Optional)
                                </label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                />
                                <p className="text-xs text-gray-500 mt-1">Max size: 2MB. Supported formats: JPG, PNG, GIF, WebP</p>
                                {imagePreview && (
                                    <div className="mt-2">
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            width={100}
                                            height={75}
                                            className="rounded-lg object-cover"
                                        />
                                        <Button
                                            size="sm"
                                            color="danger"
                                            variant="light"
                                            onPress={removeImage}
                                            className="mt-2"
                                        >
                                            Remove Image
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Active
                                </label>
                                <Switch
                                    isSelected={formData.is_active}
                                    onValueChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            onPress={handleSubmit}
                            isLoading={isSubmitting}
                        >
                            {editingProduct ? 'Update' : 'Create'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}