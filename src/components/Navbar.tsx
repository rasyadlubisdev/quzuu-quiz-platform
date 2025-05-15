"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { usePathname } from "next/navigation"
import UserDropdown from "./UserDropdown"
import { getAuthToken } from "@/lib/api"

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    const menus = [
        { title: "Home", path: "/" },
        { title: "Event", path: "/event" },
        { title: "Learn", path: "/learn" },
        { title: "Problemset", path: "/problemset" },
        { title: "Submission", path: "/submission" },
        { title: "Leaderboard", path: "/leaderboard" },
    ]

    const pathname = usePathname()
    const noNavbarRoutes = [
        "/login",
        "/register",
        "/verify-email",
        "/forgot-password",
    ]

    // Path patterns that should not show navbar
    const noNavbarPatterns = [
        /^\/verify-email\/.+$/, // verify-email/[token]
        /^\/reset-password\/.+$/, // reset-password/[token]
    ]

    // Check if the current path should hide navbar
    const shouldHideNavbar = () => {
        if (noNavbarRoutes.includes(pathname)) return true
        return noNavbarPatterns.some((pattern) => pattern.test(pathname))
    }

    useEffect(() => {
        setIsMounted(true)
        const token = getAuthToken()
        setIsLoggedIn(!!token)
    }, [])

    // Don't render anything during SSR
    if (!isMounted) return null

    // Hide navbar on specified routes
    if (shouldHideNavbar()) return null

    return (
        <>
            <nav className="navbar fixed z-[100] w-screen py-5 bg-primary text-white">
                <div className="items-center px-4 container mx-auto md:flex md:px-8">
                    <div className="flex items-center justify-between md:block basis-1/4">
                        <Link href="/">
                            <h1 className="text-4xl font-semibold">Quzuu</h1>
                        </Link>
                        <div className="md:hidden">
                            <button
                                className="text-white outline-none p-2 rounded-md"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <Menu />
                            </button>
                        </div>
                    </div>
                    <div
                        className={`basis-3/4 flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
                            isOpen ? "block" : "hidden"
                        }`}
                    >
                        <div className="flex flex-col md:flex-row justify-center md:justify-end items-center space-y-8 md:space-y-0">
                            <ul className="flex flex-col md:flex-row justify-center md:justify-end items-center space-y-8 md:flex md:space-x-6 md:space-y-0">
                                {menus.map((item, idx) => (
                                    <li
                                        key={idx}
                                        className="text-white hover:text-indigo-200"
                                    >
                                        <Link href={item.path}>
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            {/* User dropdown or login/register buttons */}
                            <div className="mt-4 md:mt-0 md:ml-6">
                                <UserDropdown />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <div style={{ paddingTop: "80px" }}></div>
        </>
    )
}

export default Navbar
