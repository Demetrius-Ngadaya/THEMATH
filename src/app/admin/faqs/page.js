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
    Pagination,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Switch,
} from "@nextui-org/react"
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from "react-icons/fi"
import { showSuccess, showError, showConfirm } from "@/utils/sweetalert"

import { API_BASE_URL as API_BASE } from "@/utils/apiConfig"

const emptyForm = { question: "", answer: "", category: "", sort_order: 0, is_active: true }

export default function AdminFaqs() {
    const [faqs, setFaqs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [perPage, setPerPage] = useState(15)
    const [editingFaq, setEditingFaq] = useState(null)
    const [formData, setFormData] = useState(emptyForm)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        fetchFaqs()
    }, [search, page, perPage])

    const authHeaders = () => ({
        headers: { Authorization: `Bearer ${Cookies.get("admin_token")}` },
    })

    const fetchFaqs = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${API_BASE}/admin/faqs`, {
                ...authHeaders(),
                params: { search, page, per_page: perPage },
            })
            setFaqs(response.data.data || response.data)
            setTotalPages(response.data.last_page || 1)
        } catch (error) {
            console.error("Error fetching FAQs:", error)
            showError("Error", "Failed to fetch FAQs")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            if (editingFaq) {
                await axios.put(`${API_BASE}/admin/faqs/${editingFaq.id}`, formData, authHeaders())
                showSuccess("Updated", "FAQ updated successfully")
            } else {
                await axios.post(`${API_BASE}/admin/faqs`, formData, authHeaders())
                showSuccess("Created", "FAQ created successfully")
            }
            onClose()
            resetForm()
            fetchFaqs()
        } catch (error) {
            console.error("Error saving FAQ:", error)
            showError("Error", error.response?.data?.error || "Failed to save FAQ")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (faq) => {
        const result = await showConfirm("Delete FAQ", `Delete "${faq.question}"?`)
        if (result.isConfirmed) {
            try {
                await axios.delete(`${API_BASE}/admin/faqs/${faq.id}`, authHeaders())
                showSuccess("Deleted", "FAQ deleted successfully")
                fetchFaqs()
            } catch (error) {
                showError("Error", error.response?.data?.message || "Failed to delete FAQ")
            }
        }
    }

    const handleToggle = async (faq) => {
        try {
            await axios.post(`${API_BASE}/admin/faqs/${faq.id}/toggle-status`, {}, authHeaders())
            fetchFaqs()
        } catch (error) {
            showError("Error", "Failed to update status")
        }
    }

    const handleEdit = (faq) => {
        setEditingFaq(faq)
        setFormData({
            question: faq.question,
            answer: faq.answer,
            category: faq.category || "",
            sort_order: faq.sort_order || 0,
            is_active: !!faq.is_active,
        })
        onOpen()
    }

    const handleAdd = () => {
        resetForm()
        onOpen()
    }

    const resetForm = () => {
        setEditingFaq(null)
        setFormData(emptyForm)
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4 mt-4 px-4">
                <p className="text-gray-500 mt-1">Manage frequently asked questions shown on the FAQs page</p>
                <div className="flex gap-3">
                    <Input
                        placeholder="Search FAQs..."
                        startContent={<FiSearch className="text-gray-400" />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-64"
                        size="sm"
                    />
                    <Button color="primary" startContent={<FiPlus />} onPress={handleAdd}>
                        Add FAQ
                    </Button>
                </div>
            </div>

            <Card>
                <CardBody>
                    <div className="overflow-x-auto">
                        <Table aria-label="FAQs table">
                            <TableHeader>
                                <TableColumn>#</TableColumn>
                                <TableColumn>QUESTION</TableColumn>
                                <TableColumn>CATEGORY</TableColumn>
                                <TableColumn>ORDER</TableColumn>
                                <TableColumn>STATUS</TableColumn>
                                <TableColumn>ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody
                                isLoading={isLoading}
                                loadingContent={<Spinner label="Loading FAQs..." />}
                                emptyContent="No FAQs found"
                            >
                                {faqs.map((faq, index) => (
                                    <TableRow key={faq.id}>
                                        <TableCell>{(page - 1) * perPage + index + 1}</TableCell>
                                        <TableCell>
                                            <span className="font-medium">{faq.question}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Chip size="sm" variant="flat">{faq.category || "General"}</Chip>
                                        </TableCell>
                                        <TableCell>{faq.sort_order}</TableCell>
                                        <TableCell>
                                            <Switch
                                                size="sm"
                                                isSelected={!!faq.is_active}
                                                onValueChange={() => handleToggle(faq)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="light" isIconOnly onPress={() => handleEdit(faq)} title="Edit">
                                                    <FiEdit2 className="h-4 w-4 text-green-600" />
                                                </Button>
                                                <Button size="sm" variant="light" isIconOnly onPress={() => handleDelete(faq)} title="Delete">
                                                    <FiTrash2 className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center p-4 border-t mt-4">
                            <Pagination total={totalPages} page={page} onChange={setPage} color="primary" showControls />
                        </div>
                    )}
                </CardBody>
            </Card>

            <Modal isOpen={isOpen} onClose={() => { resetForm(); onClose() }} size="2xl">
                <ModalContent>
                    <ModalHeader>{editingFaq ? "Edit FAQ" : "Add New FAQ"}</ModalHeader>
                    <ModalBody>
                        <form onSubmit={handleSubmit} className="space-y-4 pb-4">
                            <Input
                                label="Question"
                                value={formData.question}
                                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                isRequired
                            />
                            <Textarea
                                label="Answer"
                                minRows={4}
                                value={formData.answer}
                                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                isRequired
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Category"
                                    placeholder="e.g. Orders & Shipping"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                />
                                <Input
                                    type="number"
                                    label="Sort Order"
                                    value={String(formData.sort_order)}
                                    onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                                />
                            </div>
                            <Switch
                                isSelected={formData.is_active}
                                onValueChange={(v) => setFormData({ ...formData, is_active: v })}
                            >
                                Active (visible on the FAQs page)
                            </Switch>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button variant="flat" onPress={() => { resetForm(); onClose() }}>Cancel</Button>
                                <Button color="primary" type="submit" isLoading={isSubmitting}>
                                    {editingFaq ? "Update FAQ" : "Create FAQ"}
                                </Button>
                            </div>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    )
}
