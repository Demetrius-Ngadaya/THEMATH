"use client"

import { useForm } from "react-hook-form"

export default function Login() {

    const { register, handleSubmit } = useForm()

    const submit = data => {
        console.log(data)
    }

    return (

        <form
            onSubmit={handleSubmit(submit)}
            className="max-w-md mx-auto py-20"
        >

            <h2 className="text-2xl mb-6">

                Login

            </h2>

            <input
                placeholder="Email"
                className="border p-2 w-full mb-4"
                {...register("email")}
            />

            <input
                type="password"
                placeholder="Password"
                className="border p-2 w-full mb-4"
                {...register("password")}
            />

            <button className="bg-blue-600 text-white w-full py-2">

                Login

            </button>

        </form>

    )

}