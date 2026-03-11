export default function AdminProducts() {

    return (

        <div>

            <h1 className="text-2xl font-bold mb-6">

                Manage Products

            </h1>

            <table className="w-full border">

                <thead>

                    <tr className="bg-gray-200">

                        <th className="p-2">ID</th>
                        <th>Name</th>
                        <th>Price</th>

                    </tr>

                </thead>

                <tbody>

                    <tr className="border-t">

                        <td className="p-2">1</td>
                        <td>Laptop</td>
                        <td>$800</td>

                    </tr>

                </tbody>

            </table>

        </div>

    )

}