"use client"

import { useSelector, useDispatch } from "react-redux"
import { removeFromCart } from "@/store/cartSlice"

export default function Cart() {

    const items = useSelector(state => state.cart.items)
    const dispatch = useDispatch()

    return (

        <div className="max-w-3xl mx-auto py-10">

            <h1 className="text-3xl font-bold mb-6">

                Shopping Cart

            </h1>

            {items.map(item => (

                <div
                    key={item.id}
                    className="flex justify-between border-b py-3"
                >

                    <span>{item.name}</span>

                    <span>${item.price}</span>

                    <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="text-red-500"
                    >

                        Remove

                    </button>

                </div>

            ))}

        </div>

    )

}