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
    // Add other properties that might be in your user data
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
    withCredentials: true, // This ensures cookies are sent with requests
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
            // Update header based on Postman documentation
            config.headers["Auth-Bearer-Token"] = token
        }
        return config
    },
    (error) => Promise.reject(error),
)

// Response interceptor to handle common response patterns
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        // Handle unauthorized errors (401)
        if (error.response?.status === 401) {
            // Clear the auth token
            removeAuthToken()

            // Redirect to login if we're in a browser environment
            if (typeof window !== "undefined") {
                window.location.href = "/login"
            }
        }
        return Promise.reject(error)
    },
)

// Helper to handle API responses in a consistent way
const handleApiResponse = <T>(response: AxiosResponse<any>): T => {
    // Based on the API contract, responses look like:
    // {
    //   "status": "success",
    //   "message": "Data retrieved successfully!",
    //   "data": { ... },
    //   "meta_data": {}
    // }

    if (
        response.data &&
        (response.data.status === "success" || response.data.status === "error")
    ) {
        if (response.data.status === "error") {
            throw new Error(response.data.message || "An error occurred")
        }
        return response.data.data
    }

    // If the response doesn't follow our format, just return the data
    return response.data
}

// Helper to handle API errors
const handleApiError = (error: any): never => {
    // If it's an AxiosError with a response
    if (axios.isAxiosError(error) && error.response?.data) {
        // If the response follows our expected error format
        if (error.response.data.status === "error") {
            throw new Error(error.response.data.message || "An error occurred")
        }
        // Otherwise throw a generic error with the status text
        throw new Error(error.response.statusText || "An error occurred")
    }

    // If it's some other kind of error, just throw it
    throw error
}

// Set the auth token in cookies
export const setAuthToken = (token: string): void => {
    Cookies.set(JWT_COOKIE_NAME, token, COOKIE_OPTIONS)
}

// Get the auth token from cookies
export const getAuthToken = (): string | null => {
    return Cookies.get(JWT_COOKIE_NAME) || null
}

// Remove the auth token from cookies
export const removeAuthToken = (): void => {
    Cookies.remove(JWT_COOKIE_NAME, { path: "/" })
}

// AUTHENTICATION FUNCTIONS

// Register a new user
// POST {{base_url}}/auth/register
// Register a new user and automatically authenticate
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

// Login user
// POST {{base_url}}/auth/login
export const loginUser = async (email: string, password: string) => {
    try {
        const response = await api.post("/auth/login", {
            email,
            password,
        })

        const data = handleApiResponse<{ account: any; token: string }>(
            response,
        )

        // Store the token in cookies
        if (data.token) {
            setAuthToken(data.token)
        }

        return data
    } catch (error) {
        return handleApiError(error)
    }
}

// External login (OAuth)
// POST {{base_url}}/auth/external-login
export const externalLogin = async (
    oauth_id: string,
    oauth_provider: string,
    is_agree_terms: boolean,
    is_sexual_disease: boolean,
) => {
    try {
        const response = await api.post("/auth/external-login", {
            oauth_id,
            oauth_provider,
            is_agree_terms,
            is_sexual_disease,
        })

        const data = handleApiResponse<{ account: any; token: string }>(
            response,
        )

        // Store the token in cookies
        if (data.token) {
            setAuthToken(data.token)
        }

        return data
    } catch (error) {
        return handleApiError(error)
    }
}

// Change password
// PUT {{base_url}}/auth/change-password
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

// Forgot password (request reset)
// POST {{base_url}}/auth/forgot-password
export const requestPasswordReset = async (email: string) => {
    try {
        const response = await api.post("/auth/forgot-password", { email })
        return handleApiResponse(response)
    } catch (error) {
        return handleApiError(error)
    }
}

// Reset password with token
// PUT {{base_url}}/auth/forgot-password
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

// Logout user
export const logoutUser = async () => {
    try {
        // Call the backend to invalidate the token if needed
        // await api.post('/auth/logout');
    } catch (error) {
        console.error("Error during logout:", error)
    } finally {
        // Always remove the token from cookies regardless of API success
        removeAuthToken()
    }
}

// EMAIL VERIFICATION FUNCTIONS

