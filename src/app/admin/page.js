"use client"

import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts"

const data = [

    { month: "Jan", sales: 400 },
    { month: "Feb", sales: 800 },
    { month: "Mar", sales: 600 }

]

export default function Admin() {

    return (

        <div>

            <h1 className="text-3xl font-bold mb-6">

                Admin Dashboard

            </h1>

            <LineChart width={600} height={300} data={data}>

                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line dataKey="sales" />

            </LineChart>

        </div>

    )

}