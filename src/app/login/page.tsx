'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    User,
    Phone,
    Mail,
    Shield,
    RefreshCw,
    Lock,
    Loader2,
    ArrowRight,
    CheckCircle
} from 'lucide-react'
import { useLanguage, LanguageProvider } from '@/hooks/useLanguage'
import ClientOnly from '@/components/ClientOnly'

// Google OAuth Icon Component
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
)

function LoginPageContent() {
    const router = useRouter()
    const { t } = useLanguage()
    const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone')
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        captcha: ''
    })
    const [captchaCode, setCaptchaCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // Generate captcha
    const generateCaptcha = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let result = ''
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        setCaptchaCode(result)
    }

    useEffect(() => {
        generateCaptcha()
    }, [])

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Name is required')
            return false
        }

        if (loginMethod === 'phone') {
            if (!formData.phone.trim() || !/^[6-9]\d{9}$/.test(formData.phone)) {
                setError('Please enter a valid 10-digit mobile number')
                return false
            }
        } else {
            if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                setError('Please enter a valid email address')
                return false
            }
        }

        if (formData.captcha !== captchaCode) {
            setError('Incorrect captcha')
            generateCaptcha()
            setFormData(prev => ({ ...prev, captcha: '' }))
            return false
        }

        return true
    }

    const handleLogin = async () => {
        if (!validateForm()) return

        setLoading(true)
        setError('')

        try {
            // Simulate login process
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Store user data
            const userData = {
                name: formData.name,
                contact: loginMethod === 'phone' ? formData.phone : formData.email,
                contactType: loginMethod
            }

            localStorage.setItem('userAuth', JSON.stringify(userData))
            setSuccess('Login successful! Redirecting...')

            setTimeout(() => {
                router.push('/')
            }, 1500)

        } catch (err) {
            setError('Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setLoading(true)
        setError('')

        try {
            // Simulate Google OAuth flow
            await new Promise(resolve => setTimeout(resolve, 1500))

            // Mock Google user data
            const userData = {
                name: 'Google User',
                contact: 'user@gmail.com',
                contactType: 'email',
                provider: 'google'
            }

            localStorage.setItem('userAuth', JSON.stringify(userData))
            setSuccess('Google login successful! Redirecting...')

            setTimeout(() => {
                router.push('/')
            }, 1500)

        } catch (err) {
            setError('Google login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (field: string, value: string) => {
        let sanitizedValue = value

        if (field === 'name') {
            sanitizedValue = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 50)
        } else if (field === 'phone') {
            sanitizedValue = value.replace(/[^0-9]/g, '').slice(0, 10)
        } else if (field === 'email') {
            sanitizedValue = value.slice(0, 50)
        }

        setFormData(prev => ({ ...prev, [field]: sanitizedValue }))
        setError('')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 dark:from-gray-900 dark:via-slate-800 dark:to-gray-800 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-white font-bold text-2xl">🌾</span>
                    </div>
                    <CardTitle className="text-2xl font-bold text-green-700 dark:text-green-400">
                        Welcome to KrishiMitra
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-400">
                        Choose your preferred login method
                    </p>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Login Method Tabs */}
                    <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as 'phone' | 'email')}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="phone" className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                Mobile Number
                            </TabsTrigger>
                            <TabsTrigger value="email" className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email Address
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="phone" className="space-y-4 mt-6">
                            <LoginForm
                                method="phone"
                                formData={formData}
                                onInputChange={handleInputChange}
                                captchaCode={captchaCode}
                                onRefreshCaptcha={generateCaptcha}
                                onLogin={handleLogin}
                                loading={loading}
                                error={error}
                                success={success}
                            />
                        </TabsContent>

                        <TabsContent value="email" className="space-y-4 mt-6">
                            {/* Google Login Option */}
                            <div className="space-y-3">
                                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                    Quick Sign In
                                </div>
                                <Button
                                    onClick={handleGoogleLogin}
                                    disabled={loading}
                                    variant="outline"
                                    className="w-full border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    ) : (
                                        <GoogleIcon />
                                    )}
                                    <span className="ml-2">Continue with Google</span>
                                </Button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-gray-300" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">Or</span>
                                    </div>
                                </div>
                            </div>

                            <LoginForm
                                method="email"
                                formData={formData}
                                onInputChange={handleInputChange}
                                captchaCode={captchaCode}
                                onRefreshCaptcha={generateCaptcha}
                                onLogin={handleLogin}
                                loading={loading}
                                error={error}
                                success={success}
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}

// Login Form Component
function LoginForm({
    method,
    formData,
    onInputChange,
    captchaCode,
    onRefreshCaptcha,
    onLogin,
    loading,
    error,
    success
}: {
    method: 'phone' | 'email'
    formData: any
    onInputChange: (field: string, value: string) => void
    captchaCode: string
    onRefreshCaptcha: () => void
    onLogin: () => void
    loading: boolean
    error: string
    success: string
}) {
    return (
        <>
            {/* Name Field */}
            <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                </Label>
                <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => onInputChange('name', e.target.value)}
                    disabled={loading}
                />
            </div>

            {/* Contact Field */}
            <div className="space-y-2">
                <Label className="flex items-center gap-2">
                    {method === 'phone' ? <Phone className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                    {method === 'phone' ? 'Mobile Number' : 'Email Address'}
                </Label>
                {method === 'phone' ? (
                    <div className="flex">
                        <div className="flex items-center px-3 bg-gray-100 dark:bg-gray-800 border border-r-0 rounded-l-md text-sm">
                            +91
                        </div>
                        <Input
                            type="tel"
                            placeholder="Enter 10-digit mobile number"
                            value={formData.phone}
                            onChange={(e) => onInputChange('phone', e.target.value)}
                            className="rounded-l-none"
                            disabled={loading}
                        />
                    </div>
                ) : (
                    <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) => onInputChange('email', e.target.value)}
                        disabled={loading}
                    />
                )}
            </div>

            {/* Captcha */}
            <div className="space-y-2">
                <Label className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Security Verification
                </Label>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-lg px-3 py-2 bg-gray-100 dark:bg-gray-800">
                        {captchaCode}
                    </Badge>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onRefreshCaptcha}
                        disabled={loading}
                    >
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                </div>
                <Input
                    type="text"
                    placeholder="Enter the code above"
                    value={formData.captcha}
                    onChange={(e) => onInputChange('captcha', e.target.value)}
                    disabled={loading}
                />
            </div>

            {/* Submit Button */}
            <Button
                onClick={onLogin}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Logging in...
                    </>
                ) : success ? (
                    <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Success!
                    </>
                ) : (
                    <>
                        <Lock className="w-4 h-4 mr-2" />
                        Secure Login
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                )}
            </Button>

            {/* Messages */}
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}
        </>
    )
}

export default function LoginPage() {
    return (
        <ClientOnly fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-2xl">🌾</span>
                    </div>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <p className="text-gray-600">Loading KrishiMitra...</p>
                </div>
            </div>
        }>
            <LanguageProvider>
                <LoginPageContent />
            </LanguageProvider>
        </ClientOnly>
    )
}
