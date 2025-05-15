"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { createEmailVerification, verifyEmail } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"

export default function VerifyEmail() {
    const params = useSearchParams()
    const email = params.get("email") || ""
    const router = useRouter()
    const { setEmailVerified } = useAuth()

    const [otp, setOtp] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!email) return
        fetchOTP()
    }, [email])

    const fetchOTP = async () => {
        try {
            const response: any = await createEmailVerification(email)
            // Log the token for debugging purposes
            // console.log("OTP/Token received:", response.data?.token)
            console.log("OTP/Token received:", response)
            toast({ title: "OTP terkirim", description: `Ke ${email}` })
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Gagal kirim OTP",
                description: error.message,
            })
        }
    }

    const handleVerify = async () => {
        if (otp.length !== 6) {
            return toast({
                variant: "destructive",
                title: "Kode harus 6 digit",
            })
        }
        setLoading(true)
        try {
            const response = await verifyEmail(email, parseInt(otp))
            console.log("Verification response:", response)

            // Mark email as verified in context and localStorage
            setEmailVerified(true)
            localStorage.setItem("email_verified", "true")

            toast({
                title: "Email Verified",
                description: "Your email has been successfully verified.",
            })

            // For debugging, add an option to override verification
            localStorage.setItem("override_verification", "true")

            // Redirect to complete profile
            router.push("/complete-profile")
        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Verification Failed",
                description: err.message || "Failed to verify email",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-4 max-w-sm mx-auto">
            <h1 className="mb-4 text-xl">Verifikasi {email}</h1>
            <Input
                value={otp}
                maxLength={6}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="Masukkan kode OTP"
            />
            <Button
                onClick={handleVerify}
                disabled={loading || otp.length !== 6}
                className="mt-4 w-full"
            >
                {loading ? "Memverifikasi…" : "Verifikasi"}
            </Button>
            <Button variant="link" onClick={fetchOTP} className="mt-2">
                Kirim ulang OTP
            </Button>

            {/* Add a debug button */}
            <div className="mt-8 pt-4 border-t">
                <p className="text-xs text-gray-500 mb-2">
                    Debug options (remove in production):
                </p>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        setEmailVerified(true)
                        localStorage.setItem("email_verified", "true")
                        toast({ title: "Debug: Email marked as verified" })
                        router.push("/complete-profile")
                    }}
                >
                    Force Mark Email as Verified
                </Button>
            </div>
        </div>
    )
}
