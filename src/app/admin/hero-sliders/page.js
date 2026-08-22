"use client"

import { useState, useEffect } from "react"
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Button, Input, Modal, ModalContent, ModalHeader, ModalBody,
    ModalFooter, useDisclosure, Chip, Switch, Spinner, Textarea,
    Tooltip, Image
} from "@nextui-org/react"
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiSearch } from "react-icons/fi"
import axios from "axios"
import { toast } from "react-hot-toast"

// Get base URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backendapi.emcc-lab.com/api'

export default function AdminHeroSlidersPage() {
    const [sliders, setSliders] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [editingSlider, setEditingSlider] = useState(null)
    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        button_text: "",
        button_link: "",
        is_active: true,
        order: 0
    })
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        fetchSliders()
    }, [])

    const getAuthToken = () => {
        // Try to get token from localStorage first
        const token = localStorage.getItem('auth_token') ||
            localStorage.getItem('admin_token') ||
            document.cookie.replace(/(?:(?:^|.*;\s*)auth_token\s*=\s*([^;]*).*$)|^.*$/, "$1") ||
            document.cookie.replace(/(?:(?:^|.*;\s*)admin_token\s*=\s*([^;]*).*$)|^.*$/, "$1")
        return token
    }

    const fetchSliders = async () => {
        try {
            setIsLoading(true)
            const token = getAuthToken()

            const response = await axios.get(`${API_BASE_URL}/admin/hero-sliders`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })

            // Handle both array response and object with data property
            let slidersData = []
            if (Array.isArray(response.data)) {
                slidersData = response.data
            } else if (response.data.data && Array.isArray(response.data.data)) {
                slidersData = response.data.data
            } else if (response.data.sliders && Array.isArray(response.data.sliders)) {
                slidersData = response.data.sliders
            }

            setSliders(slidersData)
        } catch (error) {
            console.error('Error fetching sliders:', error)
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again.')
                // Clear tokens and redirect to login
                localStorage.removeItem('auth_token')
                localStorage.removeItem('admin_token')
                window.location.href = '/admin/login'
            } else {
                toast.error('Failed to load sliders: ' + (error.response?.data?.error || error.message))
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleOpenModal = (slider = null) => {
        if (slider) {
            setEditingSlider(slider)
            setFormData({
                title: slider.title || "",
                subtitle: slider.subtitle || "",
                button_text: slider.button_text || "",
                button_link: slider.button_link || "",
                is_active: slider.is_active !== undefined ? slider.is_active : true,
                order: slider.order || 0
            })
            // Set image preview from existing image
            if (slider.image) {
                const imageUrl = slider.image.startsWith('http')
                    ? slider.image
                    : `${API_BASE_URL.replace('/api', '')}/storage/${slider.image}`
                setImagePreview(imageUrl)
            } else {
                setImagePreview("")
            }
        } else {
            setEditingSlider(null)
            setFormData({
                title: "",
                subtitle: "",
                button_text: "",
                button_link: "",
                is_active: true,
                order: sliders.length + 1
            })
            setImagePreview("")
        }
        setImageFile(null)
        onOpen()
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            toast.error('Title is required')
            return
        }

        if (!imageFile && !editingSlider) {
            toast.error('Image is required for new slider')
            return
        }

        try {
            setIsSubmitting(true)
            const token = getAuthToken()

            const data = new FormData()
            data.append('title', formData.title.trim())
            data.append('subtitle', formData.subtitle.trim() || '')
            data.append('button_text', formData.button_text.trim() || '')
            data.append('button_link', formData.button_link.trim() || '')
            data.append('is_active', formData.is_active ? '1' : '0')
            data.append('order', formData.order.toString())

            if (imageFile) {
                data.append('image', imageFile)
            }

            let response
            if (editingSlider) {
                // For update, we need to append _method for Laravel
                data.append('_method', 'PUT')
                response = await axios.post(`${API_BASE_URL}/admin/hero-sliders/${editingSlider.id}`, data, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json'
                    }
                })
                toast.success('Slider updated successfully')
            } else {
                response = await axios.post(`${API_BASE_URL}/admin/hero-sliders`, data, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json'
                    }
                })
                toast.success('Slider created successfully')
            }

            onClose()
            fetchSliders()
        } catch (error) {
            console.error('Error saving slider:', error)
            if (error.response?.data?.errors) {
                const errors = error.response.data.errors
                Object.keys(errors).forEach(key => {
                    toast.error(`${key}: ${errors[key][0]}`)
                })
            } else {
                toast.error(error.response?.data?.error || 'Failed to save slider')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this slider?')) return

        try {
            const token = getAuthToken()

            await axios.delete(`${API_BASE_URL}/admin/hero-sliders/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            })
            toast.success('Slider deleted successfully')
            fetchSliders()
        } catch (error) {
            console.error('Error deleting slider:', error)
            toast.error(error.response?.data?.error || 'Failed to delete slider')
        }
    }

    const handleToggleStatus = async (id, currentStatus) => {
        // Since we don't have a toggle-status endpoint, update the slider directly
        try {
            const token = getAuthToken()
            const slider = sliders.find(s => s.id === id)

            // Simple update to toggle status
            const data = new FormData()
            data.append('_method', 'PUT')
            data.append('title', slider.title)
            data.append('subtitle', slider.subtitle || '')
            data.append('button_text', slider.button_text || '')
            data.append('button_link', slider.button_link || '')
            data.append('is_active', currentStatus ? '0' : '1')
            data.append('order', slider.order || 0)

            await axios.post(`${API_BASE_URL}/admin/hero-sliders/${id}`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                }
            })

            toast.success('Slider status updated')
            fetchSliders()
        } catch (error) {
            console.error('Error toggling status:', error)
            toast.error('Failed to update status')
        }
    }

    const filteredSliders = sliders.filter(slider =>
        slider.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        slider.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Home Page Hero Sliders</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage main website hero sliders</p>
                </div>
                <Button color="primary" startContent={<FiPlus />} onPress={() => handleOpenModal()} className="shadow-lg">
                    Add Slider
                </Button>
            </div>

            <div className="mb-6">
                <Input
                    placeholder="Search sliders..."
                    startContent={<FiSearch className="text-gray-400" />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-md"
                />
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
                <Table aria-label="Hero sliders table" removeWrapper>
                    <TableHeader>
                        <TableColumn>Image</TableColumn>
                        <TableColumn>Title</TableColumn>
                        <TableColumn>Subtitle</TableColumn>
                        <TableColumn>Order</TableColumn>
                        <TableColumn>Status</TableColumn>
                        <TableColumn align="center">Actions</TableColumn>
                    </TableHeader>
                    <TableBody
                        isLoading={isLoading}
                        loadingContent={<Spinner label="Loading..." />}
                        emptyContent="No sliders found"
                    >
                        {filteredSliders.map((slider) => {
                            // Get image URL
                            let imageUrl = ''
                            if (slider.image) {
                                if (slider.image.startsWith('http')) {
                                    imageUrl = slider.image
                                } else if (slider.image.startsWith('/storage')) {
                                    imageUrl = `${API_BASE_URL.replace('/api', '')}${slider.image}`
                                } else {
                                    imageUrl = `${API_BASE_URL.replace('/api', '')}/storage/${slider.image}`
                                }
                            }

                            return (
                                <TableRow key={slider.id}>
                                    <TableCell>
                                        {imageUrl ? (
                                            <Image
                                                src={imageUrl}
                                                alt={slider.title}
                                                width={60}
                                                height={40}
                                                className="rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="w-15 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-500">
                                                No image
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">{slider.title}</TableCell>
                                    <TableCell className="max-w-xs truncate">{slider.subtitle || '-'}</TableCell>
                                    <TableCell>{slider.order || 0}</TableCell>
                                    <TableCell>
                                        <Chip color={slider.is_active ? "success" : "danger"} size="sm">
                                            {slider.is_active ? "Active" : "Inactive"}
                                        </Chip>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 justify-center">
                                            <Tooltip content="Edit">
                                                <Button isIconOnly size="sm" variant="light" onPress={() => handleOpenModal(slider)}>
                                                    <FiEdit2 className="text-blue-500" />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip content={slider.is_active ? "Deactivate" : "Activate"}>
                                                <Button isIconOnly size="sm" variant="light" onPress={() => handleToggleStatus(slider.id, slider.is_active)}>
                                                    {slider.is_active ? <FiEye className="text-green-500" /> : <FiEyeOff className="text-gray-500" />}
                                                </Button>
                                            </Tooltip>
                                            <Tooltip content="Delete">
                                                <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleDelete(slider.id)}>
                                                    <FiTrash2 className="text-red-500" />
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>

            <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
                <ModalContent>
                    <ModalHeader>{editingSlider ? 'Edit Slider' : 'Add New Slider'}</ModalHeader>
                    <ModalBody>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title *</label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Enter slide title"
                                    isRequired
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subtitle</label>
                                <Textarea
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                    placeholder="Enter slide subtitle or description"
                                    minRows={3}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Button Text</label>
                                    <Input
                                        value={formData.button_text}
                                        onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                                        placeholder="e.g., Shop Now"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Button Link</label>
                                    <Input
                                        value={formData.button_link}
                                        onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                                        placeholder="e.g., /products"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image {!editingSlider && '*'}</label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                {imagePreview && (
                                    <div className="mt-2">
                                        <Image src={imagePreview} alt="Preview" width={200} height={133} className="rounded-lg object-cover" />
                                    </div>
                                )}
                                {!imagePreview && editingSlider && (
                                    <p className="text-sm text-gray-500 mt-2">Current image will be kept unless you upload a new one.</p>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Active</label>
                                    <Switch
                                        isSelected={formData.is_active}
                                        onValueChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort Order</label>
                                    <Input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>Cancel</Button>
                        <Button
                            color="primary"
                            onPress={handleSubmit}
                            isLoading={isSubmitting}
                            isDisabled={isSubmitting}
                        >
                            {editingSlider ? 'Update' : 'Create'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}