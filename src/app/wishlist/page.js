"use client"

import { useSelector } from "react-redux"

export default function Wishlist() {

    const items = useSelector(state => state.wishlist.items)

    return (

        <div className="py-10">

            <h1 className="text-3xl font-bold mb-6">

                Wishlist

            </h1>

            {items.map(item => (
                <div key={item.id} className="border-b py-3">

                    {item.name}

                </div>
            ))}

        </div>

    )

}