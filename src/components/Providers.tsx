// src/components/Providers.tsx
"use client"

import { SessionProvider } from "next-auth/react"
import { AuthProvider } from "@/contexts/AuthContext"
import { ReactNode } from "react"

interface ProvidersProps {
    children: ReactNode
    session?: any
}

export default function Providers({ children, session }: ProvidersProps) {
    return (
        <SessionProvider session={session}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </SessionProvider>
    )
}