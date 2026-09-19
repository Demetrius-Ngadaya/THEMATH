"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { FiStar } from "react-icons/fi"
import { API_BASE_URL } from "@/utils/apiConfig"
import { showSuccess, showError } from "@/utils/sweetalert"

function StarRow({ rating, size = "h-5 w-5", onSelect }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
                <FiStar
                    key={n}
                    onClick={onSelect ? () => onSelect(n) : undefined}
                    className={`${size} ${onSelect ? "cursor-pointer" : ""} ${n <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
            ))}
        </div>
    )
}

export default function ProductReviews({ productId }) {
    const [reviews, setReviews] = useState([])
    const [averageRating, setAverageRating] = useState(0)
    const [count, setCount] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    const [myRating, setMyRating] = useState(0)
    const [myComment, setMyComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const fetchReviews = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${API_BASE_URL}/products/${productId}/reviews`)
            setReviews(response.data.reviews || [])
            setAverageRating(response.data.average_rating || 0)
            setCount(response.data.count || 0)
        } catch (error) {
            console.error("Error fetching reviews:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchReviews()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const token = Cookies.get("auth_token")
        if (!token) {
            showError("Please Login", "You need to log in to leave a review")
            router.push("/login")
            return
        }
        if (myRating === 0) {
            showError("Rating required", "Please select a star rating")
            return
        }

        setIsSubmitting(true)
        try {
            await axios.post(
                `${API_BASE_URL}/products/${productId}/reviews`,
                { rating: myRating, comment: myComment || undefined },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            showSuccess("Thank you!", "Your review has been posted")
            setMyRating(0)
            setMyComment("")
            fetchReviews()
        } catch (error) {
            showError("Error", error.response?.data?.message || "Failed to submit review")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Customer Reviews</h2>

            <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">{averageRating || "—"}</span>
                <div>
                    <StarRow rating={Math.round(averageRating)} />
                    <p className="text-sm text-gray-500 mt-1">{count} review{count !== 1 ? "s" : ""}</p>
                </div>
            </div>

            {/* Write a review */}
            <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 mb-8">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Write a Review</h3>
                <div className="mb-3">
                    <StarRow rating={myRating} onSelect={setMyRating} size="h-7 w-7" />
                </div>
                <textarea
                    value={myComment}
                    onChange={(e) => setMyComment(e.target.value)}
                    placeholder="Share your thoughts about this product (optional)"
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-3 px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
                >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
            </form>

            {/* Review list */}
            {isLoading ? (
                <p className="text-gray-500 text-sm">Loading reviews...</p>
            ) : reviews.length === 0 ? (
                <p className="text-gray-500 text-sm">No reviews yet - be the first to review this product.</p>
            ) : (
                <div className="space-y-5">
                    {reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 dark:border-gray-800 pb-5">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-gray-900 dark:text-white">{review.user?.name || "Anonymous"}</span>
                                <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                            </div>
                            <StarRow rating={review.rating} size="h-4 w-4" />
                            {review.comment && (
                                <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">{review.comment}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
