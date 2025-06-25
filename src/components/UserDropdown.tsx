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

    // Component for user avatar with fallback
    const UserAvatar = ({ src, alt, size = 32 }: { src?: string; alt: string; size?: number }) => {
        if (src && src.includes('googleusercontent.com')) {
            // Use regular img tag for Google avatars to avoid Next.js config issues
            return (
                <img
                    src={src}
                    alt={alt}
                    width={size}
                    height={size}
                    className="rounded-full object-cover"
                    onError={(e) => {
                        // Fallback to icon if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                    }}
                />
            )
        } else if (src) {
            // Use Next.js Image for other sources
            return (
                <Image
                    src={src}
                    alt={alt}
                    width={size}
                    height={size}
                    className="rounded-full object-cover"
                />
            )
        } else {
            // Fallback to icon
            return <UserCircle className={`h-${size/4} w-${size/4} text-white`} />
        }
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-violet-600 transition-colors"
            >
                <div className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center">
                    <UserAvatar 
                        src={user.avatar} 
                        alt={user.fullName || user.username || "User"} 
                        size={32} 
                    />
                    <UserCircle className="h-8 w-8 text-white hidden" />
                </div>
                <span className="text-white hidden sm:block max-w-[100px] truncate">
                    {user.fullName || user.username}
                </span>
                <ChevronDown className="h-4 w-4 text-white" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg overflow-hidden z-50">
                    <div className="p-4 border-b">
                        <div className="flex items-center space-x-3">
                            <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center">
                                <UserAvatar 
                                    src={user.avatar} 
                                    alt={user.fullName || user.username || "User"} 
                                    size={48} 
                                />
                                <UserCircle className="h-12 w-12 text-gray-400 hidden" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">
                                    {user.fullName || user.username}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>
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