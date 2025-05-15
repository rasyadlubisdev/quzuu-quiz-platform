"use client"

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
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
import { requestPasswordReset } from "@/lib/api"

interface PasswordResetResponse {
    token?: number // Changed to number to match the API response
    success?: boolean
    message?: string
    // Add other properties you expect in the response
}

const FormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
})

export default function ForgotPassword() {
    const [loading, setLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)
    const [resetToken, setResetToken] = useState<number | null>(null)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setLoading(true)

        try {
            const response = (await requestPasswordReset(
                data.email,
            )) as PasswordResetResponse

            // Per the API response, we can show the token that was generated
            // This is only for demonstration - in a real app, the token is sent via email
            if (response && response.token) {
                setResetToken(response.token)
            }

            setEmailSent(true)

            toast({
                title: "Reset Link Sent",
                description:
                    "Please check your email for password reset instructions.",
            })
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Request Failed",
                description:
                    error.message ||
                    "Failed to request password reset. Please try again.",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg p-8 shadow-md">
                <div className="logo-wrapper w-24 mx-auto mb-6">
                    <Image
                        src="/assets/img/quzzulogo.png"
                        alt="Logo Quzzu"
                        layout="responsive"
                        width={100}
                        height={94}
                    />
                </div>

                <h1 className="text-2xl font-bold mb-2 text-center">
                    Forgot Password
                </h1>

                {emailSent ? (
                    <div className="text-center">
                        <div className="mb-6 p-4 bg-green-50 rounded-md">
                            <p className="text-green-700">
                                We have sent a password reset code to your email
                            </p>
                        </div>

                        {resetToken && (
                            <div className="mb-6 p-4 bg-yellow-50 rounded-md border border-yellow-200">
                                <p className="text-yellow-700 font-semibold">
                                    Demo Mode: Your OTP Code
                                </p>
                                <p className="text-yellow-700 mt-2 text-2xl font-mono">
                                    {resetToken}
                                </p>
                                <p className="text-yellow-600 text-xs mt-2">
                                    (In a real application, this would be sent
                                    via email)
                                </p>
                            </div>
                        )}

                        <p className="text-gray-600 mb-6">
                            Please check your inbox and follow the instructions
                            to reset your password.
                        </p>

                        <Button
                            onClick={() => setEmailSent(false)}
                            variant="outline"
                            className="mb-4 w-full"
                        >
                            Try Another Email
                        </Button>

                        <div className="text-sm text-center">
                            <Link
                                href="/login"
                                className="text-primary hover:underline"
                            >
                                Return to Login
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-600 mb-6 text-center">
                            Enter your email and we will send you a code to
                            reset your password
                        </p>

                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
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

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loading}
                                >
                                    {loading ? "Sending..." : "Send Reset Code"}
                                </Button>
                            </form>
                        </Form>

                        <div className="mt-6 text-sm text-center">
                            <Link
                                href="/login"
                                className="text-primary hover:underline"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
