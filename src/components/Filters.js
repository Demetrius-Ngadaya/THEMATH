"use client"

import { useRouter } from "next/navigation"

export default function Filters() {

    const router = useRouter()

    const categories = [
        "Electronics",
        "Fashion",
        "Phones",
        "Laptops",
        "Accessories"
    ]

    return (

        <div className="bg-white p-4 rounded shadow">

            <h3 className="font-bold mb-4">

                Categories

            </h3>

            <ul className="space-y-2">

                {categories.map(cat => (
                    <li
                        key={cat}
                        onClick={() => router.push(`/products?category=${cat}`)}
                        className="cursor-pointer hover:text-blue-600"
                    >

                        {cat}

                    </li>
                ))}

            </ul>

        </div>

    )

}