import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "@/components/Providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Quzuu - Quiz Platform",
    description: "Empowering champions with Quzuu",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    <div>
                        <Navbar />
                        {children}
                    </div>
                    <Toaster />
                </Providers>
            </body>
        </html>
    )
}