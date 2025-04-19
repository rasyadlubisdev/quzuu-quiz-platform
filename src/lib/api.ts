import axios, { AxiosRequestConfig, AxiosInstance } from "axios"

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

axiosInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const errorMessage =
            error.response?.data?.status ||
            error.response?.data?.message ||
            "Something went wrong"
        return Promise.reject(new Error(errorMessage))
    },
)

const authRequest = async (
    endpoint: string,
    method: string = "GET",
    data: any = null,
    additionalConfig: AxiosRequestConfig = {},
) => {
    const token = getAuthToken()

    if (!token) {
        throw new Error("Unauthorized: No token found")
    }

    const config: AxiosRequestConfig = {
        method,
        url: endpoint,
        headers: {
            "Auth-Bearer-Token": token,
        },
        ...additionalConfig,
    }

    if (data) {
        if (method.toUpperCase() === "GET") {
            config.params = data
        } else {
            config.data = data
        }
    }

    try {
        return await axiosInstance(config)
    } catch (error: any) {
        throw new Error(error.message || "Failed to fetch data")
    }
}

export const registerUser = async (
    name: string,
    username: string,
    email: string,
    password: string,
    phone_number: string,
) => {
    try {
        return await axiosInstance.post("/register", {
            name,
            username,
            email,
            password,
            phone_number,
        })
    } catch (error: any) {
        throw new Error(
            error.message || "Something went wrong during registration.",
        )
    }
}

export const loginUser = async (username: string, password: string) => {
    try {
        const response = await axiosInstance.post("/login", {
            username,
            password,
        })
        return response.data.token
    } catch (error: any) {
        console.log(error)
        throw new Error(error.message || "Something went wrong during login.")
    }
}

export const logoutUser = () => {
    localStorage.removeItem("authToken")
}

export const getAuthToken = (): string | null => {
    return typeof window !== "undefined"
        ? localStorage.getItem("authToken")
        : null
}

export const getEventList = async () => {
    return authRequest("/event-list")
}

export const getEventDetails = async (id_event: string) => {
    try {
        return await authRequest("/event-details", "GET", { id_event })
    } catch (error: any) {
        throw new Error(error.message || "Failed to get event details.")
    }
}

export const getProblemsetList = async () => {
    return authRequest("/problemset-list")
}

export const getQuestions = async (problemsetId: string) => {
    return authRequest(`/questions/${problemsetId}`)
}

export const registerEvent = async (id_event: number, event_code: string) => {
    try {
        return await authRequest("/register-event", "POST", {
            id_event,
            event_code,
        })
    } catch (error: any) {
        throw new Error(error.message || "Failed to register event.")
    }
}
