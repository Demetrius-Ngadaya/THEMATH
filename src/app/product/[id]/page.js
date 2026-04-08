"use client"

import { useParams } from "next/navigation"
import { useDispatch } from "react-redux"
import { addToCart } from "@/store/cartSlice"

export default function ProductPage() {

    const { id } = useParams()
    const dispatch = useDispatch()

    const product = {
        id,
        name: "Watch",
        price: 22000,
        description: "High quality product",
        image: "/product.jpg"
    }

    return (

        <div className="grid md:grid-cols-2 gap-10 py-10">

            <img src={product.image} className="rounded" />

            <div>

                <h1 className="text-3xl font-bold">

                    {product.name}

                </h1>

                <p className="text-gray-600 mt-4">

                    {product.description}

                </p>

                <p className="text-xl font-bold mt-4">

                    ${product.price}

                </p>

                <button
                    onClick={() => dispatch(addToCart(product))}
                    className="bg-blue-600 text-white px-6 py-3 rounded mt-4"
                >

                    Add to Cart

                </button>

            </div>

        </div>

    )

}