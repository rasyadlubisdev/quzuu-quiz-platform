"use client"

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
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
import { registerUser } from "@/lib/api"

// Updated schema to match API requirements
const FormSchema = z
    .object({
        email: z
            .string()
            .email({ message: "Please enter a valid email address." }),
        username: z
            .string()
            .min(3, { message: "Username must be at least 3 characters." }),
        password: z
            .string()
            .min(7, { message: "Password must be at least 7 characters." }),
        confirmPassword: z
            .string()
            .min(7, { message: "Confirm password must match the password." }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match.",
    })

export default function Register() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setLoading(true)

        try {
            // Call registerUser with email, username, and password
            await registerUser(data.email, data.username, data.password)

            toast({
                title: "Registration Successful",
                description: "Please check your email to verify your account.",
            })

            // Redirect to verification pending page
            router.push(`/verify-email?email=${encodeURIComponent(data.email)}`)
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Registration Error",
                description:
                    error.message || "An error occurred during registration",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="register-page w-screen min-h-screen bg-white grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <section className="input-register p-4 flex flex-col items-center justify-center">
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
                    Create an Account
                </h1>
                <p className="text-slate-500 mb-8">
                    Fill in your account details to register.
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
                                            placeholder="Email"
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
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Username"
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
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Confirm Password"
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full mt-14"
                            disabled={loading}
                        >
                            {loading ? "Creating Account..." : "Register"}
                        </Button>
                    </form>
                </Form>
                <p className="mt-8">
                    Already have an account?{" "}
                    <Button variant="link">
                        <Link href="/login" className="text-base">
                            Log in here
                        </Link>
                    </Button>
                </p>
            </section>
            <section className="image-register p-4 hidden md:flex">
                <Image
                    src="/assets/img/background-auth.jpg"
                    alt="Image Register"
                    layout="responsive"
                    width={100}
                    height={94}
                    className="object-cover rounded-xl"
                />
            </section>
        </div>
    )
}
