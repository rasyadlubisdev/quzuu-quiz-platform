"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { createEmailVerification, verifyEmail } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import { Suspense } from "react"

// Separate the main component that uses useSearchParams
function VerifyEmailContent() {
    const params = useSearchParams()
    const router = useRouter()
    const { setEmailVerified } = useAuth()

    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [loading, setLoading] = useState(false)
    const [isClient, setIsClient] = useState(false)

    // Ensure we're on the client side
    useEffect(() => {
        setIsClient(true)
    }, [])

    // Get email from URL params only on client side
    useEffect(() => {
        if (!isClient) return
        
        try {
            const emailParam = params?.get("email") || ""
            setEmail(emailParam)
        } catch (error) {
            console.error("Error getting email param:", error)
        }
    }, [isClient, params])

    // Fetch OTP only when we have email and are on client
    useEffect(() => {
        if (!isClient || !email) return
        
        const timer = setTimeout(() => {
            fetchOTP()
        }, 100) // Small delay to ensure everything is ready

        return () => clearTimeout(timer)
    }, [isClient, email])

    const fetchOTP = async () => {
        if (!email) return
        
        try {
            const response = await createEmailVerification(email)
            console.log("OTP/Token received:", response)
            
            if (typeof window !== "undefined") {
                toast({ 
                    title: "OTP terkirim", 
                    description: `Ke ${email}` 
                })
            }
        } catch (error: any) {
            console.error("Error fetching OTP:", error)
            
            if (typeof window !== "undefined") {
                toast({
                    variant: "destructive",
                    title: "Gagal kirim OTP",
                    description: error.message || "Failed to send OTP",
                })
            }
        }
    }

    const handleVerify = async () => {
        if (!email || otp.length !== 6) {
            if (typeof window !== "undefined") {
                toast({
                    variant: "destructive",
                    title: "Kode harus 6 digit",
                })
            }
            return
        }
        
        setLoading(true)
        
        try {
            const response = await verifyEmail(email, parseInt(otp))
            console.log("Verification response:", response)

            // Mark email as verified
            setEmailVerified(true)
            
            // Safe localStorage access
            if (typeof window !== "undefined") {
                localStorage.setItem("email_verified", "true")
                localStorage.setItem("override_verification", "true")
                
                toast({
                    title: "Email Verified",
                    description: "Your email has been successfully verified.",
                })
            }

            // Navigate to next page
            router.push("/complete-profile")
            
        } catch (err: any) {
            console.error("Verification error:", err)
            
            if (typeof window !== "undefined") {
                toast({
                    variant: "destructive",
                    title: "Verification Failed",
                    description: err.message || "Failed to verify email",
                })
            }
        } finally {
            setLoading(false)
        }
    }

    const handleResendOTP = async () => {
        if (!email) return
        await fetchOTP()
    }

    const handleForceVerify = () => {
        setEmailVerified(true)
        
        if (typeof window !== "undefined") {
            localStorage.setItem("email_verified", "true")
            
            toast({ 
                title: "Debug: Email marked as verified" 
            })
        }
        
        router.push("/complete-profile")
    }

    // Don't render until we're on client side
    if (!isClient) {
        return (
            <div className="p-4 max-w-sm mx-auto">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        )
    }

    // Show error if no email parameter
    if (!email) {
        return (
            <div className="p-4 max-w-sm mx-auto">
                <h1 className="mb-4 text-xl text-red-600">Error</h1>
                <p className="mb-4 text-gray-600">
                    Email parameter is required for verification
                </p>
                <Button 
                    onClick={() => router.push("/login")}
                    className="w-full"
                >
                    Back to Login
                </Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-center mb-2">
                    Verify Your Email
                </h1>
                <p className="text-gray-600 text-center mb-6">
                    We sent a verification code to
                </p>
                <p className="text-sm font-medium text-center mb-6 text-blue-600">
                    {email}
                </p>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Enter 6-digit code
                        </label>
                        <Input
                            value={otp}
                            maxLength={6}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                            placeholder="000000"
                            className="text-center text-lg tracking-widest"
                        />
                    </div>
                    
                    <Button
                        onClick={handleVerify}
                        disabled={loading || otp.length !== 6}
                        className="w-full"
                    >
                        {loading ? "Verifying..." : "Verify Email"}
                    </Button>
                    
                    <Button 
                        variant="outline" 
                        onClick={handleResendOTP}
                        className="w-full"
                        disabled={loading}
                    >
                        Resend Code
                    </Button>
                </div>

                {/* Debug section - only in development */}
                {/* {process.env.NODE_ENV === "development" && (
                    <div className="mt-8 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-2">
                            Development Debug:
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleForceVerify}
                            className="w-full text-xs"
                        >
                            Skip Verification (Debug)
                        </Button>
                    </div>
                )} */}
            </div>
        </div>
    )
}

// Main component wrapped with Suspense
export default function VerifyEmail() {
    return (
        <Suspense 
            fallback={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                        <div className="animate-pulse space-y-4">
                            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-8 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            }
        >
            <VerifyEmailContent />
        </Suspense>
    )
}