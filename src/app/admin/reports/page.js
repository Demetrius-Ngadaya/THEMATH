// app/admin/reports/page.js
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardBody, Button, Spinner } from "@nextui-org/react"
import { FiShoppingBag, FiPackage, FiTrendingUp, FiBarChart2 } from "react-icons/fi"

export default function ReportsIndex() {
    const reportTypes = [
        {
            title: "Order Reports",
            description: "View and export order analytics, revenue trends, and customer insights",
            icon: FiShoppingBag,
            color: "blue",
            href: "/admin/reports/orders",
            stats: ["Total Orders", "Revenue Analysis", "Status Distribution"]
        },
        {
            title: "Product Reports",
            description: "Analyze product performance, inventory levels, and category distribution",
            icon: FiPackage,
            color: "green",
            href: "/admin/reports/products",
            stats: ["Stock Levels", "Price Analysis", "Category Distribution"]
        }
    ]

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Reports Dashboard</h1>
                <p className="text-gray-500 mt-1">Select a report type to view detailed analytics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reportTypes.map((report) => {
                    const Icon = report.icon
                    return (
                        <Link key={report.href} href={report.href}>
                            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group">
                                <CardBody className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 bg-${report.color}-100 rounded-xl group-hover:scale-110 transition-transform`}>
                                            <Icon className={`h-6 w-6 text-${report.color}-600`} />
                                        </div>
                                        <FiTrendingUp className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{report.title}</h3>
                                    <p className="text-gray-500 mb-4">{report.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {report.stats.map((stat, idx) => (
                                            <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                                {stat}
                                            </span>
                                        ))}
                                    </div>
                                    <Button color={report.color} variant="flat" className="mt-4 w-full">
                                        Generate Report →
                                    </Button>
                                </CardBody>
                            </Card>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}