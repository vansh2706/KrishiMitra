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
    CheckCircle,
    Leaf,
    Users,
    Heart,
    Award,
    Sparkles
} from 'lucide-react'
import { useLanguage, LanguageProvider } from '@/hooks/useLanguage'
import ClientOnly from '@/components/ClientOnly'
import { signIn, useSession } from 'next-auth/react'

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
    const { t, language } = useLanguage()
    const { data: session, status } = useSession()
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

    // Redirect if already logged in
    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            // Store user data in localStorage
            const userData = {
                name: session.user.name || 'Google User',
                contact: session.user.email || '',
                contactType: 'email',
                provider: 'google'
            }
            localStorage.setItem('userAuth', JSON.stringify(userData))
            setSuccess('Google login successful! Redirecting...')
            setTimeout(() => {
                router.push('/')
            }, 1500)
        }
    }, [status, session, router])

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
        try {
            setLoading(true)
            setError('')
            setSuccess('')

            // Use NextAuth to handle Google login with account selection prompt
            const result = await signIn('google', {
                callbackUrl: '/',
                redirect: true
            })

            if (result?.error) {
                setError('Google login failed. Please try again.')
                setLoading(false)
            } else {
                setSuccess('Redirecting to Google... Please select your account.')
            }
        } catch (err) {
            setError('Google login failed. Please try again.')
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

    // Show loading state while checking session
    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 dark:from-gray-900 dark:via-slate-800 dark:to-gray-800">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-2xl">🌾</span>
                    </div>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading KrishiMitra...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 dark:from-gray-900 dark:via-slate-800 dark:to-gray-800 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side - Welcome Message and Features */}
                <div className="hidden lg:flex flex-col justify-center p-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl text-white shadow-xl">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <img
                                src="/krishimitra-logo.jpg"
                                alt="KrishiMitra Logo"
                                className="h-10 w-auto"
                            />
                            <h1 className="text-3xl font-bold">KrishiMitra</h1>
                        </div>

                        <h2 className="text-2xl font-semibold">Welcome, Farmer Friend!</h2>

                        <p className="text-green-100">
                            Your trusted companion for smart farming decisions. Get real-time insights,
                            expert advice, and market information right at your fingertips.
                        </p>

                        <div className="space-y-4 mt-8">
                            <div className="flex items-start gap-3">
                                <Award className="h-6 w-6 text-yellow-300 mt-1" />
                                <div>
                                    <h3 className="font-semibold">Expert Agricultural Advice</h3>
                                    <p className="text-green-100 text-sm">AI-powered guidance for better yields</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Users className="h-6 w-6 text-yellow-300 mt-1" />
                                <div>
                                    <h3 className="font-semibold">Community Support</h3>
                                    <p className="text-green-100 text-sm">Connect with fellow farmers</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Heart className="h-6 w-6 text-yellow-300 mt-1" />
                                <div>
                                    <h3 className="font-semibold">Personalized Experience</h3>
                                    <p className="text-green-100 text-sm">Tailored to your crops and location</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Sparkles className="h-6 w-6 text-yellow-300 mt-1" />
                                <div>
                                    <h3 className="font-semibold">Real-Time Market Prices</h3>
                                    <p className="text-green-100 text-sm">Updated crop prices from mandis</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-green-600/30 rounded-lg">
                            <p className="text-sm text-green-100">
                                <span className="font-semibold">🔒 Secure & Private:</span> Your data is protected with
                                end-to-end encryption and never shared without your consent.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <Card className="w-full shadow-xl border-0">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <img
                                src="/krishimitra-logo.jpg"
                                alt="KrishiMitra Logo"
                                className="h-12 w-auto"
                            />
                        </div>
                        <CardTitle className="text-2xl font-bold text-green-700 dark:text-green-400">
                            Welcome to KrishiMitra
                        </CardTitle>
                        <p className="text-gray-600 dark:text-gray-400">
                            Sign in to access your farming dashboard
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
                                <div className="space-y-4">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                            Quick Sign In with your Google account
                                        </p>
                                        <Button
                                            onClick={handleGoogleLogin}
                                            disabled={loading}
                                            variant="outline"
                                            className="w-full border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 py-6 transition-all duration-300 hover:shadow-md"
                                        >
                                            {loading ? (
                                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                            ) : (
                                                <GoogleIcon />
                                            )}
                                            <span className="ml-3 text-base font-medium">Continue with Google</span>
                                        </Button>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                            This will redirect you to select your Google account
                                        </p>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-gray-300" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-white dark:bg-gray-900 px-3 py-1 text-gray-500">Or sign in with email</span>
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

                        {/* Security Note */}
                        <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-4">
                            <Lock className="w-3 h-3 inline mr-1" />
                            Your information is secure and will only be used for agricultural advice
                        </div>
                    </CardContent>
                </Card>
            </div>
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
                    className="py-5"
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
                        <div className="flex items-center px-4 bg-gray-100 dark:bg-gray-800 border border-r-0 rounded-lg text-sm font-medium">
                            +91
                        </div>
                        <Input
                            type="tel"
                            placeholder="Enter 10-digit mobile number"
                            value={formData.phone}
                            onChange={(e) => onInputChange('phone', e.target.value)}
                            className="rounded-l-none py-5"
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
                        className="py-5"
                    />
                )}
            </div>

            {/* Captcha */}
            <div className="space-y-2">
                <Label className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Security Verification
                </Label>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono text-lg px-4 py-3 bg-gray-100 dark:bg-gray-800 border-2 border-dashed">
                        {captchaCode}
                    </Badge>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onRefreshCaptcha}
                        disabled={loading}
                        className="p-3"
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
                    className="py-5"
                />
            </div>

            {/* Submit Button */}
            <Button
                onClick={onLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 py-6 text-base transition-all duration-300 hover:shadow-lg"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Logging in...
                    </>
                ) : success ? (
                    <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Success!
                    </>
                ) : (
                    <>
                        <Lock className="w-5 h-5 mr-2" />
                        Secure Login
                        <ArrowRight className="w-5 h-5 ml-2" />
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