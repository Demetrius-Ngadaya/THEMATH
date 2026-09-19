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
    Pagination,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Switch,
    Autocomplete,
    AutocompleteItem,
} from "@nextui-org/react"
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from "react-icons/fi"
import { API_BASE_URL } from "@/utils/apiConfig"
import { getImageUrl } from "@/utils/imageHelper"
import { showSuccess, showError, showConfirm } from "@/utils/sweetalert"

export default function AdminDeals() {
    const [deals, setDeals] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingDeal, setEditingDeal] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Product picker (for creating a new deal)
    const [productQuery, setProductQuery] = useState("")
    const [productOptions, setProductOptions] = useState([])
    const [selectedProductId, setSelectedProductId] = useState(null)
    const [selectedProduct, setSelectedProduct] = useState(null)

    const [discountPrice, setDiscountPrice] = useState("")
    const [endsAt, setEndsAt] = useState("")
    const [isActive, setIsActive] = useState(true)

    const authHeaders = () => ({
        headers: { Authorization: `Bearer ${Cookies.get("admin_token")}` },
    })

    useEffect(() => {
        fetchDeals()
    }, [search, page])

    const fetchDeals = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/deals`, {
                ...authHeaders(),
                params: { search, page, per_page: 15 },
            })
            setDeals(response.data.data || [])
            setTotalPages(response.data.last_page || 1)
        } catch (error) {
            console.error("Error fetching deals:", error)
            showError("Error", "Failed to fetch deals")
        } finally {
            setIsLoading(false)
        }
    }

    // Debounced product search for the Autocomplete
    useEffect(() => {
        if (!isModalOpen || editingDeal) return
        const timeout = setTimeout(async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/admin/products`, {
                    ...authHeaders(),
                    params: { search: productQuery, per_page: 10 },
                })
                setProductOptions(response.data.data || [])
            } catch (error) {
                console.error("Error searching products:", error)
            }
        }, 300)
        return () => clearTimeout(timeout)
    }, [productQuery, isModalOpen, editingDeal])

    const resetForm = () => {
        setEditingDeal(null)
        setSelectedProductId(null)
        setSelectedProduct(null)
        setProductQuery("")
        setProductOptions([])
        setDiscountPrice("")
        setEndsAt("")
        setIsActive(true)
    }

    const openAddModal = () => {
        resetForm()
        setIsModalOpen(true)
    }

    const openEditModal = (deal) => {
        setEditingDeal(deal)
        setSelectedProduct(deal.product)
        setDiscountPrice(String(deal.discount_price))
        setEndsAt(deal.ends_at ? deal.ends_at.slice(0, 16) : "")
        setIsActive(!!deal.is_active)
        setIsModalOpen(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const payload = {
                discount_price: parseFloat(discountPrice),
                is_active: isActive,
                ends_at: endsAt || null,
            }

            if (editingDeal) {
                await axios.put(`${API_BASE_URL}/admin/deals/${editingDeal.id}`, payload, authHeaders())
                showSuccess("Updated", "Deal updated successfully")
            } else {
                if (!selectedProductId) {
                    showError("Pick a product", "Please select a product for this deal")
                    setIsSubmitting(false)
                    return
                }
                await axios.post(`${API_BASE_URL}/admin/deals`, { ...payload, product_id: selectedProductId }, authHeaders())
                showSuccess("Created", "Deal created successfully")
            }

            setIsModalOpen(false)
            resetForm()
            fetchDeals()
        } catch (error) {
            console.error("Error saving deal:", error)
            showError("Error", error.response?.data?.error || "Failed to save deal")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleToggle = async (deal) => {
        try {
            await axios.post(`${API_BASE_URL}/admin/deals/${deal.id}/toggle-status`, {}, authHeaders())
            fetchDeals()
        } catch (error) {
            showError("Error", "Failed to update status")
        }
    }

    const handleDelete = async (deal) => {
        const result = await showConfirm("Remove Deal", `Remove the deal on "${deal.product?.name}"?`)
        if (result.isConfirmed) {
            try {
                await axios.delete(`${API_BASE_URL}/admin/deals/${deal.id}`, authHeaders())
                showSuccess("Removed", "Deal removed from the deals page")
                fetchDeals()
            } catch (error) {
                showError("Error", "Failed to remove deal")
            }
        }
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <p className="text-gray-500">
                    Choose which products appear on the /deals page, set their discount price, and when the deal ends.
                    The discount percentage is calculated automatically from the product's current price.
                </p>
                <div className="flex gap-3">
                    <Input
                        placeholder="Search by product name..."
                        startContent={<FiSearch className="text-gray-400" />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-64"
                        size="sm"
                    />
                    <Button color="primary" startContent={<FiPlus />} onPress={openAddModal}>
                        Add Deal
                    </Button>
                </div>
            </div>

            <Card>
                <CardBody>
                    <div className="overflow-x-auto">
                        <Table aria-label="Deals table">
                            <TableHeader>
                                <TableColumn>PRODUCT</TableColumn>
                                <TableColumn>ORIGINAL PRICE</TableColumn>
                                <TableColumn>DISCOUNT PRICE</TableColumn>
                                <TableColumn>DISCOUNT %</TableColumn>
                                <TableColumn>ENDS AT</TableColumn>
                                <TableColumn>STATUS</TableColumn>
                                <TableColumn>ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody
                                isLoading={isLoading}
                                loadingContent={<Spinner label="Loading deals..." />}
                                emptyContent="No deals yet - click Add Deal to feature a product"
                            >
                                {deals.map((deal) => (
                                    <TableRow key={deal.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {deal.product?.images?.[0] && (
                                                    <img
                                                        src={getImageUrl(deal.product.images[0].path)}
                                                        alt={deal.product?.name}
                                                        className="w-10 h-10 rounded-lg object-cover"
                                                    />
                                                )}
                                                <span className="font-medium">{deal.product?.name || "(product deleted)"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>TSh {deal.product?.price?.toLocaleString()}</TableCell>
                                        <TableCell>TSh {deal.discount_price?.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Chip size="sm" color="danger" variant="flat">-{deal.discount_percentage}%</Chip>
                                        </TableCell>
                                        <TableCell>
                                            {deal.ends_at ? new Date(deal.ends_at).toLocaleString() : "No end date"}
                                            {deal.is_expired && (
                                                <Chip size="sm" color="warning" variant="flat" className="ml-2">Expired</Chip>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Switch size="sm" isSelected={!!deal.is_active} onValueChange={() => handleToggle(deal)} />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="light" isIconOnly onPress={() => openEditModal(deal)} title="Edit">
                                                    <FiEdit2 className="h-4 w-4 text-green-600" />
                                                </Button>
                                                <Button size="sm" variant="light" isIconOnly onPress={() => handleDelete(deal)} title="Remove">
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
                    <ModalHeader>{editingDeal ? "Edit Deal" : "Add New Deal"}</ModalHeader>
                    <ModalBody>
                        <form onSubmit={handleSubmit} className="space-y-4 pb-4">
                            {editingDeal ? (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    {editingDeal.product?.images?.[0] && (
                                        <img
                                            src={getImageUrl(editingDeal.product.images[0].path)}
                                            alt={editingDeal.product?.name}
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                    )}
                                    <div>
                                        <p className="font-medium">{editingDeal.product?.name}</p>
                                        <p className="text-sm text-gray-500">Current price: TSh {editingDeal.product?.price?.toLocaleString()}</p>
                                    </div>
                                </div>
                            ) : (
                                <Autocomplete
                                    label="Select Product"
                                    placeholder="Search by product name..."
                                    inputValue={productQuery}
                                    onInputChange={setProductQuery}
                                    onSelectionChange={(id) => {
                                        setSelectedProductId(id)
                                        const p = productOptions.find((o) => String(o.id) === String(id))
                                        setSelectedProduct(p || null)
                                    }}
                                    isRequired
                                >
                                    {productOptions.map((p) => (
                                        <AutocompleteItem key={p.id} textValue={p.name}>
                                            {p.name} — TSh {p.price?.toLocaleString()}
                                        </AutocompleteItem>
                                    ))}
                                </Autocomplete>
                            )}

                            {selectedProduct && (
                                <p className="text-sm text-gray-500">
                                    Current price: TSh {selectedProduct.price?.toLocaleString()}
                                </p>
                            )}

                            <Input
                                type="number"
                                step="0.01"
                                label="Discount Price (TSh)"
                                description="The price the product will be sold at on the deals page"
                                value={discountPrice}
                                onChange={(e) => setDiscountPrice(e.target.value)}
                                isRequired
                            />

                            <Input
                                type="datetime-local"
                                label="Deal Ends At"
                                description="Leave blank for a deal with no end date"
                                value={endsAt}
                                onChange={(e) => setEndsAt(e.target.value)}
                            />

                            <Switch isSelected={isActive} onValueChange={setIsActive}>
                                Active (visible on the /deals page)
                            </Switch>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button variant="flat" onPress={() => { setIsModalOpen(false); resetForm() }}>Cancel</Button>
                                <Button color="primary" type="submit" isLoading={isSubmitting}>
                                    {editingDeal ? "Update Deal" : "Create Deal"}
                                </Button>
                            </div>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    )
}
