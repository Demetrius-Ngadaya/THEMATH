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
                    { id: 1, name: "CLothes", price: 50000, image: "/laptop.jpg" },
                    { id: 2, name: "Phone case", price: 20000, image: "/phone.jpg" },
                    { id: 3, name: "Watches", price: 25000, image: "/headphones.jpg" },
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
