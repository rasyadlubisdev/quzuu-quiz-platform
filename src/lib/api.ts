import axios, { AxiosError, AxiosResponse } from "axios"
import Cookies from "js-cookie"

interface UserData {
    id?: string
    name?: string
    username?: string
    email?: string
    avatar?: string
    is_email_verified?: boolean
    is_detail_completed?: boolean
}

export interface UserProfileUpdateData {
    full_name: string
    school_name: string
    province: string
    city: string
    avatar: string
    phone_number: string
}

// Create axios instance with base URL
export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
})

// Cookie configuration
const JWT_COOKIE_NAME = "quzuu_auth_token"
const COOKIE_OPTIONS = {
    expires: 7, // 7 days
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
}

// Interceptor to add the JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = getAuthToken()
        if (token && config.headers) {
            config.headers["Authorization"] = "Bearer " + token
        }
        return config
    },
    (error) => Promise.reject(error),
)

// Response interceptor to handle common response patterns
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            removeAuthToken()
            if (typeof window !== "undefined") {
                window.location.href = "/login"
            }
        }
        return Promise.reject(error)
    },
)

// Helper to handle API responses
const handleApiResponse = <T>(response: AxiosResponse<any>): T => {
    if (
        response.data &&
        (response.data.status === "success" || response.data.status === "error")
    ) {
        if (response.data.status === "error") {
            throw new Error(response.data.message || "An error occurred")
        }
        return response.data.data
    }
    return response.data
}

// Helper to handle API errors
const handleApiError = (error: any): never => {
    console.error("API Error Details:", error)
    
    if (axios.isAxiosError(error) && error.response?.data) {
        console.error("API Error Response:", error.response.data)
        
        if (error.response.data.status === "error") {
            throw new Error(error.response.data.message || "An error occurred")
        }
        throw new Error(error.response.statusText || "An error occurred")
    }

    throw error
}

// Set the auth token in cookies (CLIENT-SIDE ONLY)
export const setAuthToken = (token: string): void => {
    // Add check to ensure this only runs on client-side
    if (typeof window !== "undefined") {
        console.log("🍪 Setting auth token in cookies (client-side)")
        Cookies.set(JWT_COOKIE_NAME, token, COOKIE_OPTIONS)
        console.log("🍪 Token set successfully:", !!Cookies.get(JWT_COOKIE_NAME))
    } else {
        console.warn("⚠️ setAuthToken called on server-side, skipping...")
    }
}

// Get the auth token from cookies
export const getAuthToken = (): string | null => {
    if (typeof window !== "undefined") {
        return Cookies.get(JWT_COOKIE_NAME) || null
    }
    return null
}

// Remove the auth token from cookies
export const removeAuthToken = (): void => {
    if (typeof window !== "undefined") {
        Cookies.remove(JWT_COOKIE_NAME, { path: "/" })
    }
}

// AUTHENTICATION FUNCTIONS

export const registerUser = async (
    email: string,
    username: string,
    password: string,
) => {
    try {
        const response = await api.post("/auth/register", {
            email,
            username,
            password,
        })
        return handleApiResponse(response)
    } catch (error) {
        return handleApiError(error)
    }
}

export const loginUser = async (email: string, password: string) => {
    try {
        const response = await api.post("/auth/login", {
            email,
            password,
        })

        const data = handleApiResponse<{ account: any; token: string }>(response)

        if (data.token) {
            setAuthToken(data.token)
        }

        return data
    } catch (error) {
        return handleApiError(error)
    }
}

// External login (OAuth) - Updated for server-side use
export const externalLogin = async (
    oauth_id: string,
    oauth_provider: string = "google",
    is_agree_terms: boolean = true,
    is_sexual_disease: boolean = false,
) => {
    try {
        console.log("Calling externalLogin with:", {
            oauth_id: oauth_id.substring(0, 50) + "...",
            oauth_provider,
            is_agree_terms,
            is_sexual_disease,
        })

        const response = await api.post("/auth/external-login", {
            oauth_id,
            oauth_provider,
            is_agree_terms,
            is_sexual_disease,
        })

        console.log("External login raw response:", response.data)

        const responseData = response.data
        
        if (responseData.status === "success" && responseData.data) {
            const data = responseData.data
            console.log("External login processed data:", data)

            // DON'T set token here - this will be handled on client-side
            // The token will be stored via NextAuth session
            
            return data
        } else {
            throw new Error(responseData.message || "External login failed")
        }

    } catch (error) {
        console.error("External login error:", error)
        return handleApiError(error)
    }
}

// NEW: Function to handle NextAuth session and sync with backend token
export const syncNextAuthSession = async (session: any) => {
    try {
        if (session?.backendToken) {
            console.log("🔄 Syncing NextAuth session with backend token")
            // This will run on client-side, so setAuthToken will work
            setAuthToken(session.backendToken)
            console.log("✅ Backend token synced to cookies")
            return session.accountData
        }
        return null
    } catch (error) {
        console.error("❌ Error syncing NextAuth session:", error)
        return null
    }
}

export const changePassword = async (
    old_password: string,
    new_password: string,
) => {
    try {
        const response = await api.put("/auth/change-password", {
            old_password,
            new_password,
        })
        return handleApiResponse(response)
    } catch (error) {
        return handleApiError(error)
    }
}

