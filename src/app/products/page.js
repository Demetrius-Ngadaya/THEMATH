"use client"

import { useEffect, useState } from "react"
import { API } from "@/services/api"
import ProductGrid from "@/components/ProductGrid"
import Filters from "@/components/Filters"

export default function Products() {

    const [products, setProducts] = useState([])

    useEffect(() => {

        API.get("/products")
            .then(res => setProducts(res.data))
            .catch(() => {

                setProducts([
                    { id: 1, name: "Laptop", price: 800, image: "/laptop.jpg" },
                    { id: 2, name: "Phone", price: 400, image: "/phone.jpg" },
                    { id: 3, name: "Headphones", price: 100, image: "/headphones.jpg" },
                ])

            })

    }, [])

    return (

        <div className="grid grid-cols-5 gap-6 py-10">

            <div>

                <Filters />

            </div>

            <div className="col-span-4">

                <ProductGrid products={products} />

            </div>

        </div>

    )

}