"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import {
    Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Chip, Spinner, Button, Input, Select, SelectItem, Pagination, Modal, ModalContent,
    ModalHeader, ModalBody, Switch,
} from "@nextui-org/react"
import { FiPlus, FiTrash2, FiSearch } from "react-icons/fi"
import { API_BASE_URL } from "@/utils/apiConfig"
import { showSuccess, showError, showConfirm } from "@/utils/sweetalert"

const emptyForm = { name: "", email: "", password: "", role: "staff" }

export default function AdminStaff() {
    const [staff, setStaff] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const authHeaders = () => ({
        headers: { Authorization: `Bearer ${Cookies.get("admin_token")}` },
    })

    useEffect(() => {
        fetchStaff()
    }, [search, page])

    const fetchStaff = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/staff`, {
                ...authHeaders(),
                params: { search, page, per_page: 15 },
            })
            setStaff(response.data.data || [])
            setTotalPages(response.data.last_page || 1)
        } catch (error) {
            console.error("Error fetching staff:", error)
            showError("Error", error.response?.data?.message || "Failed to fetch staff accounts")
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => setForm(emptyForm)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await axios.post(`${API_BASE_URL}/admin/staff`, form, authHeaders())
            showSuccess("Created", "Staff account created successfully")
            setIsModalOpen(false)
            resetForm()
            fetchStaff()
        } catch (error) {
            showError("Error", error.response?.data?.message || "Failed to create staff account")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleToggleActive = async (member) => {
        try {
            await axios.put(`${API_BASE_URL}/admin/staff/${member.id}`, { is_active: !member.is_active }, authHeaders())
            fetchStaff()
        } catch (error) {
            showError("Error", error.response?.data?.message || "Failed to update account")
        }
    }

    const handleRoleChange = async (member, newRole) => {
        try {
            await axios.put(`${API_BASE_URL}/admin/staff/${member.id}`, { role: newRole }, authHeaders())
            showSuccess("Updated", `${member.name} is now ${newRole === "admin" ? "a full Admin" : "Staff"}`)
            fetchStaff()
        } catch (error) {
            showError("Error", error.response?.data?.message || "Failed to update role")
        }
    }

    const handleRemove = async (member) => {
        const result = await showConfirm("Revoke Access", `Revoke admin panel access for ${member.name}?`)
        if (result.isConfirmed) {
            try {
                await axios.delete(`${API_BASE_URL}/admin/staff/${member.id}`, authHeaders())
                showSuccess("Revoked", "Staff access removed")
                fetchStaff()
            } catch (error) {
                showError("Error", error.response?.data?.message || "Failed to revoke access")
            }
        }
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <p className="text-gray-500">
                    <strong>Admin</strong> accounts have full access to everything, including this page.
                    <strong> Staff</strong> accounts can manage products, orders, deals, FAQs, and content, but
                    cannot access Settings, Coupons, Subscribers, Analytics, or Staff management.
                </p>
                <div className="flex gap-3">
                    <Input
                        placeholder="Search..."
                        startContent={<FiSearch className="text-gray-400" />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-56"
                        size="sm"
                    />
                    <Button color="primary" startContent={<FiPlus />} onPress={() => { resetForm(); setIsModalOpen(true) }}>
                        Add Staff
                    </Button>
                </div>
            </div>

            <Card>
                <CardBody>
                    <div className="overflow-x-auto">
                        <Table aria-label="Staff table">
                            <TableHeader>
                                <TableColumn>NAME</TableColumn>
                                <TableColumn>EMAIL</TableColumn>
                                <TableColumn>ROLE</TableColumn>
                                <TableColumn>ACTIVE</TableColumn>
                                <TableColumn>JOINED</TableColumn>
                                <TableColumn>ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody
                                isLoading={isLoading}
                                loadingContent={<Spinner label="Loading staff..." />}
                                emptyContent="No staff accounts yet"
                            >
                                {staff.map((member) => (
                                    <TableRow key={member.id}>
                                        <TableCell className="font-medium">{member.name}</TableCell>
                                        <TableCell>{member.email}</TableCell>
                                        <TableCell>
                                            <Select
                                                size="sm"
                                                selectedKeys={[member.role]}
                                                className="w-32"
                                                onChange={(e) => handleRoleChange(member, e.target.value)}
                                            >
                                                <SelectItem key="admin">Admin</SelectItem>
                                                <SelectItem key="staff">Staff</SelectItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Switch size="sm" isSelected={!!member.is_active} onValueChange={() => handleToggleActive(member)} />
                                        </TableCell>
                                        <TableCell>{new Date(member.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Button size="sm" variant="light" isIconOnly onPress={() => handleRemove(member)} title="Revoke access">
                                                <FiTrash2 className="h-4 w-4 text-red-600" />
                                            </Button>
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

            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm() }}>
                <ModalContent>
                    <ModalHeader>Add Staff Account</ModalHeader>
                    <ModalBody>
                        <form onSubmit={handleSubmit} className="space-y-4 pb-4">
                            <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} isRequired />
                            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} isRequired />
                            <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} isRequired />
                            <Select label="Role" selectedKeys={[form.role]} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                                <SelectItem key="staff">Staff (limited access)</SelectItem>
                                <SelectItem key="admin">Admin (full access)</SelectItem>
                            </Select>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button variant="flat" onPress={() => { setIsModalOpen(false); resetForm() }}>Cancel</Button>
                                <Button color="primary" type="submit" isLoading={isSubmitting}>Create Account</Button>
                            </div>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    )
}
