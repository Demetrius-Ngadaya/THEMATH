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
    Select,
    SelectItem,
    Pagination,
    DateRangePicker,
    Badge
} from "@nextui-org/react"
import {
    FiDownload, FiFileText, FiPrinter, FiCalendar,
    FiDollarSign, FiShoppingBag, FiUsers, FiTrendingUp,
    FiBarChart2, FiPieChart, FiRefreshCw, FiClock, FiCheckCircle, FiXCircle
} from "react-icons/fi"
import { showSuccess, showError } from "@/utils/sweetalert"
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

export default function OrderReports() {
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [perPage, setPerPage] = useState(20)
    const [statusFilter, setStatusFilter] = useState('all')
    const [dateRange, setDateRange] = useState({ start: '', end: '' })
    const [stats, setStats] = useState({
        total_revenue: 0,
        total_orders: 0,
        completed_orders: 0,
        pending_orders: 0,
        cancelled_orders: 0,
        average_order_value: 0
    })
    const [chartData, setChartData] = useState([])

    useEffect(() => {
        fetchOrders()
        fetchChartData()
    }, [page, perPage, statusFilter, dateRange])

    const fetchOrders = async () => {
        setIsLoading(true)
        try {
            const token = Cookies.get('admin_token')
            const params = {
                page,
                per_page: perPage,
                status: statusFilter !== 'all' ? statusFilter : undefined,
                date_from: dateRange.start,
                date_to: dateRange.end
            }

            const response = await axios.get('https://backendapi.emcc-lab.com/api/admin/orders', {
                params,
                headers: { Authorization: `Bearer ${token}` }
            })

            setOrders(response.data.data || [])
            setTotalPages(response.data.last_page || 1)
            setTotalItems(response.data.total || 0)

            // Calculate stats from response data
            const ordersData = response.data.data || []
            const totalRevenue = ordersData.reduce((sum, order) => sum + (order.grand_total || 0), 0)
            const averageOrderValue = totalItems > 0 ? totalRevenue / totalItems : 0

            setStats({
                total_revenue: totalRevenue,
                total_orders: totalItems,
                completed_orders: ordersData.filter(o => o.status === 'completed').length,
                pending_orders: ordersData.filter(o => o.status === 'pending').length,
                cancelled_orders: ordersData.filter(o => o.status === 'cancelled').length,
                average_order_value: averageOrderValue
            })
        } catch (error) {
            console.error("Error fetching orders:", error)
            showError('Error', 'Failed to fetch orders data')
        } finally {
            setIsLoading(false)
        }
    }

    const fetchChartData = async () => {
        try {
            const token = Cookies.get('admin_token')
            const response = await axios.get('https://backendapi.emcc-lab.com/api/admin/dashboard/stats', {
                params: { period: 'month' },
                headers: { Authorization: `Bearer ${token}` }
            })
            setChartData(response.data.chart_data || [])
        } catch (error) {
            console.error("Error fetching chart data:", error)
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US').format(amount || 0)
    }

    const exportToExcel = () => {
        const exportData = orders.map(order => ({
            'Order ID': order.id,
            'Customer Name': order.user?.name || 'N/A',
            'Email': order.user?.email || 'N/A',
            'Phone': order.user?.phone_number || 'N/A',
            'Total Amount': `TSh ${formatCurrency(order.grand_total)}`,
            'Status': order.status?.toUpperCase(),
            'Order Date': new Date(order.created_at).toLocaleDateString(),
            'Items Count': order.items?.length || 0
        }))

        const ws = XLSX.utils.json_to_sheet(exportData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Orders Report')

        let fileName = `orders_report_${new Date().toISOString().split('T')[0]}`
        if (statusFilter !== 'all') fileName += `_${statusFilter}`
        if (dateRange.start) fileName += `_from_${dateRange.start}`

        XLSX.writeFile(wb, `${fileName}.xlsx`)
        showSuccess('Exported', 'Orders report exported successfully')
    }

    const exportToPDF = () => {
        const doc = new jsPDF('landscape')

        doc.setFontSize(18)
        doc.text('Orders Report', 14, 15)
        doc.setFontSize(10)
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 25)

        let yPos = 35
        if (statusFilter !== 'all') {
            doc.text(`Status Filter: ${statusFilter.toUpperCase()}`, 14, yPos)
            yPos += 5
        }
        if (dateRange.start || dateRange.end) {
            doc.text(`Date Range: ${dateRange.start || 'Start'} to ${dateRange.end || 'End'}`, 14, yPos)
            yPos += 5
        }

        const tableData = orders.map(order => [
            order.id,
            order.user?.name || 'N/A',
            order.user?.email || 'N/A',
            `TSh ${formatCurrency(order.grand_total)}`,
            order.status?.toUpperCase(),
            new Date(order.created_at).toLocaleDateString()
        ])

        doc.autoTable({
            head: [['Order ID', 'Customer', 'Email', 'Amount', 'Status', 'Date']],
            body: tableData,
            startY: yPos + 5,
            theme: 'striped',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [41, 128, 185] }
        })

        doc.save(`orders_report_${new Date().toISOString().split('T')[0]}.pdf`)
        showSuccess('Exported', 'Orders report exported successfully')
    }

    const clearFilters = () => {
        setStatusFilter('all')
        setDateRange({ start: '', end: '' })
        setPage(1)
    }

    const statusColors = {
        pending: 'warning',
        paid: 'primary',
        transported: 'secondary',
        completed: 'success',
        cancelled: 'danger'
    }

    const statusIcons = {
        pending: FiClock,
        completed: FiCheckCircle,
        cancelled: FiXCircle
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    {/* <h1 className="text-2xl font-bold text-gray-800">Order Reports</h1> */}
                    <p className="text-gray-500 mt-1">Comprehensive order analytics and reporting</p>
                </div>
                <div className="flex gap-3">
                    <Button color="success" startContent={<FiFileText />} onPress={exportToExcel}>
                        Export Excel
                    </Button>
                    <Button color="danger" startContent={<FiPrinter />} onPress={exportToPDF}>
                        Export PDF
                    </Button>
                    <Button color="primary" variant="flat" startContent={<FiRefreshCw />} onPress={fetchOrders}>
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <CardBody>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Total Revenue</p>
                                <p className="text-2xl font-bold">TSh {formatCurrency(stats.total_revenue)}</p>
                            </div>
                            {/* <FiDollarSign className="h-8 w-8 opacity-80" /> */}
                        </div>
                    </CardBody>
                </Card>
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardBody>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Total Orders</p>
                                <p className="text-2xl font-bold">{stats.total_orders}</p>
                            </div>
                            <FiShoppingBag className="h-8 w-8 opacity-80" />
                        </div>
                    </CardBody>
                </Card>
                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <CardBody>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Average Order Value</p>
                                <p className="text-2xl font-bold">TSh {formatCurrency(stats.average_order_value)}</p>
                            </div>
                            <FiTrendingUp className="h-8 w-8 opacity-80" />
                        </div>
                    </CardBody>
                </Card>
                <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                    <CardBody>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Completed Orders</p>
                                <p className="text-2xl font-bold">{stats.completed_orders}</p>
                            </div>
                            <FiBarChart2 className="h-8 w-8 opacity-80" />
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Revenue Chart */}
            {chartData.length > 0 && (
                <Card className="mb-6">
                    <CardBody>
                        <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis tickFormatter={(value) => `TSh ${formatCurrency(value)}`} />
                                <Tooltip />
                                <Legend />
                                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>
            )}

            {/* Filters */}
            <Card className="mb-6">
                <CardBody>
                    <div className="flex flex-wrap gap-4 items-end">
                        <Select
                            label="Order Status"
                            selectedKeys={[statusFilter]}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-48"
                        >
                            <SelectItem key="all">All Orders</SelectItem>
                            <SelectItem key="pending">Pending</SelectItem>
                            <SelectItem key="paid">Paid</SelectItem>
                            <SelectItem key="transported">Transported</SelectItem>
                            <SelectItem key="completed">Completed</SelectItem>
                            <SelectItem key="cancelled">Cancelled</SelectItem>
                        </Select>

                        <Input
                            type="date"
                            label="From Date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                            className="w-48"
                        />

                        <Input
                            type="date"
                            label="To Date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                            className="w-48"
                        />

                        {(statusFilter !== 'all' || dateRange.start || dateRange.end) && (
                            <Button color="danger" variant="light" onPress={clearFilters}>
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </CardBody>
            </Card>

            {/* Orders Table */}
            <Card>
                <CardBody>
                    <div className="overflow-x-auto">
                        <Table aria-label="Orders report table">
                            <TableHeader>
                                <TableColumn>ORDER ID</TableColumn>
                                <TableColumn>CUSTOMER</TableColumn>
                                <TableColumn>EMAIL</TableColumn>
                                <TableColumn>PHONE</TableColumn>
                                <TableColumn>AMOUNT</TableColumn>
                                <TableColumn>STATUS</TableColumn>
                                <TableColumn>DATE</TableColumn>
                            </TableHeader>
                            <TableBody
                                isLoading={isLoading}
                                loadingContent={<Spinner label="Loading..." />}
                                emptyContent="No orders found"
                            >
                                {orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>#{order.id}</TableCell>
                                        <TableCell>{order.user?.name || 'N/A'}</TableCell>
                                        <TableCell>{order.user?.email || 'N/A'}</TableCell>
                                        <TableCell>{order.user?.phone_number || 'N/A'}</TableCell>
                                        <TableCell className="font-semibold text-green-600">
                                            TSh {formatCurrency(order.grand_total)}
                                        </TableCell>
                                        <TableCell>
                                            <Chip color={statusColors[order.status]} size="sm">
                                                {order.status}
                                            </Chip>
                                        </TableCell>
                                        <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 0 && totalItems > 0 && (
                        <div className="flex justify-between items-center mt-4">
                            <div className="text-sm text-gray-500">
                                Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, totalItems)} of {totalItems} orders
                            </div>
                            <div className="flex gap-4">
                                <Select
                                    size="sm"
                                    selectedKeys={[perPage.toString()]}
                                    onChange={(e) => setPerPage(Number(e.target.value))}
                                    className="w-28"
                                >
                                    <SelectItem key="10">10 / page</SelectItem>
                                    <SelectItem key="20">20 / page</SelectItem>
                                    <SelectItem key="50">50 / page</SelectItem>
                                </Select>
                                <Pagination total={totalPages} page={page} onChange={setPage} color="primary" showControls />
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    )
}