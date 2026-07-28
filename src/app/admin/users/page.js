// app/admin/users/page.js
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
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Avatar,
    Divider
} from "@nextui-org/react"
import { FiEdit2, FiTrash2, FiSearch, FiPhone, FiX, FiUser, FiEye, FiMail, FiCalendar, FiShield } from "react-icons/fi"
import { showSuccess, showError, showConfirm } from "@/utils/sweetalert"

export default function AdminUsers() {
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSearching, setIsSearching] = useState(false)
    const [search, setSearch] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalUsers, setTotalUsers] = useState(0)
    const [perPage, setPerPage] = useState(15)
    const [showModal, setShowModal] = useState(false)
    const [showViewModal, setShowViewModal] = useState(false)
    const [viewingUser, setViewingUser] = useState(null)
    const [editingUser, setEditingUser] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number: '',
        role: 'user',
        password: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Debounced search to avoid too many API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== search) {
                setSearch(searchInput)
                setPage(1)
                setIsSearching(true)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [searchInput])

    useEffect(() => {
        fetchUsers()
    }, [search, page, perPage])

    const fetchUsers = async () => {
        setIsLoading(true)
        try {
            const token = Cookies.get('admin_token')
            if (!token) {
                console.error("No admin token found")
                showError('Error', 'Authentication required')
                return
            }

            const response = await axios.get('https://backendapi.emcc-lab.com/api/admin/users', {
                params: {
                    search: search || undefined,
                    page: page,
                    per_page: perPage
                },
                headers: { Authorization: `Bearer ${token}` }
            })

            setUsers(response.data.data || [])
            setTotalPages(response.data.last_page || 1)
            setTotalUsers(response.data.total || 0)
        } catch (error) {
            console.error("Error fetching users:", error)
            if (error.response?.status === 401) {
                showError('Error', 'Session expired. Please login again.')
            } else {
                showError('Error', error.response?.data?.error || 'Failed to fetch users')
            }
            setUsers([])
            setTotalPages(1)
            setTotalUsers(0)
        } finally {
            setIsLoading(false)
            setIsSearching(false)
        }
    }

    const handleClearSearch = () => {
        setSearchInput('')
        setSearch('')
        setPage(1)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const token = Cookies.get('admin_token')

            const updateData = {
                name: formData.name,
                email: formData.email,
                phone_number: formData.phone_number,
                role: formData.role
            }

            if (formData.password && formData.password.trim() !== '') {
                updateData.password = formData.password
            }

            if (editingUser) {
                await axios.put(`https://backendapi.emcc-lab.com/api/admin/users/${editingUser.id}`,
                    updateData,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                showSuccess('Updated', 'User updated successfully')
            }

            setShowModal(false)
            resetForm()
            fetchUsers()
        } catch (error) {
            console.error("Error saving user:", error)
            showError('Error', error.response?.data?.error || error.response?.data?.message || 'Failed to save user')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (userId, userName) => {
        const result = await showConfirm('Delete User', `Delete user "${userName}"? This action cannot be undone.`)
        if (result.isConfirmed) {
            try {
                const token = Cookies.get('admin_token')
                await axios.delete(`https://backendapi.emcc-lab.com/api/admin/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                showSuccess('Deleted', 'User deleted successfully')
                fetchUsers()
            } catch (error) {
                showError('Error', error.response?.data?.error || 'Failed to delete user')
            }
        }
    }

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone_number: '',
            role: 'user',
            password: ''
        })
        setEditingUser(null)
    }

    const handleEdit = (user) => {
        setEditingUser(user)
        setFormData({
            name: user.name,
            email: user.email,
            phone_number: user.phone_number || '',
            role: user.role,
            password: ''
        })
        setShowModal(true)
    }

    const handleView = (user) => {
        setViewingUser(user)
        setShowViewModal(true)
    }

    const handlePageChange = (newPage) => {
        setPage(newPage)
    }

    const formatDate = (date) => {
        if (!date) return 'N/A'
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // COMMENTED OUT - Full page loading spinner removed for faster load
    // if (isLoading && users.length === 0) {
    //     return (
    //         <div className="flex justify-center items-center h-96">
    //             <Spinner size="lg" color="primary" />
    //         </div>
    //     )
    // }

    return (
        <div className="py-4 px-4 h-full flex flex-col">
            {/* Header Section - Fixed */}
            <div className="flex-shrink-0">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                    <div>
                        <p className="text-gray-500 mt-1 px-6">Manage customer and admin accounts</p>
                    </div>

                    {/* Search Box */}
                    <div className="w-full lg:w-auto">
                        <Input
                            placeholder="Search by name, email or phone..."
                            startContent={<FiSearch className="text-gray-400" />}
                            endContent={
                                searchInput && (
                                    <button
                                        onClick={handleClearSearch}
                                        className="focus:outline-none"
                                        type="button"
                                    >
                                        <FiX className="text-gray-400 hover:text-gray-600" />
                                    </button>
                                )
                            }
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full lg:w-96"
                            size="lg"
                            clearable={false}
                        />
                    </div>
                </div>
            </div>

            {/* Card with fixed height and scrollable table */}
            <Card className="flex-1 flex flex-col min-h-0">
                <CardBody className="p-0 flex flex-col min-h-0">
                    {/* Scrollable Table Area */}
                    <div className="flex-1 overflow-auto min-h-0">
                        <div className="min-w-[1000px] h-full">
                            <Table
                                aria-label="Users table"
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
                                    <TableColumn className="w-[80px]">#</TableColumn>
                                    <TableColumn className="min-w-[200px]">User</TableColumn>
                                    <TableColumn className="min-w-[250px]">Email</TableColumn>
                                    <TableColumn className="min-w-[180px]">Phone</TableColumn>
                                    <TableColumn className="w-[120px]">Role</TableColumn>
                                    <TableColumn className="min-w-[120px]">Registered date</TableColumn>
                                    <TableColumn className="w-[130px]">Action</TableColumn>
                                </TableHeader>
                                <TableBody
                                    isLoading={isLoading || isSearching}
                                    loadingContent={<Spinner label="Loading..." />}
                                    emptyContent={
                                        search ?
                                            `No users found matching "${search}"` :
                                            "No users found"
                                    }
                                >
                                    {users.map((user, index) => (
                                        <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <TableCell>{(page - 1) * perPage + index + 1}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar
                                                        name={user.name}
                                                        size="sm"
                                                        className="flex-shrink-0"
                                                        fallback={<FiUser className="text-gray-400" />}
                                                    />
                                                    <span className="font-medium truncate">{user.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm break-all">{user.email}</span>
                                            </TableCell>
                                            <TableCell>
                                                {user.phone_number ? (
                                                    <div className="flex items-center gap-2">
                                                        <FiPhone className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                                        <span className="text-sm break-all">{user.phone_number}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400 italic">Not provided</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    color={user.role === 'admin' ? 'primary' : 'default'}
                                                    size="sm"
                                                    variant={user.role === 'admin' ? 'solid' : 'flat'}
                                                    classNames={{
                                                        base: "capitalize"
                                                    }}
                                                >
                                                    {user.role || 'user'}
                                                </Chip>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm whitespace-nowrap">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="light"
                                                        isIconOnly
                                                        onPress={() => handleView(user)}
                                                        className="hover:bg-green-100"
                                                        title="View Details"
                                                    >
                                                        <FiEye className="h-4 w-4 text-green-600" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="light"
                                                        isIconOnly
                                                        onPress={() => handleEdit(user)}
                                                        className="hover:bg-blue-100"
                                                        title="Edit User"
                                                    >
                                                        <FiEdit2 className="h-4 w-4 text-blue-600" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="light"
                                                        isIconOnly
                                                        onPress={() => handleDelete(user.id, user.name)}
                                                        className="hover:bg-red-100"
                                                        title="Delete User"
                                                    >
                                                        <FiTrash2 className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Pagination Section - Fixed at bottom */}
                    {totalPages > 0 && totalUsers > 0 && (
                        <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t bg-white dark:bg-gray-900">
                            <div className="text-sm text-gray-500">
                                Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, totalUsers)} of {totalUsers} users
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                {/* Per Page Selector */}
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

                                {/* Pagination Controls */}
                                <Pagination
                                    total={totalPages}
                                    page={page}
                                    onChange={handlePageChange}
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

            {/* View User Details Modal */}
            <Modal
                isOpen={showViewModal}
                onClose={() => setShowViewModal(false)}
                size="2xl"
                scrollBehavior="inside"
                placement="center"
                classNames={{
                    base: "max-h-[90vh]",
                    body: "p-0"
                }}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 border-b pb-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">User Details</h2>
                            <Chip color={viewingUser?.role === 'admin' ? 'primary' : 'default'} size="sm">
                                {viewingUser?.role || 'User'}
                            </Chip>
                        </div>
                        <p className="text-sm text-gray-500">Complete user information</p>
                    </ModalHeader>
                    <ModalBody>
                        {viewingUser && (
                            <div className="p-6 space-y-6">
                                {/* User Header with Avatar */}
                                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                                    <Avatar
                                        name={viewingUser.name}
                                        size="lg"
                                        className="w-20 h-20 text-2xl"
                                        fallback={<FiUser className="text-gray-400" />}
                                    />
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{viewingUser.name}</h3>
                                        <p className="text-gray-500">{viewingUser.email}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Chip size="sm" variant="flat" color={viewingUser.role === 'admin' ? 'primary' : 'default'}>
                                                {viewingUser.role === 'admin' ? 'Administrator' : 'Customer'}
                                            </Chip>
                                        </div>
                                    </div>
                                </div>

                                <Divider />

                                {/* Contact Information */}
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <FiMail className="w-4 h-4" />
                                        Contact Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                            <FiMail className="text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500">Email Address</p>
                                                <p className="font-medium text-gray-800">{viewingUser.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                            <FiPhone className="text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500">Phone Number</p>
                                                <p className="font-medium text-gray-800">
                                                    {viewingUser.phone_number || 'Not provided'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Account Information */}
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <FiShield className="w-4 h-4" />
                                        Account Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                            <FiUser className="text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500">Full Name</p>
                                                <p className="font-medium text-gray-800">{viewingUser.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                            <FiShield className="text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500">Role</p>
                                                <p className="font-medium text-gray-800 capitalize">
                                                    {viewingUser.role === 'admin' ? 'Administrator' : 'Regular User'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Dates Information */}
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <FiCalendar className="w-4 h-4" />
                                        Account Timeline
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                            <FiCalendar className="text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500">Registered Date</p>
                                                <p className="font-medium text-gray-800">{formatDate(viewingUser.created_at)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                            <FiCalendar className="text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500">Last Updated</p>
                                                <p className="font-medium text-gray-800">{formatDate(viewingUser.updated_at)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* User ID */}
                                <div className="text-center p-3 bg-gray-100 rounded-lg">
                                    <p className="text-xs text-gray-500">User ID</p>
                                    <p className="font-mono text-sm text-gray-600">#{viewingUser.id}</p>
                                </div>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter className="border-t pt-4">
                        <Button
                            color="primary"
                            variant="flat"
                            onPress={() => {
                                setShowViewModal(false)
                                handleEdit(viewingUser)
                            }}
                        >
                            Edit User
                        </Button>
                        <Button variant="flat" onPress={() => setShowViewModal(false)}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Edit User Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false)
                    resetForm()
                }}
                size="2xl"
                scrollBehavior="inside"
                placement="center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {editingUser ? 'Edit User' : 'Add New User'}
                                {editingUser && (
                                    <p className="text-sm text-gray-500">Editing: {editingUser.name}</p>
                                )}
                            </ModalHeader>
                            <form onSubmit={handleSubmit}>
                                <ModalBody>
                                    <div className="space-y-4">
                                        <Input
                                            label="Full Name"
                                            placeholder="Enter full name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            isRequired
                                            size="lg"
                                        />

                                        <Input
                                            label="Email Address"
                                            type="email"
                                            placeholder="user@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            isRequired
                                            size="lg"
                                        />

                                        <Input
                                            label="Phone Number"
                                            type="tel"
                                            placeholder="+255712345678"
                                            value={formData.phone_number}
                                            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                            description="Optional - Enter phone number with country code"
                                            size="lg"
                                        />

                                        <Select
                                            label="Role"
                                            selectedKeys={[formData.role]}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            isRequired
                                            size="lg"
                                        >
                                            <SelectItem key="user" value="user">User (Regular customer)</SelectItem>
                                            <SelectItem key="admin" value="admin">Admin (Full access)</SelectItem>
                                        </Select>

                                        <Input
                                            label="New Password"
                                            type="password"
                                            placeholder="Leave blank to keep current password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            description="Only fill if you want to change the password (min 6 characters)"
                                            size="lg"
                                        />
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button variant="flat" onPress={onClose} size="lg">
                                        Cancel
                                    </Button>
                                    <Button color="primary" type="submit" isLoading={isSubmitting} size="lg">
                                        {editingUser ? 'Update User' : 'Create User'}
                                    </Button>
                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}