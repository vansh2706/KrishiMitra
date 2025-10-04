'use client'

import { useState } from 'react'
import LoginPage from '@/components/SimpleLoginPage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, User, Phone } from 'lucide-react'

export default function TestLoginPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState<{ name: string; contact: string; contactType: 'phone' | 'email' } | null>(null)

    const handleLoginSuccess = (data: { name: string; contact: string; contactType: 'phone' | 'email' }) => {
        setUserData(data)
        setIsLoggedIn(true)
    }

    const handleLogout = () => {
        setIsLoggedIn(false)
        setUserData(null)
        localStorage.removeItem('auth_token')
    }

    if (isLoggedIn && userData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-green-700 dark:text-green-400">
                            Welcome to KrishiMitra!
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="text-center space-y-3">
                            <p className="text-lg font-semibold">Login Successful!</p>

                            <div className="space-y-2 text-left">
                                <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                                    <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Name:</span>
                                    <span className="font-medium">{userData.name}</span>
                                </div>

                                <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                                    {userData.contactType === 'phone' ? <Phone className="h-4 w-4 text-gray-600 dark:text-gray-400" /> : <span className="h-4 w-4">✉</span>}
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{userData.contactType === 'phone' ? 'Mobile:' : 'Email:'}</span>
                                    <span className="font-medium">{userData.contactType === 'phone' ? `+91 ${userData.contact}` : userData.contact}</span>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                                You have successfully logged in with secure OTP verification.
                                The login system includes enhanced security features:
                            </p>

                            <ul className="text-xs text-gray-500 dark:text-gray-400 text-left space-y-1 mt-2">
                                <li>• Enhanced captcha (math and text)</li>
                                <li>• Phone number or email login</li>
                                <li>• Input validation and sanitization</li>
                                <li>• Simple and secure authentication</li>
                                <li>• No OTP required</li>
                            </ul>
                        </div>

                        <Button
                            onClick={handleLogout}
                            className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                        >
                            Logout & Test Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return <LoginPage onLoginSuccess={handleLoginSuccess} />
}