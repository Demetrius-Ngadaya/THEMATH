"use client"

import { useState, useEffect, useRef } from "react"
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Button, Input, Modal, ModalContent, ModalHeader, ModalBody,
    ModalFooter, useDisclosure, Switch, Spinner, Textarea,
    Tooltip, Image
} from "@nextui-org/react"
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiSearch } from "react-icons/fi"
import API, { axiosInstance } from "@/services/api"  // Import both
import { toast } from "react-hot-toast"

export default function AdminAboutHeroSlidersPage() {
    const [sliders, setSliders] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [editingSlider, setEditingSlider] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
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
    const fileInputRef = useRef(null)

    useEffect(() => {
        fetchSliders()
    }, [])

    const fetchSliders = async () => {
        try {
            setIsLoading(true)
            const response = await API.get('/about-hero-sliders')
            if (response.data.success) {
                setSliders(response.data.data)
            }
        } catch (error) {
            console.error('Error fetching about sliders:', error)
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
            data.append('title', formData.title)
            data.append('description', formData.description)
            data.append('button_text', formData.button_text || '')
            data.append('button_link', formData.button_link || '')
            data.append('is_active', formData.is_active ? '1' : '0')
            data.append('sort_order', String(formData.sort_order || 0))

            if (imageFile && imageFile instanceof File) {
                console.log('Appending image file:', imageFile.name, imageFile.size)
                data.append('image', imageFile)
            }

            let url = '/admin/about-hero-sliders'

            if (editingSlider) {
                data.append('_method', 'PUT')
                url = `/admin/about-hero-sliders/${editingSlider.id}`
            }

            // Log FormData contents
            for (let pair of data.entries()) {
                console.log(pair[0], pair[1]);
            }

            // IMPORTANT: Use axiosInstance for file uploads
            const response = await axiosInstance.post(url, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (response.data.success) {
                toast.success(editingSlider ? 'About slider updated successfully' : 'About slider created successfully')
                onClose()
                fetchSliders()
            }

        } catch (error) {
            console.error('Error saving about slider:', error)
            console.error('Error response:', error.response?.data)

            if (error.response?.data?.errors) {
                const errors = error.response.data.errors
                const errorMessages = Object.values(errors).flat().join('\n')
                toast.error(`Validation failed: ${errorMessages}`)
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message)
            } else {
                toast.error('Failed to save slider')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this slider?')) {
            try {
                await API.delete(`/admin/about-hero-sliders/${id}`)
                toast.success('About slider deleted successfully')
                fetchSliders()
            } catch (error) {
                console.error('Error deleting slider:', error)
                toast.error('Failed to delete slider')
            }
        }
    }

    const handleToggleStatus = async (id) => {
        try {
            await API.post(`/admin/about-hero-sliders/${id}/toggle-status`)
            toast.success('About slider status updated')
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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">About Page Hero Sliders</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage hero sliders for the About page</p>
                </div>
                <Button
                    color="primary"
                    startContent={<FiPlus />}
                    onPress={() => handleOpenModal()}
                    className="shadow-lg"
                >
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
                <Table aria-label="About hero sliders table" removeWrapper>
                    <TableHeader>
                        <TableColumn>Image</TableColumn>
                        <TableColumn>Title</TableColumn>
                        <TableColumn>Description</TableColumn>
                        <TableColumn>Status</TableColumn>
                        <TableColumn align="center">Actions</TableColumn>
                    </TableHeader>
                    <TableBody
                        isLoading={isLoading}
                        loadingContent={<Spinner label="Loading..." />}
                        emptyContent="No sliders found"
                    >
                        {filteredSliders.map((slider) => (
                            <TableRow key={slider.id}>
                                <TableCell>
                                    {slider.image ? (
                                        <Image
                                            src={`https://backendapi.emcc-lab.com${slider.image}`}
                                            alt={slider.title}
                                            width={60}
                                            height={40}
                                            className="rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="w-15 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-500">No image</div>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">{slider.title}</TableCell>
                                <TableCell className="max-w-xs truncate">{slider.description}</TableCell>
                                <TableCell>
                                    <Switch
                                        isSelected={slider.is_active}
                                        onValueChange={() => handleToggleStatus(slider.id)}
                                        size="sm"
                                        color="success"
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 justify-center">
                                        <Tooltip content="Edit">
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                onPress={() => handleOpenModal(slider)}
                                            >
                                                <FiEdit2 className="text-blue-500" />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip content={slider.is_active ? "Deactivate" : "Activate"}>
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                onPress={() => handleToggleStatus(slider.id)}
                                            >
                                                {slider.is_active ? <FiEye className="text-green-500" /> : <FiEyeOff className="text-gray-500" />}
                                            </Button>
                                        </Tooltip>
                                        <Tooltip content="Delete">
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                color="danger"
                                                onPress={() => handleDelete(slider.id)}
                                            >
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
                    <ModalHeader>{editingSlider ? 'Edit About Slider' : 'Add New About Slider'}</ModalHeader>
                    <ModalBody>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Title *
                                </label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Enter slide title"
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
                                    placeholder="Enter slide description"
                                    minRows={3}
                                    isRequired
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Button Text
                                    </label>
                                    <Input
                                        value={formData.button_text}
                                        onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                                        placeholder="e.g., Learn More"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Button Link
                                    </label>
                                    <Input
                                        value={formData.button_link}
                                        onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                                        placeholder="e.g., /services"
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
                                <p className="text-xs text-gray-500 mt-1">Max size: 2MB. Supported formats: JPG, PNG, GIF</p>
                                {imagePreview && (
                                    <div className="mt-2">
                                        <Image
                                            src={imagePreview.startsWith('http') ? imagePreview : `https://backendapi.emcc-lab.com${imagePreview}`}
                                            alt="Preview"
                                            width={200}
                                            height={133}
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
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Active
                                    </label>
                                    <Switch
                                        isSelected={formData.is_active}
                                        onValueChange={(checked) => setFormData({ ...formData, is_active: checked })}
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
                            {editingSlider ? 'Update' : 'Create'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}