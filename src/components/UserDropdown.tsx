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
    const [mounted, setMounted] = useState(false)
    const { user, isLoading, isAuthenticated, logout } = useAuth()
    const router = useRouter()
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

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
        setIsOpen(false) // Close dropdown immediately
        await logout()
    }

    // Don't render anything during SSR
    if (!mounted) {
        return (
            <div className="h-10 w-32 bg-violet-200 animate-pulse rounded-md">
                {/* SSR placeholder */}
            </div>
        )
    }

    // Show loading state only if actually loading and no user data
    if (isLoading && !user) {
        return (
            <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-violet-200 animate-pulse rounded-full"></div>
                <div className="h-4 w-20 bg-violet-200 animate-pulse rounded hidden sm:block"></div>
                <div className="h-4 w-4 bg-violet-200 animate-pulse rounded"></div>
            </div>
        )
    }

    // Show login/register buttons if not authenticated and not loading
    if (!isAuthenticated || !user) {
        return (
            <div className="flex space-x-2">
                <Link
                    href="/login"
                    className="text-white bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-md transition-colors font-medium"
                >
                    Login
                </Link>
                <Link
                    href="/register"
                    className="text-violet-600 bg-white hover:bg-gray-100 px-4 py-2 rounded-md transition-colors font-medium"
                >
                    Register
                </Link>
            </div>
        )
    }

    // Component for user avatar with fallback
    const UserAvatar = ({ src, alt, size = 32 }: { src?: string; alt: string; size?: number }) => {
        const [imageError, setImageError] = useState(false)
        
        if (imageError || !src) {
            return <UserCircle className="h-8 w-8 text-white" />
        }

        if (src && src.includes('googleusercontent.com')) {
            // Use regular img tag for Google avatars to avoid Next.js config issues
            return (
                <img
                    src={src}
                    alt={alt}
                    width={size}
                    height={size}
                    className="rounded-full object-cover"
                    onError={() => setImageError(true)}
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
                    onError={() => setImageError(true)}
                />
            )
        } else {
            return <UserCircle className="h-8 w-8 text-white" />
        }
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-violet-600 transition-colors"
                disabled={isLoading}
            >
                <div className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                    <UserAvatar 
                        src={user.avatar} 
                        alt={user.fullName || user.username || "User"} 
                        size={32} 
                    />
                </div>
                <span className="text-white hidden sm:block max-w-[100px] truncate font-medium">
                    {user.fullName || user.username}
                </span>
                <ChevronDown className={`h-4 w-4 text-white transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200">
                    <div className="p-4 border-b border-gray-200 bg-white">
                        <div className="flex items-center space-x-3">
                            <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                                <UserAvatar 
                                    src={user.avatar} 
                                    alt={user.fullName || user.username || "User"} 
                                    size={48} 
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">
                                    {user.fullName || user.username}
                                </p>
                                <p className="text-sm text-gray-600 truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {!user.isEmailVerified && (
                        <Link
                            href="/verify-email"
                            className="block p-3 text-sm font-medium text-red-700 bg-red-50 border-b border-red-100 flex items-center hover:bg-red-100 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0 text-red-600" />
                            <span className="text-red-700">Verify your email address</span>
                        </Link>
                    )}

                    {user.isEmailVerified && !user.isProfileComplete && (
                        <Link
                            href="/complete-profile"
                            className="block p-3 text-sm font-medium text-yellow-700 bg-yellow-50 border-b border-yellow-100 flex items-center hover:bg-yellow-100 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0 text-yellow-600" />
                            <span className="text-yellow-700">Complete your profile</span>
                        </Link>
                    )}

                    <div className="p-2 bg-white">
                        <Link
                            href="/profile"
                            className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <UserCircle className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500" />
                            <span className="text-gray-700 font-medium">My Profile</span>
                        </Link>

                        <Link
                            href="/settings"
                            className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <Settings className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500" />
                            <span className="text-gray-700 font-medium">Settings</span>
                        </Link>

                        <Link
                            href="/my-events"
                            className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <FileClock className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500" />
                            <span className="text-gray-700 font-medium">My Events</span>
                        </Link>

                        <Link
                            href="/my-learning"
                            className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <BookOpen className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500" />
                            <span className="text-gray-700 font-medium">My Learning</span>
                        </Link>

                        <Link
                            href="/achievements"
                            className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <Medal className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500" />
                            <span className="text-gray-700 font-medium">Achievements</span>
                        </Link>
                    </div>

                    <div className="p-2 border-t border-gray-200 bg-white">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="mr-2 h-4 w-4 flex-shrink-0 text-red-500" />
                            <span className="text-red-600 font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserDropdown