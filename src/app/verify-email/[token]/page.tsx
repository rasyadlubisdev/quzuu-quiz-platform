"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation"
import { verifyEmail } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { CheckCircle2, XCircle } from "lucide-react"

export default function VerifyEmailConfirmation() {
    const params = useParams<{ token: string }>()
    const [verifying, setVerifying] = useState(true)
    const [verified, setVerified] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    useEffect(() => {
        const confirmEmailVerification = async () => {
            if (!params.token) {
                setError("Invalid verification token")
                setVerifying(false)
                return
            }

            try {
                await verifyEmail(params.token)
                setVerified(true)

                toast({
                    title: "Email Verified",
                    description: "Your account has been successfully verified!",
                })
            } catch (error: any) {
                setError(
                    error.message ||
                        "Failed to verify email. The link may be expired or invalid.",
                )

                toast({
                    variant: "destructive",
                    title: "Verification Failed",
                    description:
                        error.message ||
                        "Failed to verify email. The link may be expired or invalid.",
                })
            } finally {
                setVerifying(false)
            }
        }

        confirmEmailVerification()
    }, [params.token])

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg p-8 shadow-md text-center">
                <div className="logo-wrapper w-24 mx-auto mb-6">
                    <Image
                        src="/assets/img/quzzulogo.png"
                        alt="Logo Quzzu"
                        layout="responsive"
                        width={100}
                        height={94}
                    />
                </div>

                <h1 className="text-2xl font-bold mb-6">Email Verification</h1>

                {verifying ? (
                    <div className="mb-6 flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="mt-4 text-gray-600">
                            Verifying your email...
                        </p>
                    </div>
                ) : verified ? (
                    <div className="mb-6">
                        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-green-600 mb-2">
                            Verification Successful!
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Your email has been verified successfully. You can
                            now log in to your account.
                        </p>
                        <Button
                            onClick={() => router.push("/login")}
                            className="w-full"
                        >
                            Continue to Login
                        </Button>
                    </div>
                ) : (
                    <div className="mb-6">
                        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-red-600 mb-2">
                            Verification Failed
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {error ||
                                "We couldn't verify your email. The link may be expired or invalid."}
                        </p>
                        <Button
                            onClick={() => router.push("/verify-email")}
                            className="w-full"
                        >
                            Try Again
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
