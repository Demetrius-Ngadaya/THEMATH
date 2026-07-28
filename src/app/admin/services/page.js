"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff,
    FiChevronUp, FiChevronDown, FiSearch, FiRefreshCw,
    FiX
} from "react-icons/fi"
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Button, Input, Modal, ModalContent, ModalHeader, ModalBody,
    ModalFooter, useDisclosure, Chip, Switch, Spinner,
    Select, SelectItem, Textarea, Tooltip
} from "@nextui-org/react"
import axios from "@/services/api"
import { toast } from "react-hot-toast"

// Icon options for services
const iconOptions = [
    "HiOutlineChartBar", "HiOutlineClock", "HiOutlineChip",
    "HiOutlineDocumentText", "HiOutlineAcademicCap", "HiOutlineLink",
    "HiOutlineSearch", "HiOutlineDownload", "FaDatabase",
    "FaRegLightbulb", "FaRocket", "FaShieldAlt"
]

const colorOptions = [
    "blue", "green", "purple", "red", "yellow",
    "indigo", "gray", "pink", "orange", "teal"
]

export default function AdminServicesPage() {
    const [services, setServices] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [editingService, setEditingService] = useState(null)

    // Modal states for metrics and models
    const { isOpen: isMetricModalOpen, onOpen: onMetricModalOpen, onClose: onMetricModalClose } = useDisclosure()
    const { isOpen: isModelModalOpen, onOpen: onModelModalOpen, onClose: onModelModalClose } = useDisclosure()

    const [metricInput, setMetricInput] = useState({ key: "", value: "" })
    const [modelInput, setModelInput] = useState("")

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        icon: "HiOutlineChartBar",
        color: "blue",
        metrics: {},
        models: [],
        is_popular: false,
        is_active: true,
        sort_order: 0
    })

    useEffect(() => {
        fetchServices()
    }, [])

    const fetchServices = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get('/services')
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
                icon: service.icon,
                color: service.color,
                metrics: service.metrics || {},
                models: service.models || [],
                is_popular: service.is_popular || false,
                is_active: service.is_active !== undefined ? service.is_active : true,
                sort_order: service.sort_order || 0
            })
        } else {
            setEditingService(null)
            setFormData({
                name: "",
                description: "",
                icon: "HiOutlineChartBar",
                color: "blue",
                metrics: {},
                models: [],
                is_popular: false,
                is_active: true,
                sort_order: 0
            })
        }
        onOpen()
    }

    const handleSubmit = async () => {
        try {
            if (editingService) {
                await axios.put(`/admin/services/${editingService.id}`, formData)
                toast.success('Service updated successfully')
            } else {
                await axios.post('/admin/services', formData)
                toast.success('Service created successfully')
            }
            onClose()
            fetchServices()
        } catch (error) {
            console.error('Error saving service:', error)
            toast.error(error.response?.data?.message || 'Failed to save service')
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            try {
                await axios.delete(`/admin/services/${id}`)
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
            await axios.post(`/admin/services/${id}/toggle-status`)
            toast.success('Service status updated')
            fetchServices()
        } catch (error) {
            console.error('Error toggling status:', error)
            toast.error('Failed to update status')
        }
    }

    // Metric Modal Handlers
    const handleAddMetric = () => {
        setMetricInput({ key: "", value: "" })
        onMetricModalOpen()
    }

    const handleMetricSubmit = () => {
        if (metricInput.key.trim() && metricInput.value.trim()) {
            setFormData(prev => ({
                ...prev,
                metrics: { ...prev.metrics, [metricInput.key.trim()]: metricInput.value.trim() }
            }))
            onMetricModalClose()
            toast.success('Metric added successfully')
        } else {
            toast.error('Please fill in both fields')
        }
    }

    const handleRemoveMetric = (key) => {
        const newMetrics = { ...formData.metrics }
        delete newMetrics[key]
        setFormData(prev => ({
            ...prev,
            metrics: newMetrics
        }))
        toast.success('Metric removed')
    }

    // Model Modal Handlers
    const handleAddModel = () => {
        setModelInput("")
        onModelModalOpen()
    }

    const handleModelSubmit = () => {
        if (modelInput.trim()) {
            setFormData(prev => ({
                ...prev,
                models: [...prev.models, modelInput.trim()]
            }))
            onModelModalClose()
            toast.success('Model added successfully')
        } else {
            toast.error('Please enter a model name')
        }
    }

    const handleRemoveModel = (index) => {
        setFormData(prev => ({
            ...prev,
            models: prev.models.filter((_, i) => i !== index)
        }))
        toast.success('Model removed')
    }

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Services Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage your data analysis services</p>
                </div>
                <Button
                    color="primary"
                    startContent={<FiPlus />}
                    onPress={() => handleOpenModal()}
                    className="shadow-lg"
                >
                    Add Service
                </Button>
            </div>

            {/* Search and Filters */}
            <div className="mb-6">
                <Input
                    placeholder="Search services..."
                    startContent={<FiSearch className="text-gray-400" />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-md"
                />
            </div>

            {/* Services Table */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
                <Table
                    aria-label="Services table"
                    removeWrapper
                    classNames={{
                        base: "min-h-[400px]",
                        table: "min-h-[400px]",
                    }}
                >
                    <TableHeader>
                        <TableColumn>#</TableColumn>
                        <TableColumn>Service Name</TableColumn>
                        <TableColumn>Description</TableColumn>
                        <TableColumn>Popular</TableColumn>
                        <TableColumn>Status</TableColumn>
                        <TableColumn align="center">Actions</TableColumn>
                    </TableHeader>
                    <TableBody
                        isLoading={isLoading}
                        loadingContent={<Spinner label="Loading..." />}
                        emptyContent="No services found"
                    >
                        {filteredServices.map((service, index) => (
                            <TableRow key={service.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-lg bg-${service.color}-100 dark:bg-${service.color}-900/30 flex items-center justify-center`}>
                                            <span className="text-xs text-${service.color}-600">{service.icon.slice(0, 2)}</span>
                                        </div>
                                        <span className="font-medium">{service.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="max-w-xs truncate">
                                    {service.description}
                                </TableCell>
                                <TableCell>
                                    {service.is_popular ? (
                                        <Chip color="success" size="sm">Popular</Chip>
                                    ) : (
                                        <Chip variant="flat" size="sm">Standard</Chip>
                                    )}
                                </TableCell>
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
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                onPress={() => handleOpenModal(service)}
                                            >
                                                <FiEdit2 className="text-blue-500" />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip content={service.is_active ? "Deactivate" : "Activate"}>
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                onPress={() => handleToggleStatus(service.id)}
                                            >
                                                {service.is_active ?
                                                    <FiEye className="text-green-500" /> :
                                                    <FiEyeOff className="text-gray-500" />
                                                }
                                            </Button>
                                        </Tooltip>
                                        <Tooltip content="Delete">
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                color="danger"
                                                onPress={() => handleDelete(service.id)}
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

            {/* Add/Edit Service Modal */}
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size="2xl"
                scrollBehavior="inside"
                motionProps={{
                    variants: {
                        enter: {
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            transition: {
                                duration: 0.3,
                                ease: "easeOut"
                            }
                        },
                        exit: {
                            opacity: 0,
                            scale: 0.95,
                            y: 20,
                            transition: {
                                duration: 0.2,
                                ease: "easeIn"
                            }
                        }
                    }
                }}
            >
                <ModalContent>
                    <ModalHeader>
                        {editingService ? 'Edit Service' : 'Add New Service'}
                    </ModalHeader>
                    <ModalBody>
                        <div className="space-y-4">
                            {/* Basic Info */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Service Name *
                                </label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter service name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description *
                                </label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Enter service description"
                                    minRows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Icon
                                    </label>
                                    <Select
                                        selectedKeys={[formData.icon]}
                                        onSelectionChange={(keys) => {
                                            const selected = Array.from(keys)[0] || "HiOutlineChartBar"
                                            setFormData({ ...formData, icon: selected })
                                        }}
                                    >
                                        {iconOptions.map((icon) => (
                                            <SelectItem key={icon} value={icon} textValue={icon}>
                                                {icon}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Color
                                    </label>
                                    <Select
                                        selectedKeys={[formData.color]}
                                        onSelectionChange={(keys) => {
                                            const selected = Array.from(keys)[0] || "blue"
                                            setFormData({ ...formData, color: selected })
                                        }}
                                    >
                                        {colorOptions.map((color) => (
                                            <SelectItem key={color} value={color} textValue={color}>
                                                <span className={`text-${color}-600`}>{color}</span>
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Popular
                                    </label>
                                    <Switch
                                        isSelected={formData.is_popular}
                                        onValueChange={(checked) => setFormData({ ...formData, is_popular: checked })}
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

                            {/* Metrics */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Metrics
                                    </label>
                                    <Button
                                        size="sm"
                                        color="primary"
                                        variant="flat"
                                        startContent={<FiPlus className="h-3 w-3" />}
                                        onPress={handleAddMetric}
                                    >
                                        Add Metric
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {Object.entries(formData.metrics).length === 0 ? (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">No metrics added yet</p>
                                    ) : (
                                        Object.entries(formData.metrics).map(([key, value]) => (
                                            <div key={key} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                                                <span className="flex-1 text-sm">
                                                    <strong className="text-gray-700 dark:text-gray-300">{key}:</strong>
                                                    <span className="text-gray-600 dark:text-gray-400 ml-2">{value}</span>
                                                </span>
                                                <Button
                                                    size="sm"
                                                    color="danger"
                                                    variant="light"
                                                    isIconOnly
                                                    onPress={() => handleRemoveMetric(key)}
                                                >
                                                    <FiTrash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Models */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Methods & Models
                                    </label>
                                    <Button
                                        size="sm"
                                        color="primary"
                                        variant="flat"
                                        startContent={<FiPlus className="h-3 w-3" />}
                                        onPress={handleAddModel}
                                    >
                                        Add Model
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.models.length === 0 ? (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">No models added yet</p>
                                    ) : (
                                        formData.models.map((model, index) => (
                                            <Chip
                                                key={index}
                                                onClose={() => handleRemoveModel(index)}
                                                variant="flat"
                                                color="primary"
                                            >
                                                {model}
                                            </Chip>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                            Cancel
                        </Button>
                        <Button color="primary" onPress={handleSubmit}>
                            {editingService ? 'Update' : 'Create'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Add Metric Modal */}
            <Modal
                isOpen={isMetricModalOpen}
                onClose={onMetricModalClose}
                size="md"
                motionProps={{
                    variants: {
                        enter: {
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            transition: {
                                duration: 0.3,
                                ease: "easeOut"
                            }
                        },
                        exit: {
                            opacity: 0,
                            scale: 0.9,
                            y: 20,
                            transition: {
                                duration: 0.2,
                                ease: "easeIn"
                            }
                        }
                    }
                }}
            >
                <ModalContent>
                    <ModalHeader>Add Metric</ModalHeader>
                    <ModalBody>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Metric Key (e.g., methods, clients)
                                </label>
                                <Input
                                    value={metricInput.key}
                                    onChange={(e) => setMetricInput({ ...metricInput, key: e.target.value })}
                                    placeholder="Enter metric key..."
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Metric Value
                                </label>
                                <Input
                                    value={metricInput.value}
                                    onChange={(e) => setMetricInput({ ...metricInput, value: e.target.value })}
                                    placeholder="Enter metric value..."
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onMetricModalClose}>
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            onPress={handleMetricSubmit}
                            isDisabled={!metricInput.key.trim() || !metricInput.value.trim()}
                        >
                            Add Metric
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Add Model Modal */}
            <Modal
                isOpen={isModelModalOpen}
                onClose={onModelModalClose}
                size="md"
                motionProps={{
                    variants: {
                        enter: {
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            transition: {
                                duration: 0.3,
                                ease: "easeOut"
                            }
                        },
                        exit: {
                            opacity: 0,
                            scale: 0.9,
                            y: 20,
                            transition: {
                                duration: 0.2,
                                ease: "easeIn"
                            }
                        }
                    }
                }}
            >
                <ModalContent>
                    <ModalHeader>Add Method/Model</ModalHeader>
                    <ModalBody>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Model/Method Name
                            </label>
                            <Input
                                value={modelInput}
                                onChange={(e) => setModelInput(e.target.value)}
                                placeholder="Enter model/method name..."
                                autoFocus
                            />
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                Example: Linear Models, ARIMA, Thematic Analysis, etc.
                            </p>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onModelModalClose}>
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            onPress={handleModelSubmit}
                            isDisabled={!modelInput.trim()}
                        >
                            Add Model
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}