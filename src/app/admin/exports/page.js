"use client"

import { useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { Card, CardBody, Input, Button, Select, SelectItem } from "@nextui-org/react"
import { FiDownload, FiShoppingBag, FiUsers } from "react-icons/fi"
import { API_BASE_URL } from "@/utils/apiConfig"
import { showError, showSuccess } from "@/utils/sweetalert"

const statusOptions = [
    { key: "all", label: "All Statuses" },
    { key: "pending", label: "Pending" },
    { key: "paid", label: "Paid" },
    { key: "transported", label: "Transported" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
]

export default function AdminExports() {
    const [orderStatus, setOrderStatus] = useState("all")
    const [orderDateFrom, setOrderDateFrom] = useState("")
    const [orderDateTo, setOrderDateTo] = useState("")
    const [isExportingOrders, setIsExportingOrders] = useState(false)

    const [customerDateFrom, setCustomerDateFrom] = useState("")
    const [customerDateTo, setCustomerDateTo] = useState("")
    const [isExportingCustomers, setIsExportingCustomers] = useState(false)

    const authHeaders = () => ({
        headers: { Authorization: `Bearer ${Cookies.get("admin_token")}` },
    })

    const downloadFile = async (url, params, filenamePrefix, setLoading) => {
        setLoading(true)
        try {
            const response = await axios.get(url, {
                ...authHeaders(),
                params,
                responseType: "blob",
            })

            const blobUrl = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement("a")
            link.href = blobUrl
            link.download = `${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.csv`
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(blobUrl)

            showSuccess("Downloaded", "Your export is ready")
        } catch (error) {
            if (error.response?.status === 403) {
                showError("Not Allowed", "This export is restricted to full admin accounts.")
            } else {
                showError("Error", "Failed to generate export")
            }
        } finally {
            setLoading(false)
        }
    }

    const handleExportOrders = () => {
        downloadFile(
            `${API_BASE_URL}/admin/orders/export`,
            {
                status: orderStatus === "all" ? undefined : orderStatus,
                date_from: orderDateFrom || undefined,
                date_to: orderDateTo || undefined,
            },
            "orders",
            setIsExportingOrders
        )
    }

    const handleExportCustomers = () => {
        downloadFile(
            `${API_BASE_URL}/admin/customers/export`,
            {
                date_from: customerDateFrom || undefined,
                date_to: customerDateTo || undefined,
            },
            "customers",
            setIsExportingCustomers
        )
    }

    return (
        <div className="p-4 space-y-6">
            <p className="text-gray-500">Download your data as CSV files, ready to open in Excel or Google Sheets.</p>

            <Card>
                <CardBody className="space-y-4">
                    <div className="flex items-center gap-2">
                        <FiShoppingBag className="h-5 w-5 text-blue-500" />
                        <h3 className="text-lg font-semibold">Export Orders</h3>
                    </div>
                    <p className="text-sm text-gray-500">
                        Includes customer details, status, totals, applied coupon, and items for each order.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Select
                            label="Status"
                            selectedKeys={[orderStatus]}
                            onChange={(e) => setOrderStatus(e.target.value)}
                        >
                            {statusOptions.map((opt) => (
                                <SelectItem key={opt.key}>{opt.label}</SelectItem>
                            ))}
                        </Select>
                        <Input
                            type="date"
                            label="From Date"
                            value={orderDateFrom}
                            onChange={(e) => setOrderDateFrom(e.target.value)}
                        />
                        <Input
                            type="date"
                            label="To Date"
                            value={orderDateTo}
                            onChange={(e) => setOrderDateTo(e.target.value)}
                        />
                    </div>
                    <Button
                        color="primary"
                        startContent={<FiDownload />}
                        isLoading={isExportingOrders}
                        onPress={handleExportOrders}
                    >
                        Download Orders CSV
                    </Button>
                </CardBody>
            </Card>

            <Card>
                <CardBody className="space-y-4">
                    <div className="flex items-center gap-2">
                        <FiUsers className="h-5 w-5 text-purple-500" />
                        <h3 className="text-lg font-semibold">Export Customers</h3>
                    </div>
                    <p className="text-sm text-gray-500">
                        Includes contact details, join date, order count, and lifetime spend per customer.
                        Restricted to full admin accounts.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            type="date"
                            label="Joined From"
                            value={customerDateFrom}
                            onChange={(e) => setCustomerDateFrom(e.target.value)}
                        />
                        <Input
                            type="date"
                            label="Joined To"
                            value={customerDateTo}
                            onChange={(e) => setCustomerDateTo(e.target.value)}
                        />
                    </div>
                    <Button
                        color="secondary"
                        startContent={<FiDownload />}
                        isLoading={isExportingCustomers}
                        onPress={handleExportCustomers}
                    >
                        Download Customers CSV
                    </Button>
                </CardBody>
            </Card>
        </div>
    )
}
