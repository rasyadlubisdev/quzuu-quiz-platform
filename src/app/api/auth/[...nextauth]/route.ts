// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { externalLogin } from "@/lib/api"

// Check required environment variables
if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("Missing GOOGLE_CLIENT_ID environment variable")
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("Missing GOOGLE_CLIENT_SECRET environment variable")
}

if (!process.env.NEXTAUTH_SECRET) {
    throw new Error("Missing NEXTAUTH_SECRET environment variable")
}

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                    scope: "openid email profile"
                }
            }
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            console.log("🔐 SignIn callback triggered")
            console.log("👤 User:", { id: user.id, email: user.email, name: user.name })
            console.log("🔑 Account provider:", account?.provider)

            if (account?.provider === "google") {
                try {
                    // Check if we have id_token
                    if (!account.id_token) {
                        console.error("❌ No id_token received from Google")
                        return false
                    }

                    console.log("✅ ID token received, calling backend with oauth_id...")

                    // Call your backend API to handle OAuth login
                    // Send id_token as oauth_id (as per your backend expectation)
                    const response = await externalLogin(
                        account.id_token, // Send id_token as oauth_id
                        "google",
                        true, // is_agree_terms
                        false // is_sexual_disease
                    )
                    
                    console.log("✅ Backend OAuth response:", response)
                    
                    // Store the backend data for later use
                    user.backendToken = response.token
                    user.accountData = response.account
                    
                    // Log important user data for debugging
                    console.log("✅ User authentication data:", {
                        id: response.account.id,
                        email: response.account.email,
                        is_email_verified: response.account.is_email_verified,
                        is_detail_completed: response.account.is_detail_completed,
                        token_length: response.token.length
                    })
                    
                    return true
                } catch (error) {
                    console.error("❌ OAuth login failed:", error)
                    // Return false to show error page
                    return false
                }
            }
            return true
        },
        async jwt({ token, user, account }) {
            // Store backend token in JWT
            if (user?.backendToken) {
                console.log("🎫 Storing backend data in JWT")
                token.backendToken = user.backendToken
                token.accountData = user.accountData
            }
            return token
        },
        async session({ session, token }) {
            // Pass backend token to session
            if (token.backendToken) {
                console.log("📋 Adding backend data to session")
                session.backendToken = token.backendToken
                session.accountData = token.accountData
            }
            return session
        },
    },
    pages: {
        signIn: "/login",
        error: "/login", // Redirect to login on error
    },
    debug: process.env.NODE_ENV === "development",
})

export { handler as GET, handler as POST }