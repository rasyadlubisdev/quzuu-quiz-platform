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
    const [initializationComplete, setInitializationComplete] = useState(false)
    
    const router = useRouter()
    const pathname = usePathname()
    
    // Get NextAuth session
    const { data: session, status: sessionStatus } = useSession()

    console.log("🔍 AuthContext Debug:", {
        sessionStatus,
        hasSession: !!session,
        hasBackendToken: !!session?.backendToken,
        isLoading,
        initializationComplete,
        isAuthenticated,
        userEmail: user?.email
    })

    const setEmailVerified = (value: boolean) => {
        if (user) {
            setUser({
                ...user,
                isEmailVerified: value,
            })
        }
    }

    const setProfileComplete = (value: boolean) => {
        console.log("🔄 Setting profile complete to:", value)
        if (user) {
            const updatedUser = {
                ...user,
                isProfileComplete: value,
            }
            setUser(updatedUser)
            console.log("✅ User updated in context:", updatedUser)
        } else {
            console.warn("⚠️ No user found when trying to set profile complete")
        }
    }

    // Function to parse JWT and extract data
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

    // Handle OAuth session (NextAuth)
    const handleOAuthSession = async (session: any) => {
        if (!session?.backendToken) return false

        try {
            console.log("🔄 Processing OAuth session...")
            
            const accountData = await syncNextAuthSession(session)
            
            if (accountData) {
                console.log("✅ OAuth session processed successfully")
                
                // Check localStorage for manual profile completion flag
                const manualProfileComplete = localStorage.getItem("profile_completed") === "true"
                const backendProfileComplete = accountData.is_detail_completed || false
                
                // Use manual flag if backend hasn't been updated yet
                const finalProfileComplete = manualProfileComplete || backendProfileComplete
                
                console.log("🔍 Profile complete status:", {
                    backend: backendProfileComplete,
                    manual: manualProfileComplete,
                    final: finalProfileComplete
                })
                
                setUser({
                    id: accountData.id,
                    username: accountData.username || session.user?.name || "User",
                    email: accountData.email || session.user?.email || "",
                    avatar: session.user?.image,
                    fullName: session.user?.name,
                    isEmailVerified: accountData.is_email_verified || false,
                    isProfileComplete: finalProfileComplete,
                })
                
                setIsAuthenticated(true)
                return true
            }
        } catch (error) {
            console.error("❌ Failed to process OAuth session:", error)
        }
        
        return false
    }

    // Handle regular authentication (email/password)
    const handleRegularAuth = async () => {
        const token = getAuthToken()
        
        if (!token) {
            console.log("❌ No auth token found")
            setUser(null)
            setIsAuthenticated(false)
            return false
        }

        try {
            console.log("🔄 Processing regular authentication...")
            
            // Verify token before making API call
            const tokenData = parseJwt(token)
            const currentTime = Math.floor(Date.now() / 1000)

            if (tokenData && tokenData.exp && tokenData.exp < currentTime) {
                console.log("⏰ Token expired")
                throw new Error("Token expired")
            }

            // Make API call with valid token
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/me`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token,
                    },
                },
            )

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`)
            }

            const userData = await response.json()

            if (userData && userData.data && userData.data.account) {
                const account = userData.data.account
                const details = userData.data.details || {}

                console.log("✅ Regular auth processed successfully")

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
                return true
            }
        } catch (error) {
            console.error("❌ Regular auth failed:", error)
            
            if (
                error instanceof Error &&
                (error.message.includes("Token expired") ||
                    error.message.includes("API error: 401"))
            ) {
                // Clear expired token
                removeAuthToken()
                setUser(null)
                setIsAuthenticated(false)
            }
        }
        
        return false
    }

    // Main initialization effect
    useEffect(() => {
        const initializeAuth = async () => {
            console.log("🚀 Initializing authentication...")
            
            // Wait for NextAuth to be ready
            if (sessionStatus === "loading") {
                console.log("⏳ Waiting for NextAuth...")
                return
            }

            setIsLoading(true)
            
            try {
                let authSuccess = false

                // Try OAuth first if available
                if (session?.backendToken) {
                    authSuccess = await handleOAuthSession(session)
                }

                // Fall back to regular auth if OAuth not available or failed
                if (!authSuccess) {
                    authSuccess = await handleRegularAuth()
                }

                // If no authentication method worked
                if (!authSuccess) {
                    console.log("❌ No valid authentication found")
                    setUser(null)
                    setIsAuthenticated(false)
                }

            } catch (error) {
                console.error("❌ Auth initialization failed:", error)
                setUser(null)
                setIsAuthenticated(false)
            } finally {
                setIsLoading(false)
                setInitializationComplete(true)
                console.log("✅ Auth initialization complete")
            }
        }

        initializeAuth()
    }, [session, sessionStatus])

    // Refreshable auth function
    const refreshUserData = async (): Promise<void> => {
        console.log("🔄 Refreshing user data...")
        setIsLoading(true)
        
        try {
            let success = false
            
            if (session?.backendToken) {
                success = await handleOAuthSession(session)
            }
            
            if (!success) {
                success = await handleRegularAuth()
            }
            
            if (!success) {
                setUser(null)
                setIsAuthenticated(false)
            }
        } catch (error) {
            console.error("❌ Refresh failed:", error)
            setUser(null)
            setIsAuthenticated(false)
        } finally {
            setIsLoading(false)
        }
    }

    // Handle routing based on authentication and profile completion
    useEffect(() => {
        // Don't redirect during initialization
        if (!initializationComplete || isLoading) return

        console.log("🧭 Checking routing rules:", {
            isAuthenticated,
            pathname,
            isProfileComplete: user?.isProfileComplete,
            isEmailVerified: user?.isEmailVerified,
        })

        // Override email verification for testing
        if (user && !user.isEmailVerified) {
            const shouldOverride =
                localStorage.getItem("override_verification") === "true"
            if (shouldOverride) {
                console.log("🔧 OVERRIDING email verification for debugging")
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

        if (!isAuthenticated) {
            console.log("🔒 Not authenticated, redirecting to login")
            router.push("/login")
            return
        }

        if (user) {
            if (!user.isEmailVerified && !pathname.includes("/verify-email")) {
                console.log("📧 Email not verified, redirecting to verify-email")
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
                console.log("👤 Profile not complete, redirecting to complete-profile")
                router.push("/complete-profile")
                return
            }
        }
    }, [isAuthenticated, initializationComplete, isLoading, user, pathname, router])

    const logout = async () => {
        try {
            console.log("🚪 Logging out...")
            
            // Clear all auth data
            Cookies.remove("quzuu_auth_token", { path: "/" })
            localStorage.removeItem("email_verified")
            localStorage.removeItem("profile_completed")
            setUser(null)
            setIsAuthenticated(false)
            setInitializationComplete(false)

            toast({
                title: "Logged Out",
                description: "You have been successfully logged out.",
            })

            router.push("/login")
        } catch (error) {
            console.error("❌ Logout failed:", error)

            // Force clear everything even if error
            Cookies.remove("quzuu_auth_token", { path: "/" })
            localStorage.removeItem("email_verified")
            localStorage.removeItem("profile_completed")
            setUser(null)
            setIsAuthenticated(false)
            setInitializationComplete(false)

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