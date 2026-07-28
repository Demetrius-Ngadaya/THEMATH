"use client"

import { useEffect, useState, useCallback } from "react"
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
    Select,
    SelectItem,
    Pagination,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Badge,
    Tooltip
} from "@nextui-org/react"
import {
    FiSearch,
    FiDownload,
    FiFileText,
    FiEye,
    FiAlertCircle,
    FiCalendar,
    FiFilter,
    FiRefreshCw,
    FiChevronDown,
    FiPrinter,
    FiPackage,
    FiTruck,
    FiCheckCircle,
    FiXCircle,
    FiCreditCard,
} from "react-icons/fi"
import { showSuccess, showError, showConfirm } from "@/utils/sweetalert"
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default function AdminOrders() {
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [perPage, setPerPage] = useState(15)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [error, setError] = useState(null)
    const [dateFrom, setDateFrom] = useState('')
    const [dateTo, setDateTo] = useState('')
    const [showFilters, setShowFilters] = useState(false)
    const [updatingStatus, setUpdatingStatus] = useState(null)
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        paid: 0,
        transported: 0,
        completed: 0,
        cancelled: 0
    })
    const { isOpen, onOpen, onClose } = useDisclosure()

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (page === 1) {
                fetchOrders()
            } else {
                setPage(1)
            }
        }, 500)
        return () => clearTimeout(timer)
    }, [search])

    useEffect(() => {
        fetchOrders()
    }, [filter, page, dateFrom, dateTo, perPage])

    const fetchOrders = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const token = Cookies.get('admin_token')

            if (!token) {
                setError('No authentication token found')
                setIsLoading(false)
                return
            }

            const params = {
                page: page,
                per_page: perPage
            }
            if (filter !== 'all') params.status = filter
            if (search) params.search = search
            if (dateFrom) params.date_from = dateFrom
            if (dateTo) params.date_to = dateTo

            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'https://backendapi.emcc-lab.com/'}/api/admin/orders`, {
                params: params,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            })

            console.log('Orders response:', response.data)

            setOrders(response.data.data || [])
            setTotalPages(response.data.last_page || 1)
            setTotalItems(response.data.total || 0)
            if (response.data.stats) {
                setStats(response.data.stats)
            }
        } catch (error) {
            console.error("Error fetching orders:", error)
            let errorMessage = 'Failed to fetch orders'
            if (error.response) {
                errorMessage = error.response.data?.message || error.response.data?.error || errorMessage
            } else if (error.request) {
                errorMessage = 'No response from server. Please check if the backend is running.'
            }
            setError(errorMessage)
            showError('Error', errorMessage)
        } finally {
            setIsLoading(false)
        }
    }, [filter, search, page, dateFrom, dateTo, perPage])

    const handleStatusUpdate = async (orderId, newStatus) => {
        const result = await showConfirm('Update Status', `Change order #${orderId} status to ${newStatus.toUpperCase()}?`)
        if (result.isConfirmed) {
            setUpdatingStatus(orderId)
            try {
                const token = Cookies.get('admin_token')
                await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'https://backendapi.emcc-lab.com/'}/api/admin/orders/${orderId}/status`,
                    { status: newStatus },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    }
                )
                showSuccess('Updated', 'Order status updated successfully')
                fetchOrders()
            } catch (error) {
                console.error("Error updating status:", error)
                showError('Error', 'Failed to update order status')
            } finally {
                setUpdatingStatus(null)
            }
        }
    }

    const viewOrderDetails = async (orderId) => {
        try {
            const token = Cookies.get('admin_token')
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'https://backendapi.emcc-lab.com/'}/api/admin/orders/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            })
            console.log('Order details:', response.data)
            setSelectedOrder(response.data)
            onOpen()
        } catch (error) {
            console.error("Error fetching order details:", error)
            showError('Error', 'Failed to fetch order details')
        }
    }

    // Helper function to get product names from order items
    const getProductNames = (items) => {
        if (!items || items.length === 0) return 'No products'

        // Try different possible property names for product name
        const names = items.map(item => {
            return item.product_name ||
                item.name ||
                item.product?.name ||
                item.title ||
                `Product #${item.product_id || item.id}`
        })

        return names.join(', ')
    }

    // Helper function to get total quantity
    const getTotalQuantity = (items) => {
        if (!items || items.length === 0) return 0
        return items.reduce((sum, item) => sum + (item.quantity || 0), 0)
    }

    const exportToExcel = () => {
        if (orders.length === 0) {
            showError('Error', 'No orders to export')
            return
        }

        const exportData = orders.map(order => ({
            'Order ID': order.id,
            'Customer Name': order.user?.name || order.customer_name || 'N/A',
            'Phone Number': order.user?.phone_number || order.phone_number || 'N/A',
            'Products': getProductNames(order.items),
            'Quantity': getTotalQuantity(order.items),
            'Total Amount': `TSh ${(order.grand_total || order.total || 0).toLocaleString()}`,
            'Status': order.status?.toUpperCase() || 'N/A',
            'Date': order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'
        }))

        const ws = XLSX.utils.json_to_sheet(exportData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Orders')

        let fileName = `orders_${new Date().toISOString().split('T')[0]}`
        if (filter !== 'all') fileName += `_${filter}`
        if (dateFrom) fileName += `_from_${dateFrom}`

        XLSX.writeFile(wb, `${fileName}.xlsx`)
        showSuccess('Exported', 'Orders exported to Excel successfully')
    }

    const exportToPDF = () => {
        if (orders.length === 0) {
            showError('Error', 'No orders to export')
            return
        }

        const doc = new jsPDF()

        // Add title
        doc.setFontSize(18)
        doc.text('Orders Report', 14, 15)

        // Add generation date
        doc.setFontSize(10)
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 25)

        // Add filters info
        let yPos = 35
        if (filter !== 'all') {
            doc.text(`Status: ${filter.toUpperCase()}`, 14, yPos)
            yPos += 5
        }
        if (dateFrom) {
            doc.text(`From: ${dateFrom}`, 14, yPos)
            yPos += 5
        }
        if (dateTo) {
            doc.text(`To: ${dateTo}`, 14, yPos)
            yPos += 5
        }

        const tableData = orders.map(order => [
            order.id || 'N/A',
            order.user?.name || order.customer_name || 'N/A',
            order.user?.phone_number || order.phone_number || 'N/A',
            getProductNames(order.items).substring(0, 50),
            getTotalQuantity(order.items).toString(),
            `TSh ${(order.grand_total || order.total || 0).toLocaleString()}`,
            order.status?.toUpperCase() || 'N/A',
            order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'
        ])

        doc.autoTable({
            head: [['Order ID', 'Customer', 'Phone', 'Products', 'Qty', 'Amount', 'Status', 'Date']],
            body: tableData,
            startY: yPos + 5,
            theme: 'striped',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [41, 128, 185] }
        })

        let fileName = `orders_${new Date().toISOString().split('T')[0]}`
        if (filter !== 'all') fileName += `_${filter}`

        doc.save(`${fileName}.pdf`)
        showSuccess('Exported', 'Orders exported to PDF successfully')
    }

    const resetFilters = () => {
        setFilter('all')
        setSearch('')
        setDateFrom('')
        setDateTo('')
        setPage(1)
        setPerPage(15)
    }

    const formatCurrency = (amount) => {
        return `TSh ${(amount || 0).toLocaleString()}`
    }

    const statusColors = {
        pending: 'warning',
        paid: 'primary',
        transported: 'secondary',
        completed: 'success',
        cancelled: 'danger'
    }

    const statusLabels = {
        pending: 'Pending',
        paid: 'Paid',
        transported: 'Transported',
        completed: 'Completed',
        cancelled: 'Cancelled'
    }

    const statusIcons = {
        pending: FiPackage,
        paid: FiCreditCard,
        transported: FiTruck,
        completed: FiCheckCircle,
        cancelled: FiXCircle
    }

    // COMMENTED OUT - Loading spinner removed for faster page load
    // if (isLoading && orders.length === 0) {
    //     return (
    //         <div className="flex justify-center items-center h-96">
    //             <Spinner size="lg" color="primary" />
    //         </div>
    //     )
    // }

    if (error && orders.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center h-96">
                <FiAlertCircle className="h-16 w-16 text-danger mb-4" />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Orders</h2>
                <p className="text-gray-500 mb-4">{error}</p>
                <Button color="primary" onPress={fetchOrders} startContent={<FiRefreshCw />}>
                    Try Again
                </Button>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <p className="text-gray-500 mt-1">Manage and track all customer orders</p>
                    </div>
                    <div className="flex gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button color="primary" variant="flat" endContent={<FiDownload />}>
                                    Export
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem key="excel" startContent={<FiFileText />} onPress={exportToExcel}>
                                    Export to Excel
                                </DropdownItem>
                                <DropdownItem key="pdf" startContent={<FiPrinter />} onPress={exportToPDF}>
                                    Export to PDF
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <Button
                            color="secondary"
                            variant="flat"
                            isIconOnly
                            onPress={fetchOrders}
                            title="Refresh"
                        >
                            <FiRefreshCw className={isLoading ? "animate-spin" : ""} />
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <CardBody className="text-center py-3">
                            <p className="text-xs opacity-90">Total Orders</p>
                            <p className="text-2xl font-bold">{stats.total}</p>
                        </CardBody>
                    </Card>
                    <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                        <CardBody className="text-center py-3">
                            <p className="text-xs opacity-90">Pending</p>
                            <p className="text-2xl font-bold">{stats.pending}</p>
                        </CardBody>
                    </Card>
                    <Card className="bg-gradient-to-br from-blue-400 to-blue-500 text-white">
                        <CardBody className="text-center py-3">
                            <p className="text-xs opacity-90">Paid</p>
                            <p className="text-2xl font-bold">{stats.paid}</p>
                        </CardBody>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <CardBody className="text-center py-3">
                            <p className="text-xs opacity-90">Transported</p>
                            <p className="text-2xl font-bold">{stats.transported}</p>
                        </CardBody>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <CardBody className="text-center py-3">
                            <p className="text-xs opacity-90">Completed</p>
                            <p className="text-2xl font-bold">{stats.completed}</p>
                        </CardBody>
                    </Card>
                    <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                        <CardBody className="text-center py-3">
                            <p className="text-xs opacity-90">Cancelled</p>
                            <p className="text-2xl font-bold">{stats.cancelled}</p>
                        </CardBody>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardBody>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    size="sm"
                                    color={filter === 'all' ? "primary" : "default"}
                                    variant={filter === 'all' ? "solid" : "flat"}
                                    onPress={() => setFilter('all')}
                                >
                                    All Orders
                                </Button>
                                {['pending', 'paid', 'transported', 'completed', 'cancelled'].map((status) => {
                                    const Icon = statusIcons[status]
                                    return (
                                        <Button
                                            key={status}
                                            size="sm"
                                            color={filter === status ? statusColors[status] : "default"}
                                            variant={filter === status ? "solid" : "flat"}
                                            onPress={() => setFilter(status)}
                                            startContent={<Icon className="h-3 w-3" />}
                                        >
                                            {statusLabels[status]}
                                        </Button>
                                    )
                                })}
                            </div>

                            <div className="flex flex-wrap gap-3 items-center">
                                <Input
                                    placeholder="Search by Order ID, Customer, Phone or Email..."
                                    startContent={<FiSearch className="text-gray-400" />}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1 min-w-[200px]"
                                    size="sm"
                                    isClearable
                                    onClear={() => setSearch('')}
                                />

                                <Button
                                    size="sm"
                                    variant="flat"
                                    startContent={<FiCalendar />}
                                    onPress={() => setShowFilters(!showFilters)}
                                >
                                    Date Filter
                                    {(dateFrom || dateTo) && <Badge color="primary" size="sm" className="ml-1" />}
                                </Button>

                                {(filter !== 'all' || search || dateFrom || dateTo) && (
                                    <Button
                                        size="sm"
                                        variant="light"
                                        color="danger"
                                        onPress={resetFilters}
                                    >
                                        Clear Filters
                                    </Button>
                                )}
                            </div>

                            {showFilters && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                    <Input
                                        type="date"
                                        label="From Date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        size="sm"
                                    />
                                    <Input
                                        type="date"
                                        label="To Date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        size="sm"
                                    />
                                </div>
                            )}
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Orders Table */}
            <Card className="flex-1 flex flex-col min-h-0">
                <CardBody className="p-0 flex flex-col min-h-0">
                    <div className="flex-1 overflow-auto min-h-0">
                        <div className="min-w-[1000px] h-full">
                            <Table
                                aria-label="Orders table"
                                isHeaderSticky
                                removeWrapper
                                classNames={{
                                    table: "min-w-full",
                                    th: "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold text-sm sticky top-0 z-10",
                                    td: "py-3",
                                    wrapper: "p-0"
                                }}
                            >
                                <TableHeader>
                                    <TableColumn className="w-[70px]">#</TableColumn>
                                    <TableColumn className="min-w-[100px]">Order ID</TableColumn>
                                    <TableColumn className="min-w-[180px]">Customer</TableColumn>
                                    <TableColumn className="min-w-[130px]">Phone Number</TableColumn>
                                    <TableColumn className="min-w-[200px]">Product Names</TableColumn>
                                    <TableColumn className="min-w-[80px]">Qty</TableColumn>
                                    <TableColumn className="min-w-[120px]">Total</TableColumn>
                                    <TableColumn className="min-w-[130px]">Status</TableColumn>
                                    <TableColumn className="min-w-[100px]">Date</TableColumn>
                                    <TableColumn className="w-[80px]">Action</TableColumn>
                                </TableHeader>
                                <TableBody
                                    isLoading={isLoading}
                                    loadingContent={<Spinner label="Loading..." />}
                                    emptyContent="No orders found"
                                >
                                    {orders.map((order, index) => {
                                        const totalQuantity = getTotalQuantity(order.items)
                                        const productNames = getProductNames(order.items)

                                        return (
                                            <TableRow key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                <TableCell>{((page - 1) * perPage) + index + 1}</TableCell>
                                                <TableCell>
                                                    <span className="font-mono text-sm font-semibold">#{order.id}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium text-sm">{order.user?.name || order.customer_name || 'N/A'}</p>
                                                        <p className="text-xs text-gray-500">{order.user?.email || 'N/A'}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm">{order.user?.phone_number || order.phone_number || 'Not provided'}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip content={productNames} placement="top">
                                                        <div className="text-sm truncate max-w-[200px]" title={productNames}>
                                                            {productNames.length > 50 ? productNames.substring(0, 50) + '...' : productNames}
                                                        </div>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip size="sm" variant="flat" color="primary">
                                                        {totalQuantity} items
                                                    </Chip>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-bold text-green-600">
                                                        {formatCurrency(order.grand_total || order.total)}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Select
                                                        size="sm"
                                                        selectedKeys={[order.status]}
                                                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                        className="w-32"
                                                        color={statusColors[order.status]}
                                                        variant="flat"
                                                        isDisabled={updatingStatus === order.id}
                                                        isLoading={updatingStatus === order.id}
                                                    >
                                                        <SelectItem key="pending">Pending</SelectItem>
                                                        <SelectItem key="paid">Paid</SelectItem>
                                                        <SelectItem key="transported">Transported</SelectItem>
                                                        <SelectItem key="completed">Completed</SelectItem>
                                                        <SelectItem key="cancelled">Cancelled</SelectItem>
                                                    </Select>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-xs whitespace-nowrap">
                                                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        size="sm"
                                                        variant="light"
                                                        isIconOnly
                                                        onPress={() => viewOrderDetails(order.id)}
                                                        title="View Details"
                                                    >
                                                        <FiEye className="h-4 w-4 text-blue-600" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Pagination Section */}
                    {totalPages > 0 && totalItems > 0 && (
                        <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t bg-white dark:bg-gray-900">
                            <div className="text-sm text-gray-500">
                                Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, totalItems)} of {totalItems} orders
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Select
                                    size="sm"
                                    selectedKeys={[perPage.toString()]}
                                    onChange={(e) => {
                                        setPerPage(Number(e.target.value))
                                        setPage(1)
                                    }}
                                    className="w-28"
                                    aria-label="Items per page"
                                >
                                    <SelectItem key="10" value="10">10 / page</SelectItem>
                                    <SelectItem key="15" value="15">15 / page</SelectItem>
                                    <SelectItem key="20" value="20">20 / page</SelectItem>
                                    <SelectItem key="50" value="50">50 / page</SelectItem>
                                </Select>

                                <Pagination
                                    total={totalPages}
                                    page={page}
                                    onChange={setPage}
                                    color="primary"
                                    size="md"
                                    showControls
                                    loop
                                    classNames={{
                                        cursor: "bg-blue-600",
                                        item: "data-[active=true]:bg-blue-600 data-[active=true]:text-white",
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Order Details Modal */}
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size="2xl"
                scrollBehavior="inside"
                classNames={{
                    base: "max-h-[90vh]",
                    body: "p-4 md:p-6"
                }}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        <h2 className="text-xl font-bold">Order Details #{selectedOrder?.id}</h2>
                        <Chip color={statusColors[selectedOrder?.status]} size="sm" variant="flat">
                            {statusLabels[selectedOrder?.status]}
                        </Chip>
                    </ModalHeader>
                    <ModalBody>
                        {selectedOrder && (
                            <div className="space-y-5">
                                {/* Customer Info */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-700 mb-3">Customer Information</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs text-gray-500">Name</p>
                                            <p className="font-medium">{selectedOrder.user?.name || selectedOrder.customer_name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Email</p>
                                            <p className="font-medium">{selectedOrder.user?.email || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Phone Number</p>
                                            <p className="font-medium">{selectedOrder.user?.phone_number || selectedOrder.phone_number || 'Not provided'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Order Date</p>
                                            <p className="font-medium">
                                                {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-700 mb-3">Order Summary</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal:</span>
                                            <span>{formatCurrency(selectedOrder.subtotal)}</span>
                                        </div>
                                        {selectedOrder.tax > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Tax:</span>
                                                <span>{formatCurrency(selectedOrder.tax)}</span>
                                            </div>
                                        )}
                                        {selectedOrder.shipping > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Shipping:</span>
                                                <span>{formatCurrency(selectedOrder.shipping)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between border-t pt-2 font-bold">
                                            <span>Total:</span>
                                            <span className="text-green-600 text-lg">{formatCurrency(selectedOrder.grand_total || selectedOrder.total)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-3">Order Items</h3>
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                            selectedOrder.items.map((item, idx) => {
                                                const itemName = item.product_name || item.name || item.product?.name || `Product #${item.product_id}`
                                                return (
                                                    <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                                                        <div className="flex-1">
                                                            <p className="font-medium">{itemName}</p>
                                                            <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                                                            <p className="font-semibold">{formatCurrency(item.total)}</p>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        ) : (
                                            <p className="text-gray-500 text-sm text-center py-4">No items found</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="default" variant="light" onPress={onClose}>
                            Close
                        </Button>
                        {selectedOrder?.status === 'paid' && (
                            <Button
                                color="primary"
                                onPress={() => {
                                    onClose()
                                    handleStatusUpdate(selectedOrder.id, 'transported')
                                }}
                            >
                                Mark as Transported
                            </Button>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}