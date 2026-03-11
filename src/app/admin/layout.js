import Link from "next/link"

export default function AdminLayout({ children }) {

    return (

        <div className="flex">

            <aside className="w-64 bg-black text-white min-h-screen p-6">

                <h2 className="text-xl mb-6">

                    Admin

                </h2>

                <ul className="space-y-3">

                    <li><Link href="/admin">Dashboard</Link></li>
                    <li><Link href="/admin/products">Products</Link></li>
                    <li><Link href="/admin/orders">Orders</Link></li>

                </ul>

            </aside>

            <main className="flex-1 p-6">

                {children}

            </main>

        </div>

    )

}