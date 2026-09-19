"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import {
    Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Chip, Spinner, Button, Pagination, Switch,
} from "@nextui-org/react"
import { FiTrash2, FiStar } from "react-icons/fi"
import { API_BASE_URL } from "@/utils/apiConfig"
import { showSuccess, showError, showConfirm } from "@/utils/sweetalert"

export default function AdminReviews() {
    const [reviews, setReviews] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const authHeaders = () => ({
        headers: { Authorization: `Bearer ${Cookies.get("admin_token")}` },
    })

    useEffect(() => {
        fetchReviews()
    }, [page])

    const fetchReviews = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/reviews`, {
                ...authHeaders(),
                params: { page, per_page: 20 },
            })
            setReviews(response.data.data || [])
            setTotalPages(response.data.last_page || 1)
        } catch (error) {
            console.error("Error fetching reviews:", error)
            showError("Error", "Failed to fetch reviews")
        } finally {
            setIsLoading(false)
        }
    }

    const handleToggle = async (review) => {
        try {
            await axios.post(`${API_BASE_URL}/admin/reviews/${review.id}/toggle-status`, {}, authHeaders())
            fetchReviews()
        } catch (error) {
            showError("Error", "Failed to update status")
        }
    }

    const handleDelete = async (review) => {
        const result = await showConfirm("Delete Review", `Delete this review by ${review.user?.name}?`)
        if (result.isConfirmed) {
            try {
                await axios.delete(`${API_BASE_URL}/admin/reviews/${review.id}`, authHeaders())
                showSuccess("Deleted", "Review removed")
                fetchReviews()
            } catch (error) {
                showError("Error", "Failed to delete review")
            }
        }
    }

    return (
        <div className="p-4">
            <p className="text-gray-500 mb-4">
                Reviews are visible on the product page while "Approved" is on. Toggle it off to hide a review
                without deleting it (useful for spam/abuse pending your judgment), or delete it outright.
            </p>

            <Card>
                <CardBody>
                    <div className="overflow-x-auto">
                        <Table aria-label="Reviews table">
                            <TableHeader>
                                <TableColumn>PRODUCT</TableColumn>
                                <TableColumn>CUSTOMER</TableColumn>
                                <TableColumn>RATING</TableColumn>
                                <TableColumn>COMMENT</TableColumn>
                                <TableColumn>DATE</TableColumn>
                                <TableColumn>APPROVED</TableColumn>
                                <TableColumn>ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody
                                isLoading={isLoading}
                                loadingContent={<Spinner label="Loading reviews..." />}
                                emptyContent="No reviews yet"
                            >
                                {reviews.map((review) => (
                                    <TableRow key={review.id}>
                                        <TableCell>{review.product?.name || "(deleted)"}</TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{review.user?.name}</p>
                                                <p className="text-xs text-gray-400">{review.user?.email}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                {review.rating} <FiStar className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-[240px] truncate">{review.comment || "—"}</TableCell>
                                        <TableCell>{new Date(review.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Switch size="sm" isSelected={!!review.is_approved} onValueChange={() => handleToggle(review)} />
                                        </TableCell>
                                        <TableCell>
                                            <Button size="sm" variant="light" isIconOnly onPress={() => handleDelete(review)} title="Delete">
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
