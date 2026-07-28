// app/admin/reports/products/page.js
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
    Progress
} from "@nextui-org/react"
import {
    FiDownload, FiFileText, FiPrinter, FiPackage,
    FiDollarSign, FiTrendingUp, FiBarChart2, FiRefreshCw,
    FiAlertCircle, FiCheckCircle, FiTag
} from "react-icons/fi"
import { showSuccess, showError } from "@/utils/sweetalert"
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import {
    BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer
} from 'recharts'

export default function ProductReports() {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [perPage, setPerPage] = useState(20)
    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('')
    const [categories, setCategories] = useState([])
    const [stats, setStats] = useState({
        total_products: 0,
        total_value: 0,
        low_stock_count: 0,
        out_of_stock_count: 0,
        average_price: 0
    })

    useEffect(() => {
        fetchProducts()
        fetchCategories()
    }, [page, perPage, search, categoryFilter])

    const fetchProducts = async () => {
        setIsLoading(true)
        try {
            const token = Cookies.get('admin_token')
            const response = await axios.get('https://backendapi.emcc-lab.com/api/admin/products', {
                params: {
                    page,
                    per_page: perPage,
                    search: search || undefined,
                    category_id: categoryFilter || undefined
                },
                headers: { Authorization: `Bearer ${token}` }
            })

            setProducts(response.data.data || [])
            setTotalPages(response.data.last_page || 1)
            setTotalItems(response.data.total || 0)

            // Calculate stats
            const productsData = response.data.data || []
            const totalValue = productsData.reduce((sum, p) => sum + (p.price * p.stock), 0)
            const lowStockCount = productsData.filter(p => p.stock > 0 && p.stock <= (p.stock_alert_qty || 5)).length
            const outOfStockCount = productsData.filter(p => p.stock === 0).length
            const averagePrice = productsData.length > 0
                ? productsData.reduce((sum, p) => sum + p.price, 0) / productsData.length
                : 0

            setStats({
                total_products: totalItems,
                total_value: totalValue,
                low_stock_count: lowStockCount,
                out_of_stock_count: outOfStockCount,
                average_price: averagePrice
            })
        } catch (error) {
            console.error("Error fetching products:", error)
            showError('Error', 'Failed to fetch products data')
        } finally {
            setIsLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const token = Cookies.get('admin_token')
            const response = await axios.get('https://backendapi.emcc-lab.com/api/admin/categories', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setCategories(response.data.data || response.data || [])
        } catch (error) {
            console.error("Error fetching categories:", error)
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US').format(amount || 0)
    }

    const exportToExcel = () => {
        const exportData = products.map(product => ({
            'Product ID': product.id,
            'Name': product.name,
            'Category': product.category?.name || 'N/A',
            'Price': `TSh ${formatCurrency(product.price)}`,
            'Buying Price': `TSh ${formatCurrency(product.buying_price)}`,
            'Profit': `TSh ${formatCurrency(product.profit_price)}`,
            'Stock': product.stock,
            'Status': product.stock === 0 ? 'Out of Stock' : product.stock <= (product.stock_alert_qty || 5) ? 'Low Stock' : 'In Stock',
            'Created': new Date(product.created_at).toLocaleDateString()
        }))

        const ws = XLSX.utils.json_to_sheet(exportData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Products Report')

        let fileName = `products_report_${new Date().toISOString().split('T')[0]}`
        if (categoryFilter) fileName += `_${categoryFilter}`

        XLSX.writeFile(wb, `${fileName}.xlsx`)
        showSuccess('Exported', 'Products report exported successfully')
    }

    const exportToPDF = () => {
        const doc = new jsPDF('landscape')

        doc.setFontSize(18)
        doc.text('Products Report', 14, 15)
        doc.setFontSize(10)
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 25)

        let yPos = 35
        if (categoryFilter) {
            const category = categories.find(c => c.id == categoryFilter)
            doc.text(`Category: ${category?.name || 'Selected'}`, 14, yPos)
            yPos += 5
        }

        const tableData = products.map(product => [
            product.id,
            product.name,
            product.category?.name || 'N/A',
            `TSh ${formatCurrency(product.price)}`,
            product.stock,
            product.stock === 0 ? 'Out of Stock' : 'In Stock',
            new Date(product.created_at).toLocaleDateString()
        ])

        doc.autoTable({
            head: [['ID', 'Name', 'Category', 'Price', 'Stock', 'Status', 'Created']],
            body: tableData,
            startY: yPos + 5,
            theme: 'striped',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [41, 128, 185] }
        })

        doc.save(`products_report_${new Date().toISOString().split('T')[0]}.pdf`)
        showSuccess('Exported', 'Products report exported successfully')
    }

    const clearFilters = () => {
        setSearch('')
        setCategoryFilter('')
        setPage(1)
    }

    // Prepare chart data for category distribution
    const categoryData = categories.slice(0, 5).map(cat => ({
        name: cat.name,
        value: products.filter(p => p.category_id === cat.id).length
    }))

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

    // COMMENTED OUT - Full page loading spinner removed for faster load
    // if (isLoading && products.length === 0) {
    //     return (
    //         <div className="flex justify-center items-center h-96">
    //             <Spinner size="lg" color="primary" />
    //         </div>
    //     )
    // }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    {/* <h1 className="text-2xl font-bold text-gray-800">Product Reports</h1> */}
                    <p className="text-gray-500 mt-1">Comprehensive product analytics and inventory reporting</p>
                </div>
                <div className="flex gap-3">
                    <Button color="success" startContent={<FiFileText />} onPress={exportToExcel}>
                        Export Excel
                    </Button>
                    <Button color="danger" startContent={<FiPrinter />} onPress={exportToPDF}>
                        Export PDF
                    </Button>
                    <Button color="primary" variant="flat" startContent={<FiRefreshCw />} onPress={fetchProducts}>
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardBody>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Total Products</p>
                                <p className="text-2xl font-bold">{stats.total_products}</p>
                            </div>
                            <FiPackage className="h-8 w-8 opacity-80" />
                        </div>
                    </CardBody>
                </Card>
                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <CardBody>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Total Inventory Value</p>
                                <p className="text-2xl font-bold">TSh {formatCurrency(stats.total_value)}</p>
                            </div>
                            {/* <FiDollarSign className="h-8 w-8 opacity-80" /> */}
                        </div>
                    </CardBody>
                </Card>
                <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                    <CardBody>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Average Price</p>
                                <p className="text-2xl font-bold">TSh {formatCurrency(stats.average_price)}</p>
                            </div>
                            <FiTrendingUp className="h-8 w-8 opacity-80" />
                        </div>
                    </CardBody>
                </Card>
                <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                    <CardBody>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Low Stock</p>
                                <p className="text-2xl font-bold">{stats.low_stock_count}</p>
                            </div>
                            <FiAlertCircle className="h-8 w-8 opacity-80" />
                        </div>
                    </CardBody>
                </Card>
                <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                    <CardBody>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Out of Stock</p>
                                <p className="text-2xl font-bold">{stats.out_of_stock_count}</p>
                            </div>
                            <FiAlertCircle className="h-8 w-8 opacity-80" />
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Category Distribution Chart */}
            {categoryData.length > 0 && (
                <Card className="mb-6">
                    <CardBody>
                        <h3 className="text-lg font-semibold mb-4">Products by Category</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>
            )}

            {/* Filters */}
            <Card className="mb-6">
                <CardBody>
                    <div className="flex flex-wrap gap-4 items-end">
                        <Input
                            label="Search Product"
                            placeholder="Search by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-64"
                        />

                        <Select
                            label="Category"
                            selectedKeys={categoryFilter ? [categoryFilter] : []}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-48"
                        >
                            <SelectItem key="">All Categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id}>{cat.name}</SelectItem>
                            ))}
                        </Select>

                        {(search || categoryFilter) && (
                            <Button color="danger" variant="light" onPress={clearFilters}>
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </CardBody>
            </Card>

            {/* Products Table */}
            <Card>
                <CardBody>
                    <div className="overflow-x-auto">
                        <Table aria-label="Products report table">
                            <TableHeader>
                                <TableColumn>ID</TableColumn>
                                <TableColumn>NAME</TableColumn>
                                <TableColumn>CATEGORY</TableColumn>
                                <TableColumn>PRICE</TableColumn>
                                <TableColumn>BUYING PRICE</TableColumn>
                                <TableColumn>PROFIT</TableColumn>
                                <TableColumn>STOCK</TableColumn>
                                <TableColumn>STATUS</TableColumn>
                            </TableHeader>
                            <TableBody
                                isLoading={isLoading}
                                loadingContent={<Spinner label="Loading..." />}
                                emptyContent="No products found"
                            >
                                {products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>#{product.id}</TableCell>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>{product.category?.name || 'N/A'}</TableCell>
                                        <TableCell className="font-semibold text-green-600">
                                            TSh {formatCurrency(product.price)}
                                        </TableCell>
                                        <TableCell className="text-gray-600">
                                            TSh {formatCurrency(product.buying_price)}
                                        </TableCell>
                                        <TableCell className="text-blue-600">
                                            TSh {formatCurrency(product.profit_price)}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                color={product.stock === 0 ? 'danger' : product.stock <= (product.stock_alert_qty || 5) ? 'warning' : 'success'}
                                                size="sm"
                                            >
                                                {product.stock} units
                                            </Chip>
                                        </TableCell>
                                        <TableCell>
                                            {product.stock === 0 ? (
                                                <Chip color="danger" size="sm" startContent={<FiAlertCircle />}>Out of Stock</Chip>
                                            ) : product.stock <= (product.stock_alert_qty || 5) ? (
                                                <Chip color="warning" size="sm">Low Stock</Chip>
                                            ) : (
                                                <Chip color="success" size="sm" startContent={<FiCheckCircle />}>In Stock</Chip>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 0 && totalItems > 0 && (
                        <div className="flex justify-between items-center mt-4">
                            <div className="text-sm text-gray-500">
                                Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, totalItems)} of {totalItems} products
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