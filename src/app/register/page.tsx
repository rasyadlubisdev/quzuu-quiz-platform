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
import GoogleSignInButton from "@/components/GoogleSignInButton"

// Updated schema to match API requirements
const FormSchema = z
    .object({
        email: z
            .string()
            .email({ message: "Please enter a valid email address." }),
        username: z
            .string()
            .min(3, { message: "Username must be at least 3 characters." })
            .max(20, { message: "Username must be less than 20 characters." })
            .regex(/^[a-zA-Z0-9_]+$/, { 
                message: "Username can only contain letters, numbers, and underscores." 
            }),
        password: z
            .string()
            .min(7, { message: "Password must be at least 7 characters." })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
                message: "Password must contain at least one uppercase letter, one lowercase letter, and one number."
            }),
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
    const [errorMessage, setErrorMessage] = useState("")

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
        setErrorMessage("")

        try {
            console.log("Attempting registration with:", { 
                email: data.email, 
                username: data.username 
            })

            // Call registerUser with email, username, and password
            await registerUser(data.email, data.username, data.password)

            toast({
                title: "Registration Successful",
                description: "Please check your email to verify your account.",
            })

            // Redirect to verification pending page
            router.push(`/verify-email?email=${encodeURIComponent(data.email)}`)
        } catch (error: any) {
            console.error("Registration error:", error)
            
            setErrorMessage(
                error.message || "An error occurred during registration"
            )

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
                <div className="logo-wrapper w-36 mb-6">
                    <Image
                        src="/assets/img/quzzulogo.png"
                        alt="Logo Quzzu"
                        layout="responsive"
                        width={100}
                        height={94}
                        priority
                    />
                </div>
                
                <h1 className="text-2xl font-semibold mb-2 text-center">
                    Create an Account
                </h1>
                <p className="text-slate-500 mb-8 text-center">
                    Fill in your account details to register.
                </p>

                {/* Google Sign-In Button */}
                <div className="w-2/3 mb-6">
                    <GoogleSignInButton 
                        text="Sign up with Google" 
                        disabled={loading} 
                    />
                </div>

                {/* Divider */}
                <div className="w-2/3 flex items-center mb-6">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-4 text-gray-500 text-sm">or</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Registration Form */}
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
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="your-email@example.com"
                                            type="email"
                                            autoComplete="email"
                                            disabled={loading}
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
                                            placeholder="Choose a username"
                                            autoComplete="username"
                                            disabled={loading}
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
                                            placeholder="Create a strong password"
                                            type="password"
                                            autoComplete="new-password"
                                            disabled={loading}
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
                                            placeholder="Confirm your password"
                                            type="password"
                                            autoComplete="new-password"
                                            disabled={loading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Error Message Display */}
                        {errorMessage && (
                            <div className="text-red-500 text-sm text-center p-3 bg-red-50 rounded-md border border-red-200">
                                {errorMessage}
                            </div>
                        )}

                        {/* Terms and Conditions */}
                        <div className="text-xs text-gray-500 text-center">
                            By creating an account, you agree to our{" "}
                            <Link href="/terms" className="text-primary hover:underline">
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-primary hover:underline">
                                Privacy Policy
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            className="w-full mt-6"
                            disabled={loading}
                            size="lg"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Creating Account...
                                </div>
                            ) : (
                                "Create Account"
                            )}
                        </Button>
                    </form>
                </Form>

                {/* Login Link */}
                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        Already have an account?{" "}
                        <Button variant="link" className="p-0 h-auto font-normal">
                            <Link href="/login" className="text-primary hover:underline">
                                Sign in here
                            </Link>
                        </Button>
                    </p>
                </div>
            </section>

            {/* Right Side - Image */}
            <section className="image-register p-4 hidden md:flex">
                <div className="w-full h-full relative">
                    <Image
                        src="/assets/img/background-auth.jpg"
                        alt="Registration Background"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-xl"
                        priority
                    />
                </div>
            </section>
        </div>
    )
}