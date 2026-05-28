// app/admin/team-members/page.js
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
    Textarea,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Switch,
    useDisclosure,
    Divider,
    Avatar
} from "@nextui-org/react"
import {
    FiEdit2, FiTrash2, FiPlus, FiUpload, FiFacebook, FiTwitter,
    FiLinkedin, FiEye, FiMail, FiUser, FiBriefcase, FiInfo,
    FiHash, FiCheckCircle, FiXCircle, FiCalendar
} from "react-icons/fi"
import { showSuccess, showError, showConfirm } from "@/utils/sweetalert"
import { getImageUrl, validateImage } from "@/utils/imageHelper"

export default function AdminTeamMembers() {
    const [members, setMembers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [editingMember, setEditingMember] = useState(null)
    const [viewingMember, setViewingMember] = useState(null)
    const [showViewModal, setShowViewModal] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        bio: '',
        facebook_url: '',
        twitter_url: '',
        linkedin_url: '',
        order: 0,
        is_active: true
    })
    const [selectedImage, setSelectedImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        fetchMembers()
    }, [])

    const fetchMembers = async () => {
        setIsLoading(true)
        try {
            const token = Cookies.get('admin_token')
            const response = await axios.get('https://backendapi.emcc-lab.com/api/admin/team-members', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setMembers(response.data)
        } catch (error) {
            console.error("Error fetching team members:", error)
            showError('Error', 'Failed to fetch team members')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const token = Cookies.get('admin_token')
            const submitData = new FormData()

            submitData.append('name', formData.name)
            submitData.append('role', formData.role)
            if (formData.bio) submitData.append('bio', formData.bio)
            if (formData.facebook_url) submitData.append('facebook_url', formData.facebook_url)
            if (formData.twitter_url) submitData.append('twitter_url', formData.twitter_url)
            if (formData.linkedin_url) submitData.append('linkedin_url', formData.linkedin_url)
            submitData.append('order', formData.order.toString())
            submitData.append('is_active', formData.is_active ? '1' : '0')

            if (selectedImage) {
                submitData.append('image', selectedImage)
            }

            if (editingMember) {
                submitData.append('_method', 'PUT')
                await axios.post(`https://backendapi.emcc-lab.com/api/admin/team-members/${editingMember.id}`,
                    submitData,
                    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
                )
                showSuccess('Updated', 'Team member updated successfully')
            } else {
                await axios.post('https://backendapi.emcc-lab.com/api/admin/team-members',
                    submitData,
                    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
                )
                showSuccess('Created', 'Team member created successfully')
            }

            onClose()
            resetForm()
            fetchMembers()
        } catch (error) {
            console.error("Error saving team member:", error)
            showError('Error', error.response?.data?.error || 'Failed to save team member')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (memberId, memberName) => {
        const result = await showConfirm('Delete Team Member', `Delete "${memberName}"? This action cannot be undone.`)
        if (result.isConfirmed) {
            try {
                const token = Cookies.get('admin_token')
                await axios.delete(`https://backendapi.emcc-lab.com/api/admin/team-members/${memberId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                showSuccess('Deleted', 'Team member deleted successfully')
                fetchMembers()
            } catch (error) {
                showError('Error', 'Failed to delete team member')
            }
        }
    }

    const handleEdit = (member) => {
        setEditingMember(member)
        setFormData({
            name: member.name,
            role: member.role,
            bio: member.bio || '',
            facebook_url: member.facebook_url || '',
            twitter_url: member.twitter_url || '',
            linkedin_url: member.linkedin_url || '',
            order: member.order,
            is_active: member.is_active === 1 || member.is_active === true
        })
        if (member.image) {
            setImagePreview(getImageUrl(member.image))
        }
        onOpen()
    }

    const handleView = (member) => {
        setViewingMember(member)
        setShowViewModal(true)
    }

    const handleAdd = () => {
        resetForm()
        onOpen()
    }

    const resetForm = () => {
        setEditingMember(null)
        setFormData({
            name: '',
            role: '',
            bio: '',
            facebook_url: '',
            twitter_url: '',
            linkedin_url: '',
            order: members.length,
            is_active: true
        })
        setSelectedImage(null)
        setImagePreview(null)
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const validationError = validateImage(file)
            if (validationError) {
                showError('Error', validationError)
                return
            }
            setSelectedImage(file)
            const reader = new FileReader()
            reader.onloadend = () => setImagePreview(reader.result)
            reader.readAsDataURL(file)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Spinner size="lg" color="primary" />
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Team Members Management</h1>
                    <p className="text-gray-500 mt-1">Manage your team members</p>
                </div>
                <Button color="primary" startContent={<FiPlus />} onPress={handleAdd}>
                    Add Team Member
                </Button>
            </div>

            <Card>
                <CardBody>
                    <div className="overflow-x-auto">
                        <Table aria-label="Team members table">
                            <TableHeader>
                                <TableColumn>Image</TableColumn>
                                <TableColumn>Name</TableColumn>
                                <TableColumn>Role</TableColumn>
                                <TableColumn>Order</TableColumn>
                                <TableColumn>Status</TableColumn>
                                <TableColumn>Actions</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {members.map((member) => (
                                    <TableRow key={member.id}>
                                        <TableCell>
                                            <img
                                                src={getImageUrl(member.image)}
                                                alt={member.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{member.name}</TableCell>
                                        <TableCell>{member.role}</TableCell>
                                        <TableCell>{member.order}</TableCell>
                                        <TableCell>
                                            <Chip color={member.is_active ? "success" : "danger"} size="sm">
                                                {member.is_active ? "Active" : "Inactive"}
                                            </Chip>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="light"
                                                    isIconOnly
                                                    onPress={() => handleView(member)}
                                                    title="View Details"
                                                >
                                                    <FiEye className="h-4 w-4 text-green-600" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="light"
                                                    isIconOnly
                                                    onPress={() => handleEdit(member)}
                                                    title="Edit Member"
                                                >
                                                    <FiEdit2 className="h-4 w-4 text-blue-600" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="light"
                                                    isIconOnly
                                                    onPress={() => handleDelete(member.id, member.name)}
                                                    title="Delete Member"
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
                </CardBody>
            </Card>

            {/* View Team Member Details Modal */}
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
                            <h2 className="text-2xl font-bold">Team Member Details</h2>
                            <Chip color={viewingMember?.is_active ? "success" : "danger"} size="sm">
                                {viewingMember?.is_active ? "Active" : "Inactive"}
                            </Chip>
                        </div>
                        <p className="text-sm text-gray-500">Complete team member information</p>
                    </ModalHeader>
                    <ModalBody>
                        {viewingMember && (
                            <div className="p-6 space-y-6">
                                {/* Profile Header */}
                                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                                    <Avatar
                                        src={getImageUrl(viewingMember.image)}
                                        name={viewingMember.name}
                                        size="lg"
                                        className="w-20 h-20"
                                    />
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{viewingMember.name}</h3>
                                        <p className="text-purple-600 font-medium">{viewingMember.role}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Chip size="sm" variant="flat" color="primary">
                                                Order: {viewingMember.order}
                                            </Chip>
                                        </div>
                                    </div>
                                </div>

                                <Divider />

                                {/* Bio Section */}
                                {viewingMember.bio && (
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <FiInfo className="w-4 h-4" />
                                            Biography
                                        </h4>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                                {viewingMember.bio}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Social Media Links */}
                                {(viewingMember.facebook_url || viewingMember.twitter_url || viewingMember.linkedin_url) && (
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <FiShare className="w-4 h-4" />
                                            Social Media
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {viewingMember.facebook_url && (
                                                <a
                                                    href={viewingMember.facebook_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                                >
                                                    <FiFacebook className="text-blue-600" />
                                                    <span className="text-sm text-blue-600">Facebook Profile</span>
                                                </a>
                                            )}
                                            {viewingMember.twitter_url && (
                                                <a
                                                    href={viewingMember.twitter_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 p-3 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors"
                                                >
                                                    <FiTwitter className="text-sky-600" />
                                                    <span className="text-sm text-sky-600">Twitter Profile</span>
                                                </a>
                                            )}
                                            {viewingMember.linkedin_url && (
                                                <a
                                                    href={viewingMember.linkedin_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                                >
                                                    <FiLinkedin className="text-blue-700" />
                                                    <span className="text-sm text-blue-700">LinkedIn Profile</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Additional Information */}
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <FiInfo className="w-4 h-4" />
                                        Additional Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                            <FiHash className="text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500">Member ID</p>
                                                <p className="font-mono text-sm text-gray-600">#{viewingMember.id}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                            <FiBriefcase className="text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500">Position Order</p>
                                                <p className="font-medium text-gray-800">{viewingMember.order}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                            {viewingMember.is_active ? (
                                                <FiCheckCircle className="text-green-500 mt-0.5" />
                                            ) : (
                                                <FiXCircle className="text-red-500 mt-0.5" />
                                            )}
                                            <div>
                                                <p className="text-xs text-gray-500">Status</p>
                                                <p className="font-medium text-gray-800">
                                                    {viewingMember.is_active ? 'Active Member' : 'Inactive Member'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                            <FiCalendar className="text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500">Created</p>
                                                <p className="font-medium text-gray-800">
                                                    {new Date(viewingMember.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
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
                                handleEdit(viewingMember)
                            }}
                        >
                            Edit Member
                        </Button>
                        <Button variant="flat" onPress={() => setShowViewModal(false)}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Team Member Modal - Create/Edit */}
            <Modal isOpen={isOpen} onClose={() => { resetForm(); onClose() }} size="2xl">
                <ModalContent>
                    <ModalHeader>{editingMember ? 'Edit Team Member' : 'Add New Team Member'}</ModalHeader>
                    <ModalBody>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <Input
                                label="Role"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                required
                            />
                            <Textarea
                                label="Bio"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                rows={3}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Facebook URL"
                                    value={formData.facebook_url}
                                    onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                                    startContent={<FiFacebook className="text-gray-400" />}
                                />
                                <Input
                                    label="Twitter URL"
                                    value={formData.twitter_url}
                                    onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                                    startContent={<FiTwitter className="text-gray-400" />}
                                />
                                <Input
                                    label="LinkedIn URL"
                                    value={formData.linkedin_url}
                                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                                    startContent={<FiLinkedin className="text-gray-400" />}
                                />
                                <Input
                                    label="Order"
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                />
                            </div>
                            <Switch
                                isSelected={formData.is_active}
                                onValueChange={(value) => setFormData({ ...formData, is_active: value })}
                            >
                                Active
                            </Switch>
                            <div>
                                <label className="block text-sm font-medium mb-2">Profile Image (Square recommended)</label>
                                <div className="flex items-center gap-4">
                                    {imagePreview && (
                                        <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-full object-cover" />
                                    )}
                                    <label className="cursor-pointer">
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-primary transition-colors text-center">
                                            <FiUpload className="mx-auto h-8 w-8 text-gray-400" />
                                            <span className="text-sm text-gray-500 mt-1 block">
                                                {imagePreview ? 'Change Image' : 'Upload Image'}
                                            </span>
                                        </div>
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    </label>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button variant="flat" onPress={() => { resetForm(); onClose() }}>Cancel</Button>
                                <Button color="primary" type="submit" isLoading={isSubmitting}>
                                    {editingMember ? 'Update' : 'Create'}
                                </Button>
                            </div>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    )
}