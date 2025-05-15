"use client"

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useRouter } from "next/navigation"
import { loginUser } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext" // Import useAuth hook

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

// Update form schema to use email instead of username
const FormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(7, {
        message: "Password must be at least 7 characters.",
    }),
})

const Login = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const { refreshUserData } = useAuth() // Get refreshUserData from context

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setLoading(true)
        setErrorMessage("")

        try {
            console.log("Attempting login with:", { email: data.email })

            // Call loginUser with email and password
            const response = await loginUser(data.email, data.password)
            console.log("Login response:", response)

            // loginUser will automatically store the token in cookies

            // After successful login, refresh user data in context
            await refreshUserData()

            toast({
                title: "Login successful",
                description: "Welcome back to Quzuu!",
            })

            // If the account is not verified, redirect to email verification
            if (
                response.account &&
                response.account.is_email_verified === false
            ) {
                router.push(
                    `/verify-email?email=${encodeURIComponent(data.email)}`,
                )
                return
            }

            // If profile is not complete, redirect to complete profile
            if (
                response.account &&
                response.account.is_detail_completed === false
            ) {
                router.push("/complete-profile")
                return
            }

            // Otherwise redirect to home
            router.push("/")
        } catch (error: any) {
            console.error("Login error:", error)

            setErrorMessage(
                error.message || "Failed to login. Please try again.",
            )

            toast({
                variant: "destructive",
                title: "Login failed",
                description:
                    error.message ||
                    "Failed to login. Please check your credentials.",
            })
        } finally {
            setLoading(false)
        }
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="your-email@example.com"
                                            type="email"
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
                                            <Link href="/forgot-password">
                                                Forgot Password
                                            </Link>
                                        </Button>
                                    </div>
                                </FormItem>
                            )}
                        />
                        {errorMessage && (
                            <div className="text-red-500 text-sm">
                                {errorMessage}
                            </div>
                        )}
                        <Button
                            type="submit"
                            className="w-full mt-14"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
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
