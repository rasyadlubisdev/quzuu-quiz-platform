"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
    ChevronDown,
    UserCircle,
    LogOut,
    Settings,
    BookOpen,
    Medal,
    FileClock,
    AlertCircle,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

const UserDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { user, isLoading, isAuthenticated, logout } = useAuth()
    const router = useRouter()
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const handleLogout = async () => {
        await logout()
    }

    if (isLoading) {
        return (
            <div className="h-10 w-32 bg-violet-200 animate-pulse rounded-md">
                {/* Loading placeholder */}
            </div>
        )
    }

    if (!isAuthenticated || !user) {
        return (
            <div className="flex space-x-2">
                <Link
                    href="/login"
                    className="text-white bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-md"
                >
                    Login
                </Link>
                <Link
                    href="/register"
                    className="text-violet-600 bg-white hover:bg-gray-100 px-4 py-2 rounded-md"
                >
                    Register
                </Link>
            </div>
        )
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-violet-600 transition-colors"
            >
                {user.avatar ? (
                    <div className="h-8 w-8 rounded-full overflow-hidden">
                        <Image
                            src={user.avatar}
                            alt={user.name}
                            width={32}
                            height={32}
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <UserCircle className="h-8 w-8 text-white" />
                )}
                <span className="text-white hidden sm:block max-w-[100px] truncate">
                    {user.name}
                </span>
                <ChevronDown className="h-4 w-4 text-white" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg overflow-hidden z-50">
                    <div className="p-4 border-b">
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-500 truncate">
                            {user.email}
                        </p>
                    </div>

                    {!user.isEmailVerified && (
                        <Link
                            href="/verify-email"
                            className="block p-3 text-sm font-medium text-red-700 bg-red-50 border-b flex items-center"
                        >
                            <AlertCircle className="mr-2 h-4 w-4" />
                            Verify your email address
                        </Link>
                    )}

                    {user.isEmailVerified && !user.isProfileComplete && (
                        <Link
                            href="/complete-profile"
                            className="block p-3 text-sm font-medium text-yellow-700 bg-yellow-50 border-b flex items-center"
                        >
                            <AlertCircle className="mr-2 h-4 w-4" />
                            Complete your profile
                        </Link>
                    )}

                    <div className="p-2">
                        <Link
                            href="/profile"
                            className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                        >
                            <UserCircle className="mr-2 h-4 w-4" />
                            My Profile
                        </Link>

                        <Link
                            href="/settings"
                            className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </Link>

                        <Link
                            href="/my-events"
                            className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                        >
                            <FileClock className="mr-2 h-4 w-4" />
                            My Events
                        </Link>

                        <Link
                            href="/my-learning"
                            className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                        >
                            <BookOpen className="mr-2 h-4 w-4" />
                            My Learning
                        </Link>

                        <Link
                            href="/achievements"
                            className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                        >
                            <Medal className="mr-2 h-4 w-4" />
                            Achievements
                        </Link>
                    </div>

                    <div className="p-2 border-t">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserDropdown
