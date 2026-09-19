"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import {
    Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Chip, Spinner, Pagination, Select, SelectItem,
} from "@nextui-org/react"
import { API_BASE_URL } from "@/utils/apiConfig"
import { showError } from "@/utils/sweetalert"

const actionColors = {
    created: "success",
    updated: "primary",
    deleted: "danger",
    status_changed: "warning",
    login: "default",
    login_failed: "danger",
}

export default function AdminActivityLog() {
    const [logs, setLogs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [actionFilter, setActionFilter] = useState("all")

    const authHeaders = () => ({
        headers: { Authorization: `Bearer ${Cookies.get("admin_token")}` },
    })

    useEffect(() => {
        fetchLogs()
    }, [page, actionFilter])

    const fetchLogs = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/activity-log`, {
                ...authHeaders(),
                params: { page, per_page: 25, action: actionFilter === "all" ? undefined : actionFilter },
            })
            setLogs(response.data.data || [])
            setTotalPages(response.data.last_page || 1)
        } catch (error) {
            console.error("Error fetching activity log:", error)
            showError("Error", error.response?.data?.message || "Failed to fetch activity log")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <p className="text-gray-500">A record of admin and staff actions across the panel.</p>
                <Select
                    size="sm"
                    className="w-48"
                    selectedKeys={[actionFilter]}
                    onChange={(e) => { setActionFilter(e.target.value); setPage(1) }}
                >
                    <SelectItem key="all">All Actions</SelectItem>
                    <SelectItem key="created">Created</SelectItem>
                    <SelectItem key="updated">Updated</SelectItem>
                    <SelectItem key="deleted">Deleted</SelectItem>
                    <SelectItem key="status_changed">Status Changed</SelectItem>
                </Select>
            </div>

            <Card>
                <CardBody>
                    <div className="overflow-x-auto">
                        <Table aria-label="Activity log table">
                            <TableHeader>
                                <TableColumn>WHEN</TableColumn>
                                <TableColumn>WHO</TableColumn>
                                <TableColumn>ACTION</TableColumn>
                                <TableColumn>DETAILS</TableColumn>
                            </TableHeader>
                            <TableBody
                                isLoading={isLoading}
                                loadingContent={<Spinner label="Loading activity..." />}
                                emptyContent="No activity recorded yet"
                            >
                                {logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="whitespace-nowrap text-sm text-gray-500">
                                            {new Date(log.created_at).toLocaleString()}
                                        </TableCell>
                                        <TableCell>{log.user_name || log.user?.name || "System"}</TableCell>
                                        <TableCell>
                                            <Chip size="sm" color={actionColors[log.action] || "default"} variant="flat">
                                                {log.action.replace("_", " ")}
                                            </Chip>
                                        </TableCell>
                                        <TableCell className="max-w-md">{log.description}</TableCell>
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
