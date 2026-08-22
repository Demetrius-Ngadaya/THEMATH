"use client"

import { useState, useEffect } from "react"
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Button, Input, Modal, ModalContent, ModalHeader, ModalBody,
    ModalFooter, useDisclosure, Chip, Switch, Spinner, Textarea,
    Tooltip, Image
} from "@nextui-org/react"
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiSearch } from "react-icons/fi"
import axios from "@/services/api"
import { toast } from "react-hot-toast"

export default function AdminHeroSlidersPage() {
    const [sliders, setSliders] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [editingSlider, setEditingSlider] = useState(null)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        button_text: "",
        button_link: "",
        is_active: true,
        sort_order: 0
    })
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState("")

    useEffect(() => {
        fetchSliders()
    }, [])

    const fetchSliders = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get('/admin/hero-sliders')
            setSliders(Array.isArray(response.data) ? response.data : [])
        } catch (error) {
            console.error('Error fetching sliders:', error)
            toast.error('Failed to load sliders')
        } finally {
            setIsLoading(false)
        }
    }

    const handleOpenModal = (slider = null) => {
        if (slider) {
            setEditingSlider(slider)
            setFormData({
                title: slider.title,
                description: slider.description,
                button_text: slider.button_text || "",
                button_link: slider.button_link || "",
                is_active: slider.is_active,
                sort_order: slider.sort_order || 0
            })
            setImagePreview(slider.image || "")
        } else {
            setEditingSlider(null)
            setFormData({
                title: "",
                description: "",
                button_text: "",
                button_link: "",
                is_active: true,
                sort_order: 0
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
        try {
            const data = new FormData()
            data.append('title', formData.title)
            data.append('description', formData.description)
            data.append('button_text', formData.button_text || '')
            data.append('button_link', formData.button_link || '')
            data.append('is_active', formData.is_active ? '1' : '0')
            data.append('sort_order', formData.sort_order)

            if (imageFile) {
                data.append('image', imageFile)
            }

            if (editingSlider) {
                data.append('_method', 'PUT')
                // Using general hero-sliders endpoint
                await axios.post(`/admin/hero-sliders/${editingSlider.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                toast.success('Slider updated successfully')
            } else {
                await axios.post('/admin/hero-sliders', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                toast.success('Slider created successfully')
            }
            onClose()
            fetchSliders()
        } catch (error) {
            console.error('Error saving slider:', error)
            toast.error('Failed to save slider')
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this slider?')) {
            try {
                await axios.delete(`/admin/hero-sliders/${id}`)
                toast.success('Slider deleted successfully')
                fetchSliders()
            } catch (error) {
                console.error('Error deleting slider:', error)
                toast.error('Failed to delete slider')
            }
        }
    }

    const handleToggleStatus = async (id) => {
        try {
            await axios.post(`/admin/hero-sliders/${id}/toggle-status`)
            toast.success('Slider status updated')
            fetchSliders()
        } catch (error) {
            console.error('Error toggling status:', error)
            toast.error('Failed to update status')
        }
    }

    const filteredSliders = sliders.filter(slider =>
        slider.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        slider.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hero Sliders</h1>
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
                        <TableColumn>Description</TableColumn>
                        <TableColumn>Status</TableColumn>
                        <TableColumn align="center">Actions</TableColumn>
                    </TableHeader>
                    <TableBody isLoading={isLoading} loadingContent={<Spinner label="Loading..." />} emptyContent="No sliders found">
                        {filteredSliders.map((slider) => (
                            <TableRow key={slider.id}>
                                <TableCell>
                                    {slider.image ? (
                                        <Image src={slider.image} alt={slider.title} width={60} height={40} className="rounded-lg object-cover" />
                                    ) : (
                                        <div className="w-15 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-500">No image</div>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">{slider.title}</TableCell>
                                <TableCell className="max-w-xs truncate">{slider.description}</TableCell>
                                <TableCell>
                                    <Switch isSelected={slider.is_active} onValueChange={() => handleToggleStatus(slider.id)} size="sm" color="success" />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 justify-center">
                                        <Tooltip content="Edit">
                                            <Button isIconOnly size="sm" variant="light" onPress={() => handleOpenModal(slider)}>
                                                <FiEdit2 className="text-blue-500" />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip content={slider.is_active ? "Deactivate" : "Activate"}>
                                            <Button isIconOnly size="sm" variant="light" onPress={() => handleToggleStatus(slider.id)}>
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
                        ))}
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
                                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter slide title" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description *</label>
                                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Enter slide description" minRows={3} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Button Text</label>
                                    <Input value={formData.button_text} onChange={(e) => setFormData({ ...formData, button_text: e.target.value })} placeholder="e.g., Learn More" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Button Link</label>
                                    <Input value={formData.button_link} onChange={(e) => setFormData({ ...formData, button_link: e.target.value })} placeholder="e.g., /services" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image</label>
                                <Input type="file" accept="image/*" onChange={handleImageChange} />
                                {imagePreview && (
                                    <div className="mt-2">
                                        <Image src={imagePreview} alt="Preview" width={200} height={133} className="rounded-lg object-cover" />
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Active</label>
                                    <Switch isSelected={formData.is_active} onValueChange={(checked) => setFormData({ ...formData, is_active: checked })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort Order</label>
                                    <Input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })} placeholder="0" />
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>Cancel</Button>
                        <Button color="primary" onPress={handleSubmit}>{editingSlider ? 'Update' : 'Create'}</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}