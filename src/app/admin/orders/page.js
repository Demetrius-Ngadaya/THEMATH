export default function Orders() {

    return (

        <div>

            <h1 className="text-2xl font-bold mb-6">

                Orders

            </h1>

            <table className="w-full border">

                <thead>

                    <tr className="bg-gray-200">

                        <th>ID</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Status</th>

                    </tr>

                </thead>

                <tbody>

                    <tr className="border-t">

                        <td>1001</td>
                        <td>John</td>
                        <td>$1200</td>
                        <td>Paid</td>

                    </tr>

                </tbody>

            </table>

        </div>

    )

}