// Create email verification (request OTP)
// POST {{base_url}}/email/create-verification
// Create email verification (request OTP)
// POST {{base_url}}/email/create-verification
export const createEmailVerification = async (email: string) => {
    try {
        const response = await api.post("/email/create-verification", { email })
        return handleApiResponse(response)
    } catch (error) {
        return handleApiError(error)
    }
}

// Verify email with OTP
// POST {{base_url}}/email/verify
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

// Get user profile
// GET {{base_url}}/user/profile
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
        console.log("Updating profile with data:", profileData)
        console.log("Using token:", getAuthToken())

        const headers = {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getAuthToken() || "",
        }
        console.log("Request headers:", headers)

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/me`,
            {
                method: "PUT",
                headers: headers,
                body: JSON.stringify(profileData),
            },
        )

        const responseText = await response.text()
        console.log("Raw response:", responseText)

        let responseData
        try {
            responseData = JSON.parse(responseText)
        } catch (e) {
            console.error("Failed to parse response:", e)
            throw new Error("Invalid response format from server")
        }

        if (!response.ok) {
            throw new Error(responseData?.message || "Failed to update profile")
        }

        return responseData.data
    } catch (error) {
        console.error("Profile update error:", error)
        return handleApiError(error)
    }
}

// Check if user is verified
export const checkUserVerified = async () => {
    try {
        // Get user profile which should include verification status
        const userData: any = await getUserProfile()
        return { verified: userData?.account?.is_email_verified || false }
    } catch (error) {
        return { verified: false }
    }
}

// Check if user has completed profile
export const checkProfileComplete = async () => {
    try {
        // Get user profile which should include profile completion status
        const userData: any = await getUserProfile()
        return { complete: userData?.account?.is_detail_completed || false }
    } catch (error) {
        return { complete: false }
    }
}

// EVENT FUNCTIONS

// Get list of events
// GET {{base_url}}/events
export const getEventList = async () => {
    try {
        // Based on Postman documentation: GET with empty data payload
        const response = await api.get("/events", { data: {} })
        return handleApiResponse(response)
    } catch (error) {
        return handleApiError(error)
    }
}

// Get event details
// GET {{base_url}}/events/event-details
export const getEventDetails = async (
    id_event: string,
    id_account: string | number,
) => {
    try {
        // Based on Postman documentation: GET with data payload
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

// Register for an event
// POST {{base_url}}/events/register-event
export const registerEvent = async (id_event: string, event_code: string) => {
    try {
        // Updated endpoint based on Postman documentation
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

// Get problemset list for an event
// GET {{base_url}}/problemsets/lists
export const getProblemsetList = async (id_event: string) => {
    try {
        // Based on Postman documentation: GET with data payload
        const response = await api.get("/problemsets/lists", {
            data: { id_event },
        })
        return handleApiResponse(response)
    } catch (error) {
        return handleApiError(error)
    }
}

// Get questions for a specific problemset
export const getQuestions = async (problemsetId: string) => {
    try {
        // This endpoint might need to be updated based on complete API documentation
        const response = await api.get(`/problemsets/${problemsetId}/questions`)
        return handleApiResponse(response)
    } catch (error) {
        return handleApiError(error)
    }
}

// EXAM FUNCTIONS

// Start an exam
// GET {{base_url}}/exam/start
export const startExam = async (id_problemset: string) => {
    try {
        // Based on Postman documentation: GET endpoint
        const response = await api.get("/exam/start", {
            data: { id_problemset },
        })
        return handleApiResponse(response)
    } catch (error) {
        return handleApiError(error)
    }
}

// Submit exam answers
export const submitExamAnswers = async (
    id_exam: string,
    answers: Record<string, any>,
) => {
    try {
        // This endpoint might need to be updated based on complete API documentation
        const response = await api.post(`/exam/${id_exam}/submit`, { answers })
        return handleApiResponse(response)
    } catch (error) {
        return handleApiError(error)
    }
}

// Get leaderboard data
export const getLeaderboard = async (quizId: string) => {
    try {
        // This endpoint might need to be updated based on complete API documentation
        const response = await api.get(`/quizzes/${quizId}/leaderboard`)
        return handleApiResponse(response)
    } catch (error) {
        return handleApiError(error)
    }
}
