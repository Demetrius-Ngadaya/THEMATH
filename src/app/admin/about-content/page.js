"use client"

import { useState, useEffect } from "react"
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Button, Input, Modal, ModalContent, ModalHeader, ModalBody,
    ModalFooter, useDisclosure, Chip, Switch, Spinner, Textarea,
    Tooltip
} from "@nextui-org/react"
import { FiEdit2, FiSearch } from "react-icons/fi"
import axios from "@/services/api"
import { toast } from "react-hot-toast"

export default function AdminAboutContentPage() {
    const [content, setContent] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [editingContent, setEditingContent] = useState(null)
    const [formData, setFormData] = useState({
        section: "",
        content: "",
        additional_data: {},
        is_active: true
    })

    useEffect(() => {
        fetchContent()
    }, [])

    const fetchContent = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get('/about-content')
            if (response.data.success) {
                setContent(response.data.data)
            }
        } catch (error) {
            console.error('Error fetching content:', error)
            toast.error('Failed to load content')
        } finally {
            setIsLoading(false)
        }
    }

    const handleToggleStatus = async (section) => {
        try {
            await axios.post(`/admin/about-content/${section}/toggle-status`)
            toast.success('Content status updated')
            fetchContent()
        } catch (error) {
            console.error('Error toggling status:', error)
            toast.error('Failed to update status')
        }
    }

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingContent(item)
            setFormData({
                section: item.section,
                content: item.content,
                additional_data: item.additional_data || {},
                is_active: item.is_active
            })
        } else {
            setEditingContent(null)
            setFormData({
                section: "",
                content: "",
                additional_data: {},
                is_active: true
            })
        }
        onOpen()
    }

    const handleSubmit = async () => {
        try {
            if (editingContent) {
                await axios.put(`/admin/about-content/${editingContent.section}`, formData)
                toast.success('Content updated successfully')
            } else {
                await axios.post('/admin/about-content', formData)
                toast.success('Content created successfully')
            }
            onClose()
            fetchContent()
        } catch (error) {
            console.error('Error saving content:', error)
            toast.error('Failed to save content')
        }
    }

    const sectionLabels = {
        about: 'About EMCC',
        vision: 'Vision',
        mission: 'Mission',
        motto: 'Core Motto'
    }

    const filteredContent = content.filter(item =>
        item.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">About Page Content</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage About, Vision, Mission, and Motto</p>
                </div>
            </div>

            <div className="mb-6">
                <Input
                    placeholder="Search content..."
                    startContent={<FiSearch className="text-gray-400" />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-md"
                />
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
                <Table aria-label="About content table" removeWrapper>
                    <TableHeader>
                        <TableColumn>Section</TableColumn>
                        <TableColumn>Content Preview</TableColumn>
                        <TableColumn>Status</TableColumn>
                        <TableColumn align="center">Actions</TableColumn>
                    </TableHeader>
                    <TableBody isLoading={isLoading} loadingContent={<Spinner label="Loading..." />} emptyContent="No content found">
                        {filteredContent.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                    {sectionLabels[item.section] || item.section}
                                </TableCell>
                                <TableCell className="max-w-xs truncate">
                                    {item.content.substring(0, 100)}...
                                </TableCell>
                                <TableCell>
                                    <Switch
                                        isSelected={item.is_active}
                                        onValueChange={() => handleToggleStatus(item.section)}
                                        size="sm"
                                        color="success"
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 justify-center">
                                        <Tooltip content="Edit">
                                            <Button isIconOnly size="sm" variant="light" onPress={() => handleOpenModal(item)}>
                                                <FiEdit2 className="text-blue-500" />
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
                    <ModalHeader>{editingContent ? 'Edit Content' : 'Add New Content'}</ModalHeader>
                    <ModalBody>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Section</label>
                                {editingContent ? (
                                    <Input value={sectionLabels[formData.section] || formData.section} disabled />
                                ) : (
                                    <select
                                        value={formData.section}
                                        onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select section</option>
                                        <option value="about">About EMCC</option>
                                        <option value="vision">Vision</option>
                                        <option value="mission">Mission</option>
                                        <option value="motto">Core Motto</option>
                                    </select>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
                                <Textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="Enter content..."
                                    minRows={6}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Active</label>
                                <Switch
                                    isSelected={formData.is_active}
                                    onValueChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>Cancel</Button>
                        <Button color="primary" onPress={handleSubmit}>{editingContent ? 'Update' : 'Create'}</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}