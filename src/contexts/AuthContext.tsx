"use client"

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react"
import { useRouter, usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { getAuthToken, removeAuthToken, syncNextAuthSession } from "@/lib/api"
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
    
    // Use NextAuth session
    const { data: session, status: sessionStatus } = useSession()

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

    // Update refreshUserData function to handle both NextAuth and regular auth
    const refreshUserData = async (): Promise<void> => {
        try {
            // Check if we have a NextAuth session first
            if (session?.backendToken && session?.accountData) {
                console.log("Using NextAuth session with backend data")
                
                const accountData = session.accountData
                
                setUser({
                    id: accountData.id,
                    username: accountData.username || "",
                    email: accountData.email,
                    avatar: session.user?.image || "",
                    fullName: session.user?.name || "",
                    schoolName: "",
                    province: "",
                    city: "",
                    phoneNumber: "",
                    isEmailVerified: accountData.is_email_verified || true, // OAuth users are usually verified
                    isProfileComplete: accountData.is_detail_completed || false,
                })
                
                setIsAuthenticated(true)
                setIsLoading(false)
                return
            }

            // Fallback to regular token-based auth
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
                const tokenData = parseJwt(token)
                const currentTime = Math.floor(Date.now() / 1000)

                if (tokenData && tokenData.exp && tokenData.exp < currentTime) {
                    console.log("Token expired, logging out")
                    throw new Error("Token expired")
                }

                // Make API call with valid token
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/me`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Auth-Bearer-Token": token,
                        },
                    },
                )

                if (!response.ok) {
                    const text = await response.text()
                    console.log("API error response:", text)
                    throw new Error(`API error: ${response.status}`)
                }

                const text = await response.text()
                console.log("Raw response:", text)
                const userData = JSON.parse(text)

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

                if (
                    error instanceof Error &&
                    (error.message.includes("Token expired") ||
                        error.message.includes("API error: 401"))
                ) {
                    console.log("Authentication failed, clearing tokens")
                    // Don't clear tokens here, let the routing effect handle it
                } else {
                    const storedProfileComplete =
                        localStorage.getItem("profile_completed") === "true"
                    const storedEmailVerified =
                        localStorage.getItem("email_verified") === "true"

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

    // Initial data load - wait for NextAuth session to load
    useEffect(() => {
        if (sessionStatus === "loading") {
            return // Wait for NextAuth session to load
        }
        
        const checkAuthentication = async () => {
            await refreshUserData()
        }

        checkAuthentication()
    }, [session, sessionStatus])

    // Handle routing based on authentication and profile completion
    useEffect(() => {
        if (isLoading || sessionStatus === "loading") return

        console.log("Auth state check:", {
            isAuthenticated,
            pathname,
            isProfileComplete: user?.isProfileComplete,
            isEmailVerified: user?.isEmailVerified,
            user,
            session: !!session,
            sessionStatus,
        })

        // Override email verification status for testing
        if (user && !user.isEmailVerified) {
            const shouldOverride =
                localStorage.getItem("override_verification") === "true"
            if (shouldOverride) {
                console.log(
                    "OVERRIDING email verification status for debugging",
                )
                setEmailVerified(true)
                localStorage.setItem("email_verified", "true")
                return
            }
        }

        const publicPaths = [
            "/login",
            "/register",
            "/forgot-password",
            "/verify-email",
        ]

        const isOnPublicPath = publicPaths.some(
            (path) => pathname === path || pathname.startsWith(`${path}/`),
        )

        if (isOnPublicPath) return

        // Check if user is authenticated (either via session or token)
        const hasAuthentication = isAuthenticated || session?.backendToken

        if (!hasAuthentication) {
            console.log("Not authenticated, redirecting to login")
            router.push("/login")
            return
        }

        if (user) {
            // OAuth users skip email verification
            if (!user.isEmailVerified && !pathname.includes("/verify-email") && !session?.user) {
                console.log("Email not verified, redirecting to verify-email")
                router.push(
                    `/verify-email?email=${encodeURIComponent(user.email)}`,
                )
                return
            }

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
    }, [isAuthenticated, isLoading, user, pathname, router, session, sessionStatus])

    const logout = async () => {
        try {
            // Clear all auth data
            Cookies.remove("quzuu_auth_token", { path: "/" })
            localStorage.removeItem("email_verified")
            localStorage.removeItem("profile_completed")
            setUser(null)
            setIsAuthenticated(false)

            // If using NextAuth, sign out from NextAuth as well
            if (session) {
                const { signOut } = await import("next-auth/react")
                await signOut({ redirect: false })
            }

            toast({
                title: "Logged Out",
                description: "You have been successfully logged out.",
            })

            router.push("/login")
        } catch (error) {
            console.error("Logout failed:", error)

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
                isAuthenticated: isAuthenticated || !!session?.backendToken,
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