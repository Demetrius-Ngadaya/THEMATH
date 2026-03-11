"use client"

import { useSelector } from "react-redux"

export default function Checkout() {

    const items = useSelector(state => state.cart.items)

    const total = items.reduce(
        (acc, i) => acc + i.price * i.quantity, 0
    )

    return (

        <div className="max-w-3xl mx-auto py-10">

            <h1 className="text-3xl font-bold">

                Checkout

            </h1>

            {items.map(item => (
                <div key={item.id} className="flex justify-between border-b py-3">

                    <span>{item.name}</span>
                    <span>${item.price}</span>

                </div>
            ))}

            <h2 className="text-xl mt-6">

                Total: ${total}

            </h2>

            <button className="bg-green-600 text-white px-6 py-3 rounded mt-4">

                Proceed to Payment

            </button>

        </div>

    )

}