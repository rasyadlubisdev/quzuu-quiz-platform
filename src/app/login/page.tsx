"use client"

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useRouter } from "next/navigation"
import { loginUser } from "@/lib/api"

import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"

const FormSchema = z.object({
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters." }),
    password: z.string().min(7, {
        message: "Password must be at least 7 characters.",
    }),
})

const Login = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setLoading(true)
        setErrorMessage("")

        console.log(data)

        try {
            const token = await loginUser(data.username, data.password)

            // Simpan token ke localStorage atau session
            localStorage.setItem("authToken", token)

            // Redirect ke dashboard atau halaman utama setelah login berhasil
            router.push("/")
        } catch (error: any) {
            setErrorMessage(error.message)
        } finally {
            setLoading(false)
        }

        // toast({
        //     title: "You submitted the following values:",
        //     description: (
        //         <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        //             <code className="text-white">
        //                 {JSON.stringify(data, null, 2)}
        //             </code>
        //         </pre>
        //     ),
        // })
    }

    return (
        <div className="login-page w-screen min-h-screen bg-white grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <section className="input-login p-4 flex flex-col items-center justify-center">
                <div className="logo-wrapper w-36">
                    <Image
                        src="/assets/img/quzzulogo.png"
                        alt="Logo Quzzu"
                        layout="responsive"
                        width={100}
                        height={94}
                    />
                </div>
                <h1 className="text-2xl font-semibold mb-2">
                    Welcome back to Quzuu
                </h1>
                <p className="text-slate-500 mb-8">
                    Enter your email and password to continue.
                </p>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-2/3 space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Password"
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    <div className="lupa-password flex justify-end">
                                        <Button variant="link">
                                            <Link href="/">Lupa Password</Link>
                                        </Button>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full mt-14">
                            Login
                        </Button>
                    </form>
                </Form>
                <p className="mt-8">
                    Belum punya akun?{" "}
                    <Button variant="link">
                        <Link href="/register" className="text-base">
                            klik di sini
                        </Link>
                    </Button>
                </p>
            </section>
            <section className="image-login p-4 hidden md:flex">
                <Image
                    src="/assets/img/background-auth.jpg"
                    alt="Image Login"
                    layout="responsive"
                    width={100}
                    height={94}
                    className="object-cover rounded-xl"
                />
            </section>
        </div>
    )
}

export default Login
