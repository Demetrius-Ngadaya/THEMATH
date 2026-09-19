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
    Switch,
} from "@nextui-org/react"
import { FiTrash2, FiSearch } from "react-icons/fi"
import { API_BASE_URL } from "@/utils/apiConfig"
import { showSuccess, showError, showConfirm } from "@/utils/sweetalert"

export default function AdminSubscribers() {
    const [subscribers, setSubscribers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)

    const authHeaders = () => ({
        headers: { Authorization: `Bearer ${Cookies.get("admin_token")}` },
    })

    useEffect(() => {
        fetchSubscribers()
    }, [search, page])

    const fetchSubscribers = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/subscribers`, {
                ...authHeaders(),
                params: { search, page, per_page: 15 },
            })
            setSubscribers(response.data.data || [])
            setTotalPages(response.data.last_page || 1)
            setTotal(response.data.total || 0)
        } catch (error) {
            console.error("Error fetching subscribers:", error)
            showError("Error", "Failed to fetch subscribers")
        } finally {
            setIsLoading(false)
        }
    }

    const handleToggle = async (subscriber) => {
        try {
            await axios.post(`${API_BASE_URL}/admin/subscribers/${subscriber.id}/toggle-status`, {}, authHeaders())
            fetchSubscribers()
        } catch (error) {
            showError("Error", "Failed to update status")
        }
    }

    const handleDelete = async (subscriber) => {
        const result = await showConfirm("Remove Subscriber", `Remove ${subscriber.email}?`)
        if (result.isConfirmed) {
            try {
                await axios.delete(`${API_BASE_URL}/admin/subscribers/${subscriber.id}`, authHeaders())
                showSuccess("Removed", "Subscriber removed")
                fetchSubscribers()
            } catch (error) {
                showError("Error", "Failed to remove subscriber")
            }
        }
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <p className="text-gray-500">
                    {total} subscriber{total !== 1 ? "s" : ""} - they're notified automatically when products, deals,
                    or services are added or updated. No action needed here unless you want to remove someone.
                </p>
                <Input
                    placeholder="Search by email or phone..."
                    startContent={<FiSearch className="text-gray-400" />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-72"
                    size="sm"
                />
            </div>

            <Card>
                <CardBody>
                    <div className="overflow-x-auto">
                        <Table aria-label="Subscribers table">
                            <TableHeader>
                                <TableColumn>EMAIL</TableColumn>
                                <TableColumn>PHONE</TableColumn>
                                <TableColumn>SUBSCRIBED</TableColumn>
                                <TableColumn>ACTIVE</TableColumn>
                                <TableColumn>ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody
                                isLoading={isLoading}
                                loadingContent={<Spinner label="Loading subscribers..." />}
                                emptyContent="No subscribers yet"
                            >
                                {subscribers.map((s) => (
                                    <TableRow key={s.id}>
                                        <TableCell className="font-medium">{s.email}</TableCell>
                                        <TableCell>
                                            {s.phone ? s.phone : <Chip size="sm" variant="flat">Email only</Chip>}
                                        </TableCell>
                                        <TableCell>{new Date(s.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Switch size="sm" isSelected={!!s.is_active} onValueChange={() => handleToggle(s)} />
                                        </TableCell>
                                        <TableCell>
                                            <Button size="sm" variant="light" isIconOnly onPress={() => handleDelete(s)} title="Remove">
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
        </div>
    )
}