export const requestPasswordReset = async (email: string) => {
    try {
        const response = await api.post("/auth/forgot-password", { email })
        return handleApiResponse(response)
    } catch (error) {
        return handleApiError(error)
    }
}

export const resetPassword = async (token: number, new_password: string) => {
    try {
        const response = await api.put("/auth/forgot-password", {
            token,
            new_password,
        })
        return handleApiResponse(response)
    } catch (error) {
        return handleApiError(error)
    }
}

export const logoutUser = async () => {
    try {
        // Call backend logout if needed
    } catch (error) {
        console.error("Error during logout:", error)
    } finally {
        removeAuthToken()
    }
}

// EMAIL VERIFICATION FUNCTIONS

export const createEmailVerification = async (email: string) => {
    try {
        const response = await api.post("/email/create-verification", { email })
        return handleApiResponse(response)
    } catch (error) {
        return handleApiError(error)
    }
}

export const verifyEmail = async (email: string, token: number | string) => {
    try {
        const response = await api.post("/email/verify", {
            email,
            token,
        })
        return handleApiResponse(response)
    } catch (error) {
        return handleApiError(error)
    }
}

// USER PROFILE FUNCTIONS

export const getUserProfile = async () => {
    try {
        const response = await api.get("/user/me")
        return handleApiResponse(response)
    } catch (error) {
        return handleApiError(error)
    }
}

export const updateUserProfile = async (profileData: UserProfileUpdateData) => {
    try {
        console.log("📝 Updating profile with data:", profileData)
        console.log("🔑 Using token:", getAuthToken()?.substring(0, 20) + "...")

        // Use the axios instance for consistency
        const response = await api.put("/user/me", profileData)

        console.log("📨 Profile update raw response:", response.data)

        // Check if the response indicates success
        if (response.data && response.data.status === "success") {
            console.log("✅ Profile update successful!")
            
            // Return the processed data
            const data = handleApiResponse(response)
            console.log("📊 Profile update processed data:", data)
            
            return data
        } else if (response.data && response.data.status === "error") {
            console.error("❌ API returned error:", response.data.message)
            throw new Error(response.data.message || "Profile update failed")
        } else {
            console.warn("⚠️ Unexpected response format:", response.data)
            // Still try to process it
            const data = handleApiResponse(response)
            return data
        }
    } catch (error) {
        console.error("❌ Profile update error:", error)
        
        // Enhanced error logging
        if (axios.isAxiosError(error)) {
            console.error("🔍 Axios error details:", {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                headers: error.response?.headers,
            })
        }
        
        return handleApiError(error)
    }
}

export const checkUserVerified = async () => {
    try {
        const userData: any = await getUserProfile()
        return { verified: userData?.account?.is_email_verified || false }
    } catch (error) {
        return { verified: false }
    }
}

export const checkProfileComplete = async () => {
    try {
        const userData: any = await getUserProfile()
        return { complete: userData?.account?.is_detail_completed || false }
    } catch (error) {
        return { complete: false }
    }
}

// EVENT FUNCTIONS

export const getEventList = async () => {
    try {
        const response = await api.get("/events", { data: {} })
        return handleApiResponse(response)
    } catch (error) {
        return handleApiError(error)
    }
}

export const getEventDetails = async (
    id_event: string,
    id_account: string | number,
) => {
    try {
        const response = await api.get("/events/event-details", {
            data: {
                id_event,
                id_account,
            },
        })
        return handleApiResponse(response)
    } catch (error) {
        return handleApiError(error)
    }
}

export const registerEvent = async (id_event: string, event_code: string) => {
    try {
        const response = await api.post("/events/register-event", {
            id_event,
            event_code,
        })
        return handleApiResponse(response)
    } catch (error) {
        return handleApiError(error)
    }
}

// PROBLEMSET FUNCTIONS

export const getProblemsetList = async (id_event: string) => {
    try {
        const response = await api.get("/problemsets/lists", {
            data: { id_event },
        })
        return handleApiResponse(response)
    } catch (error) {
        return handleApiError(error)
    }
}

export const getQuestions = async (problemsetId: string) => {
    try {
        const response = await api.get(`/problemsets/${problemsetId}/questions`)
        return handleApiResponse(response)
    } catch (error) {
        return handleApiError(error)
    }
}

// EXAM FUNCTIONS

export const startExam = async (id_problemset: string) => {
    try {
        const response = await api.get("/exam/start", {
            data: { id_problemset },
        })
        return handleApiResponse(response)
    } catch (error) {
        return handleApiError(error)
    }
}

export const submitExamAnswers = async (
    id_exam: string,
    answers: Record<string, any>,
) => {
    try {
        const response = await api.post(`/exam/${id_exam}/submit`, { answers })
        return handleApiResponse(response)
    } catch (error) {
        return handleApiError(error)
    }
}

export const getLeaderboard = async (quizId: string) => {
    try {
        const response = await api.get(`/quizzes/${quizId}/leaderboard`)
        return handleApiResponse(response)
    } catch (error) {
        return handleApiError(error)
    }
}