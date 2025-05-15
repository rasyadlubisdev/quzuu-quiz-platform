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
import { useRouter } from "next/navigation"
import { resetPassword } from "@/lib/api"
import { CheckCircle2 } from "lucide-react"

// Since we're using OTP directly instead of token in the URL
// We need to collect both the OTP and the new password
const FormSchema = z
    .object({
        otp: z
            .string()
            .min(6, { message: "OTP must be 6 digits." })
            .regex(/^\d+$/, { message: "OTP must contain only digits." }),
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

export default function ResetPassword() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [resetComplete, setResetComplete] = useState(false)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            otp: "",
            password: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setLoading(true)

        try {
            // Convert OTP string to number before sending
            // Updated to use number instead of string for the token parameter
            const otpNumber = parseInt(data.otp, 10)

            await resetPassword(otpNumber, data.password)

            setResetComplete(true)

            toast({
                title: "Password Reset Successful",
                description: "Your password has been changed successfully.",
            })

            // Redirect to login after a short delay
            setTimeout(() => {
                router.push("/login")
            }, 3000)
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Reset Failed",
                description:
                    error.message ||
                    "Failed to reset password. Please check your OTP code and try again.",
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

                {resetComplete ? (
                    <div className="text-center">
                        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold mb-2">
                            Password Reset Complete
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Your password has been changed successfully. You can
                            now log in with your new password.
                        </p>
                        <p className="text-gray-500 text-sm mb-6">
                            Redirecting to login page...
                        </p>
                        <Button
                            onClick={() => router.push("/login")}
                            className="w-full"
                        >
                            Go to Login
                        </Button>
                    </div>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold mb-2 text-center">
                            Reset Password
                        </h1>
                        <p className="text-gray-600 mb-6 text-center">
                            Enter the OTP code from your email and your new
                            password
                        </p>

                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <FormField
                                    control={form.control}
                                    name="otp"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>OTP Code</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter 6-digit OTP"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value
                                                                .replace(
                                                                    /\D/g,
                                                                    "",
                                                                )
                                                                .substring(
                                                                    0,
                                                                    6,
                                                                ),
                                                        )
                                                    }
                                                    maxLength={6}
                                                    className="text-center text-xl tracking-wider"
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
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="New password"
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
                                            <FormLabel>
                                                Confirm New Password
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Confirm new password"
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
                                    className="w-full"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Resetting..."
                                        : "Reset Password"}
                                </Button>
                            </form>
                        </Form>

                        <div className="mt-6 text-sm text-center">
                            <Link
                                href="/forgot-password"
                                className="text-primary hover:underline block mb-2"
                            >
                                Request a new code
                            </Link>
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
