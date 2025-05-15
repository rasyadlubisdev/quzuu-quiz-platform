"use client"

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react"
import { useRouter, usePathname } from "next/navigation"
import { getAuthToken, removeAuthToken } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import Cookies from "js-cookie"

interface UserData {
    id?: string
    username: string
    email: string
    avatar?: string
    fullName?: string
    schoolName?: string
    province?: string
    city?: string
    phoneNumber?: string
    isEmailVerified: boolean
    isProfileComplete: boolean
}

interface AuthContextType {
    user: UserData | null
    isLoading: boolean
    isAuthenticated: boolean
    logout: () => Promise<void>
    refreshUserData: () => Promise<void>
    setEmailVerified: (value: boolean) => void
    setProfileComplete: (value: boolean) => void
}

const defaultAuthContext: AuthContextType = {
    user: null,
    isLoading: true,
    isAuthenticated: false,
    logout: async () => {},
    refreshUserData: async () => {},
    setEmailVerified: () => {},
    setProfileComplete: () => {},
}

export const AuthContext = createContext<AuthContextType>(defaultAuthContext)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    // Add functions to directly set verification status
    const setEmailVerified = (value: boolean) => {
        if (user) {
            setUser({
                ...user,
                isEmailVerified: value,
            })
        }
    }

    const setProfileComplete = (value: boolean) => {
        if (user) {
            setUser({
                ...user,
                isProfileComplete: value,
            })
        }
    }

    // Function to parse JWT and extract data
    // Function to parse JWT
    const parseJwt = (token: string) => {
        try {
            const base64Url = token.split(".")[1]
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => {
                        return (
                            "%" +
                            ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                        )
                    })
                    .join(""),
            )

            return JSON.parse(jsonPayload)
        } catch (e) {
            console.error("Error parsing JWT:", e)
            return null
        }
    }

    // Update refreshUserData function to better handle token issues
    const refreshUserData = async (): Promise<void> => {
        try {
            const token = getAuthToken()
            console.log(
                "Refreshing user data with token:",
                token ? "present" : "not found",
            )

            if (!token) {
                setUser(null)
                setIsAuthenticated(false)
                setIsLoading(false)
                return
            }

            // Verify token before making API call
            try {
                // Decode JWT to check if it's not expired
                const tokenData = parseJwt(token)
                const currentTime = Math.floor(Date.now() / 1000)

                if (tokenData && tokenData.exp && tokenData.exp < currentTime) {
                    console.log("Token expired, logging out")
                    throw new Error("Token expired")
                }

                // Make API call with valid token
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/me`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Auth-Bearer-Token": token,
                        },
                    },
                )

                // Check response
                if (!response.ok) {
                    const text = await response.text()
                    console.log("API error response:", text)
                    throw new Error(`API error: ${response.status}`)
                }

                // Parse response
                const text = await response.text()
                console.log("Raw response:", text)
                const userData = JSON.parse(text)

                // Process user data
                if (userData && userData.data && userData.data.account) {
                    const account = userData.data.account
                    const details = userData.data.details || {}

                    setUser({
                        id: account.id,
                        username: account.username,
                        email: account.email,
                        avatar: details.avatar,
                        fullName: details.full_name,
                        schoolName: details.school_name,
                        province: details.province,
                        city: details.city,
                        phoneNumber: details.phone_number,
                        isEmailVerified: account.is_email_verified || false,
                        isProfileComplete: account.is_detail_completed || false,
                    })

                    setIsAuthenticated(true)
                }
            } catch (error) {
                console.error("Error fetching user profile:", error)

                // Handle token-related errors
                if (
                    error instanceof Error &&
                    (error.message.includes("Token expired") ||
                        error.message.includes("API error: 401"))
                ) {
                    // Clear token and authentication state
                    console.log("Ini serius mau dihapus auth nya??")
                    // removeAuthToken()
                    // setUser(null)
                    // setIsAuthenticated(false)

                    // Don't redirect here - let the routing effect handle it
                } else {
                    // For other errors, try to maintain authentication if possible
                    const storedProfileComplete =
                        localStorage.getItem("profile_completed") === "true"
                    const storedEmailVerified =
                        localStorage.getItem("email_verified") === "true"

                    // Create minimal user data
                    setUser({
                        username: "User",
                        email: "",
                        isEmailVerified: storedEmailVerified,
                        isProfileComplete: storedProfileComplete,
                    })

                    setIsAuthenticated(!!token)
                }
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error)
            setUser(null)
            setIsAuthenticated(false)
        } finally {
            setIsLoading(false)
        }
    }

    // Initial data load
    useEffect(() => {
        const checkAuthentication = async () => {
            await refreshUserData()
        }

        checkAuthentication()
    }, [])

    // Handle routing based on authentication and profile completion
    useEffect(() => {
        if (isLoading) return

        console.log("Auth state check:", {
            isAuthenticated,
            pathname,
            isProfileComplete: user?.isProfileComplete,
            isEmailVerified: user?.isEmailVerified,
            user,
        })

        // Override email verification status for testing
        // COMMENT THIS OUT AFTER DEBUGGING
        if (user && !user.isEmailVerified) {
            const shouldOverride =
                localStorage.getItem("override_verification") === "true"
            if (shouldOverride) {
                console.log(
                    "OVERRIDING email verification status for debugging",
                )
                setEmailVerified(true)
                localStorage.setItem("email_verified", "true")
                return // Don't proceed with redirects on this render
            }
        }

        // List of public paths that don't require authentication
        const publicPaths = [
            "/login",
            "/register",
            "/forgot-password",
            "/verify-email",
        ]

        // Check if we're on a public path
        const isOnPublicPath = publicPaths.some(
            (path) => pathname === path || pathname.startsWith(`${path}/`),
        )

        // If on a public path, don't redirect
        if (isOnPublicPath) return

        // If not authenticated and not on a public path, redirect to login
        if (!isAuthenticated) {
            console.log("Not authenticated, redirecting to login")
            router.push("/login")
            return
        }

        // Handle routing based on user data if available
        if (user) {
            // If authenticated but email not verified, redirect to verify-email
            if (!user.isEmailVerified && !pathname.includes("/verify-email")) {
                console.log("Email not verified, redirecting to verify-email")
                router.push(
                    `/verify-email?email=${encodeURIComponent(user.email)}`,
                )
                return
            }

            // If authenticated and email verified but profile not complete,
            // redirect to complete-profile (unless already there)
            if (
                user.isEmailVerified &&
                !user.isProfileComplete &&
                pathname !== "/complete-profile"
            ) {
                console.log(
                    "Profile not complete, redirecting to complete-profile",
                )
                router.push("/complete-profile")
                return
            }
        }
    }, [isAuthenticated, isLoading, user, pathname, router])

    const logout = async () => {
        try {
            // Clear all Auth data
            Cookies.remove("quzuu_auth_token", { path: "/" })
            localStorage.removeItem("email_verified")
            localStorage.removeItem("profile_completed")
            setUser(null)
            setIsAuthenticated(false)

            toast({
                title: "Logged Out",
                description: "You have been successfully logged out.",
            })

            router.push("/login")
        } catch (error) {
            console.error("Logout failed:", error)

            // Even if API call fails, clear local data
            Cookies.remove("quzuu_auth_token", { path: "/" })
            localStorage.removeItem("email_verified")
            localStorage.removeItem("profile_completed")
            setUser(null)
            setIsAuthenticated(false)

            router.push("/login")
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated,
                logout,
                refreshUserData,
                setEmailVerified,
                setProfileComplete,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
