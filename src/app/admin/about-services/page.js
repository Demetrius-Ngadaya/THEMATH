"use client"

import { useState, useEffect } from "react"
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Button, Input, Modal, ModalContent, ModalHeader, ModalBody,
    ModalFooter, useDisclosure, Chip, Switch, Spinner, Textarea,
    Tooltip
} from "@nextui-org/react"
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiSearch } from "react-icons/fi"
import axios from "@/services/api"
import { toast } from "react-hot-toast"

export default function AdminAboutServicesPage() {
    const [services, setServices] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [editingService, setEditingService] = useState(null)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        icon: "FaChartBar",
        color: "blue",
        is_active: true,
        sort_order: 0
    })

    useEffect(() => {
        fetchServices()
    }, [])

    const fetchServices = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get('/about-services')
            if (response.data.success) {
                setServices(response.data.data)
            }
        } catch (error) {
            console.error('Error fetching services:', error)
            toast.error('Failed to load services')
        } finally {
            setIsLoading(false)
        }
    }

    const handleOpenModal = (service = null) => {
        if (service) {
            setEditingService(service)
            setFormData({
                name: service.name,
                description: service.description,
                icon: service.icon || "FaChartBar",
                color: service.color || "blue",
                is_active: service.is_active,
                sort_order: service.sort_order || 0
            })
        } else {
            setEditingService(null)
            setFormData({
                name: "",
                description: "",
                icon: "FaChartBar",
                color: "blue",
                is_active: true,
                sort_order: 0
            })
        }
        onOpen()
    }

    const handleSubmit = async () => {
        try {
            if (editingService) {
                await axios.put(`/admin/about-services/${editingService.id}`, formData)
                toast.success('Service updated successfully')
            } else {
                await axios.post('/admin/about-services', formData)
                toast.success('Service created successfully')
            }
            onClose()
            fetchServices()
        } catch (error) {
            console.error('Error saving service:', error)
            toast.error('Failed to save service')
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            try {
                await axios.delete(`/admin/about-services/${id}`)
                toast.success('Service deleted successfully')
                fetchServices()
            } catch (error) {
                console.error('Error deleting service:', error)
                toast.error('Failed to delete service')
            }
        }
    }

    const handleToggleStatus = async (id) => {
        try {
            await axios.post(`/admin/about-services/${id}/toggle-status`)
            toast.success('Service status updated')
            fetchServices()
        } catch (error) {
            console.error('Error toggling status:', error)
            toast.error('Failed to update status')
        }
    }

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const iconOptions = ["FaChartBar", "FaLightbulb", "FaUsers", "FaGlobe", "FaRocket", "FaGraduationCap", "FaBriefcase", "FaCog"]
    const colorOptions = ["blue", "green", "purple", "red", "yellow", "indigo", "gray", "pink"]

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">About Services</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage services displayed on About page</p>
                </div>
                <Button color="primary" startContent={<FiPlus />} onPress={() => handleOpenModal()} className="shadow-lg">
                    Add Service
                </Button>
            </div>

            <div className="mb-6">
                <Input
                    placeholder="Search services..."
                    startContent={<FiSearch className="text-gray-400" />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-md"
                />
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
                <Table aria-label="Services table" removeWrapper>
                    <TableHeader>
                        <TableColumn>Name</TableColumn>
                        <TableColumn>Description</TableColumn>
                        <TableColumn>Status</TableColumn>
                        <TableColumn align="center">Actions</TableColumn>
                    </TableHeader>
                    <TableBody isLoading={isLoading} loadingContent={<Spinner label="Loading..." />} emptyContent="No services found">
                        {filteredServices.map((service) => (
                            <TableRow key={service.id}>
                                <TableCell className="font-medium">{service.name}</TableCell>
                                <TableCell className="max-w-xs truncate">{service.description}</TableCell>
                                <TableCell>
                                    <Switch
                                        isSelected={service.is_active}
                                        onValueChange={() => handleToggleStatus(service.id)}
                                        size="sm"
                                        color="success"
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 justify-center">
                                        <Tooltip content="Edit">
                                            <Button isIconOnly size="sm" variant="light" onPress={() => handleOpenModal(service)}>
                                                <FiEdit2 className="text-blue-500" />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip content={service.is_active ? "Deactivate" : "Activate"}>
                                            <Button isIconOnly size="sm" variant="light" onPress={() => handleToggleStatus(service.id)}>
                                                {service.is_active ? <FiEye className="text-green-500" /> : <FiEyeOff className="text-gray-500" />}
                                            </Button>
                                        </Tooltip>
                                        <Tooltip content="Delete">
                                            <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleDelete(service.id)}>
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
                    <ModalHeader>{editingService ? 'Edit Service' : 'Add New Service'}</ModalHeader>
                    <ModalBody>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name *</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter service name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description *</label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Enter service description"
                                    minRows={3}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Icon</label>
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
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color</label>
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
                                        value={formData.sort_order}
                                        onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>Cancel</Button>
                        <Button color="primary" onPress={handleSubmit}>{editingService ? 'Update' : 'Create'}</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}