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

const emptyForm = {
    code: "", type: "percentage", value: "", min_order_amount: "",
    max_uses: "", starts_at: "", expires_at: "", is_active: true,
}

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCoupon, setEditingCoupon] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const authHeaders = () => ({
        headers: { Authorization: `Bearer ${Cookies.get("admin_token")}` },
    })

    useEffect(() => {
        fetchCoupons()
    }, [search, page])

    const fetchCoupons = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/coupons`, {
                ...authHeaders(),
                params: { search, page, per_page: 15 },
            })
            setCoupons(response.data.data || [])
            setTotalPages(response.data.last_page || 1)
        } catch (error) {
            console.error("Error fetching coupons:", error)
            showError("Error", "Failed to fetch coupons")
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setEditingCoupon(null)
        setForm(emptyForm)
    }

    const openAddModal = () => {
        resetForm()
        setIsModalOpen(true)
    }

    const openEditModal = (coupon) => {
        setEditingCoupon(coupon)
        setForm({
            code: coupon.code,
            type: coupon.type,
            value: String(coupon.value),
            min_order_amount: coupon.min_order_amount ? String(coupon.min_order_amount) : "",
            max_uses: coupon.max_uses ? String(coupon.max_uses) : "",
            starts_at: coupon.starts_at ? coupon.starts_at.slice(0, 16) : "",
            expires_at: coupon.expires_at ? coupon.expires_at.slice(0, 16) : "",
            is_active: !!coupon.is_active,
        })
        setIsModalOpen(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const payload = {
                type: form.type,
                value: parseFloat(form.value),
                min_order_amount: form.min_order_amount ? parseFloat(form.min_order_amount) : null,
                max_uses: form.max_uses ? parseInt(form.max_uses) : null,
                starts_at: form.starts_at || null,
                expires_at: form.expires_at || null,
                is_active: form.is_active,
            }

            if (editingCoupon) {
                await axios.put(`${API_BASE_URL}/admin/coupons/${editingCoupon.id}`, payload, authHeaders())
                showSuccess("Updated", "Coupon updated successfully")
            } else {
                await axios.post(`${API_BASE_URL}/admin/coupons`, { ...payload, code: form.code }, authHeaders())
                showSuccess("Created", "Coupon created successfully")
            }

            setIsModalOpen(false)
            resetForm()
            fetchCoupons()
        } catch (error) {
            showError("Error", error.response?.data?.error || "Failed to save coupon")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleToggle = async (coupon) => {
        try {
            await axios.post(`${API_BASE_URL}/admin/coupons/${coupon.id}/toggle-status`, {}, authHeaders())
            fetchCoupons()
        } catch (error) {
            showError("Error", "Failed to update status")
        }
    }

    const handleDelete = async (coupon) => {
        const result = await showConfirm("Delete Coupon", `Delete coupon "${coupon.code}"?`)
        if (result.isConfirmed) {
            try {
                await axios.delete(`${API_BASE_URL}/admin/coupons/${coupon.id}`, authHeaders())
                showSuccess("Deleted", "Coupon deleted")
                fetchCoupons()
            } catch (error) {
                showError("Error", "Failed to delete coupon")
            }
        }
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <p className="text-gray-500">Create discount codes customers can apply at checkout.</p>
                <div className="flex gap-3">
                    <Input
                        placeholder="Search by code..."
                        startContent={<FiSearch className="text-gray-400" />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-56"
                        size="sm"
                    />
                    <Button color="primary" startContent={<FiPlus />} onPress={openAddModal}>
                        Add Coupon
                    </Button>
                </div>
            </div>

            <Card>
                <CardBody>
                    <div className="overflow-x-auto">
                        <Table aria-label="Coupons table">
                            <TableHeader>
                                <TableColumn>CODE</TableColumn>
                                <TableColumn>DISCOUNT</TableColumn>
                                <TableColumn>MIN ORDER</TableColumn>
                                <TableColumn>USES</TableColumn>
                                <TableColumn>EXPIRES</TableColumn>
                                <TableColumn>ACTIVE</TableColumn>
                                <TableColumn>ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody
                                isLoading={isLoading}
                                loadingContent={<Spinner label="Loading coupons..." />}
                                emptyContent="No coupons yet"
                            >
                                {coupons.map((coupon) => (
                                    <TableRow key={coupon.id}>
                                        <TableCell><code className="font-semibold">{coupon.code}</code></TableCell>
                                        <TableCell>
                                            {coupon.type === "percentage" ? `${coupon.value}%` : `TSh ${coupon.value.toLocaleString()}`}
                                        </TableCell>
                                        <TableCell>{coupon.min_order_amount ? `TSh ${coupon.min_order_amount.toLocaleString()}` : "—"}</TableCell>
                                        <TableCell>{coupon.used_count}{coupon.max_uses ? ` / ${coupon.max_uses}` : ""}</TableCell>
                                        <TableCell>{coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : "Never"}</TableCell>
                                        <TableCell>
                                            <Switch size="sm" isSelected={!!coupon.is_active} onValueChange={() => handleToggle(coupon)} />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="light" onPress={() => openEditModal(coupon)}>Edit</Button>
                                                <Button size="sm" variant="light" isIconOnly onPress={() => handleDelete(coupon)}>
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

            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm() }} size="lg">
                <ModalContent>
                    <ModalHeader>{editingCoupon ? "Edit Coupon" : "Add New Coupon"}</ModalHeader>
                    <ModalBody>
                        <form onSubmit={handleSubmit} className="space-y-4 pb-4">
                            <Input
                                label="Coupon Code"
                                placeholder="e.g. SAVE10"
                                value={form.code}
                                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                isDisabled={!!editingCoupon}
                                isRequired
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Select
                                    label="Discount Type"
                                    selectedKeys={[form.type]}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                                >
                                    <SelectItem key="percentage">Percentage (%)</SelectItem>
                                    <SelectItem key="fixed">Fixed Amount (TSh)</SelectItem>
                                </Select>
                                <Input
                                    type="number"
                                    step="0.01"
                                    label={form.type === "percentage" ? "Percent Off" : "Amount Off (TSh)"}
                                    value={form.value}
                                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                                    isRequired
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    type="number"
                                    label="Minimum Order (TSh)"
                                    description="Leave blank for no minimum"
                                    value={form.min_order_amount}
                                    onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })}
                                />
                                <Input
                                    type="number"
                                    label="Max Uses"
                                    description="Leave blank for unlimited"
                                    value={form.max_uses}
                                    onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    type="datetime-local"
                                    label="Starts At"
                                    description="Leave blank to start immediately"
                                    value={form.starts_at}
                                    onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
                                />
                                <Input
                                    type="datetime-local"
                                    label="Expires At"
                                    description="Leave blank for no expiry"
                                    value={form.expires_at}
                                    onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                                />
                            </div>
                            <Switch isSelected={form.is_active} onValueChange={(v) => setForm({ ...form, is_active: v })}>
                                Active
                            </Switch>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button variant="flat" onPress={() => { setIsModalOpen(false); resetForm() }}>Cancel</Button>
                                <Button color="primary" type="submit" isLoading={isSubmitting}>
                                    {editingCoupon ? "Update Coupon" : "Create Coupon"}
                                </Button>
                            </div>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    )
}
