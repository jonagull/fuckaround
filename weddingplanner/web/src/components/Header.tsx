"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Skeleton } from "./ui/skeleton"

export const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
    const router = useRouter()



    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/check')
                const data = await response.json()
                setIsAuthenticated(data.isAuthenticated)
            } catch {
                setIsAuthenticated(false)
            }
        }

        checkAuth()

        const interval = setInterval(checkAuth, 1000)
        return () => clearInterval(interval)
    }, [])

    const handleGetStartedClick = (e: React.MouseEvent) => {
        e.preventDefault()
        if (isAuthenticated) {
            router.push('/protected/dashboard')
        } else {
            router.push('/login')
        }
    }

    if (isAuthenticated === null) {
        return (
            <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
                <div className="flex items-center space-x-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                </div>
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-10 w-28 rounded-full" />
                </div>
            </nav>
        )
    }

    return (
        <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
            <Link href="/">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">W</span>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                        WeddingPlanner
                    </span>
                </div>
            </Link>
            <div className="flex items-center space-x-4">
                <Link
                    href="/wedding-wizard"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                    Wedding Planner
                </Link>
                <Link
                    href="/table-planning"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                    Table Planning
                </Link>
                <button
                    onClick={handleGetStartedClick}
                    className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-2 rounded-full hover:from-rose-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                    {isAuthenticated ? 'Dashboard' : 'Get Started'}
                </button>
            </div>
        </nav>
    )
}