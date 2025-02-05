export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const registerUser = async (
    name: string,
    username: string,
    email: string,
    password: string,
    phone_number: string,
) => {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                username,
                email,
                password,
                phone_number,
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.status || "Registration failed")
        }

        return data
    } catch (error: any) {
        throw new Error(
            error.message || "Something went wrong during registration.",
        )
    }
}

export const loginUser = async (username: string, password: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.status || "Invalid credentials")
        }

        return data.data.token
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

export const fetchWithAuth = async (
    endpoint: string,
    method: string = "GET",
    body: any = null,
) => {
    const token = getAuthToken()

    if (!token) {
        throw new Error("Unauthorized: No token found")
    }

    const options: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            "Auth-Bearer-Token": token,
        },
    }

    if (body) {
        options.body = JSON.stringify(body)
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options)
    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch data")
    }

    return data
}

export const getEventList = async () => {
    return fetchWithAuth("/event-list")
}

export const getEventDetails = async (eventId: string) => {
    return fetchWithAuth(`/event-details/${eventId}`)
}

export const getProblemsetList = async () => {
    return fetchWithAuth("/problemset-list")
}

export const getQuestions = async (problemsetId: string) => {
    return fetchWithAuth(`/questions/${problemsetId}`)
}

export const registerEvent = async (id_event: number, event_code: string) => {
    try {
        const data = await fetchWithAuth("/register-event", "POST", {
            id_event,
            event_code,
        })
        return data
    } catch (error: any) {
        throw new Error(error.message || "Failed to register event.")
    }
}
