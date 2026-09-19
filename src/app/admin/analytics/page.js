"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { Card, CardBody, Spinner, Chip } from "@nextui-org/react"
import {
    AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer,
} from "recharts"
import { FiUsers, FiEye, FiGlobe, FiWifi } from "react-icons/fi"
import { API_BASE_URL } from "@/utils/apiConfig"

const ONLINE_POLL_MS = 20000

export default function AdminAnalytics() {
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const authHeaders = () => ({
        headers: { Authorization: `Bearer ${Cookies.get("admin_token")}` },
    })

    const fetchSummary = async (showSpinner = false) => {
        if (showSpinner) setIsLoading(true)
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/analytics/summary`, authHeaders())
            setData(response.data)
        } catch (error) {
            console.error("Error fetching analytics:", error)
        } finally {
            if (showSpinner) setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchSummary(true)
        const interval = setInterval(() => fetchSummary(false), ONLINE_POLL_MS)
        return () => clearInterval(interval)
    }, [])

    if (isLoading || !data) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner label="Loading analytics..." />
            </div>
        )
    }

    const { counts, online_now, daily_series, top_locations } = data

    const statCards = [
        { label: "Today", visitors: counts.today.visitors, pageViews: counts.today.page_views },
        { label: "This Week", visitors: counts.this_week.visitors, pageViews: counts.this_week.page_views },
        { label: "This Month", visitors: counts.this_month.visitors, pageViews: counts.this_month.page_views },
        { label: "This Year", visitors: counts.this_year.visitors, pageViews: counts.this_year.page_views },
        { label: "Total", visitors: counts.total.visitors, pageViews: counts.total.page_views },
    ]

    const chartData = daily_series.map((d) => ({
        date: new Date(d.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        visitors: d.visitors,
        pageViews: d.page_views,
    }))

    return (
        <div className="p-4 space-y-6">
            {/* Online now banner */}
            <Card className="bg-gradient-to-r from-green-600 to-emerald-600">
                <CardBody className="flex flex-row items-center justify-between py-6">
                    <div className="flex items-center gap-3">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                        </span>
                        <div>
                            <p className="text-white/80 text-sm">Currently Online</p>
                            <p className="text-white text-3xl font-bold">{online_now}</p>
                        </div>
                    </div>
                    <FiWifi className="h-10 w-10 text-white/70" />
                </CardBody>
            </Card>

            {/* Period stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {statCards.map((card) => (
                    <Card key={card.label}>
                        <CardBody className="py-4">
                            <p className="text-gray-500 text-sm">{card.label}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <FiUsers className="h-4 w-4 text-blue-500" />
                                <span className="text-xl font-bold">{card.visitors.toLocaleString()}</span>
                                <span className="text-xs text-gray-400">visitors</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <FiEye className="h-4 w-4 text-purple-500" />
                                <span className="text-sm text-gray-600">{card.pageViews.toLocaleString()}</span>
                                <span className="text-xs text-gray-400">page views</span>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* Trend chart */}
            <Card>
                <CardBody>
                    <h3 className="text-lg font-semibold mb-4">Visitors - Last 30 Days</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis dataKey="date" fontSize={12} />
                            <YAxis fontSize={12} allowDecimals={false} />
                            <Tooltip />
                            <Area type="monotone" dataKey="visitors" stroke="#3b82f6" fill="url(#visitorGradient)" strokeWidth={2} name="Visitors" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardBody>
            </Card>

            {/* Page views chart */}
            <Card>
                <CardBody>
                    <h3 className="text-lg font-semibold mb-4">Page Views - Last 30 Days</h3>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis dataKey="date" fontSize={12} />
                            <YAxis fontSize={12} allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="pageViews" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Page Views" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardBody>
            </Card>

            {/* Top locations */}
            <Card>
                <CardBody>
                    <div className="flex items-center gap-2 mb-4">
                        <FiGlobe className="h-5 w-5 text-blue-500" />
                        <h3 className="text-lg font-semibold">Top Locations</h3>
                    </div>
                    {top_locations.length === 0 ? (
                        <p className="text-gray-500 text-sm">No location data yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {top_locations.map((loc, i) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0 border-gray-100 dark:border-gray-800">
                                    <span className="font-medium">{loc.country || "Unknown"}</span>
                                    <Chip size="sm" variant="flat">{loc.visitors} visitor{loc.visitors !== 1 ? "s" : ""}</Chip>
                                </div>
                            ))}
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    )
}
