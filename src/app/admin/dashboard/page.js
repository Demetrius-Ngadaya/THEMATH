// app/admin/dashboard/page.js
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
    Select,
    SelectItem
} from "@nextui-org/react"
import {
    FiPackage, FiShoppingBag, FiUsers,
    FiTrendingUp, FiClock, FiCreditCard, FiDollarSign
} from "react-icons/fi"
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

export default function AdminDashboard() {
    const [stats, setStats] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [chartPeriod, setChartPeriod] = useState('week')
    const [chartData, setChartData] = useState([])

    useEffect(() => {
        fetchDashboardData()
    }, [chartPeriod])

    const fetchDashboardData = async () => {
        setIsLoading(true)
        try {
            const token = Cookies.get('admin_token')
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'https://backendapi.emcc-lab.com'}/api/admin/dashboard/stats`, {
                params: { period: chartPeriod },
                headers: { Authorization: `Bearer ${token}` }
            })
            console.log("Dashboard data:", response.data)
            setStats(response.data)
            setChartData(response.data.chart_data || [])
        } catch (error) {
            console.error("Error fetching dashboard data:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return '0'
        return new Intl.NumberFormat('en-US').format(amount)
    }

    const statCards = [
        { title: "Total Revenue", value: stats?.total_revenue, icon: FiCreditCard, color: "bg-green-500", prefix: "TSh " },
        { title: "Total Orders", value: stats?.total_orders, icon: FiShoppingBag, color: "bg-blue-500" },
        { title: "Total Products", value: stats?.total_products, icon: FiPackage, color: "bg-purple-500" },
        { title: "Total Customers", value: stats?.total_customers, icon: FiUsers, color: "bg-orange-500" },
        { title: "Pending Orders", value: stats?.pending_orders, icon: FiClock, color: "bg-yellow-500" },
        { title: "Completed Orders", value: stats?.completed_orders, icon: FiTrendingUp, color: "bg-green-500" },
    ]

    // Correct order status distribution with all statuses
    const orderStatusData = [
        { name: 'Pending', value: stats?.pending_orders || 0, color: '#fbbf24' },
        { name: 'Paid', value: stats?.paid_orders || 0, color: '#3b82f6' },
        { name: 'Transported', value: stats?.transported_orders || 0, color: '#8b5cf6' },
        { name: 'Completed', value: stats?.completed_orders || 0, color: '#10b981' },
        { name: 'Cancelled', value: stats?.cancelled_orders || 0, color: '#ef4444' },
    ]

    // Filter out zero values for better pie chart display
    const nonZeroStatusData = orderStatusData.filter(item => item.value > 0)

    // Custom Tooltip for charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border">
                    <p className="font-semibold text-gray-700 dark:text-gray-300">{label}</p>
                    {payload[0]?.dataKey === 'revenue' && (
                        <p className="text-sm text-blue-600">
                            Revenue: TSh {formatCurrency(payload[0]?.value)}
                        </p>
                    )}
                    {payload[0]?.dataKey === 'orders' && (
                        <p className="text-sm text-green-600">
                            Orders: {payload[0]?.value}
                        </p>
                    )}
                    {payload[1] && (
                        <p className="text-sm text-green-600">
                            Orders: {payload[1]?.value}
                        </p>
                    )}
                </div>
            )
        }
        return null
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Spinner size="lg" color="primary" />
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's what's happening with your store today.</p>
                </div>
                <Select
                    size="sm"
                    className="w-32"
                    selectedKeys={[chartPeriod]}
                    onChange={(e) => setChartPeriod(e.target.value)}
                >
                    <SelectItem key="week">This Week</SelectItem>
                    <SelectItem key="month">This Month</SelectItem>
                    <SelectItem key="year">This Year</SelectItem>
                </Select>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
                {statCards.map((card) => (
                    <Card key={card.title} className="hover:shadow-lg transition-shadow">
                        <CardBody className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{card.title}</p>
                                    <p className="text-xl font-bold mt-1 dark:text-white">
                                        {card.prefix || ''}{formatCurrency(card.value || 0)}
                                    </p>
                                </div>
                                <div className={`${card.color} p-2 rounded-full text-white`}>
                                    <card.icon className="h-4 w-4" />
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Revenue Chart */}
                {/* <Card>
                    <CardBody>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold dark:text-white">Revenue Overview</h2>
                        </div>
                        {chartData.length > 0 ? (
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
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#3b82f6"
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                        name="Revenue (TSh)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex justify-center items-center h-300 text-gray-500">
                                No revenue data available
                            </div>
                        )}
                    </CardBody>
                </Card> */}

                {/* Orders Chart */}
                {/* <Card>
                    <CardBody>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold dark:text-white">Orders Overview</h2>
                        </div>
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Bar
                                        dataKey="orders"
                                        fill="#10b981"
                                        name="Orders"
                                        radius={[8, 8, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex justify-center items-center h-300 text-gray-500">
                                No orders data available
                            </div>
                        )}
                    </CardBody>
                </Card> */}

                {/* Order Status Pie Chart */}
                
                <Card>
                    <CardBody>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Revenue Overview</h2>
                            <Button size="sm" variant="light">View Details</Button>
                        </div>
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
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue (TSh)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>

                {/* Orders Chart */}
                <Card>
                    <CardBody>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Orders Overview</h2>
                            <Button size="sm" variant="light">View Details</Button>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="orders" fill="#10b981" name="Orders" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <h2 className="text-lg font-semibold mb-4 dark:text-white">Order Status Distribution</h2>
                        {nonZeroStatusData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={nonZeroStatusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {nonZeroStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex justify-center items-center h-300 text-gray-500">
                                No order status data available
                            </div>
                        )}
                    </CardBody>
                </Card>

                {/* Quick Stats */}
                <Card>
                    <CardBody>
                        <h2 className="text-lg font-semibold mb-4 dark:text-white">Quick Stats</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                        <FiCreditCard className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
                                        <p className="text-lg font-bold text-gray-800 dark:text-white">
                                            TSh {formatCurrency(stats?.total_revenue || 0)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                        <FiShoppingBag className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Completed Orders</p>
                                        <p className="text-lg font-bold text-gray-800 dark:text-white">
                                            {formatCurrency(stats?.completed_orders || 0)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                                        <FiPackage className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Products</p>
                                        <p className="text-lg font-bold text-gray-800 dark:text-white">
                                            {formatCurrency(stats?.total_products || 0)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                                        <FiClock className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Pending Orders</p>
                                        <p className="text-lg font-bold text-gray-800 dark:text-white">
                                            {formatCurrency(stats?.pending_orders || 0)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Recent Orders Table */}
            <Card>
                <CardBody>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold dark:text-white">Recent Orders</h2>
                        <Button size="sm" color="primary" onPress={() => window.location.href = '/admin/orders'}>
                            View All Orders
                        </Button>
                    </div>
                    <div className="overflow-x-auto">
                        <Table aria-label="Recent orders table">
                            <TableHeader>
                                <TableColumn>ORDER ID</TableColumn>
                                <TableColumn>CUSTOMER</TableColumn>
                                <TableColumn>AMOUNT</TableColumn>
                                <TableColumn>STATUS</TableColumn>
                                <TableColumn>DATE</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {stats?.recent_orders?.length > 0 ? (
                                    stats.recent_orders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell>#{order.id}</TableCell>
                                            <TableCell>{order.user?.name || 'N/A'}</TableCell>
                                            <TableCell>TSh {formatCurrency(order.grand_total)}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    color={
                                                        order.status === 'completed' ? 'success' :
                                                            order.status === 'pending' ? 'warning' :
                                                                order.status === 'transported' ? 'primary' :
                                                                    order.status === 'paid' ? 'secondary' : 'default'
                                                    }
                                                    size="sm"
                                                >
                                                    {order.status}
                                                </Chip>
                                            </TableCell>
                                            <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center">No orders found</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}