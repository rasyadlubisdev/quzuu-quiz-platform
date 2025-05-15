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
import {
    getAuthToken,
    removeAuthToken,
    updateUserProfile,
    UserProfileUpdateData,
} from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"

// Define the form schema based on the API requirements
const FormSchema = z.object({
    full_name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters." }),
    school_name: z
        .string()
        .min(2, { message: "School name must be at least 2 characters." }),
    province: z
        .string()
        .min(2, { message: "Province must be at least 2 characters." }),
    city: z.string().min(2, { message: "City must be at least 2 characters." }),
    phone_number: z
        .string()
        .regex(/^\d+$/, {
            message: "Phone number must contain only digits.",
        })
        .min(10, { message: "Phone number must be at least 10 digits." }),
    avatar: z.string().default("avatar.png"),
})

export default function CompleteProfile() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { user, refreshUserData } = useAuth()

    // Initialize form with default values
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            full_name: user?.fullName || "",
            school_name: user?.schoolName || "",
            province: user?.province || "",
            city: user?.city || "",
            phone_number: user?.phoneNumber?.replace(/^\+62/, "") || "",
            avatar: "avatar.png", // Default avatar
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setLoading(true)

        try {
            console.log("Submitting profile data:", data)

            // Format the phone number if needed
            let formattedPhoneNumber = data.phone_number

            // Format: Add +62 prefix if starts with 0
            if (formattedPhoneNumber.startsWith("0")) {
                formattedPhoneNumber = `+62${formattedPhoneNumber.substring(1)}`
            }
            // Add +62 prefix if doesn't have country code
            else if (!formattedPhoneNumber.startsWith("+")) {
                formattedPhoneNumber = `+62${formattedPhoneNumber}`
            }

            // Create data object matching the API structure
            const profileData: UserProfileUpdateData = {
                full_name: data.full_name,
                school_name: data.school_name,
                province: data.province,
                city: data.city,
                phone_number: formattedPhoneNumber,
                avatar: data.avatar || "avatar.png",
            }

            console.log("Sending profile data to API:", profileData)

            // Check if token exists
            const token = getAuthToken()
            if (!token) {
                toast({
                    variant: "destructive",
                    title: "Authentication Error",
                    description: "You need to login first",
                })
                router.push("/login")
                return
            }

            // Update profile via API
            const result = await updateUserProfile(profileData)
            console.log("Profile update result:", result)

            // Manually set profile as complete
            localStorage.setItem("profile_completed", "true")

            // Refresh user data to update context
            await refreshUserData()

            toast({
                title: "Profile Updated",
                description:
                    "Your profile details have been saved successfully.",
            })

            // Redirect to home page after successful profile update
            router.push("/")
        } catch (error: any) {
            console.error("Error updating profile:", error)

            // Check if it's an authentication error
            if (
                error.message?.includes("login") ||
                error.message?.includes("auth")
            ) {
                toast({
                    variant: "destructive",
                    title: "Authentication Error",
                    description:
                        "Your session has expired. Please login again.",
                })

                console.log(error.message)

                // // Clear token and redirect to login
                // removeAuthToken()
                // router.push("/login")
            } else {
                toast({
                    variant: "destructive",
                    title: "Failed to Update Profile",
                    description:
                        error.message ||
                        "An error occurred while updating your profile.",
                })
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="container bg-slate-100 min-h-screen py-10">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
                <h1 className="text-2xl font-bold mb-6">
                    Complete Your Profile
                </h1>
                <p className="text-gray-600 mb-8">
                    Please provide some additional information to complete your
                    profile. This will help us personalize your experience.
                </p>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="full_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Your Full Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="phone_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Phone Number"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="school_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            School/Institution
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="School or Institution Name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="City"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="province"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Province</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Province"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-between pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/")}
                            >
                                Skip for Now
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Saving..." : "Save Profile"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </main>
    )
}
