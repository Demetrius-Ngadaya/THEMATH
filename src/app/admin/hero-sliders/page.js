// app/admin/hero-sliders/page.js
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
    Textarea,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Switch,
    useDisclosure,
    Divider
} from "@nextui-org/react"
import {
    FiEdit2, FiTrash2, FiPlus, FiUpload, FiEye,
    FiImage, FiLink, FiHash, FiCheckCircle, FiXCircle,
    FiCalendar, FiType, FiMessageSquare
} from "react-icons/fi"
import { showSuccess, showError, showConfirm } from "@/utils/sweetalert"
import { getImageUrl, validateImage } from "@/utils/imageHelper"

export default function AdminHeroSliders() {
    const [sliders, setSliders] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [editingSlider, setEditingSlider] = useState(null)
    const [viewingSlider, setViewingSlider] = useState(null)
    const [showViewModal, setShowViewModal] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        button_text: '',
        button_link: '',
        order: 0,
        is_active: true
    })
    const [selectedImage, setSelectedImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        fetchSliders()
    }, [])

    const fetchSliders = async () => {
        setIsLoading(true)
        try {
            const token = Cookies.get('admin_token')
            const response = await axios.get('https://backendapi.emcc-lab.com/api/admin/hero-sliders', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setSliders(response.data)
        } catch (error) {
            console.error("Error fetching sliders:", error)
            showError('Error', 'Failed to fetch sliders')
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

            submitData.append('title', formData.title)
            if (formData.subtitle) submitData.append('subtitle', formData.subtitle)
            if (formData.button_text) submitData.append('button_text', formData.button_text)
            if (formData.button_link) submitData.append('button_link', formData.button_link)
            submitData.append('order', formData.order.toString())
            submitData.append('is_active', formData.is_active ? '1' : '0')

            if (selectedImage) {
                submitData.append('image', selectedImage)
            }

            if (editingSlider) {
                submitData.append('_method', 'PUT')
                await axios.post(`https://backendapi.emcc-lab.com/api/admin/hero-sliders/${editingSlider.id}`,
                    submitData,
                    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
                )
                showSuccess('Updated', 'Slider updated successfully')
            } else {
                await axios.post('https://backendapi.emcc-lab.com/api/admin/hero-sliders',
                    submitData,
                    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
                )
                showSuccess('Created', 'Slider created successfully')
            }

            onClose()
            resetForm()
            fetchSliders()
        } catch (error) {
            console.error("Error saving slider:", error)
            showError('Error', error.response?.data?.error || 'Failed to save slider')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (sliderId, sliderTitle) => {
        const result = await showConfirm('Delete Slider', `Delete "${sliderTitle}"? This action cannot be undone.`)
        if (result.isConfirmed) {
            try {
                const token = Cookies.get('admin_token')
                await axios.delete(`https://backendapi.emcc-lab.com/api/admin/hero-sliders/${sliderId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                showSuccess('Deleted', 'Slider deleted successfully')
                fetchSliders()
            } catch (error) {
                showError('Error', 'Failed to delete slider')
            }
        }
    }

    const handleEdit = (slider) => {
        setEditingSlider(slider)
        setFormData({
            title: slider.title,
            subtitle: slider.subtitle || '',
            button_text: slider.button_text || '',
            button_link: slider.button_link || '',
            order: slider.order,
            is_active: slider.is_active === 1 || slider.is_active === true
        })
        if (slider.image) {
            setImagePreview(getImageUrl(slider.image))
        }
        onOpen()
    }

    const handleView = (slider) => {
        setViewingSlider(slider)
        setShowViewModal(true)
    }

    const handleAdd = () => {
        resetForm()
        onOpen()
    }

    const resetForm = () => {
        setEditingSlider(null)
        setFormData({
            title: '',
            subtitle: '',
            button_text: '',
            button_link: '',
            order: sliders.length,
            is_active: true
        })
        setSelectedImage(null)
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
            setSelectedImage(file)
            const reader = new FileReader()
            reader.onloadend = () => setImagePreview(reader.result)
            reader.readAsDataURL(file)
        }
    }

    const formatDate = (date) => {
        if (!date) return 'N/A'
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
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
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Hero Sliders Management</h1>
                    <p className="text-gray-500 mt-1">Manage homepage hero slider images</p>
                </div>
                <Button color="primary" startContent={<FiPlus />} onPress={handleAdd}>
                    Add Slider
                </Button>
            </div>

            <Card>
                <CardBody>
                    <div className="overflow-x-auto">
                        <Table aria-label="Hero sliders table">
                            <TableHeader>
                                <TableColumn>Image</TableColumn>
                                <TableColumn>Title</TableColumn>
                                <TableColumn>Subtitle</TableColumn>
                                <TableColumn>Order</TableColumn>
                                <TableColumn>Status</TableColumn>
                                <TableColumn>Actions</TableColumn>
                            </TableHeader>
                            <TableBody
                                isLoading={isLoading}
                                loadingContent={<Spinner label="Loading sliders..." />}
                                emptyContent="No sliders found"
                            >
                                {sliders.map((slider) => (
                                    <TableRow key={slider.id}>
                                        <TableCell>
                                            <img
                                                src={getImageUrl(slider.image)}
                                                alt={slider.title}
                                                className="w-16 h-16 object-cover rounded-lg"
                                                onError={(e) => { e.target.src = '/placeholder-image.jpg' }}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{slider.title}</TableCell>
                                        <TableCell>{slider.subtitle}</TableCell>
                                        <TableCell>{slider.order}</TableCell>
                                        <TableCell>
                                            <Chip color={slider.is_active ? "success" : "danger"} size="sm">
                                                {slider.is_active ? "Active" : "Inactive"}
                                            </Chip>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="light"
                                                    isIconOnly
                                                    onPress={() => handleView(slider)}
                                                    title="View Details"
                                                >
                                                    <FiEye className="h-4 w-4 text-green-600" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="light"
                                                    isIconOnly
                                                    onPress={() => handleEdit(slider)}
                                                    title="Edit Slider"
                                                >
                                                    <FiEdit2 className="h-4 w-4 text-blue-600" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="light"
                                                    isIconOnly
                                                    onPress={() => handleDelete(slider.id, slider.title)}
                                                    title="Delete Slider"
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
                </CardBody>
            </Card>

            {/* View Slider Details Modal */}
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
                            <h2 className="text-2xl font-bold">Slider Details</h2>
                            <Chip color={viewingSlider?.is_active ? "success" : "danger"} size="sm">
                                {viewingSlider?.is_active ? "Active" : "Inactive"}
                            </Chip>
                        </div>
                        <p className="text-sm text-gray-500">Complete slider information</p>
                    </ModalHeader>
                    <ModalBody>
                        {viewingSlider && (
                            <div className="p-6 space-y-6">
                                {/* Image Preview */}
                                <div className="flex justify-center">
                                    <div className="relative">
                                        <img
                                            src={getImageUrl(viewingSlider.image)}
                                            alt={viewingSlider.title}
                                            className="w-full max-h-64 object-cover rounded-lg shadow-lg"
                                            onError={(e) => { e.target.src = '/placeholder-image.jpg' }}
                                        />
                                    </div>
                                </div>

                                <Divider />

                                {/* Content Section */}
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <FiType className="w-4 h-4" />
                                        Content
                                    </h4>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                            <FiType className="text-gray-400 mt-0.5" />
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500">Title</p>
                                                <p className="font-medium text-gray-800">{viewingSlider.title}</p>
                                            </div>
                                        </div>
                                        {viewingSlider.subtitle && (
                                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                <FiMessageSquare className="text-gray-400 mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-500">Subtitle</p>
                                                    <p className="font-medium text-gray-800">{viewingSlider.subtitle}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Button Section */}
                                {(viewingSlider.button_text || viewingSlider.button_link) && (
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <FiLink className="w-4 h-4" />
                                            Call to Action Button
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {viewingSlider.button_text && (
                                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <FiType className="text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs text-gray-500">Button Text</p>
                                                        <p className="font-medium text-gray-800">{viewingSlider.button_text}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {viewingSlider.button_link && (
                                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <FiLink className="text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs text-gray-500">Button Link</p>
                                                        <p className="font-medium text-blue-600">{viewingSlider.button_link}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Additional Information */}
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <FiHash className="w-4 h-4" />
                                        Additional Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                            <FiHash className="text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500">Slider ID</p>
                                                <p className="font-mono text-sm text-gray-600">#{viewingSlider.id}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                            <FiHash className="text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500">Display Order</p>
                                                <p className="font-medium text-gray-800">{viewingSlider.order}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                            {viewingSlider.is_active ? (
                                                <FiCheckCircle className="text-green-500 mt-0.5" />
                                            ) : (
                                                <FiXCircle className="text-red-500 mt-0.5" />
                                            )}
                                            <div>
                                                <p className="text-xs text-gray-500">Status</p>
                                                <p className="font-medium text-gray-800">
                                                    {viewingSlider.is_active ? 'Active Slider' : 'Inactive Slider'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                            <FiCalendar className="text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500">Created Date</p>
                                                <p className="font-medium text-gray-800">{formatDate(viewingSlider.created_at)}</p>
                                            </div>
                                        </div>
                                        {viewingSlider.updated_at && viewingSlider.updated_at !== viewingSlider.created_at && (
                                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                <FiCalendar className="text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Last Updated</p>
                                                    <p className="font-medium text-gray-800">{formatDate(viewingSlider.updated_at)}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Image Information */}
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <FiImage className="w-4 h-4" />
                                        Image Information
                                    </h4>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-500">Image Path</p>
                                        <p className="font-mono text-xs text-gray-600 break-all">{viewingSlider.image}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter className="border-t pt-4">
                        <Button
                            color="primary"
                            variant="flat"
                            onPress={() => {
                                setShowViewModal(false)
                                handleEdit(viewingSlider)
                            }}
                        >
                            Edit Slider
                        </Button>
                        <Button variant="flat" onPress={() => setShowViewModal(false)}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Slider Modal - Create/Edit */}
            <Modal isOpen={isOpen} onClose={() => { resetForm(); onClose() }} size="2xl">
                <ModalContent>
                    <ModalHeader>{editingSlider ? 'Edit Slider' : 'Add New Slider'}</ModalHeader>
                    <ModalBody>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                            <Textarea
                                label="Subtitle"
                                value={formData.subtitle}
                                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                rows={2}
                            />
                            <Input
                                label="Button Text"
                                value={formData.button_text}
                                onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                                placeholder="e.g., Shop Now"
                            />
                            <Input
                                label="Button Link"
                                value={formData.button_link}
                                onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                                placeholder="/products"
                            />
                            <Input
                                label="Order"
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                            />
                            <Switch
                                isSelected={formData.is_active}
                                onValueChange={(value) => setFormData({ ...formData, is_active: value })}
                            >
                                Active
                            </Switch>
                            <div>
                                <label className="block text-sm font-medium mb-2">Slider Image (1920x1080 recommended)</label>
                                <div className="flex items-center gap-4">
                                    {imagePreview && (
                                        <img src={imagePreview} alt="Preview" className="w-32 h-20 object-cover rounded-lg" />
                                    )}
                                    <label className="cursor-pointer">
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-primary transition-colors text-center">
                                            <FiUpload className="mx-auto h-8 w-8 text-gray-400" />
                                            <span className="text-sm text-gray-500 mt-1 block">
                                                {imagePreview ? 'Change Image' : 'Upload Image'}
                                            </span>
                                        </div>
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    </label>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button variant="flat" onPress={() => { resetForm(); onClose() }}>Cancel</Button>
                                <Button color="primary" type="submit" isLoading={isSubmitting}>
                                    {editingSlider ? 'Update' : 'Create'}
                                </Button>
                            </div>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    )
}