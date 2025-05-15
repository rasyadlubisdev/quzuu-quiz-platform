import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Protected routes that require authentication
const protectedRoutes = [
    "/profile",
    "/settings",
    "/my-events",
    "/my-learning",
    "/achievements",
    "/complete-profile",
    "/event-details",
]

// Auth routes (accessible only when NOT authenticated)
const authRoutes = ["/login", "/register"]

export function middleware(request: NextRequest) {
    // Get the path of the request
    const path = request.nextUrl.pathname

    // Check if the auth token exists in cookies
    const token = request.cookies.get("quzuu_auth_token")?.value
    const isAuthenticated = !!token

    // If trying to access a protected route without authentication
    if (
        protectedRoutes.some((route) => path.startsWith(route)) &&
        !isAuthenticated
    ) {
        // Redirect to login page with the returnUrl query parameter
        const url = new URL("/login", request.url)
        url.searchParams.set("returnUrl", path)
        return NextResponse.redirect(url)
    }

    // If trying to access auth routes (login/register) when already authenticated
    if (authRoutes.some((route) => path === route) && isAuthenticated) {
        // Redirect to home page
        return NextResponse.redirect(new URL("/", request.url))
    }

    // Email verification special case
    if (path.startsWith("/verify-email") && !path.includes("/verify-email/")) {
        // Allow access to the email verification pending page regardless of auth status
        return NextResponse.next()
    }

    // Check for verified email status for authenticated users
    // This should use a cookie or session to avoid api calls in middleware
    if (isAuthenticated) {
        const isVerified =
            request.cookies.get("quzuu_email_verified")?.value === "true"

        // If user is logged in but not verified, allow only certain pages
        if (
            !isVerified &&
            !path.startsWith("/verify-email") &&
            path !== "/logout" // Fixed comparison
        ) {
            // Redirect to email verification pending page
            return NextResponse.redirect(new URL("/verify-email", request.url))
        }
    }

    // Allow the request to continue
    return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public directory files (assets, images, etc.)
         * - api routes (internal API endpoints)
         */
        "/((?!_next/static|_next/image|favicon.ico|assets/|api/).*)",
    ],
}
