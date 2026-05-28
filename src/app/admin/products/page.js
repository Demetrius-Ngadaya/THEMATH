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
    Textarea,
    Select,
    SelectItem,
    Divider
} from "@nextui-org/react"
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiUpload, FiEye } from "react-icons/fi"
import { showSuccess, showError, showConfirm } from "@/utils/sweetalert"
import { getImageUrl, validateImage } from "@/utils/imageHelper"
import ProductImage from "@/components/ProductImage"

export default function AdminProducts() {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [showViewModal, setShowViewModal] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [editingProduct, setEditingProduct] = useState(null)
    const [categories, setCategories] = useState([])
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        buying_price: '',
        stock: '',
        stock_alert_qty: '5',
        category_id: '',
        description: ''
    })
    const [selectedImage, setSelectedImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [profitPreview, setProfitPreview] = useState(0)

    const [debouncedSearch, setDebouncedSearch] = useState('')

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
            setPage(1)
        }, 500)
        return () => clearTimeout(timer)
    }, [search])

    // Fetch products when dependencies change
    useEffect(() => {
        fetchProducts()
        fetchCategories()
    }, [debouncedSearch, page, perPage])

    // Calculate profit preview
    useEffect(() => {
        const price = parseFloat(formData.price) || 0
        const buyingPrice = parseFloat(formData.buying_price) || 0
        setProfitPreview(price - buyingPrice)
    }, [formData.price, formData.buying_price])

    const fetchProducts = async () => {
        setIsLoading(true)
        try {
            const token = Cookies.get('admin_token')
            const response = await axios.get('https://backendapi.emcc-lab.com/api/admin/products', {
                params: { search: debouncedSearch, page, per_page: perPage },
                headers: { Authorization: `Bearer ${token}` }
            })
            console.log('Products fetched:', response.data)
            setProducts(response.data.data)
            setTotalPages(response.data.last_page || 1)
        } catch (error) {
            console.error("Error fetching products:", error)
            showError('Error', 'Failed to fetch products')
        } finally {
            setIsLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const token = Cookies.get('admin_token')
            const response = await axios.get('https://backendapi.emcc-lab.com/api/admin/categories', {
                params: { per_page: 100 },
                headers: { Authorization: `Bearer ${token}` }
            })

            console.log('Categories API Response:', response.data)

            let categoriesData = []

            // Handle Laravel pagination response
            if (response.data && response.data.data) {
                categoriesData = response.data.data
            }
            // Handle direct array response
            else if (Array.isArray(response.data)) {
                categoriesData = response.data
            }

            console.log('Extracted categories:', categoriesData)
            setCategories(categoriesData)
        } catch (error) {
            console.error("Error fetching categories:", error)
            setCategories([])
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.name || !formData.price || !formData.stock || !formData.category_id) {
            showError('Error', 'Please fill in all required fields')
            return
        }

        setIsSubmitting(true)

        try {
            const token = Cookies.get('admin_token')
            let productId

            if (editingProduct) {
                // Update product
                await axios.put(`https://backendapi.emcc-lab.com/api/admin/products/${editingProduct.id}`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                productId = editingProduct.id
                showSuccess('Updated', 'Product updated successfully')
            } else {
                // Create new product
                const response = await axios.post('https://backendapi.emcc-lab.com/api/admin/products',
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                productId = response.data.id
                showSuccess('Created', 'Product created successfully')
            }

            // Upload image if selected
            if (selectedImage) {
                const imageData = new FormData()
                imageData.append('image', selectedImage)

                const uploadResponse = await axios.post(
                    `https://backendapi.emcc-lab.com/api/admin/products/${productId}/images`,
                    imageData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                )

                console.log('Image upload response:', uploadResponse.data)

                if (uploadResponse.data.success) {
                    showSuccess('Success', 'Image uploaded successfully')
                } else {
                    showError('Error', 'Failed to upload image')
                }
            }

            setShowModal(false)
            resetForm()
            fetchProducts()
        } catch (error) {
            console.error("Error saving product:", error)
            const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to save product'
            showError('Error', errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (productId, productName) => {
        const result = await showConfirm('Delete Product', `Delete "${productName}"? This action cannot be undone.`)
        if (result.isConfirmed) {
            try {
                const token = Cookies.get('admin_token')
                await axios.delete(`https://backendapi.emcc-lab.com/api/admin/products/${productId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                showSuccess('Deleted', 'Product deleted successfully')
                fetchProducts()
            } catch (error) {
                console.error("Error deleting product:", error)
                showError('Error', 'Failed to delete product')
            }
        }
    }

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            buying_price: '',
            stock: '',
            stock_alert_qty: '5',
            category_id: '',
            description: ''
        })
        setSelectedImage(null)
        setImagePreview(null)
        setEditingProduct(null)
        setProfitPreview(0)
    }

    const handleEdit = (product) => {
        setEditingProduct(product)
        setFormData({
            name: product.name,
            price: product.price,
            selling_price: product.price,
            buying_price: product.buying_price || '',
            stock: product.stock,
            stock_alert_qty: product.stock_alert_qty || '5',
            category_id: product.category_id,
            description: product.description || ''
        })
        if (product.images && product.images.length > 0) {
            setImagePreview(getImageUrl(product.images[0].path))
        }
        setProfitPreview(product.price - (product.buying_price || 0))
        setShowModal(true)
    }

    const handleView = (product) => {
        setSelectedProduct(product)
        setShowViewModal(true)
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const validationError = validateImage(file)
            if (validationError) {
                showError('Error', validationError)
                return
            }

            setSelectedImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    if (isLoading && products.length === 0) {
        return (
            <div className="flex justify-center items-center h-96">
                <Spinner size="lg" color="primary" />
            </div>
        )
    }

    return (
        <div className="space-y-2 px-4">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <p className="text-gray-500 px-6 mt-1">Manage your product inventory</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 py-4 w-full md:w-auto">
                    <Input
                        placeholder="Search products..."
                        startContent={<FiSearch className="text-gray-400" />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full sm:w-80"
                        size="md"
                    />
                    <Button
                        color="primary"
                        startContent={<FiPlus />}
                        onPress={() => {
                            resetForm()
                            setShowModal(true)
                        }}
                        className="whitespace-nowrap"
                    >
                        Add Product
                    </Button>
                </div>
            </div>

            {/* Products Table */}
            <Card>
                <CardBody className="p-0">
                    <div className="overflow-x-auto">
                        <Table
                            aria-label="Products table"
                            removeWrapper
                            classNames={{
                                table: "min-w-[800px]",
                            }}
                        >
                            <TableHeader>
                                <TableColumn className="bg-gray-50">S/N</TableColumn>
                                <TableColumn className="bg-gray-50">IMAGE</TableColumn>
                                <TableColumn className="bg-gray-50">NAME</TableColumn>
                                <TableColumn className="bg-gray-50">SELLING PRICE</TableColumn>
                                <TableColumn className="bg-gray-50">STOCK</TableColumn>
                                <TableColumn className="bg-gray-50">ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody emptyContent={"No products found"}>
                                {products.map((product, index) => {
                                    const imagePath = product.images && product.images.length > 0
                                        ? product.images[0].path
                                        : null

                                    return (
                                        <TableRow key={product.id}>
                                            <TableCell>{((page - 1) * perPage) + index + 1}</TableCell>
                                            <TableCell>
                                                <ProductImage
                                                    path={imagePath}
                                                    alt={product.name}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{product.name}</p>
                                                    {product.description && (
                                                        <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                                            {product.description.substring(0, 50)}...
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-semibold text-green-600">
                                                    TSh {product.price?.toLocaleString()}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    color={product.stock === 0 ? 'danger' : product.stock <= product.stock_alert_qty ? 'warning' : 'success'}
                                                    size="sm"
                                                    variant="flat"
                                                >
                                                    {product.stock} in stock
                                                    {product.stock <= product.stock_alert_qty && product.stock > 0 && (
                                                        <span className="ml-1 text-xs">(Low)</span>
                                                    )}
                                                </Chip>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="light"
                                                        isIconOnly
                                                        onPress={() => handleView(product)}
                                                        title="View Details"
                                                    >
                                                        <FiEye className="h-4 w-4 text-blue-600" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="light"
                                                        isIconOnly
                                                        onPress={() => handleEdit(product)}
                                                        title="Edit Product"
                                                    >
                                                        <FiEdit2 className="h-4 w-4 text-green-600" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="light"
                                                        isIconOnly
                                                        onPress={() => handleDelete(product.id, product.name)}
                                                        title="Delete Product"
                                                    >
                                                        <FiTrash2 className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Controller */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Rows per page:</span>
                                <Select
                                    size="sm"
                                    className="w-20"
                                    selectedKeys={[perPage.toString()]}
                                    onChange={(e) => {
                                        setPerPage(Number(e.target.value))
                                        setPage(1)
                                    }}
                                >
                                    <SelectItem key="10" value="10">10</SelectItem>
                                    <SelectItem key="25" value="25">25</SelectItem>
                                    <SelectItem key="50" value="50">50</SelectItem>
                                    <SelectItem key="100" value="100">100</SelectItem>
                                </Select>
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

            {/* Create/Edit Product Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false)
                    resetForm()
                }}
                size="2xl"
                scrollBehavior="inside"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="border-b">
                                <h2 className="text-xl font-bold">
                                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                                </h2>
                            </ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Left Column */}
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Product Name <span className="text-red-500">*</span>
                                                </label>
                                                <Input
                                                    placeholder="Enter product name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Category <span className="text-red-500">*</span>
                                                </label>
                                                {categories.length === 0 ? (
                                                    <div className="text-sm text-red-500 p-2 border border-red-200 rounded-lg bg-red-50">
                                                        No categories found. Please create a category first.
                                                    </div>
                                                ) : (
                                                    <Select
                                                        placeholder="Select category"
                                                        selectedKeys={formData.category_id ? [formData.category_id.toString()] : []}
                                                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                                        required
                                                        isRequired
                                                    >
                                                        {categories.map((cat) => (
                                                            <SelectItem key={cat.id} value={cat.id.toString()}>
                                                                {cat.name}
                                                            </SelectItem>
                                                        ))}
                                                    </Select>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Description
                                                </label>
                                                <Textarea
                                                    placeholder="Product description"
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    rows={4}
                                                />
                                            </div>
                                        </div>

                                        {/* Right Column */}
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Selling Price (TSh) <span className="text-red-500">*</span>
                                                </label>
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                    required
                                                    startContent={<span className="text-gray-400">TSh</span>}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Buying Price (TSh)
                                                </label>
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={formData.buying_price}
                                                    onChange={(e) => setFormData({ ...formData, buying_price: e.target.value })}
                                                    startContent={<span className="text-gray-400">TSh</span>}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Stock Quantity <span className="text-red-500">*</span>
                                                </label>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    value={formData.stock}
                                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Stock Alert Quantity
                                                </label>
                                                <Input
                                                    type="number"
                                                    placeholder="5"
                                                    value={formData.stock_alert_qty}
                                                    onChange={(e) => setFormData({ ...formData, stock_alert_qty: e.target.value })}
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Alert when stock falls below this number
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Profit Preview */}
                                    {profitPreview !== 0 && (
                                        <div className={`p-4 rounded-lg ${profitPreview > 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">Expected Profit per Unit:</span>
                                                <span className={`text-xl font-bold ${profitPreview > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    TSh {profitPreview.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Image Upload Section */}
                                    <div className="border-t pt-4">
                                        <label className="block text-sm font-medium mb-2">
                                            Product Image
                                        </label>
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
                                                            setSelectedImage(null)
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
                                            <p className="text-xs text-gray-500">Max file size: 2MB (JPG, PNG, GIF)</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4 border-t">
                                        <Button variant="flat" onPress={onClose}>
                                            Cancel
                                        </Button>
                                        <Button color="primary" type="submit" isLoading={isSubmitting}>
                                            {editingProduct ? 'Update Product' : 'Create Product'}
                                        </Button>
                                    </div>
                                </form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* View Product Modal */}
            <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} size="lg">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="border-b">
                                <h2 className="text-xl font-bold">Product Details</h2>
                            </ModalHeader>
                            <ModalBody>
                                {selectedProduct && (
                                    <div className="space-y-6">
                                        <div className="flex justify-center">
                                            {selectedProduct.images && selectedProduct.images.length > 0 ? (
                                                <img
                                                    src={getImageUrl(selectedProduct.images[0].path)}
                                                    alt={selectedProduct.name}
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

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Product Name</p>
                                                <p className="font-semibold">{selectedProduct.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Category</p>
                                                <p className="font-semibold">{selectedProduct.category?.name || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Selling Price</p>
                                                <p className="font-semibold text-green-600">TSh {selectedProduct.price?.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Buying Price</p>
                                                <p className="font-semibold">TSh {selectedProduct.buying_price?.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Profit per Unit</p>
                                                <p className={`font-semibold ${(selectedProduct.price - (selectedProduct.buying_price || 0)) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    TSh {(selectedProduct.price - (selectedProduct.buying_price || 0)).toLocaleString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Stock Quantity</p>
                                                <p className="font-semibold">
                                                    {selectedProduct.stock} units
                                                    {selectedProduct.stock <= selectedProduct.stock_alert_qty && (
                                                        <Chip color="warning" size="sm" className="ml-2">Low Stock</Chip>
                                                    )}
                                                </p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-sm text-gray-500">Description</p>
                                                <p className="mt-1">{selectedProduct.description || 'No description provided'}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}