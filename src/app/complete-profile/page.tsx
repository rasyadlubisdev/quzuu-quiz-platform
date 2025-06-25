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
    const { user, refreshUserData, setProfileComplete } = useAuth()

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
            console.log("🚀 Starting profile update process...")
            console.log("📝 Form data:", data)

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

            console.log("📤 Sending profile data to API:", profileData)

            // Check if token exists
            const token = getAuthToken()
            if (!token) {
                throw new Error("Authentication token not found. Please login again.")
            }

            console.log("🔑 Auth token present:", token.substring(0, 20) + "...")

            // Define the expected result type for type safety
            type UpdateProfileResult = {
                account?: { is_detail_completed?: boolean }
                is_detail_completed?: boolean
                [key: string]: any
            }

            // Update profile via API
            console.log("📡 Calling API...")
            const result = await updateUserProfile(profileData) as UpdateProfileResult
            console.log("✅ API call successful, result:", result)

            // Check if backend returned is_detail_completed: true
            const backendProfileComplete = result?.account?.is_detail_completed || 
                                         result?.is_detail_completed || 
                                         false

            console.log("🔍 Backend profile complete status:", backendProfileComplete)

            // Set profile as complete in localStorage for persistence
            localStorage.setItem("profile_completed", "true")
            console.log("💾 Set profile_completed in localStorage")

            // Update context immediately
            setProfileComplete(true)
            console.log("🔄 Updated context profileComplete to true")

            // Show success toast
            toast({
                title: "Profile Updated",
                description: "Your profile details have been saved successfully.",
            })

            if (backendProfileComplete) {
                console.log("✅ Backend confirms profile is complete, refreshing data...")
                
                // Backend confirms profile is complete, safe to refresh
                await new Promise(resolve => setTimeout(resolve, 1000))
                await refreshUserData()
                
                // Redirect after refresh
                setTimeout(() => {
                    console.log("🏠 Redirecting to home page...")
                    router.push("/")
                }, 500)
                
            } else {
                console.log("⚠️ Backend hasn't updated is_detail_completed flag yet")
                console.log("🔧 Using manual context update and direct redirect")
                
                // Backend hasn't updated the flag yet, use manual approach
                // Don't call refreshUserData() to avoid overriding our manual update
                
                // Wait a bit for visual feedback then redirect
                setTimeout(() => {
                    console.log("🏠 Direct redirect to home page (backend not updated yet)...")
                    router.push("/")
                }, 2000)
            }

        } catch (error: any) {
            console.error("❌ Error updating profile:", error)

            // Clear the manual localStorage flag if API failed
            localStorage.removeItem("profile_completed")

            // Check if it's an authentication error
            if (
                error.message?.includes("login") ||
                error.message?.includes("auth") ||
                error.message?.includes("token")
            ) {
                toast({
                    variant: "destructive",
                    title: "Authentication Error",
                    description: "Your session has expired. Please login again.",
                })

                console.log("🔓 Auth error detected, redirecting to login...")
                removeAuthToken()
                router.push("/login")
            } else {
                toast({
                    variant: "destructive",
                    title: "Failed to Update Profile",
                    description: error.message || "An error occurred while updating your profile.",
                })
            }
        } finally {
            setLoading(false)
        }
    }

    // Debug button for testing
    const handleDebugInfo = () => {
        console.log("🔍 Debug Info:", {
            user,
            formValues: form.getValues(),
            token: getAuthToken()?.substring(0, 20) + "...",
            localStorage: {
                profile_completed: localStorage.getItem("profile_completed"),
                email_verified: localStorage.getItem("email_verified"),
            }
        })
    }

    // Force complete profile for testing
    const handleForceComplete = () => {
        console.log("🔧 Force completing profile...")
        localStorage.setItem("profile_completed", "true")
        setProfileComplete(true)
        
        setTimeout(() => {
            router.push("/")
        }, 1000)
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
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push("/")}
                                >
                                    Skip for Now
                                </Button>
                                
                                {/* Debug buttons - remove in production */}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={handleDebugInfo}
                                    className="text-xs"
                                >
                                    Debug
                                </Button>
                                
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={handleForceComplete}
                                    className="text-xs text-green-600"
                                >
                                    Force Complete
                                </Button>
                            </div>
                            
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